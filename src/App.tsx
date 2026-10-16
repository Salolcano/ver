import { useEffect, useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { PoolPanel } from './components/PoolPanel';
import { ClaimForm } from './components/ClaimForm';
import { ClaimList } from './components/ClaimList';
import { ClaimDetail } from './components/ClaimDetail';
import { getClaims, getPoolBalance, Claim } from './lib/contract';

export default function App() {
  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const [poolBalance, setPoolBalance] = useState<string>('0');
  const [claims, setClaims] = useState<Claim[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    (async () => {
      try {
        const [bal, cs] = await Promise.all([getPoolBalance(), getClaims()]);
        setPoolBalance(String(bal ?? '0'));
        setClaims(Array.isArray(cs) ? cs : []);
      } catch (e) { console.error(e); }
    })();
  }, [refreshKey]);

  return (
    <Layout address={address} setAddress={setAddress}>
      <section className="fade-up">
        <p className="text-muted text-sm uppercase tracking-[0.2em] mb-6">Verifiable claims layer</p>
        <h1 className="serif-headline text-5xl md:text-7xl max-w-3xl">Claims settled by consensus,<br />not by paperwork.</h1>
        <p className="text-muted mt-8 max-w-xl leading-relaxed">Submit a claim with an evidence URL. An Intelligent Contract fetches the evidence, runs validator consensus, and updates the pool.</p>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-20">
        <div className="lg:col-span-2 space-y-6">
          <ClaimForm address={address} onSubmitted={() => { refresh(); setSelected(null); }} />
          <ClaimList claims={claims} onSelect={(id) => setSelected(id)} selected={selected} />
        </div>
        <div className="space-y-6">
          <PoolPanel address={address} balance={poolBalance} onFunded={refresh} />
          {selected !== null && claims.find(c => c.id === selected) && (
            <ClaimDetail address={address} claim={claims.find(c => c.id === selected)!} onResolved={refresh} />
          )}
        </div>
      </div>
    </Layout>
  );
}
