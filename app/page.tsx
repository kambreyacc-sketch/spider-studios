import {games} from "../data/games";

function Arrow(){return <span aria-hidden>↗</span>}

export default function Home(){
  return <main>
    <nav className="nav">
      <a className="brand" href="#">SPIDER<span>STUDIOS</span></a>
      <div className="navlinks">
        <a href="#games">Games</a><a href="#about">About</a><a href="#contact">Contact</a>
      </div>
    </nav>

    <section className="hero">
      <div className="heroGlow"/>
      <p className="eyebrow">INDEPENDENT ROBLOX GAME STUDIO</p>
      <h1>WE BUILD GAMES<br/><em>PEOPLE REMEMBER.</em></h1>
      <p className="heroText">Spider Studios creates bold, chaotic, and unforgettable experiences for the Roblox community.</p>
      <a className="button" href="#games">EXPLORE OUR GAMES <Arrow/></a>
    </section>

    <section id="games" className="section">
      <div className="sectionHead"><div><p className="eyebrow">OUR WORK</p><h2>GAMES</h2></div><span className="count">{games.length.toString().padStart(2,"0")} TITLES</span></div>
      <div className="grid">
        {games.map(game=><a className="card" href={game.url} target="_blank" rel="noreferrer" key={game.title}>
          <div className="thumb"><img src={game.image} alt="" /><div className="tag">{game.tag}</div><div className="cardArrow"><Arrow/></div></div>
          <div className="cardBody"><h3>{game.title}</h3><p>{game.description}</p></div>
        </a>)}
      </div>
    </section>

    <section id="about" className="about section">
      <p className="eyebrow">WHO WE ARE</p>
      <h2>SMALL TEAM.<br/><em>BIG IDEAS.</em></h2>
      <p>Spider Studios is an independent game studio focused on making original, social Roblox experiences that are easy to jump into and hard to put down.</p>
    </section>

    <footer id="contact">
      <div><a className="brand" href="#">SPIDER<span>STUDIOS</span></a><p>Independent Roblox Game Studio</p></div>
      <a className="footerLink" href="mailto:hello@spiderstudios.gg">GET IN TOUCH <Arrow/></a>
      <small>© {new Date().getFullYear()} Spider Studios</small>
    </footer>
  </main>
}
