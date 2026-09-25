"use client";
import {useMemo,useState} from "react";
import {games} from "../data/games";
import {staff} from "../data/team";

const roles=["Scripters","Map Builders","3D Modelers","UI Designers","VFX Artists","Animators","Game Designers","Sound Designers","QA Testers","Backend Developers","Frontend Developers","Full-Stack Developers","Roblox Developers","Discord Developers","DevOps","Community Managers","Marketing","Game Analysts","Concept / Idea Developers"];

function answer(q:string){
 const x=q.toLowerCase();
 if(/who|team|staff|owner|developer|manager|lead/.test(x)){
  const leadership=staff.filter(s=>s.department==="Leadership");
  return "Spider Studios is led by "+leadership.map(s=>s.name+" ("+s.role+")").join(", ")+". The full team directory includes community staff and developers. Ask me about a specific team member for their role and bio.";
 }
 if(/hire|hiring|job|jobs|career|join|work/.test(x)){
  return "We're actively looking for developers, artists, designers, QA, community, marketing, Discord, web, and game-design talent. We're also open to people with skills or ideas that aren't listed. Visit the Careers page to apply.";
 }
 if(/sell|buy|acqui|acquisition|game.*sale|for sale/.test(x)){
  const sale=games.filter(g=>g.sale).map(g=>g.title).join(", ");
  return "Spider Studios is open to buying full Roblox games, partial ownership, investments, and partnerships. Current game for sale: "+sale+". Use Sell Your Game for acquisition inquiries.";
 }
 if(/game|games|play|portfolio/.test(x)){
  return "Spider Studios works on Roblox experiences across obby, survival, casual, adventure, horror, and other genres. Ask me for the current games list or a specific title.";
 }
 if(/discord|contact|reach|message/.test(x)){
  return "You can contact Spider Studios through the Discord community linked on the website, or use the site's business, creator, and application forms.";
 }
 if(/idea|ideas|concept|suggest/.test(x)){
  return "Yes — we're still looking for ideas. We want original mechanics, maps, progression systems, events, and concepts that make our games stand out.";
 }
 if(/role|roles|need|looking for/.test(x)){
  return "Current areas include: "+roles.slice(0,8).join(", ")+", and more. Check Careers for the complete list.";
 }
 return "I'm Spider Studios Support. I can tell you about the team, games, hiring, game acquisitions, partnerships, and how to contact us. What do you want to know?";
}

export default function SpiderSupport(){
 const [open,setOpen]=useState(false); const [q,setQ]=useState(""); const [messages,setMessages]=useState<string[]>([]);
 const suggestions=useMemo(()=>["Who is on the team?","What games do you have?","Are you hiring?","Do you buy Roblox games?"],[ ]);
 function send(text=q){const v=text.trim();if(!v)return;setMessages(m=>[...m,"You: "+v,"Spider AI: "+answer(v)]);setQ("");}
 return <div className={"supportWidget "+(open?"open":"")}><button className="supportLauncher" onClick={()=>setOpen(!open)}>{open?"×":"SPIDER AI"}</button>{open&&<div className="supportPanel"><div className="supportHead"><div><strong>Spider AI Support</strong><small>Ask about the studio, team, games, hiring or acquisitions.</small></div></div><div className="supportMessages">{messages.length===0&&<div className="supportWelcome">Hi — I’m Spider Studios Support. What can I help you find?<div className="supportSuggestions">{suggestions.map(s=><button key={s} onClick={()=>send(s)}>{s}</button>)}</div></div>}{messages.map((m,i)=><div className={m.startsWith("You:")?"supportMsg user":"supportMsg"} key={i}>{m.replace(/^(You:|Spider AI:) /,"")}</div>)}</div><div className="supportInput"><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask Spider AI..." /><button onClick={()=>send()}>SEND</button></div></div>}</div>
}