import Link from "next/link";
import {games} from "../../../data/games";
import {notFound} from "next/navigation";

const slug=(title:string)=>title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
const logo="https://cdn.discordapp.com/icons/1541030301336215562/4119cf6ca8318ba22c8882efb6e18505.webp?size=512";

export function generateStaticParams(){return games.map(g=>({slug:slug(g.title)}));}
export default async function GamePage({params}:{params:Promise<{slug:string}>}){
 const {slug:current}=await params;
 const game=games.find(g=>slug(g.title)===current);
 if(!game)notFound();
 return <main className="subpage gameDetailPage">
  <nav className="siteNav"><Link className="brand" href="/"><span className="brandMark"><img src={logo} alt="Spider Studios"/></span><span>SPIDER</span><b>STUDIOS</b></Link><div className="navlinks"><Link href="/#games">Games</Link><Link href="/about">About</Link><Link href="/team">Team</Link><Link href="/careers">Careers</Link><Link href="/sell-game">Sell Your Game</Link><Link href="/contact">Contact</Link><Link href="/admin">Admin</Link></div></nav>
  <section className="gameDetailHero"><img src={game.image} alt=""/><div className="gameDetailShade"/><div className="gameDetailCopy"><span className="gameTag">{game.tag} · {game.status||"LIVE"}</span><h1>{game.title}</h1><p>{game.description}</p><div className="heroActions"><a className="primaryBtn" href={game.url} target="_blank" rel="noreferrer">PLAY ON ROBLOX ↗</a>{game.discord&&<a className="ghostBtn" href={game.discord} target="_blank" rel="noreferrer">GAME DISCORD ↗</a>}</div></div></section>
  <section className="gameDetailInfo"><div><span className="sectionKicker">GAME INFO</span><h2>ABOUT<br/><em>{game.title}.</em></h2></div><div className="gameFacts"><div><small>STATUS</small><strong>{game.status||"LIVE"}</strong></div>{game.robloxId&&<div><small>ROBLOX ID</small><strong>{game.robloxId}</strong></div>}{game.releaseDate&&<div><small>RELEASED</small><strong>{game.releaseDate}</strong></div>}{game.updatedAt&&<div><small>UPDATED</small><strong>{game.updatedAt}</strong></div>}{game.visits&&<div><small>VISITS</small><strong>{game.visits}</strong></div>}{game.players&&<div><small>PLAYERS</small><strong>{game.players}</strong></div>}</div></section>
  {game.screenshots&&game.screenshots.length>0&&<section className="gameScreenshots"><span className="sectionKicker">SCREENSHOTS</span><div>{game.screenshots.map((src,i)=><img key={src+i} src={src} alt={game.title+" screenshot "+(i+1)}/>)}</div></section>}
  <section className="gameDetailBottom"><Link className="ghostBtn" href="/#games">← BACK TO GAMES</Link>{game.sale&&<Link className="primaryBtn" href="/sell-game">DISCUSS ACQUISITION ↗</Link>}</section>
  <footer className="siteFooter"><Link className="brand" href="/"><span className="brandMark"><img src={logo} alt="Spider Studios"/></span><Link href="/contact">Contact</Link><small>© {new Date().getFullYear()} Spider Studios</small></footer>
 </main>;
}
