import Link from "next/link";
import { games } from "../data/games";
import SpiderSupport from "./components/SpiderSupport";
import GameBrowser from "./components/GameBrowser";
import MobileNav from "./components/MobileNav";

const discord=[["Spider Studios","https://discord.gg/ghSzF5fcK"],["Spider Uncopylocked","https://discord.gg/ue2VP47Kn"]];
const communities=[
["YouTube","https://www.youtube.com/channel/UChHjRINwtNyjRS7VkWl2LHA","https://tse3.mm.bing.net/th/id/OIP.V3WOCLFe6BjXEnOssE_yGwHaHa?r=0&pid=Api&h=220&P=0"],
["Strawberryini Studio","https://www.roblox.com/communities/486751351/Strawberryini-Studio#!/about","https://tr.rbxcdn.com/180DAY-e7226b6fc3cfe9ad1fd935060b428002/150/150/Image/Webp/noFilter"],
["HypeX Games","https://www.roblox.com/communities/811389125/HypeX-Games#!/about","https://cdn.discordapp.com/icons/1530962123000381690/071e82d706f2b4d00aaebed6d48c87a5.webp?size=1024"]];
const logo="https://cdn.discordapp.com/icons/1541030301336215562/4119cf6ca8318ba22c8882efb6e18505.webp?size=512";
function Arrow(){return <span aria-hidden>↗</span>}
function Brand(){return <span className="brandMark"><img src={logo} alt="Spider Studios"/></span>}
export default function Home(){
 const featured=games.filter(g=>g.featured);
 const ticker=[...games,...games,...games];
 const marqueeGames=[...games,...games,...games];
 const marquee=(reverse=false,large=false)=><section className={"gameMarquee "+(reverse?"reverse ":"")+(large?"large":"")} aria-label="Roblox game showcase"><div className="gameMarqueeFade"/><div className="gameMarqueeTrack">{marqueeGames.map((g,i)=><a className="marqueeGame" href={g.url} target="_blank" rel="noreferrer" key={g.title+"-"+i}><img src={g.image} alt="" loading="eager"/><div><strong>{g.title}</strong><span>PLAY ON ROBLOX ↗</span></div></a>)}</div></section>;
 return <main>
  <nav className="siteNav"><Link className="brand" href="/"><Brand/><span>SPIDER</span><b>STUDIOS</b></Link><div className="navlinks"><a href="#games">Games</a><Link href="/about">About</Link><Link href="/team">Team</Link><Link href="/careers">Careers</Link><Link href="/sell-game">Sell Your Game</Link><Link href="/contact">Contact</Link><a href="#community">Community</a><Link href="/admin">Admin</Link></div><MobileNav links={[{label:"Games",href:"#games"},{label:"About",href:"/about"},{label:"Team",href:"/team"},{label:"Careers",href:"/careers"},{label:"Sell Your Game",href:"/sell-game"},{label:"Contact",href:"/contact"},{label:"Community",href:"#community"},{label:"Admin",href:"/admin"}]}/></nav>

  <section className="studioHero">
   <video className="heroVideo" autoPlay muted loop playsInline preload="auto" aria-hidden="true"><source src="https://dobig.com/banner.webm" type="video/webm"/></video>
   <div className="heroVideoShade"/>
   <div className="heroOrb heroOrbOne"/><div className="heroOrb heroOrbTwo"/><div className="heroNoise"/>
   <div className="heroTicker"><div className="heroTickerTrack">{ticker.map((g,i)=><div className="heroTickerItem" key={i}>{g.title}<b>SPIDER STUDIOS</b>✦</div>)}</div></div>
   <div className="heroInner">
    <div className="heroPill"><span/> INDEPENDENT ROBLOX GAME STUDIO</div>
    <h1>WE BUILD<br/><span>EXPERIENCES.</span></h1>
    <p>Spider Studios creates original Roblox games, builds communities around them, and works with developers and creators to turn strong ideas into experiences players want to come back to.</p>
    <div className="heroActions"><a className="primaryBtn" href="#games">EXPLORE OUR GAMES <Arrow/></a><Link className="ghostBtn" href="/careers">WORK WITH US <Arrow/></Link><Link className="adminQuick" href="/admin">STUDIO ADMIN <Arrow/></Link></div>
   </div>
   <div className="heroBottom"><span>ROBLOX GAME DEVELOPMENT</span><span>INDEPENDENT STUDIO</span><span>BUILD · PLAY · GROW</span></div>
  </section>

  <section className="statsBar"><div><strong>{games.filter(g=>!g.sale).length}+</strong><span>LIVE PROJECTS</span></div><div><strong>ROBLOX</strong><span>PRIMARY PLATFORM</span></div><div><strong>24/7</strong><span>COMMUNITY FOCUS</span></div><div><strong>01</strong><span>STUDIO MISSION</span></div></section>

  {marquee(false)}

  <section id="games" className="studioSection">
   <div className="sectionIntro"><div><span className="sectionKicker">OUR GAMES</span><h2>MADE TO<br/><em>BE PLAYED.</em></h2></div><p>From obbies and survival games to horror and adventure, our portfolio is built around ideas with room to grow.</p></div>
   <GameBrowser games={games}/>
  </section>

  <section className="saleSection"><div><span className="sectionKicker">GAME ACQUISITIONS</span><h2>GAMES<br/><em>FOR SALE.</em></h2><p>Spider Studios is open to full game acquisitions, partial ownership, investments, and partnerships. Current listing:</p></div><div className="saleGrid">{games.filter(g=>g.sale).map(game=><a className="saleCard" href={game.url} target="_blank" rel="noreferrer" key={game.title}><img src={game.image} alt=""/><div><span className="gameTag">FOR SALE</span><h3>{game.title}</h3><p>{game.description}</p><b>VIEW GAME <Arrow/></b></div></a>)}</div></section>

  <section id="about" className="aboutSection"><div className="aboutVisual"><div className="spiderBadge"><img src={logo} alt="Spider Studios logo"/></div></div><div className="aboutCopy"><span className="sectionKicker">ABOUT SPIDER STUDIOS</span><h2>MORE THAN<br/><em>A GAME.</em></h2><p>Spider Studios is an independent Roblox game studio focused on creating, improving, publishing, and growing experiences for players around the world.</p><p>We work across gameplay programming, creative development, community building, creator relationships, and business opportunities.</p><Link className="textLink" href="/about">LEARN ABOUT THE STUDIO <Arrow/></Link></div></section>

  <section className="storySection"><div className="sectionIntro"><div><span className="sectionKicker">OUR STORY</span><h2>FROM IDEA<br/><em>TO EXPERIENCE.</em></h2></div><p>Build the concept, make the experience, bring in the community, then keep improving it after launch.</p></div><div className="timeline">{[["01","THE IDEA","Start with a clear game concept and a reason to keep playing."],["02","THE BUILD","Develop gameplay, systems, art, UI, progression, and polish."],["03","THE COMMUNITY","Bring players and creators into the process through feedback and events."],["04","THE GROWTH","Update, market, improve, and keep building after launch."]].map(x=><article key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div></section>

  <section className="workSection"><div className="sectionIntro centered"><span className="sectionKicker">WHAT WE DO</span><h2>BUILD. GROW.<br/><em>REPEAT.</em></h2><p>Development and community work together so games can keep getting better after launch.</p></div><div className="serviceGrid">{[["01","GAME DEVELOPMENT","Gameplay systems, Roblox Luau, progression, optimization, and live updates."],["02","CREATIVE","Game concepts, UI direction, presentation, thumbnails, and player experience."],["03","COMMUNITY","Discord, creators, player feedback, announcements, and community growth."],["04","PUBLISHING & GROWTH","Launch strategy, updates, partnerships, monetization, and long-term development."]].map(x=><article className="serviceCard" key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p><span>↗</span></article>)}</div></section>

  <section className="teamSection" id="team"><div className="sectionIntro"><div><span className="sectionKicker">MEET OUR TEAM</span><h2>PEOPLE<br/><em>BEHIND IT.</em></h2></div><p>Meet the people and working groups behind Spider Studios. Development, creative, community, and studio operations all work together.</p></div><div className="teamGrid">{[["PROGRAMMING","Roblox Luau developers","Gameplay, systems, performance, and technical foundations."],["CREATIVE","Designers & creators","UI, visuals, concepts, content, and player experience."],["COMMUNITY","Community staff & creators","Discord, social content, feedback, and player relationships."],["OPERATIONS","Studio & business","Partnerships, publishing, acquisitions, and studio operations."]].map(x=><article key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div><div className="heroActions"><Link className="primaryBtn" href="/team">MEET THE TEAM <Arrow/></Link><Link className="ghostBtn" href="/careers">JOIN THE TEAM <Arrow/></Link></div></section>

  <section className="creatorSection"><div className="creatorIcon">✦</div><span className="sectionKicker">CREATOR PROGRAM</span><h2>CREATE WITH<br/><em>SPIDER.</em></h2><p>Are you a Roblox YouTuber, TikTok creator, or streamer? Create content about Spider Studios games, join our community, and get news about upcoming releases and events.</p><p className="fine">Creator rewards or early access are only offered when explicitly announced.</p><Link className="primaryBtn" href="/contact?category=creator">CREATOR INQUIRIES <Arrow/></Link></section>

  <section className="acquisitionSection"><div><span className="sectionKicker">HAVE A GAME?</span><h2>BRING IT<br/><em>TO SPIDER.</em></h2></div><div><p>Think your Roblox experience could become something bigger? Submit your game for consideration.</p><Link className="primaryBtn" href="/sell-game">SELL YOUR GAME <Arrow/></Link></div></section>

  <section id="community" className="communitySection"><div className="sectionIntro"><div><span className="sectionKicker">COMMUNITY</span><h2>STAY<br/><em>CONNECTED.</em></h2></div><p>Follow Spider Studios, meet other players and creators, and keep up with new releases.</p></div><div className="communityCards">
   <a className="communityCard" href={discord[0][1]} target="_blank" rel="noreferrer"><img src="https://cdn.discordapp.com/icons/1541030301336215562/4119cf6ca8318ba22c8882efb6e18505.webp?size=1024" alt=""/><small>DISCORD</small><h3>Spider Studios</h3><span>JOIN COMMUNITY <Arrow/></span></a>
   <a className="communityCard" href={discord[1][1]} target="_blank" rel="noreferrer"><img src="https://cdn.discordapp.com/icons/1411733652257374242/06da1c0125b044b0626e60d150cab1fc.webp?size=1024" alt=""/><small>DISCORD</small><h3>Spider Uncopylocked</h3><span>JOIN COMMUNITY <Arrow/></span></a>
   {communities.map(([name,url,img])=><a className="communityCard" key={name} href={url} target="_blank" rel="noreferrer"><img src={img} alt=""/><small>NETWORK</small><h3>{name}</h3><span>VISIT <Arrow/></span></a>)}
  </div></section>

  <SpiderSupport/>

  <footer className="siteFooter"><div><Link className="brand" href="/"><Brand/><span>SPIDER</span><b>STUDIOS</b></Link><p>Independent Roblox Game Studio</p><a className="footerEmail" href="mailto:Spiderstudios137483@gmail.com">Spiderstudios137483@gmail.com</a></div><div><Link href="/about">About</Link><Link href="/team">Team</Link><Link href="/careers">Careers</Link><Link href="/sell-game">Sell Your Game</Link><Link href="/admin">Admin</Link></div><small>© {new Date().getFullYear()} Spider Studios</small></footer>
 </main>
}