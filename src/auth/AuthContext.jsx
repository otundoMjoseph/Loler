import React, { createContext, useState, useEffect } from 'react';
export const AuthContext = createContext();
export const AuthProvider = ({children})=>{
  const [user,setUser]=useState(null); const [token,setToken]=useState(localStorage.getItem('token')||null);
  useEffect(()=>{ if(token){ localStorage.setItem('token',token); (async ()=>{ try{ const base=(import.meta.env.MODE==='development')?'http://localhost:8000':(import.meta.env.VITE_BACKEND_URL||''); const res=await fetch(base+'/api/auth/me',{headers:{Authorization:`Bearer ${token}`}}); if(res.ok){ const j=await res.json(); setUser(j.user);} }catch(e){} })(); } else { localStorage.removeItem('token'); setUser(null); } },[token]);
  const login=(t,u)=>{ setToken(t); setUser(u); }; const logout=()=>{ setToken(null); setUser(null); window.location.href='/'; };
  const authFetch = async (path, opts={})=>{ const headers=opts.headers||{}; if(token) headers['Authorization']=`Bearer ${token}`; headers['Content-Type']=headers['Content-Type']||'application/json'; const base=(import.meta.env.MODE==='development')?'http://localhost:8000':(import.meta.env.VITE_BACKEND_URL||''); const res=await fetch(base+path,{...opts,headers}); return res; };
  return <AuthContext.Provider value={{user,token,login,logout,authFetch}}>{children}</AuthContext.Provider>;
};
