import { useState } from 'react';
import { fundPool } from '../lib/contract';
export function PoolPanel({ address, balance, onFunded }: {
  address: `0x${string}` | null; balance: string; onFunded: () => void;
}) {
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (!address) { alert('Connect wallet first'); return; }
    if (!amount) return;
    setBusy(true);
    try {
      const wei = BigInt(Math.floor(parseFloat(amount) * 1e18));
      await fundPool(address, wei);
      setAmount('');
      onFunded();
    } catch (e) { alert('Funding failed: ' + (e as Error).message); }
    finally { setBusy(false); }
  };
  return (
    <div id="pool" className="rounded-2xl border border-border bg-surface p-6">
      <p className="text-muted text-xs uppercase tracking-[0.2em] mb-4">Claim pool</p>
      <div className="flex items-baseline gap-3">
        <span className="serif-headline text-4xl">{(Number(balance) / 1e18).toFixed(4)}</span>
        <span className="text-muted text-sm">GEN</span>
      </div>
      <p className="text-muted-dim text-xs mt-3">Approved claims are paid from this pool.</p>
      <div className="mt-6 space-y-3">
        <input type="number" step="0.01" placeholder="Amount in GEN" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-sm" />
        <button onClick={submit} disabled={busy || !address} className="w-full py-3 rounded-lg bg-accent text-black text-sm font-medium hover:opacity-90 disabled:opacity-40">{busy ? 'Funding…' : 'Fund Pool'}</button>
      </div>
    </div>
  );
}
