import { useState } from 'react';
import { submitClaim } from '../lib/contract';
const TYPES = ['flight_delay', 'product_warranty', 'rebate'];
export function ClaimForm({ address, onSubmitted }: {
  address: `0x${string}` | null; onSubmitted: () => void;
}) {
  const [claimType, setClaimType] = useState(TYPES[0]);
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [payout, setPayout] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (!address) { alert('Connect wallet first'); return; }
    if (!description || !evidenceUrl || !payout) { alert('Fill all fields'); return; }
    setBusy(true);
    try {
      const payoutWei = BigInt(Math.floor(parseFloat(payout) * 1e18));
      await submitClaim(address, claimType, description, evidenceUrl, payoutWei);
      setDescription(''); setEvidenceUrl(''); setPayout('');
      onSubmitted();
    } catch (e) { alert('Submit failed: ' + (e as Error).message); }
    finally { setBusy(false); }
  };
  return (
    <div id="claims" className="rounded-2xl border border-border bg-surface p-6">
      <p className="text-muted text-xs uppercase tracking-[0.2em] mb-6">Submit a claim</p>
      <div className="space-y-5">
        <div>
          <label className="text-sm text-muted block mb-2">Claim type</label>
          <div className="flex gap-2 flex-wrap">
            {TYPES.map((t) => (
              <button key={t} onClick={() => setClaimType(t)} className={`px-4 py-2 rounded-full text-xs border ${claimType === t ? 'border-accent text-accent bg-accent-dim' : 'border-border text-muted hover:text-white'}`}>{t.replace('_', ' ')}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm text-muted block mb-2">Description</label>
          <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="My flight BA123 was delayed 4 hours…" className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-sm resize-none" />
        </div>
        <div>
          <label className="text-sm text-muted block mb-2">Evidence URL</label>
          <input type="url" value={evidenceUrl} onChange={(e) => setEvidenceUrl(e.target.value)} placeholder="https://…" className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-sm font-mono" />
        </div>
        <div>
          <label className="text-sm text-muted block mb-2">Expected payout (GEN)</label>
          <input type="number" step="0.01" value={payout} onChange={(e) => setPayout(e.target.value)} placeholder="0.50" className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-sm" />
        </div>
        <button onClick={submit} disabled={busy || !address} className="w-full py-3 rounded-lg bg-accent text-black text-sm font-medium hover:opacity-90 disabled:opacity-40">{busy ? 'Submitting…' : 'Submit Claim'}</button>
      </div>
    </div>
  );
}
