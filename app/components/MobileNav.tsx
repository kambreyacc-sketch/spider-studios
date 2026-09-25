"use client";
import {useState} from "react";
import Link from "next/link";

export default function MobileNav({links}:{links:{label:string;href:string}[]}){
 const [open,setOpen]=useState(false);
 return <div className="mobileNav">
  <button className="mobileMenuButton" aria-label="Open navigation" aria-expanded={open} onClick={()=>setOpen(v=>!v)}><span/><span/><span/></button>
  {open&&<div className="mobileMenu">{links.map(l=><Link key={l.label} href={l.href} onClick={()=>setOpen(false)}>{l.label}</Link>)}</div>}
 </div>;
}
