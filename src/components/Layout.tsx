import { ReactNode } from 'react';
export function Layout({ children, address, setAddress }: {
  children: ReactNode; address: `0x${string}` | null; setAddress: (a: `0x${string}` | null) => void;
}) {
  const connect = async () => {
    const eth = (window as any).ethereum;
    if (!eth) { alert('Install MetaMask'); return; }
    try {
      await eth.request({ method: 'wallet_addEthereumChain', params: [{
        chainId: '0xF22F', chainName: 'GenLayer Studio',
        nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 },
        rpcUrls: ['https://studio.genlayer.com/api'],
        blockExplorerUrls: ['https://explorer-studio.genlayer.com'],
      }] });
    } catch (e) {}
    const a = await eth.request({ method: 'eth_requestAccounts' });
    setAddress(a[0]);
  };
  return (
    <div className="min-h-screen grid-bg">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="font-serif text-xl">VeriClaim</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
            <a href="#claims" className="hover:text-white">Claims</a>
            <a href="#pool" className="hover:text-white">Pool</a>
            <a href="https://explorer-studio.genlayer.com" target="_blank" rel="noreferrer" className="hover:text-white">Explorer</a>
          </nav>
          {address ? (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-muted font-mono text-xs">{address.slice(0,6)}…{address.slice(-4)}</span>
            </div>
          ) : (
            <button onClick={connect} className="text-sm px-4 py-2 rounded-full bg-accent text-black font-medium hover:opacity-90">Connect Wallet</button>
          )}
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-24">{children}</main>
      <footer className="border-t border-border mt-24">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-4">
          <span className="text-muted text-sm">Built on GenLayer Studio · Chain 61999</span>
          <span className="text-muted-dim text-xs font-mono">Intelligent Contracts with web + LLM consensus</span>
        </div>
      </footer>
    </div>
  );
}
