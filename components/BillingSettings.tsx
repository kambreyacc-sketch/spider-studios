"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type PaymentMethod = { id: string; brand: string; last4: string; expMonth: number | null; expYear: number | null; isDefault: boolean };
type Invoice = { id: string; number: string | null; status: string | null; currency: string; amountPaid: number; amountDue: number; created: number; hostedInvoiceUrl: string | null; invoicePdf: string | null; description: string };
type Summary = {
  account: { discordUsername: string };
  subscription: null | { id: string; status: string; cancelAtPeriodEnd: boolean; currentPeriodEnd: number | null; interval: string | null; currency: string | null; amount: number | null };
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
  configuredPrices: { monthly: boolean; yearly: boolean };
};
type LoadState = "loading" | "ready" | "signed-out" | "not-configured" | "error";

const money = (amount: number, currency: string) => new Intl.NumberFormat(undefined, { style: "currency", currency: currency.toUpperCase() }).format(amount / 100);
const date = (seconds: number | null) => seconds ? new Date(seconds * 1000).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Not available";
const statusLabel = (status: string) => status.replaceAll("_", " ").replace(/\b\w/g, s => s.toUpperCase());

export default function BillingSettings() {
  const [state, setState] = useState<LoadState>("loading");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"monthly" | "yearly" | "portal" | "card" | null>(null);

  const load = useCallback(async () => {
    setState("loading"); setError("");
    try {
      const response = await fetch("/api/billing/summary", { cache: "no-store" });
      const data = await response.json();
      if (response.status === 401) { setState("signed-out"); return; }
      if (response.status === 503) { setError(data.error || "Billing configuration is incomplete."); setState("not-configured"); return; }
      if (!response.ok) throw new Error(data.error || "Unable to load billing information.");
      setSummary(data as Summary); setState("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load billing information."); setState("error");
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const goTo = async (kind: "monthly" | "yearly" | "portal" | "card") => {
    setBusy(kind); setError("");
    try {
      const endpoint = kind === "portal" ? "/api/billing/portal" : kind === "card" ? "/api/billing/payment-method" : "/api/billing/checkout";
      const response = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: kind === "monthly" || kind === "yearly" ? JSON.stringify({ interval: kind }) : "{}",
      });
      const data = await response.json();
      if (response.status === 401) { window.location.href = "/api/auth/discord/start"; return; }
      if (!response.ok) throw new Error(data.error || "The billing action could not be completed.");
      if (!data.url) throw new Error("The secure billing provider did not return a destination.");
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The billing action could not be completed."); setBusy(null);
    }
  };

  return <main className="spiderSettings">
    <div className="spiderSettingsEyebrow">SPIDER STUDIO / ACCOUNT</div>
    <h1 className="spiderSettingsHeading">Billing &amp; payments</h1>
    <p className="spiderSettingsCopy">Manage your membership, saved cards, and receipts in one place. Card details are handled by Stripe; Spider Studio never stores full card numbers or security codes.</p>
    <div className="spiderSettingsShell" style={{ marginTop: 28 }}>
      <aside className="spiderSettingsSidebar">
        <div className="spiderSettingsEyebrow">SETTINGS</div>
        <nav className="spiderSettingsNav" aria-label="Account settings">
          <Link href="/" >← Spider Studio</Link>
          <Link href="/dashboard/settings?tab=billing" aria-current="page">Billing &amp; payments</Link>
        </nav>
        <div className="spiderSettingsFootnote">SECURE BILLING · POWERED BY STRIPE</div>
      </aside>
      <div className="spiderSettingsMain">
        {state === "loading" && <section className="spiderSettingsPanel" aria-live="polite"><h2>Loading billing details</h2><p>Checking your signed-in account and Stripe billing records…</p></section>}
        {state === "signed-out" && <section className="spiderSettingsPanel"><h2>Sign in to manage billing</h2><p>Your payment methods and invoices are private to your Spider Studio account. Sign in with Discord to continue.</p><div className="spiderSettingsActions"><a className="spiderSettingsButton" href="/api/auth/discord/start">Continue with Discord ↗</a></div></section>}
        {state === "not-configured" && <section className="spiderSettingsPanel"><div className="spiderBillingStatus"><div className="spiderBillingStatusIcon">!</div><div><strong>Billing setup is not finished</strong><span>{error}</span></div></div><p style={{ marginTop: 14 }}>No charge has been made. A site administrator must finish server-side database, Discord OAuth, and Stripe configuration before billing actions can run.</p></section>}
        {state === "error" && <section className="spiderSettingsPanel"><h2>We couldn't load billing</h2><p>{error}</p><div className="spiderSettingsActions"><button className="spiderSettingsButton secondary" onClick={() => void load()}>Try again</button></div></section>}
        {state === "ready" && summary && <>
          <section className="spiderSettingsPanel">
            <div className="spiderSettingsEyebrow">YOUR MEMBERSHIP</div><h2 style={{ marginTop: 8 }}>Subscription overview</h2><p>Signed in as {summary.account.discordUsername}.</p>
            <div className="spiderBillingGrid">
              <div className="spiderBillingMetric"><span>Current plan</span><strong>{summary.subscription ? (summary.subscription.status === "active" || summary.subscription.status === "trialing" ? "Spider Studio Premium" : summary.subscription.status === "past_due" || summary.subscription.status === "unpaid" ? "Payment issue" : "Subscription pending") : "Free plan"}</strong></div>
              <div className="spiderBillingMetric"><span>Subscription status</span><strong>{summary.subscription ? statusLabel(summary.subscription.status) : "No paid subscription"}</strong></div>
              <div className="spiderBillingMetric"><span>Next renewal / period end</span><strong>{summary.subscription ? date(summary.subscription.currentPeriodEnd) : "—"}</strong></div>
              <div className="spiderBillingMetric"><span>Renewal setting</span><strong>{summary.subscription ? summary.subscription.cancelAtPeriodEnd ? "Cancels at period end" : "Renews automatically" : "Not subscribed"}</strong></div>
            </div>
            {summary.subscription?.amount !== null && summary.subscription?.amount !== undefined && summary.subscription.currency && <p style={{ marginTop: 14 }}>Current recurring price: {money(summary.subscription.amount, summary.subscription.currency)} / {summary.subscription.interval || "billing period"}. Amount is read from Stripe.</p>}
            <div className="spiderSettingsActions">
              {summary.subscription ? <button className="spiderSettingsButton" disabled={busy !== null} onClick={() => void goTo("portal")}>{busy === "portal" ? "Opening Stripe…" : "Manage subscription ↗"}</button> : <>
                <button className="spiderSettingsButton" disabled={!summary.configuredPrices.monthly || busy !== null} onClick={() => void goTo("monthly")}>{busy === "monthly" ? "Opening Stripe…" : "Choose monthly plan"}</button>
                <button className="spiderSettingsButton secondary" disabled={!summary.configuredPrices.yearly || busy !== null} onClick={() => void goTo("yearly")}>{busy === "yearly" ? "Opening Stripe…" : "Choose yearly plan"}</button>
              </>}
            </div>
            {!summary.configuredPrices.monthly && !summary.configuredPrices.yearly && <div className="spiderSettingsFootnote">Paid plans are not available yet. No prices have been assumed or activated.</div>}
          </section>
          <section className="spiderSettingsPanel">
            <div className="spiderSettingsEyebrow">PAYMENT METHODS</div><h2 style={{ marginTop: 8 }}>Saved cards</h2><p>Only card brand, last four digits, and expiration are displayed. Add, replace, remove, or set a default card through Stripe's secure hosted pages.</p>
            {summary.paymentMethods.length ? <div className="spiderBillingTableWrap"><table className="spiderBillingTable"><thead><tr><th>Card</th><th>Expires</th><th>Default</th></tr></thead><tbody>{summary.paymentMethods.map(card => <tr key={card.id}><td>{card.brand.toUpperCase()} ···· {card.last4}</td><td>{card.expMonth && card.expYear ? String(card.expMonth).padStart(2,"0") + "/" + card.expYear : "—"}</td><td>{card.isDefault ? "Default" : "—"}</td></tr>)}</tbody></table></div> : <p style={{ marginTop: 16 }}>No saved cards on this account yet.</p>}
            <div className="spiderSettingsActions"><button className="spiderSettingsButton" disabled={busy !== null} onClick={() => void goTo("card")}>{busy === "card" ? "Opening secure setup…" : "Add payment method ↗"}</button>{summary.paymentMethods.length > 0 && <button className="spiderSettingsButton secondary" disabled={busy !== null} onClick={() => void goTo("portal")}>Update / remove cards ↗</button>}</div>
          </section>
          <section className="spiderSettingsPanel">
            <div className="spiderSettingsEyebrow">BILLING HISTORY</div><h2 style={{ marginTop: 8 }}>Invoices &amp; receipts</h2><p>Download invoices and receipts provided by Stripe.</p>
            <div className="spiderBillingTableWrap"><table className="spiderBillingTable"><thead><tr><th>Invoice</th><th>Date</th><th>Status</th><th>Amount paid</th><th>Receipt</th></tr></thead><tbody>
              {summary.invoices.map(invoice => <tr key={invoice.id}><td>{invoice.number || invoice.id}</td><td>{date(invoice.created)}</td><td>{invoice.status ? statusLabel(invoice.status) : "—"}</td><td>{money(invoice.amountPaid, invoice.currency)}</td><td>{invoice.invoicePdf ? <a href={invoice.invoicePdf} target="_blank" rel="noreferrer">PDF ↗</a> : invoice.hostedInvoiceUrl ? <a href={invoice.hostedInvoiceUrl} target="_blank" rel="noreferrer">View ↗</a> : "—"}</td></tr>)}
              {!summary.invoices.length && <tr><td className="spiderBillingEmpty" colSpan={5}>No invoices have been issued for this account.</td></tr>}
            </tbody></table></div>
            <div className="spiderSettingsFootnote">Invoice links are supplied by Stripe and are only displayed for your authenticated customer record.</div>
          </section>
          {error && <div className="spiderBillingStatus" role="alert"><div className="spiderBillingStatusIcon">!</div><div><strong>Billing action failed</strong><span>{error}</span></div></div>}
        </>}
      </div>
    </div>
  </main>;
}
