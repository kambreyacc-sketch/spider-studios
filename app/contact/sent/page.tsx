import Link from "next/link";
const EMAIL="Spiderstudios137483@gmail.com";
export default function ContactSent(){
 return <main className="subpage">
  <nav className="siteNav"><Link className="brand" href="/"><span className="brandMark"><img src="https://cdn.discordapp.com/icons/1541030301336215562/4119cf6ca8318ba22c8882efb6e18505.webp?size=512" alt="Spider Studios"/></span><span>SPIDER</span><b>STUDIOS</b></Link><div className="navlinks"><Link href="/#games">Games</Link><Link href="/about">About</Link><Link href="/team">Team</Link><Link href="/careers">Careers</Link><Link href="/sell-game">Sell Your Game</Link><Link href="/contact">Contact</Link></div></nav>
  <section className="formWrap success"><div className="successIcon">✓</div><h2>MESSAGE SENT</h2><p>Your message was submitted to Spider Studios. We'll review it and respond to the email you provided.</p><Link className="primaryBtn" href="/">BACK HOME <span>↗</span></Link></section>
  <section className="contactDirect"><span className="sectionKicker">DIRECT CONTACT</span><h2>SPIDER STUDIOS<br/><em>EMAIL.</em></h2><a className="primaryBtn" href={"mailto:"+EMAIL}>{EMAIL} <span>↗</span></a></section>
 </main>
}