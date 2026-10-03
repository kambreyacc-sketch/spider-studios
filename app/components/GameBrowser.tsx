"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import type {Game} from "../../data/games";
type Row={robloxId:string;title:string;players:number;visits:number;favorites:number};
const slug=(title:string)=>title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
const Arrow=()=> <span aria-hidden>↗</span>;
export default function GameBrowser({games}:{games:Game[]}){
 const [query,setQuery]=useState(""),[filter,setFilter]=useState("ALL"),[live,setLive]=useState<Row[]>([]);
 const genres=["ALL",...Array.from(new Set(games.filter(g=>!g.sale).map(g=>g.tag)))];
 useEffect(()=>{const load=async()=>{try{const r=await fetch("/api/roblox-stats",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({games}),cache:"no-store"});if(r.ok){const d=await r.json();setLive(Array.isArray(d.games)?d.games:[])}}catch{}};load();const t=setInterval(load,60000);return()=>clearInterval(t)},[games]);
 const liveById=new Map(live.map(g=>[g.robloxId,g]));
 const filtered=useMemo(()=>games.filter(g=>!g.sale&&(!query||(g.title+" "+g.description).toLowerCase().includes(query.toLowerCase()))&&(filter==="ALL"||g.tag===filter)),[games,query,filter]);
 const totalPlayers=filtered.reduce((n,g)=>n+(liveById.get(g.robloxId||"")?.players||0),0);
 return <div className="gameBrowser"><div className="gameBrowserTop"><div><span className="sectionKicker">LIVE PORTFOLIO</span><h3>{totalPlayers.toLocaleString()} <small>PLAYERS RIGHT NOW</small></h3></div><div className="livePulse"><i/> LIVE · UPDATES EVERY MINUTE</div></div><div className="gameBrowserTools"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="SEARCH GAMES..." aria-label="Search games"/><div className="gameFilters">{genres.map(g=><button key={g} className={filter===g?"active":""} onClick={()=>setFilter(g)}>{g}</button>)}</div></div><div className="gameGrid liveGameGrid">{filtered.map(game=>{const s=liveById.get(game.robloxId||"");return <Link className="gameCard liveCard" href={"/games/"+slug(game.title)} key={game.title}><div className="gameImage"><img src={game.image} alt=""/><span className="gameTag">{game.tag}</span><span className="gameStatus">{game.status||"LIVE"}</span><span className="livePlayers"><i/>{Number(s?.players||0).toLocaleString()} PLAYING</span><span className="roundArrow"><Arrow/></span></div><div className="gameCardInfo"><div className="liveCardMeta"><span>{Number(s?.visits||0).toLocaleString()} VISITS</span><span>{Number(s?.favorites||0).toLocaleString()} FAVS</span></div><h3>{game.title}</h3><p>{game.description}</p><span>VIEW GAME <Arrow/></span></div></Link>})}</div>{!filtered.length&&<div className="emptyGames">NO GAMES MATCH THAT SEARCH.</div>}</div>;
}