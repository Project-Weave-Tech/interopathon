# RLTP and Consensual (Geb): VRCs and DID resolution

Date: 9 November 2026. Outcome: pass in both directions, with the limits named below. All keys are throwaway test keys.

This repeats the run of 11 October 2026 that is on the [DTG interop board](https://project-weave-tech.github.io/dtg-interop/).

## Direction 1: RLTP reads Geb's credentials

Geb issued two fresh RelationshipCredentials under `did:peer:2` with its own handshake code: the response VRC by bob about alice, and the completion VRC by alice about bob. They are in [`geb-vrcs.json`](geb-vrcs.json), as posted by Geb's side, together with Geb's own `hashData`.

RLTP's reader accepts both.

```sh
git clone https://github.com/real-life-org/trust-protocol
cd trust-protocol && git checkout 36af651
node conformance/dtg-vrc.mjs geb-vrcs.json
```

Full output: [`reader-output.txt`](reader-output.txt). Node 22, no install, no network.

- Checks passed on each: context, type, issuer, issuerScope, validFrom, subject, proof-form, proof-binding, proof-key, proof-signature.
- DID resolution: `did:peer:2` is resolved offline; `#key-1` is the `A` (assertionMethod) segment.
- The `hashData` recomputed by RLTP (`sha256(JCS(proof options)) || sha256(JCS(document))`) equals Geb's for both.
- One note on each: `issuerScope` is `directed`, which is permitted for a VRC; `pairwise` is RECOMMENDED.

Changed copies are refused ([`tamper-check.mjs`](tamper-check.mjs), output in [`tamper-check-output.txt`](tamper-check-output.txt)):

| Change | Fails at |
|---|---|
| changed nonce | proof-signature |
| changed validFrom | proof-signature |
| the other party's verificationMethod | proof-binding |
| the keyAgreement key (`#key-3`) | proof-key |

```sh
node tamper-check.mjs /path/to/trust-protocol geb-vrcs.json
```

## Direction 2: Geb reads RLTP's credentials

Geb's side ran two verifiers on [`vectors/encounter-cards.json`](https://github.com/real-life-org/trust-protocol/blob/main/vectors/encounter-cards.json) at trust-protocol `48c5efb`. The file is the same at `36af651` and `48c5efb` (blob `882fbe4a`). Full output as posted by Geb's side: [`geb-verifier-output.txt`](geb-verifier-output.txt).

- Geb's independent strict `eddsa-jcs-2022` verifier accepts the four credentials RLTP expects to pass and refuses the rewritten one, as RLTP expects. Four changed copies are refused.
- The verifier inside the Geb app cannot read RLTP's credentials yet. It parses only Geb's own VRC shape and only `did:peer` issuers; RLTP uses `did:key`. Geb's side has taken this as a work item.

## Limits

- Two Geb credentials were read today; the October run read twelve.
- Direction 2 rests on Geb's standalone verifier, as it did in October, not on the Geb app's reader.
- The reader is an informative check of the plain DTG form. It does not check validity windows against a clock, status, or any RLTP rule.

## Source

The credentials and both outputs were posted in the We Play Interop room on 9 November 2026 (lines 3265, 3266, 3273 and 3279).
