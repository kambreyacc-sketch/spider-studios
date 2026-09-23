"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ApplyPage() {
  const params = useSearchParams();
  const [role, setRole] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setRole(params.get("role") || "");
  }, [params]);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <main className="subpage">
      <nav className="nav"><Link className="brand" href="/">SPIDER<span>STUDIOS</span></Link><div className="navlinks"><Link href="/careers">Careers</Link><Link href="/#games">Games</Link></div></nav>
      <header className="pageHero compact"><p className="eyebrow">APPLICATION</p><h1>APPLY<br /><em>TO JOIN.</em></h1><p>Send your information to the Spider Studios team.</p></header>
      {sent ? (
        <section className="formWrap success"><div className="successIcon">✓</div><h2>APPLICATION RECEIVED</h2><p>Your application has been submitted on this site. We'll review the information you provided.</p><Link className="button" href="/careers">BACK TO CAREERS ↗</Link></section>
      ) : (
        <form className="formWrap" onSubmit={submit}>
          <label>ROLE<input value={role} onChange={(e)=>setRole(e.target.value)} placeholder="Role you're applying for" required /></label>
          <label>FULL NAME<input name="name" placeholder="Your name" required /></label>
          <label>EMAIL<input type="email" name="email" placeholder="you@example.com" required /></label>
          <label>DISCORD USERNAME<input name="discord" placeholder="username" /></label>
          <label>PORTFOLIO / WORK LINK<input type="url" name="portfolio" placeholder="https://..." /></label>
          <label>ABOUT YOU<textarea name="about" rows={7} placeholder="Tell us about yourself, your skills, and what you can bring to Spider Studios." required /></label>
          <label>WHY THIS ROLE?<textarea name="why" rows={5} placeholder="Why do you want to join Spider Studios?" required /></label>
          <button className="button" type="submit">SUBMIT APPLICATION ↗</button>
        </form>
      )}
      <footer><Link className="brand" href="/">SPIDER<span>STUDIOS</span></Link><small>© {new Date().getFullYear()} Spider Studios</small></footer>
    </main>
  );
}
