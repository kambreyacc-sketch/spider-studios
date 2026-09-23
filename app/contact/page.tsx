"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [sent,setSent]=useState(false);
  function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setSent(true);}
  return <main className="subpage"><nav className="nav"><Link className="brand" href="/">SPIDER<span>STUDIOS</span></Link><div className="navlinks"><Link href="/careers">Careers</Link><Link href="/sell-game">Sell Your Game</Link></div></nav>
    <header className="pageHero compact"><p className="eyebrow">CONTACT</p><h1>LET'S<br /><em>TALK.</em></h1><p>Creator, business, partnership, and general inquiries.</p></header>
    {sent?<section className="formWrap success"><div className="successIcon">✓</div><h2>MESSAGE RECEIVED</h2><p>Thanks for reaching out to Spider Studios.</p><Link className="button" href="/">BACK HOME ↗</Link></section>:<form className="formWrap" onSubmit={submit}><label>NAME<input required/></label><label>EMAIL<input type="email" required/></label><label>INQUIRY TYPE<select defaultValue="general"><option value="general">General</option><option value="creator">Creator</option><option value="business">Business</option></select></label><label>MESSAGE<textarea rows={8} required/></label><button className="button" type="submit">SEND MESSAGE ↗</button></form>}
    <footer><Link className="brand" href="/">SPIDER<span>STUDIOS</span></Link><small>© {new Date().getFullYear()} Spider Studios</small></footer>
  </main>;
}
