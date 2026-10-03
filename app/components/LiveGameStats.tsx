"use client";
import {useEffect,useMemo,useState} from "react";
import type {Game} from "../../data/games";

type Row={robloxId:string;title:string;players:number;visits:number;favorites:number};

export default function LiveGameStats({games}:{games:Game[]}){
 const [rows,setRows]=useState<Row[]>([]),[updated,setUpdated]=useState("");
 const tracked=useMemo(()=>games.filter(g=>g.robloxId),[games]);
 const load=async()=>{try{const r=await fetch("/api/roblox-stats",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({games:tracked}),cache:"no-store"});if(!r.ok)return;const d=await r.json();setRows(Array.isArray(d.games)?d.games:[]);setUpdated(d.updatedAt||"")}catch{}};
 useEffect(()=>{load();const t=setInterval(load,60000);return()=>clearInterval(t)},[tracked]);
 const totalPlayers=rows.reduce((n,g)=>n+g.players,0),totalVisits=rows.reduce((n,g)=>n+g.visits,0),totalFavorites=rows.reduce((n,g)=>n+g.favorites,0),byId=new Map(rows.map(g=>[g.robloxId,g]));
 return <section className="liveStudioStats"><div className="liveStatsHead"><div><span className="sectionKicker">LIVE ROBLOX DATA</span><h2>WHAT'S<br/><em>HAPPENING.</em></h2></div><div className="livePulse"><i/> LIVE {updated?new Date(updated).toLocaleTimeString():""}</div></div><div className="liveStatsNumbers"><div><span>LIVE ACTIVE PLAYERS</span><strong>{totalPlayers.toLocaleString()}</strong><small>Playing across Spider Studios games</small></div><div><span>TOTAL VISITS</span><strong>{totalVisits.toLocaleString()}</strong><small>Combined Roblox visits</small></div><div><span>TOTAL FAVORITES</span><strong>{totalFavorites.toLocaleString()}</strong><small>Combined Roblox favorites</small></div></div><div className="liveGameRows">{tracked.map(game=>{const s=byId.get(game.robloxId!);return <a href={game.url} target="_blank" rel="noreferrer" className="liveGameRow" key={game.title}><img src={game.image} alt=""/><div><b>{game.title}</b><small>{game.tag}</small></div><strong>{Number(s?.players||0).toLocaleString()}<small>ACTIVE</small></strong><span>{Number(s?.visits||0).toLocaleString()} VISITS</span><em>↗</em></a>})}</div></section>;
}
