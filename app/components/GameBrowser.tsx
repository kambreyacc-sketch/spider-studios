"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import type {Game} from "../../data/games";

const slug=(title:string)=>title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
const Arrow=()=> <span aria-hidden>↗</span>;

export default function GameBrowser({games}:{games:Game[]}){
 const [query,setQuery]=useState("");
 const [filter,setFilter]=useState("ALL");
 const genres=["ALL",...Array.from(new Set(games.filter(g=>!g.sale).map(g=>g.tag)))];
 const filtered=useMemo(()=>games.filter(g=>!g.sale&&(!query||(g.title+" "+g.description).toLowerCase().includes(query.toLowerCase()))&&(filter==="ALL"||g.tag===filter)),[games,query,filter]);
 const featured=filtered.filter(g=>g.featured);
 const rest=filtered.filter(g=>!g.featured);
 return <div className="gameBrowser">
  <div className="gameBrowserTools"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="SEARCH GAMES..." aria-label="Search games"/><div className="gameFilters">{genres.map(g=><button key={g} className={filter===g?"active":""} onClick={()=>setFilter(g)}>{g}</button>)}</div></div>
  {featured.length>0&&<div className="featuredGrid">{featured.map(game=><Link className="bigGameCard" href={"/games/"+slug(game.title)} key={game.title}><img src={game.image} alt=""/><div className="gameShade"/><div className="bigGameInfo"><span className="gameTag">{game.tag} · {game.status||"LIVE"}</span><h3>{game.title}</h3><p>{game.description}</p><b>VIEW GAME <Arrow/></b></div></Link>)}</div>}
  <div className="gameGrid">{rest.map(game=><Link className="gameCard" href={"/games/"+slug(game.title)} key={game.title}><div className="gameImage"><img src={game.image} alt=""/><span className="gameTag">{game.tag}</span><span className="gameStatus">{game.status||"LIVE"}</span><span className="roundArrow"><Arrow/></span></div><div className="gameCardInfo"><h3>{game.title}</h3><p>{game.description}</p><span>VIEW GAME <Arrow/></span></div></Link>)}</div>
  {!featured.length&&!rest.length&&<div className="emptyGames">NO GAMES MATCH THAT SEARCH.</div>}
 </div>;
}
