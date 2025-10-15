import { spawnSync } from 'child_process';
import path from 'path'; import fs from 'fs';
const PY_SCRIPT = path.join(process.cwd(),'utils','gee_query.py');
export async function queryGEEPoint(lat, lon){
  if (!fs.existsSync(PY_SCRIPT)) return null;
  const proc = spawnSync('python3',[PY_SCRIPT,'--lat',String(lat),'--lon',String(lon)],{encoding:'utf-8'});
  if (proc.status!==0) return null;
  try{ return JSON.parse(proc.stdout); }catch(e){ return null; }
}
