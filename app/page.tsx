import { games } from "../data/games";
import Link from "next/link";

type LinkItem = [string, string];
const discord: LinkItem[] = [["Spider Studios","https://discord.gg/ghSzF5fcK"],["Spider Uncopylocked","https://discord.gg/ue2VP47Kn"]];
const communities: LinkItem[] = [["YouTube","https://www.youtube.com/channel/UChHjRINwtNyjRS7VkWl2LHA"],["Strawberryini Studio","https://www.roblox.com/communities/486751351/Strawberryini-Studio#!/about"],["HypeX Games","https://www.roblox.com/communities/811389125/HypeX-Games#!/about"]];
const linkGroups: [string,LinkItem[]][]=[["Discord",discord],["Other",communities]];
function Arrow(){return <span aria-hidden>↗</span>}

export default function Home(){
 const featured=games.filter((game)=>game.featured);
 return <main>
  <nav className="nav"><Link className="brand" href="/">SPIDER<span>STUDIOS</span></Link><div className="navlinks"><a href="#games">Games</a><a href="#about">About</a><Link href="/careers">Careers</Link><Link href="/sell-game">Sell Your Game</Link><a href="#community">Community</a></div></nav>
  <section className="hero"><div className="heroGrid"/><div className="heroGlow"/><p className="eyebrow">INDEPENDENT ROBLOX GAME STUDIO</p><h1>WE BUILD<br/><em>GAMES.</em></h1><p className="heroText">Spider Studios creates Roblox experiences across obbies, survival, adventure, horror, and more.</p><a className="button" href="#games">EXPLORE GAMES <Arrow/></a></section>
  <section id="games" className="section"><div className="sectionHead"><div><p className="eyebrow">OUR GAMES</p><h2>PLAY NOW</h2></div><span className="count">{games.length} GAMES</span></div>
   {featured.length>0&&<div className="featured">{featured.map((game)=><a className="featuredCard" href={game.url} target="_blank" rel="noreferrer" key={game.title}><img src={game.image} alt=""/><div className="overlay"><span className="tag">{game.tag} · FEATURED</span><h3>{game.title}</h3><p>{game.description}</p><b>PLAY ON ROBLOX <Arrow/></b></div></a>)}</div>}
   <div className="grid">{games.filter((game)=>!game.featured).map((game)=><a className="card" href={game.url} target="_blank" rel="noreferrer" key={game.title}><div className="thumb"><img src={game.image} alt=""/><span className="tag">{game.tag}</span><span className="cardArrow"><Arrow/></span></div><div className="cardBody"><h3>{game.title}</h3><p>{game.description}</p></div></a>)}</div>
  </section>
  <section id="about" className="about section"><div><p className="eyebrow">ABOUT SPIDER STUDIOS</p><h2>BUILT FOR<br/><em>ROBLOX.</em></h2></div><p>Spider Studios is an independent Roblox game studio making original experiences for players around the world.</p></section>
  <section id="community" className="community section"><p className="eyebrow">JOIN THE COMMUNITY</p><h2>STAY<br/><em>CONNECTED.</em></h2><div className="links">{linkGroups.map(([title,items])=><div key={title}><h3>{title}</h3>{items.map(([name,url])=><a href={url} target="_blank" rel="noreferrer" key={name}>{name}<Arrow/></a>)}</div>)}</div></section>
  <footer><div><Link className="brand" href="/">SPIDER<span>STUDIOS</span></Link><p>Independent Roblox Game Studio</p></div><small>© {new Date().getFullYear()} Spider Studios</small></footer>
 </main>
}
