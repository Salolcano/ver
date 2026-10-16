import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';

export function getReadClient() {
  return createClient({ chain: studionet });
}
export function getWriteClient(address: `0x${string}`) {
  return createClient({ chain: studionet, account: address });
}
