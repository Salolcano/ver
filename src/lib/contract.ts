import { getReadClient, getWriteClient } from './genlayer';
import { CONTRACT_ADDRESS } from '../config/network';

export type Claim = {
  id: number; claimant: string; claim_type: string; description: string;
  evidence_url: string; expected_payout: number; status: string; verdict: string;
};

export async function getPoolBalance() {
  return getReadClient().readContract({ address: CONTRACT_ADDRESS, functionName: 'get_pool_balance', args: [] });
}
export async function getClaims() {
  return getReadClient().readContract({ address: CONTRACT_ADDRESS, functionName: 'get_claims', args: [] }) as Promise<Claim[]>;
}
export async function fundPool(account: `0x${string}`, amountWei: bigint) {
  return getWriteClient(account).writeContract({ address: CONTRACT_ADDRESS, functionName: 'fund_pool', args: [amountWei] });
}
export async function submitClaim(account: `0x${string}`, claimType: string, description: string, evidenceUrl: string, expectedPayout: bigint) {
  return getWriteClient(account).writeContract({ address: CONTRACT_ADDRESS, functionName: 'submit_claim', args: [claimType, description, evidenceUrl, expectedPayout] });
}
export async function resolveClaim(account: `0x${string}`, claimId: number) {
  return getWriteClient(account).writeContract({ address: CONTRACT_ADDRESS, functionName: 'resolve_claim', args: [BigInt(claimId)] });
}
