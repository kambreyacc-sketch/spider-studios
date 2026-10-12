"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AdminData = {
  generatedAt: string;
  users: {
    id: string; discordId: string; discordUsername: string; createdAt: string; hasStripeCustomer: boolean;
    subscriptions: { stripeSubscriptionId: string; stripePriceId: string | null; planKey: string; status: string; interval: string | null; currentPeriodEnd: string | null; cancelAtPeriodEnd: boolean; updatedAt: string }[];
    invoices: { id: string; number: string | null; status: string | null; created: number; amountDue: number; amountPaid: number; currency: string }[];
  }[];
  issues: { id: string; stripeEventId: string | null; eventType: string | null; message: string; createdAt: string }[];
};
const human=(value:string)=>value.replaceAll("_"," ").replace(/\b\w/g,x=>x.toUpperCase());
const date=(value:string|number|null)=>value?new Date(typeof value==="number"?value*1000:value).toLocaleString():"—";

export default function AdminBillingPage(){
  const [data,setData]=useState<AdminData|null>(null);
  const [state,setState]=useState<"loading"|"ready"|"signin"|"forbidden"|"error">("loading");
  const [error,setError]=useState("");
  const load=async()=>{
    setState("loading");setError("");
    try{
      const r=await fetch("/api/admin/billing",{cache:"no-store"});
      const body=await r.json();
      if(r.status===401){setState("signin");return;}
      if(r.status===403){setState("forbidden");return;}
      if(!r.ok)throw new Error(body.error||"Unable to load billing data.");
      setData(body);setState("ready");
    }catch(e){setError(e instanceof Error?e.message:"Unable to load billing data.");setState("error");}
  };
  useEffect(()=>{void load()},[]);
  return <main className="spiderSettings">
    <div className="spiderSettingsEyebrow">SPIDER STUDIO / ADMIN</div>
    <h1 className="spiderSettingsHeading">Billing control</h1>
    <p className="spiderSettingsCopy">Authorized overview of subscriptions, payment status, invoice references, and recent billing-processing errors. Full card details and payment credentials are never displayed.</p>
    <div className="spiderSettingsActions"><Link className="spiderSettingsButton secondary" href="/admin">← Studio admin</Link><button className="spiderSettingsButton" onClick={()=>void load()}>Refresh data ↻</button></div>
    {state==="loading"&&<section className="spiderSettingsPanel" style={{marginTop:18}}><h2>Loading billing records…</h2></section>}
    {state==="signin"&&<section className="spiderSettingsPanel" style={{marginTop:18}}><h2>Verify administrator account</h2><p>Sign in with the authorized Discord account to access billing administration.</p><div className="spiderSettingsActions"><a className="spiderSettingsButton" href="/api/auth/discord/start">Continue with Discord ↗</a></div></section>}
    {state==="forbidden"&&<section className="spiderSettingsPanel" style={{marginTop:18}}><h2>Access denied</h2><p>This Discord account is not authorized to view billing records.</p></section>}
    {state==="error"&&<section className="spiderSettingsPanel" style={{marginTop:18}}><h2>Billing data unavailable</h2><p>{error}</p></section>}
    {state==="ready"&&data&&<>
      <div className="spiderBillingGrid">
        <div className="spiderBillingMetric"><span>Accounts reviewed</span><strong>{data.users.length}</strong></div>
        <div className="spiderBillingMetric"><span>Stripe customers</span><strong>{data.users.filter(u=>u.hasStripeCustomer).length}</strong></div>
        <div className="spiderBillingMetric"><span>Active / trialing</span><strong>{data.users.reduce((n,u)=>n+u.subscriptions.filter(s=>s.status==="active"||s.status==="trialing").length,0)}</strong></div>
        <div className="spiderBillingMetric"><span>Billing issues</span><strong>{data.issues.length}</strong></div>
      </div>
      <section className="spiderSettingsPanel" style={{marginTop:18}}>
        <div className="spiderSettingsEyebrow">ACCOUNTS &amp; SUBSCRIPTIONS</div><h2 style={{marginTop:8}}>Customer billing status</h2>
        <div className="spiderBillingTableWrap"><table className="spiderBillingTable"><thead><tr><th>Discord account</th><th>Plan / price reference</th><th>Status</th><th>Renewal / end</th><th>Latest invoice refs</th></tr></thead><tbody>
          {data.users.map(u=><tr key={u.id}><td>{u.discordUsername}<br/><small>{u.discordId}</small></td><td>{u.subscriptions.length?u.subscriptions.map(s=><div key={s.stripeSubscriptionId}>{human(s.planKey)}<br/><small>{s.stripePriceId||"No price reference"}</small></div>):"Free / none"}</td><td>{u.subscriptions.length?u.subscriptions.map(s=><div key={s.stripeSubscriptionId}>{human(s.status)}{s.cancelAtPeriodEnd?" · cancellation scheduled":""}</div>):"No subscription"}</td><td>{u.subscriptions.length?u.subscriptions.map(s=><div key={s.stripeSubscriptionId}>{date(s.currentPeriodEnd)}</div>):"—"}</td><td>{u.invoices.length?u.invoices.slice(0,3).map(i=><div key={i.id}>{i.number||i.id} · {human(i.status||"unknown")}</div>):"—"}</td></tr>)}
          {!data.users.length&&<tr><td colSpan={5} className="spiderBillingEmpty">No billing accounts have been created.</td></tr>}
        </tbody></table></div>
        <div className="spiderSettingsFootnote">Invoice references and statuses only; no card PANs, CVCs, or private payment credentials are exposed.</div>
      </section>
      <section className="spiderSettingsPanel" style={{marginTop:18}}>
        <div className="spiderSettingsEyebrow">WEBHOOKS &amp; PROCESSING</div><h2 style={{marginTop:8}}>Recent billing issues</h2>
        <div className="spiderBillingTableWrap"><table className="spiderBillingTable"><thead><tr><th>Time</th><th>Event</th><th>Event reference</th><th>Error</th></tr></thead><tbody>
          {data.issues.map(i=><tr key={i.id}><td>{date(i.createdAt)}</td><td>{i.eventType||"Billing"}</td><td>{i.stripeEventId||"—"}</td><td>{i.message}</td></tr>)}
          {!data.issues.length&&<tr><td colSpan={4} className="spiderBillingEmpty">No recorded billing processing errors.</td></tr>}
        </tbody></table></div>
        <div className="spiderSettingsFootnote">Updated {date(data.generatedAt)}. Failed webhook processing is recorded without storing payment credentials.</div>
      </section>
    </>}
  </main>;
}
