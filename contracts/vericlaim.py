# v0.2.17
# {"Depends":"py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6"}

from genlayer import *
import json
import typing


@allow_storage
class Claim:
    id: u256
    claimant: str
    claim_type: str
    description: str
    evidence_url: str
    expected_payout: u256
    status: str
    verdict: str


class VeriClaim(gl.Contract):
    owner: Address
    pool_balance: u256
    claims: DynArray[Claim]
    claim_count: u256

    def __init__(self):
        self.owner = gl.message.sender_address
        self.pool_balance = u256(0)
        self.claim_count = u256(0)

    @gl.public.write
    def fund_pool(self, amount: u256) -> None:
        if amount == u256(0):
            raise gl.vm.UserError("amount must be > 0")
        self.pool_balance = self.pool_balance + amount

    @gl.public.write
    def submit_claim(self, claim_type: str, description: str, evidence_url: str, expected_payout: u256) -> u256:
        claim_id = self.claim_count
        claim = Claim()
        claim.id = claim_id
        claim.claimant = gl.message.sender_address.as_hex
        claim.claim_type = claim_type
        claim.description = description
        claim.evidence_url = evidence_url
        claim.expected_payout = expected_payout
        claim.status = "pending"
        claim.verdict = ""
        self.claims.append(claim)
        self.claim_count = self.claim_count + u256(1)
        return claim_id

    @gl.public.write
    def resolve_claim(self, claim_id: u256) -> typing.Any:
        idx = int(claim_id)
        if idx < 0 or idx >= len(self.claims):
            raise gl.vm.UserError("invalid claim id")
        claim = self.claims[idx]
        if claim.status != "pending":
            raise gl.vm.UserError("claim already resolved")

        url = claim.evidence_url
        claim_type = claim.claim_type
        description = claim.description

        def verify_claim() -> typing.Any:
            page = gl.nondet.web.render(url, mode="text")
            task = f"""
You are an impartial insurance adjuster. Verify the following claim.

Claim type: {claim_type}
Claim description: {description}
Evidence URL content:
{page}
End of evidence.

Respond ONLY with JSON:
{{"valid": bool, "reason": str, "confidence": int}}
No markdown, no extra text.
"""
            raw = gl.nondet.exec_prompt(task).replace("```json", "").replace("```", "")
            return json.loads(raw)

        verdict = gl.eq_principle.strict_eq(verify_claim)

        if verdict["valid"] and int(verdict["confidence"]) >= 80:
            payout = u256(claim.expected_payout)
            if payout > self.pool_balance:
                claim.status = "insufficient_pool"
                claim.verdict = json.dumps(verdict)
                return verdict
            self.pool_balance = self.pool_balance - payout
            claim.status = "approved"
        else:
            claim.status = "rejected"

        claim.verdict = json.dumps(verdict)
        return verdict

    @gl.public.view
    def get_claim(self, claim_id: u256) -> dict:
        c = self.claims[int(claim_id)]
        return {"id": int(c.id), "claimant": c.claimant, "claim_type": c.claim_type, "description": c.description, "evidence_url": c.evidence_url, "expected_payout": int(c.expected_payout), "status": c.status, "verdict": c.verdict}

    @gl.public.view
    def get_claims(self) -> list:
        out = []
        for c in self.claims:
            out.append({"id": int(c.id), "claimant": c.claimant, "claim_type": c.claim_type, "description": c.description, "evidence_url": c.evidence_url, "expected_payout": int(c.expected_payout), "status": c.status, "verdict": c.verdict})
        return out

    @gl.public.view
    def get_pool_balance(self) -> u256:
        return self.pool_balance
