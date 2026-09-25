"use client";
import Link from "next/link";
import {FormEvent,useState} from "react";
const EMAIL="Spiderstudios137483@gmail.com";
export default function ContactPage(){
  const [status,setStatus]=useState<"idle"|"sending"|"sent"|"error">("idle");
  const submit=async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setStatus("sending");
    const form=e.currentTarget;
    const data=new FormData(form);
    data.append("_subject","Spider Studios Website Contact");
    data.append("_captcha","false");
    data.append("_template","table");
    try{
      const res=await fetch("https://formsubmit.co/ajax/"+EMAIL,{method:"POST",body:data,headers:{Accept:"application/json"}});
      if(!res.ok) throw new Error("send failed");
      setStatus("sent");
      form.reset();
    }catch{setStatus("error")}
  };
  return <main className="subpage"><nav className="siteNav"><Link className="brand" href="/"><span className="brandMark"><img src="https://cdn.discordapp.com/icons/1541030301336215562/4119cf6ca8318ba22c8882efb6e18505.webp?size=512" alt="Spider Studios"/></span><span>SPIDER</span><b>STUDIOS</b></Link><div className="navlinks"><Link href="/#games">Games</Link><Link href="/about">About</Link><Link href="/team">Team</Link><Link href="/careers">Careers</Link><Link href="/sell-game">Sell Your Game</Link><Link href="/contact">Contact</Link><Link href="/admin">Admin</Link></div></nav><header className="pageHero"><div className="heroPill"><span/> CONTACT SPIDER STUDIOS</div><h1>LET'S<br/><em>TALK.</em></h1><p>Partnerships, creator questions, business opportunities, game acquisitions, hiring, and general studio inquiries.</p><a className="primaryBtn" href={"mailto:"+EMAIL}>EMAIL US <span>↗</span></a><p className="contactEmail"><a href={"mailto:"+EMAIL}>{EMAIL}</a></p></header>{status==="sent"?<section className="formWrap success"><div className="successIcon">✓</div><h2>MESSAGE SENT</h2><p>Your message was sent to Spider Studios. If you don't see it, check your spam/junk folder.</p><Link className="primaryBtn" href="/">BACK HOME <span>↗</span></Link></section>:<form className="formWrap" onSubmit={submit}><div className="formGrid"><label>NAME<input required name="name"/></label><label>EMAIL<input required type="email" name="email"/></label><label>INQUIRY TYPE<select name="category"><option>General</option><option>Creator</option><option>Business</option><option>Partnership</option></select></label><label className="full">MESSAGE<textarea required rows={8} name="message"/></label></div>{status==="error"&&<p className="formError">Couldn't send the message. Please use the EMAIL US button above.</p>}<button className="primaryBtn submitBtn" type="submit" disabled={status==="sending"}>{status==="sending"?"SENDING...":"SEND MESSAGE"} <span>↗</span></button></form>}<section className="contactDirect"><span className="sectionKicker">DIRECT CONTACT</span><h2>SPIDER STUDIOS<br/><em>EMAIL.</em></h2><a className="primaryBtn" href={"mailto:"+EMAIL}>{EMAIL} <span>↗</span></a></section><footer className="siteFooter"><Link className="brand" href="/"><span className="brandMark"><img src="https://cdn.discordapp.com/icons/1541030301336215562/4119cf6ca8318ba22c8882efb6e18505.webp?size=512" alt="Spider Studios"/></span><span>SPIDER</span><b>STUDIOS</b></Link><a className="footerEmail" href={"mailto:"+EMAIL}>{EMAIL}</a><small>© {new Date().getFullYear()} Spider Studios</small></footer></main>
}