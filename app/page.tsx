import Link from "next/link";
import { games } from "../data/games";

const discord=[["Spider Studios","https://discord.gg/ghSzF5fcK"],["Spider Uncopylocked","https://discord.gg/ue2VP47Kn"]];
const communities=[["YouTube","https://www.youtube.com/channel/UChHjRINwtNyjRS7VkWl2LHA"],["Strawberryini Studio","https://www.roblox.com/communities/486751351/Strawberryini-Studio#!/about"],["HypeX Games","https://www.roblox.com/communities/811389125/HypeX-Games#!/about"]];

function Arrow(){return <span aria-hidden>↗</span>}

export default function Home(){
 const featured=games.filter(g=>g.featured);
 return <main>
  <nav className="siteNav">
   <Link className="brand" href="/"><span className="brandMark">S</span><span>SPIDER</span><b>STUDIOS</b></Link>
   <div className="navlinks"><a href="#games">Games</a><Link href="/about">About</Link><Link href="/careers">Careers</Link><Link href="/sell-game">Sell Your Game</Link><a href="#community">Community</a></div>
  </nav>
  <section className="studioHero">
   <div className="heroOrb heroOrbOne"/><div className="heroOrb heroOrbTwo"/><div className="heroNoise"/>
   <div className="heroInner">
    <div className="heroPill"><span/> INDEPENDENT ROBLOX GAME STUDIO</div>
    <h1>WE BUILD<br/><span>EXPERIENCES.</span></h1>
    <p>Spider Studios creates original Roblox games, builds communities around them, and works with developers and creators to turn strong ideas into experiences players want to come back to.</p>
    <div className="heroActions"><a className="primaryBtn" href="#games">EXPLORE OUR GAMES <Arrow/></a><Link className="ghostBtn" href="/careers">WORK WITH US <Arrow/></Link></div>
   </div>
   <div className="heroBottom"><span>ROBLOX GAME DEVELOPMENT</span><span>INDEPENDENT STUDIO</span><span>BUILD · PLAY · GROW</span></div>
  </section>
  <section className="statsBar"><div><strong>{games.length}+</strong><span>LIVE PROJECTS</span></div><div><strong>ROBLOX</strong><span>PRIMARY PLATFORM</span></div><div><strong>24/7</strong><span>COMMUNITY FOCUS</span></div><div><strong>01</strong><span>STUDIO MISSION</span></div></section>

  <section id="games" className="studioSection">
   <div className="sectionIntro"><div><span className="sectionKicker">OUR GAMES</span><h2>MADE TO<br/><em>BE PLAYED.</em></h2></div><p>From obbies and survival games to horror and adventure, our portfolio is built around ideas with room to grow.</p></div>
   <div className="featuredGrid">{featured.map(game=><a className="bigGameCard" href={game.url} target="_blank" rel="noreferrer" key={game.title}><img src={game.image} alt=""/><div className="gameShade"/><div className="bigGameInfo"><span className="gameTag">{game.tag} · FEATURED</span><h3>{game.title}</h3><p>{game.description}</p><b>PLAY ON ROBLOX <Arrow/></b></div></a>)}</div>
   <div className="gameGrid">{games.filter(g=>!g.featured).map(game=><a className="gameCard" href={game.url} target="_blank" rel="noreferrer" key={game.title}><div className="gameImage"><img src={game.image} alt=""/><span className="gameTag">{game.tag}</span><span className="roundArrow"><Arrow/></span></div><div className="gameCardInfo"><h3>{game.title}</h3><p>{game.description}</p><span>VIEW GAME <Arrow/></span></div></a>)}</div>
  </section>

  <section id="about" className="aboutSection">
   <div className="aboutVisual"><div className="spiderBadge">S<span>•</span>S</div></div>
   <div className="aboutCopy"><span className="sectionKicker">ABOUT SPIDER STUDIOS</span><h2>MORE THAN<br/><em>A GAME.</em></h2><p>Spider Studios is an independent Roblox game studio focused on creating, improving, publishing, and growing experiences for players around the world.</p><p>We work across gameplay programming, creative development, community building, creator relationships, and business opportunities. The goal is simple: make games people remember and build a studio where talented people can grow with them.</p><Link className="textLink" href="/about">LEARN ABOUT THE STUDIO <Arrow/></Link></div>
  </section>

  <section className="storySection"><div className="sectionIntro"><div><span className="sectionKicker">OUR STORY</span><h2>FROM IDEA<br/><em>TO EXPERIENCE.</em></h2></div><p>Spider Studios is building its portfolio one experience at a time. The public site keeps the studio history factual rather than inventing founding dates or milestones that have not been published.</p></div>
   <div className="timeline"><article><span>01</span><h3>THE IDEA</h3><p>Start with a game concept, a clear player loop, and a reason to keep playing.</p></article><article><span>02</span><h3>THE BUILD</h3><p>Develop gameplay, systems, art, UI, progression, and the details that make an experience feel complete.</p></article><article><span>03</span><h3>THE COMMUNITY</h3><p>Bring players and creators into the process through Discord, content, feedback, and events.</p></article><article><span>04</span><h3>THE GROWTH</h3><p>Update, market, improve, and keep building after launch instead of treating release as the finish line.</p></article></div>
  </section>

  <section className="workSection"><div className="sectionIntro centered"><span className="sectionKicker">WHAT WE DO</span><h2>BUILD. GROW.<br/><em>REPEAT.</em></h2><p>Spider Studios brings development and community work together so games can keep getting better after launch.</p></div>
   <div className="serviceGrid">{[["01","GAME DEVELOPMENT","Gameplay systems, Roblox Luau, progression, optimization, and live updates."],["02","CREATIVE","Game concepts, UI direction, presentation, thumbnails, and player-facing experiences."],["03","COMMUNITY","Discord, creators, player feedback, announcements, and community growth."],["04","PUBLISHING & GROWTH","Launch strategy, updates, partnerships, monetization, and long-term game development."]].map(([n,t,d])=><article className="serviceCard" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><Arrow/></article>)}</div>
  </section>

  <section className="teamSection"><div className="sectionIntro"><div><span className="sectionKicker">THE TEAM</span><h2>PEOPLE<br/><em>BEHIND IT.</em></h2></div><p>Spider Studios is built around different skills working together. Public staff names and headcount have not been supplied yet, so the site shows the actual working groups instead of inventing people.</p></div>
   <div className="teamGrid">{[["PROGRAMMING","Roblox Luau developers","Gameplay, systems, performance, and technical foundations."],["CREATIVE","Designers & creators","UI, visuals, concepts, content, and player experience."],["COMMUNITY","Community staff & creators","Discord, social content, feedback, and player relationships."],["OPERATIONS","Studio & business","Partnerships, publishing, acquisitions, and studio operations."]].map(([a,b,c])=><article key={a}><span>{a}</span><h3>{b}</h3><p>{c}</p></article>)}</div>
   <Link className="primaryBtn" href="/careers">JOIN THE TEAM <Arrow/></Link>
  </section>

  <section className="creatorSection"><div className="creatorIcon">✦</div><span className="sectionKicker">CREATOR PROGRAM</span><h2>CREATE WITH<br/><em>SPIDER.</em></h2><p>Are you a Roblox YouTuber, TikTok creator, or streamer? Create content about Spider Studios games, join our community, and get news about upcoming releases and special events.</p><p className="fine">We don't promise free items, payment, early access, or creator rewards unless explicitly offered.</p><Link className="primaryBtn" href="/contact?category=creator">CREATOR INQUIRIES <Arrow/></Link></section>

  <section className="acquisitionSection"><div><span className="sectionKicker">HAVE A GAME?</span><h2>BRING IT<br/><em>TO SPIDER.</em></h2></div><div><p>Think your Roblox experience could become something bigger? Submit your game for consideration.</p><Link className="primaryBtn" href="/sell-game">SELL YOUR GAME <Arrow/></Link></div></section>

  <section id="community" className="communitySection"><div className="sectionIntro"><div><span className="sectionKicker">COMMUNITY</span><h2>STAY<br/><em>CONNECTED.</em></h2></div><p>Follow Spider Studios, meet other players and creators, and keep up with new releases.</p></div>
   <div className="linkColumns"><div><h3>DISCORD</h3>{discord.map(([name,url])=><a key={name} href={url} target="_blank" rel="noreferrer">{name}<Arrow/></a>)}</div><div><h3>NETWORK</h3>{communities.map(([name,url])=><a key={name} href={url} target="_blank" rel="noreferrer">{name}<Arrow/></a>)}</div></div>
  </section>
  <footer className="siteFooter"><div><Link className="brand" href="/"><span className="brandMark">S</span><span>SPIDER</span><b>STUDIOS</b></Link><p>Independent Roblox Game Studio</p></div><div><Link href="/about">About</Link><Link href="/careers">Careers</Link><Link href="/sell-game">Sell Your Game</Link></div><small>© {new Date().getFullYear()} Spider Studios</small></footer>
 </main>
}