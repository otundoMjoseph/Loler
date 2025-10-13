import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';

const API_BASE = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000';

export default function SoilMapsPage() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [layers, setLayers] = useState({ moisture: true, flood: false, fertility: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [37.9062, -0.0236],
      zoom: 6,
    });
    const geocoder = new MaplibreGeocoder({ maplibregl } as any);
    map.addControl(geocoder as any);
    mapRef.current = map;
    return () => map.remove();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    async function updateLayers() {
      setLoading(true); setError(null);
      try {
        const reqs: Record<string, string> = {
          moisture: `${API_BASE}/gee/layer?lat=-1.286389&lon=36.817223&type=moisture`,
          flood: `${API_BASE}/gee/layer?lat=-1.286389&lon=36.817223&type=flood`,
          fertility: `${API_BASE}/lsc/fertility?lat=-1.286389&lon=36.817223`
        };
        const out: Record<string, any> = {};
        for (const key of Object.keys(reqs)) {
          const r = await fetch(reqs[key]); out[key] = await r.json();
        }

        const data = [
          { id: 'sentinel-moisture', url: out.moisture.pngUrl || out.moisture.tileUrl, visible: layers.moisture },
          { id: 'sentinel-flood',    url: out.flood.pngUrl || out.flood.tileUrl,       visible: layers.flood },
          // Fertility endpoint returns JSON — here we just simulate a raster overlay via the moisture layer format.
          // In production, publish a tile endpoint for fertility rasters, then replace url below.
          { id: 'lsc-fertility',     url: out.moisture.pngUrl || out.moisture.tileUrl, visible: layers.fertility },
        ];

        data.forEach(({ id, url, visible }) => {
          if (!url) return;
          if (map.getLayer(id)) {
            map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none');
          } else if (visible) {
            if (!map.getSource(id)) {
              map.addSource(id, { type: 'raster', tiles: [url], tileSize: 256 } as any);
            }
            map.addLayer({ id, type: 'raster', source: id } as any);
          }
        });

        setOffline(Boolean(out.moisture?.pngUrl && out.moisture?.cached));
      } catch (e: any) {
        setError('Failed to load layers'); console.error(e);
      } finally {
        setLoading(false);
      }
    }
    updateLayers();
  }, [layers]);

  return (
    <div className="flex flex-col h-screen" style={{fontFamily:'system-ui,Segoe UI,Roboto,Helvetica,Arial'}}>
      <header className="p-3" style={{background:'#166534', color:'#fff', fontWeight:600}}>🌍 LOLER — Soil Maps</header>
      <div className="flex-grow relative">
        <div ref={mapContainer} className="w-full h-full" />
        <div style={{position:'absolute', top:16, left:16, background:'#fff', borderRadius:12, padding:12, boxShadow:'0 2px 10px rgba(0,0,0,0.15)'}}>
          <p style={{fontWeight:600, fontSize:13, color:'#374151'}}>🛰️ Layers</p>
          {[
            ['moisture','Sentinel-1 Soil Moisture'],
            ['flood','Sentinel-1 Flood Risk'],
            ['fertility','LSC-Hub Fertility Map']
          ].map(([key,label]) => (
            <label key={key} style={{display:'block', fontSize:13, marginTop:6, color:'#111827'}}>
              <input type="checkbox" style={{marginRight:8}} checked={(layers as any)[key]}
                onChange={(e) => setLayers(prev => ({...prev, [key]: e.target.checked}))}/>
              {label}
            </label>
          ))}
          {offline && <div style={{marginTop:8, fontSize:12, color:'#065f46'}}>Offline tiles in use</div>}
        </div>
        {loading && <div style={{position:'absolute', top:8, right:8, background:'#fff', padding:'6px 10px', borderRadius:8, boxShadow:'0 1px 6px rgba(0,0,0,0.15)', fontSize:12}}>Loading…</div>}
        {error && <div style={{position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)', background:'#fee2e2', color:'#991b1b', padding:'6px 10px', borderRadius:8, fontSize:12}}>{error}</div>}
      </div>
      <footer style={{textAlign:'center', padding:8, fontSize:12, color:'#4b5563', background:'#f9fafb'}}>
        Live/placeholder data from Sentinel + ISDA • © {new Date().getFullYear()} LOLER
      </footer>
    </div>
  );
}
