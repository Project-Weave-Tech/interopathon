# RLTP and NAOMS: did:key and eddsa-jcs-2022

Date: 9 November 2026. Outcome: pass in both directions. All keys are throwaway test keys, made for this run only.

## What was run

Each side signed the other side's 32-byte challenge as a small JSON document with an `eddsa-jcs-2022` Data Integrity proof (`proofPurpose` `assertionMethod`, `verificationMethod` `did:key#fragment`), and each side verified the other's document against its `did:key`.

| File | Signed by | Verified by |
|---|---|---|
| [`rltp-signed.json`](rltp-signed.json) | RLTP library, `did:key:z6Mkj8cULoPu2nbia5prMXsrMCApBi9pj9DEMeAFFttndJ6K` | NAOMS-Rust crypto |
| [`naoms-signed.json`](naoms-signed.json) | NAOMS, `did:key:z6MknadufJQCSmGHSYa298LBjn7UsMUyxh8o6KuHwhLFP1Lm` | RLTP library |

## Results

- **NAOMS verifies RLTP's document:** accepted. A copy with one digit of the challenge changed is refused (`BadSignature`). Reported by NAOMS's side.
- **RLTP verifies NAOMS's document:** `diVerify(doc, expectedAnchor)` of the RLTP library 0.14.0 returns `true`. Three changed copies return `false`: a changed challenge in the body, a changed `proof.domain`, and a wrong expected signer.
- A third implementation in the room rechecked both signatures independently and both pass.

## To rerun

Any `eddsa-jcs-2022` verifier that resolves `did:key` can check both files: the signer's key is the `did:key` in `signer`, and the proof has no `@context` of its own.

The RLTP side used `diVerify` from a local build of the library at 0.14.0 (`lib/dist/crypto.js` in the [repository](https://github.com/real-life-org/trust-protocol)). That function is not one of the npm package's public entry points.

Both files in this folder were verified again that way after they were copied here: genuine `true`, changed challenge `false`, for each.

## What the two sides do differently

- NAOMS puts the challenge in `proof.challenge` and a `proof.domain`, as well as in the body. RLTP binds the challenge in the body only.
- Each side accepted the other's shape. RLTP's verify accepts the extra proof fields, and they are covered by the signature: changing `domain` breaks it.
- Neither side used a proof-level `@context`.

## Limits

This run covers key resolution from `did:key` and one signature suite. It exchanges no credential and sends no message over a carrier.

## Source

The signed documents and both checks were posted in the We Play Interop room on 9 November 2026 (lines 2276, 2348, 2349 and 2352).
