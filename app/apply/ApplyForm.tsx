"use client";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {useState} from "react";
import MobileNav from "../components/MobileNav";
const EMAIL="Spiderstudios137483@gmail.com";
const roles=["Scripter / Roblox Luau Developer","Roblox Developer","Backend Developer","Frontend / Full-Stack Developer","Map Builder","3D Modeler","UI/UX Designer","VFX Artist","Animator","Game Designer / Concept Developer","Sound Designer","QA Tester","Community Manager","Marketing / Growth","Discord Developer","Game Analyst","General Application"];
export default function ApplyForm(){
 const params=useSearchParams();
 const [status,setStatus]=useState("idle");
 if(status==="success")return <main className="subpage"><section className="formWrap success"><div className="successIcon">✓</div><h2>APPLICATION SENT.</h2><p>Your application has been sent to the Spider Studios team.</p><Link className="primaryBtn" href="/careers">BACK TO CAREERS ↗</Link></section></main>;
 return <main className="subpage">
  <nav className="siteNav"><Link className="brand" href="/"><span className="brandMark"><img src="https://cdn.discordapp.com/icons/1541030301336215562/4119cf6ca8318ba22c8882efb6e18505.webp?size=512" alt="Spider Studios"/></span><span>SPIDER</span><b>STUDIOS</b></Link><div className="navlinks"><Link href="/careers">Careers</Link><Link href="/team">Team</Link><Link href="/contact">Contact</Link><Link href="/">Home</Link></div><MobileNav links={[{label:"Careers",href:"/careers"},{label:"Team",href:"/team"},{label:"Contact",href:"/contact"},{label:"Home",href:"/"}]}/></nav>
  <header className="pageHero"><div className="heroPill"><span/> SPIDER STUDIOS APPLICATION</div><h1>APPLY<br/><em>TO JOIN.</em></h1><p>Show us what you can actually build. Be specific and link your work.</p></header>
  <form className="formWrap" action={"https://formsubmit.co/"+EMAIL} method="POST">\n   <input type="hidden" name="_subject" value="Spider Studios Developer Application"/>\n   <input type="hidden" name="_captcha" value="false"/>\n   <input type="hidden" name="_template" value="box"/>\n   <input type="hidden" name="_next" value="https://spider-studios-hq.vercel.app/apply/sent"/>
   <div className="formGrid">
    <label>DISCORD USERNAME<input name="discord" required/></label>
    <label>EMAIL<input name="email" required type="email" placeholder="you@example.com"/></label>
    <label>AGE<input name="age" required type="number" min="13" max="99"/></label>
    <label>ROLE<select name="role" defaultValue={params.get("role")||""} required><option value="" disabled>Select a role</option>{roles.map(r=><option key={r}>{r}</option>)}</select></label>
    <label>TIMEZONE<input name="timezone" required placeholder="e.g. MST"/></label>
    <label>AVAILABILITY<input name="availability" required placeholder="10–15 hours/week"/></label>
    <label>START DATE<input name="startDate"/></label>
    <label className="full">PORTFOLIO / EXAMPLES<textarea name="portfolio" required/></label>
    <label className="full">DEVELOPMENT EXPERIENCE<textarea name="experience" required/></label>
    <label className="full">WHAT HAVE YOU ACTUALLY SHIPPED?<textarea name="shipped" required/></label>
    <label className="full">TECHNICAL SKILLS<textarea name="skills" required placeholder="Luau, JS/TS, React, Blender, UEFN/Verse, VFX, UI/UX, Git, APIs, etc."/></label>
    <label className="full">HARDEST PROBLEM YOU'VE SOLVED<textarea name="problem" required/></label>
    <label className="full">TEAM EXPERIENCE<textarea name="teamwork" required/></label>
    <label className="full">WHY SPIDER STUDIOS?<textarea name="why" required/></label>
    <label className="full">ANYTHING ELSE?<textarea name="anything"/></label>
    <label className="full">COMPENSATION EXPECTATIONS<input name="compensation"/></label>
   </div>
   {status==="error"&&<p className="formError">Could not send application. Please try again.</p>}
   <button className="primaryBtn submitBtn" type="submit">SUBMIT APPLICATION ↗</button>
  </form>
 </main>
}