"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

const roles = [
"Scripter / Roblox Luau Developer","Roblox Developer","Backend Developer","Frontend / Full-Stack Developer",
"Map Builder","3D Modeler","UI/UX Designer","VFX Artist","Animator","Game Designer / Concept Developer",
"Sound Designer","QA Tester","Community Manager","Marketing / Growth","Discord Developer","Game Analyst","General Application"
];

export default function ApplyPage(){
 const params=useSearchParams();
 const [status,setStatus]=useState("idle");
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault(); setStatus("sending");
  const data=Object.fromEntries(new FormData(e.currentTarget).entries());
  try{const r=await fetch("/api/applications",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});if(!r.ok)throw new Error();setStatus("success");e.currentTarget.reset()}catch{setStatus("error")}
 }
 if(status==="success") return <main className="subpage"><nav className="siteNav"><Link className="brand" href="/"><span className="brandMark">S</span><span>SPIDER</span><b>STUDIOS</b></Link></nav><section className="formWrap success"><div className="successIcon">✓</div><h2>APPLICATION SENT.</h2><p>Thanks for applying to Spider Studios. Your application has been sent to the team for review.</p><Link className="primaryBtn" href="/careers">BACK TO CAREERS <span>↗</span></Link></section></main>;
 return <main className="subpage">
 <nav className="siteNav"><Link className="brand" href="/"><span className="brandMark">S</span><span>SPIDER</span><b>STUDIOS</b></Link><div className="navlinks"><Link href="/careers">Careers</Link><Link href="/team">Team</Link><Link href="/">Home</Link></div></nav>
 <header className="pageHero"><div className="heroPill"><span/> SPIDER STUDIOS APPLICATION</div><h1>APPLY<br/><em>TO JOIN.</em></h1><p>We want to see what you can actually build. Be specific, link your work, and tell us what you personally contributed.</p></header>
 <form className="formWrap applicationForm" onSubmit={submit}>
 <div className="formGrid">
 <label>DISCORD USERNAME<input name="discord" required placeholder="username"/></label><label>AGE<input name="age" required type="number" min="13" max="99"/></label>
 <label>ROLE APPLYING FOR<select name="role" defaultValue={params.get("role")||""} required><option value="" disabled>Select a role</option>{roles.map(r=><option key={r}>{r}</option>)}</select></label>
 <label>TIMEZONE<input name="timezone" required placeholder="e.g. MST"/></label><label>AVAILABILITY<input name="availability" required placeholder="e.g. 10–15 hours/week"/></label><label>START DATE<input name="startDate" placeholder="When could you start?"/></label>
 <label className="full">PORTFOLIO / EXAMPLES<textarea name="portfolio" required placeholder="Roblox games, GitHub, videos, screenshots, models, UI, maps, etc."/></label>
 <label className="full">DEVELOPMENT EXPERIENCE<textarea name="experience" required placeholder="How long have you developed? What tools/languages do you use?"/></label>
 <label className="full">WHAT HAVE YOU ACTUALLY SHIPPED?<textarea name="shipped" required placeholder="Describe projects you personally worked on and exactly what you contributed."/></label>
 <label className="full">TECHNICAL SKILLS<textarea name="skills" required placeholder="Luau, JS/TS, React, Next.js, Blender, UEFN/Verse, VFX, UI/UX, Git, APIs, databases, etc."/></label>
 <label className="full">HARDEST PROBLEM YOU'VE SOLVED<textarea name="problem" required placeholder="Tell us about a difficult bug, system, performance issue, or design problem you solved."/></label>
 <label className="full">TEAM EXPERIENCE<textarea name="teamwork" required placeholder="Have you worked on a development team before? What was your role?"/></label>
 <label className="full">WHY SPIDER STUDIOS?<textarea name="why" required placeholder="What makes you interested in working with us?"/></label>
 <label className="full">ANYTHING ELSE?<textarea name="anything" placeholder="Anything else you want the team to know."/></label>
 <label className="full">COMPENSATION EXPECTATIONS<input name="compensation" placeholder="Optional — paid, revenue share, project-based, etc."/></label>
 </div>
 {status==="error"&&<p style={{color:"#aaa"}}>Could not send the application. The application system may not be configured yet.</p>}
 <button className="primaryBtn submitBtn" disabled={status==="sending"}>{status==="sending"?"SENDING...":"SUBMIT APPLICATION"} <span>↗</span></button>
 </form></main>
}