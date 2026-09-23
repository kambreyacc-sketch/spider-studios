const studio="Spider Studios";

function Arrow(){return <span aria-hidden>↗</span>}

export default function Home(){
  return <main>
    <nav className="nav">
      <a className="brand" href="#">{studio}<span>.</span></a>
      <div className="navlinks"><a href="#games">Games</a><a href="#about">About</a><a href="#contact">Contact</a></div>
    </nav>

    <section className="hero">
      <div className="heroGrid"/><div className="heroGlow"/>
      <p className="eyebrow">INDEPENDENT ROBLOX GAME STUDIO</p>
      <h1>SPIDER<br/><em>STUDIOS.</em></h1>
      <p className="heroText">We create memorable Roblox experiences with a focus on original ideas, strong visuals, and communities that keep coming back.</p>
      <a className="button" href="#games">VIEW GAMES <Arrow/></a>
    </section>

    <section id="games" className="section">
      <div className="sectionHead"><div><p className="eyebrow">SELECTED WORK</p><h2>GAMES</h2></div></div>
      <div className="emptyState"><span>01</span><p>Games will appear here.</p></div>
    </section>

    <section id="about" className="about section">
      <div><p className="eyebrow">ABOUT THE STUDIO</p><h2>BUILT TO<br/><em>STAND OUT.</em></h2></div>
      <p>Spider Studios is an independent Roblox game studio building original experiences for players around the world.</p>
    </section>

    <footer id="contact">
      <div><a className="brand" href="#">{studio}<span>.</span></a><p>Independent Roblox Game Studio</p></div>
      <div className="footerRight"><a href="#games">GAMES <Arrow/></a><a href="#about">ABOUT <Arrow/></a></div>
      <small>© {new Date().getFullYear()} Spider Studios</small>
    </footer>
  </main>
}
