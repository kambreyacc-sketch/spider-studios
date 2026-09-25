"use client";
import Link from "next/link";

const EMAIL="Spiderstudios137483@gmail.com";

export default function ContactPage(){
 return <main className="subpage">
  <nav className="siteNav"><Link className="brand" href="/"><span className="brandMark"><img src="https://cdn.discordapp.com/icons/1541030301336215562/4119cf6ca8318ba22c8882efb6e18505.webp?size=512" alt="Spider Studios"/></span><span>SPIDER</span><b>STUDIOS</b></Link><div className="navlinks"><Link href="/#games">Games</Link><Link href="/about">About</Link><Link href="/team">Team</Link><Link href="/careers">Careers</Link><Link href="/sell-game">Sell Your Game</Link><Link href="/contact">Contact</Link><Link href="/admin">Admin</Link></div></nav>
  <header className="pageHero"><div className="heroPill"><span/> CONTACT SPIDER STUDIOS</div><h1>LET'S<br/><em>TALK.</em></h1><p>Partnerships, creator questions, business opportunities, game acquisitions, hiring, and general studio inquiries.</p><a className="primaryBtn" href={"mailto:"+EMAIL}>EMAIL US <span>↗</span></a><p className="contactEmail"><a href={"mailto:"+EMAIL}>{EMAIL}</a></p></header>
  <form className="formWrap" action={"https://formsubmit.co/"+EMAIL} method="POST">
   <input type="hidden" name="_subject" value="Spider Studios Website Contact"/>
   <input type="hidden" name="_captcha" value="false"/>
   <input type="hidden" name="_template" value="box"/>
   <input type="hidden" name="_next" value="https://spider-studios-hq.vercel.app/contact/sent"/>
   <div className="formGrid">
    <label>NAME<input required name="name" placeholder="Your name"/></label>
    <label>EMAIL<input required type="email" name="_replyto" placeholder="you@example.com"/></label>
    <label>INQUIRY TYPE<select name="category"><option>General</option><option>Creator</option><option>Business</option><option>Partnership</option><option>Game Acquisition</option><option>Hiring</option></select></label>
    <label className="full">MESSAGE<textarea required rows={8} name="message" placeholder="Tell us what you need..."/></label>
   </div>
   <button className="primaryBtn submitBtn" type="submit">SEND MESSAGE <span>↗</span></button>
  </form>
  <section className="contactDirect"><span className="sectionKicker">DIRECT CONTACT</span><h2>SPIDER STUDIOS<br/><em>EMAIL.</em></h2><a className="primaryBtn" href={"mailto:"+EMAIL}>{EMAIL} <span>↗</span></a></section>
  <footer className="siteFooter"><Link className="brand" href="/"><span className="brandMark"><img src="https://cdn.discordapp.com/icons/1541030301336215562/4119cf6ca8318ba22c8882efb6e18505.webp?size=512" alt="Spider Studios"/></span><span>SPIDER</span><b>STUDIOS</b></Link><a className="footerEmail" href={"mailto:"+EMAIL}>{EMAIL}</a><small>© {new Date().getFullYear()} Spider Studios</small></footer>
 </main>
}