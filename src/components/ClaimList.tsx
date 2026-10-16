import { Claim } from '../lib/contract';
const statusStyles: Record<string, string> = {
  pending: 'text-yellow-400/80 border-yellow-400/30',
  approved: 'text-accent border-accent/40',
  rejected: 'text-red-400/80 border-red-400/30',
  insufficient_pool: 'text-orange-400/80 border-orange-400/30',
};
export function ClaimList({ claims, onSelect, selected }: {
  claims: Claim[]; onSelect: (id: number) => void; selected: number | null;
}) {
  if (!claims.length) {
    return (<div className="rounded-2xl border border-border bg-surface p-10 text-center"><p className="text-muted text-sm">No claims yet.</p></div>);
  }
  return (
    <div className="space-y-3">
      {claims.map((c) => (
        <button key={c.id} onClick={() => onSelect(c.id)} className={`w-full text-left rounded-xl border p-5 transition ${selected === c.id ? 'border-accent bg-accent-dim' : 'border-border bg-surface hover:bg-surface-hover'}`}>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-dim">#{c.id}</span>
                <span className="text-xs text-muted">{(c.claim_type || '').replace('_', ' ')}</span>
              </div>
              <p className="text-sm mt-2 truncate">{c.description}</p>
            </div>
            <span className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border whitespace-nowrap ${statusStyles[c.status] ?? 'text-muted border-border'}`}>{(c.status || '').replace('_', ' ')}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
