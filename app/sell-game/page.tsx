"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

const statuses = ["Concept","In Development","Completed","Released"];
const platforms = ["PC","Mobile","Roblox","Console","Web","VR / XR","Other"];
const includes = ["Source Code","Game Assets","Branding","Website","Social Accounts","Community Server","Other"];

export default function SellGamePage() {
  const [done,setDone]=useState(false);
  const [selectedPlatforms,setSelectedPlatforms]=useState<string[]>([]);
  const [selectedIncludes,setSelectedIncludes]=useState<string[]>([]);
  const [status,setStatus]=useState("Concept");
  const [negotiable,setNegotiable]=useState(false);

  const toggle=(list:string[],setList:(v:string[])=>void,value:string)=>setList(list.includes(value)?list.filter(x=>x!==value):[...list,value]);

  function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setDone(true);}

  if(done) return <main className="subpage"><nav className="nav"><Link className="brand" href="/">SPIDER<span>STUDIOS</span></Link></nav><section className="formWrap success"><div className="successIcon">✓</div><h2>SUBMISSION RECEIVED</h2><p>Spider Studios has received your game submission. If we're interested, we'll contact you using the details you provided.</p><Link className="button" href="/">BACK TO HOME ↗</Link></section></main>;

  return <main className="subpage">
    <nav className="nav"><Link className="brand" href="/">SPIDER<span>STUDIOS</span></Link><div className="navlinks"><Link href="/#games">Games</Link><Link href="/careers">Careers</Link></div></nav>
    <header className="pageHero compact"><p className="eyebrow">SELL YOUR GAME</p><h1>BUILD<br /><em>SOMETHING GREAT?</em></h1><p>Tell us about your game and we'll take a serious look. Every submission is reviewed by our team.</p></header>
    <form className="sellForm" onSubmit={submit}>
      <section className="formSection"><p className="eyebrow">01</p><h2>YOUR DETAILS</h2><div className="formGrid"><label>FULL NAME<input required name="full_name"/></label><label>EMAIL<input required type="email" name="email"/></label><label>PHONE<input name="phone"/></label><label>DISCORD USERNAME<input name="discord"/></label></div></section>
      <section className="formSection"><p className="eyebrow">02</p><h2>ABOUT THE GAME</h2><div className="formGrid"><label>GAME NAME<input required name="game_name"/></label><label>GENRE<input name="genre"/></label><label className="full">STATUS<div className="chips">{statuses.map(x=><button type="button" className={status===x?"chip active":"chip"} key={x} onClick={()=>setStatus(x)}>{x}</button>)}</div></label><label className="full">PLATFORMS<div className="chips">{platforms.map(x=><button type="button" className={selectedPlatforms.includes(x)?"chip active":"chip"} key={x} onClick={()=>toggle(selectedPlatforms,setSelectedPlatforms,x)}>{x}</button>)}</div></label><label className="full">GAME DESCRIPTION<textarea required name="description" rows={6}/></label></div></section>
      <section className="formSection"><p className="eyebrow">03</p><h2>LINKS & FILES</h2><div className="formGrid"><label>GAME / PLAY LINK<input name="play_link" placeholder="https://..."/></label><label>TRAILER LINK<input name="trailer_link" placeholder="https://..."/></label><label className="full">ATTACHMENTS<input type="file" multiple accept="image/*,.zip,.rar,.7z,.pdf,.mp4,.obj,.fbx,.rbxm,.rbxl"/></label></div></section>
      <section className="formSection"><p className="eyebrow">04</p><h2>PERFORMANCE</h2><div className="formGrid"><label>CURRENT PLAYER COUNT<input type="number" min="0" name="player_count"/></label><label>TOTAL PLAYERS / DOWNLOADS<input type="number" min="0" name="downloads"/></label><label>MONTHLY REVENUE (USD)<input type="number" min="0" name="monthly_revenue"/></label><label>TOTAL REVENUE (USD)<input type="number" min="0" name="total_revenue"/></label></div></section>
      <section className="formSection"><p className="eyebrow">05</p><h2>THE DEAL</h2><div className="formGrid"><label>ASKING PRICE (USD)<input required type="number" min="0" name="asking_price"/></label><label>NEGOTIABLE<div className="chips"><button type="button" className={negotiable?"chip active":"chip"} onClick={()=>setNegotiable(true)}>Yes</button><button type="button" className={!negotiable?"chip active":"chip"} onClick={()=>setNegotiable(false)}>No</button></div></label><label className="full">INCLUDED IN SALE<div className="chips">{includes.map(x=><button type="button" className={selectedIncludes.includes(x)?"chip active":"chip"} key={x} onClick={()=>toggle(selectedIncludes,setSelectedIncludes,x)}>{x}</button>)}</div></label><label className="full">ADDITIONAL INFORMATION<textarea name="additional" rows={5}/></label></div></section>
      <label className="rights"><input required type="checkbox"/> I confirm that I own or have the legal rights to sell the game and all materials included with it.</label>
      <button className="button" type="submit">SUBMIT GAME <span>↗</span></button>
    </form>
    <footer><Link className="brand" href="/">SPIDER<span>STUDIOS</span></Link><small>© {new Date().getFullYear()} Spider Studios</small></footer>
  </main>;
}
