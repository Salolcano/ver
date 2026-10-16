import { useState } from 'react';
import { Claim, resolveClaim } from '../lib/contract';
export function ClaimDetail({ address, claim, onResolved }: {
  address: `0x${string}` | null; claim: Claim; onResolved: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const resolve = async () => {
    if (!address) { alert('Connect wallet first'); return; }
    setBusy(true);
    try { await resolveClaim(address, claim.id); setTimeout(onResolved, 3000); }
    catch (e) { alert('Resolve failed: ' + (e as Error).message); }
    finally { setBusy(false); }
  };
  let verdict: any = null;
  try { verdict = claim.verdict ? JSON.parse(claim.verdict) : null; } catch {}
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <p className="text-muted text-xs uppercase tracking-[0.2em] mb-4">Claim #{claim.id}</p>
      <p className="text-sm leading-relaxed">{claim.description}</p>
      <div className="mt-5 space-y-2 text-xs">
        <div className="flex justify-between"><span className="text-muted">Claimant</span><span className="font-mono text-muted">{claim.claimant.slice(0,8)}…{claim.claimant.slice(-6)}</span></div>
        <div className="flex justify-between"><span className="text-muted">Payout</span><span>{(claim.expected_payout / 1e18).toFixed(4)} GEN</span></div>
        <div className="flex justify-between"><span className="text-muted">Status</span><span>{claim.status}</span></div>
      </div>
      <a href={claim.evidence_url} target="_blank" rel="noreferrer" className="block mt-5 text-xs text-accent hover:underline truncate font-mono">{claim.evidence_url}</a>
      {claim.status === 'pending' && (
        <button onClick={resolve} disabled={busy || !address} className="w-full mt-6 py-3 rounded-lg bg-accent text-black text-sm font-medium hover:opacity-90 disabled:opacity-40">{busy ? 'Resolving…' : 'Resolve Claim'}</button>
      )}
      {verdict && (
        <div className="mt-6 border-t border-border pt-5">
          <p className="text-muted text-xs uppercase tracking-[0.2em] mb-3">Verdict</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-muted">Valid</span><span className={verdict.valid ? 'text-accent' : 'text-red-400'}>{String(verdict.valid)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Confidence</span><span>{verdict.confidence}%</span></div>
            <p className="text-muted leading-relaxed pt-2">{verdict.reason}</p>
          </div>
        </div>
      )}
    </div>
  );
}
