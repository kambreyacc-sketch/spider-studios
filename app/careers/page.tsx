"use client";

import Link from "next/link";
import { useState } from "react";

type Role = {
  department: string;
  title: string;
  description: string;
  experience: string;
  arrangement: string;
};

const roles: Role[] = [
  {
    department: "General",
    title: "General Application",
    description: "Don't see a specific opening? Tell Spider Studios what you can bring to the team.",
    experience: "All levels",
    arrangement: "Remote",
  },
];

export default function CareersPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <main className="subpage">
      <nav className="nav">
        <Link className="brand" href="/">SPIDER<span>STUDIOS</span></Link>
        <div className="navlinks">
          <Link href="/#games">Games</Link>
          <Link href="/careers">Careers</Link>
          <Link href="/sell-game">Sell Your Game</Link>
          <Link href="/#community">Community</Link>
        </div>
      </nav>

      <header className="pageHero">
        <p className="eyebrow">CAREERS</p>
        <h1>MAKE GAMES<br /><em>WITH US.</em></h1>
        <p>We're looking for creative, talented people who want to help build Spider Studios experiences.</p>
      </header>

      <section className="subsection">
        <div className="sectionHead">
          <div><p className="eyebrow">OPEN ROLES</p><h2>APPLY</h2></div>
          <span className="count">{roles.length} ROLE</span>
        </div>

        <div className="roleGrid">
          {roles.map((role) => (
            <article className="roleCard" key={role.title}>
              <div className="roleTop">
                <div>
                  <span className="roleDept">{role.department}</span>
                  <h3>{role.title}</h3>
                </div>
                <span className="status">OPEN</span>
              </div>
              <p>{role.description}</p>
              <div className="roleMeta"><span>◈ {role.experience}</span><span>⌖ {role.arrangement}</span></div>
              <Link className="textButton" href={"/apply?role=" + encodeURIComponent(role.title)}>Apply Now ↗</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="creatorBox">
        <p className="eyebrow">CREATOR PROGRAM</p>
        <h2>CREATE WITH<br /><em>SPIDER.</em></h2>
        <p>Are you a Roblox YouTuber, TikTok creator, or streamer? Create content about Spider Studios games, join the community, and get news about upcoming releases and events.</p>
        <p className="fine">We don't promise free items, payment, early access, or creator rewards unless explicitly offered.</p>
        <Link className="button" href="/contact?category=creator">CREATOR INQUIRIES ↗</Link>
      </section>

      <section className="businessBox">
        <p className="eyebrow">BUSINESS</p>
        <h2>BUSINESS<br /><em>INQUIRIES.</em></h2>
        <p>Partnerships, sponsorships, collaborations, and other business opportunities.</p>
        <Link className="textButton" href="/contact?category=business">CONTACT BUSINESS TEAM ↗</Link>
      </section>

      <footer><Link className="brand" href="/">SPIDER<span>STUDIOS</span></Link><small>© {new Date().getFullYear()} Spider Studios</small></footer>
    </main>
  );
}
