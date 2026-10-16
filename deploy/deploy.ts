import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import * as fs from 'fs';
import * as path from 'path';

const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
if (!PRIVATE_KEY) throw new Error('Set PRIVATE_KEY env var');
const client = createClient({ chain: studionet, account: PRIVATE_KEY });

async function main() {
  const code = fs.readFileSync(path.join(__dirname, '../contracts/vericlaim.py'), 'utf-8');
  const txId = await client.deployContract({ code, args: [] });
  const receipt = await client.waitForFinalization({ hash: txId });
  if (!receipt) throw new Error('No receipt');
  console.log('Contract address:', receipt.contractAddress);
}
main().catch((e) => { console.error(e); process.exit(1); });
