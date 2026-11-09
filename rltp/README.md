# Real Life Trust Protocol (RLTP)

RLTP roots trust in encounters between people: two people meet, recognise each other, and record that as verifiable credentials, without a certifying institution. It is published by the [Real Life Organisation](https://real-life.org).

This page lists where everything is. All of it is public.

## Start here

| What | Where |
|---|---|
| Site, with the specifications in readable form | <https://trust-protocol.real-life.org> |
| Repository: specifications, schemas, vectors, library, simulators | <https://github.com/real-life-org/trust-protocol> (Apache-2.0) |
| Library `@real-life/trust-protocol`, zero dependencies, WebCrypto only | <https://www.npmjs.com/package/@real-life/trust-protocol> |
| RLTP on the DTG interop board | <https://project-weave-tech.github.io/dtg-interop/> |

## Try it without installing anything

Everything runs locally in the browser tab, with real Ed25519, X25519 and AES-GCM.

- [The app on three devices](https://trust-protocol.real-life.org/simulator/network.html): verify by QR, introduce two contacts, give trust, found and join groups. A wire panel shows every sealed envelope.
- [One encounter in detail](https://trust-protocol.real-life.org/simulator/index.html): two devices, one delivery channel, clock skew and fault injection.
- [The graph](https://trust-protocol.real-life.org/simulator/graph.html): who can prove what about whom, from above and from one person's view.

## Specifications

In [`spec/`](https://github.com/real-life-org/trust-protocol/tree/main/spec) of the repository. All are Editor's Drafts.

| Document | Concern |
|---|---|
| [Identity Layer](https://github.com/real-life-org/trust-protocol/blob/main/spec/identity-layer.md) | one root seed, an anchor per relationship and per group, devices, recovery |
| [Encounter Layer](https://github.com/real-life-org/trust-protocol/blob/main/spec/encounter-layer.md) | the ceremony between two people, contact cards, encounter credentials |
| [Trust Layer](https://github.com/real-life-org/trust-protocol/blob/main/spec/trust-layer.md) | trust classes, profile, continuity, introductions |
| [Access Layer](https://github.com/real-life-org/trust-protocol/blob/main/spec/access-layer.md) | groups, policies, epochs, authorization toward services |
| [Delivery Contract](https://github.com/real-life-org/trust-protocol/blob/main/spec/delivery-contract.md) | how documents travel: Trust Task types, the sealed envelope |
| [Membership Tasks](https://github.com/real-life-org/trust-protocol/blob/main/spec/membership-tasks.md) | invitation, consent and admission to a group |
| [Message Tasks](https://github.com/real-life-org/trust-protocol/blob/main/spec/message-tasks.md) | direct messages between the two parties of a relationship |
| [Replication Contract](https://github.com/real-life-org/trust-protocol/blob/main/spec/replication-contract.md) | what a replication substrate has to promise |
| [Personhood Predicates](https://github.com/real-life-org/trust-protocol/blob/main/spec/personhood-predicates.md) | what "a human vouched for a human" can and cannot prove |
| [VTI Mediator Adapter](https://github.com/real-life-org/trust-protocol/blob/main/spec/adapter-vti-mediator.md) | the delivery profile over TSP through the VTI mediator |

## What another implementation can test against

| What | Where |
|---|---|
| Test vectors, with an index | [`vectors/`](https://github.com/real-life-org/trust-protocol/tree/main/vectors) |
| Encounter credentials in DTG form (positives and negatives) | [`vectors/encounter-cards.json`](https://github.com/real-life-org/trust-protocol/blob/main/vectors/encounter-cards.json) |
| DTG credentials | [`vectors/dtg-credentials.json`](https://github.com/real-life-org/trust-protocol/blob/main/vectors/dtg-credentials.json) |
| Shared-connect flow and its binding | [`vectors/shared-connect.json`](https://github.com/real-life-org/trust-protocol/blob/main/vectors/shared-connect.json), [`vectors/shared-connect-binding.json`](https://github.com/real-life-org/trust-protocol/blob/main/vectors/shared-connect-binding.json) |
| Sealed envelope, routed addressing and delivery hints over the VTI mediator | [`vectors/vti-sealed-envelope.json`](https://github.com/real-life-org/trust-protocol/blob/main/vectors/vti-sealed-envelope.json), [`vectors/vti-routed-addressing.json`](https://github.com/real-life-org/trust-protocol/blob/main/vectors/vti-routed-addressing.json), [`vectors/vti-delivery-hints.json`](https://github.com/real-life-org/trust-protocol/blob/main/vectors/vti-delivery-hints.json) |
| JSON Schemas for every wire artifact | [`schemas/`](https://github.com/real-life-org/trust-protocol/tree/main/schemas) |
| JSON-LD context | [`contexts/`](https://github.com/real-life-org/trust-protocol/tree/main/contexts) |
| Conformance runner | [`conformance/`](https://github.com/real-life-org/trust-protocol/tree/main/conformance) |
| Reader for another project's plain DTG RelationshipCredentials (`did:key`, `did:peer:2`, `eddsa-jcs-2022`, no network) | [`conformance/dtg-vrc.mjs`](https://github.com/real-life-org/trust-protocol/blob/main/conformance/dtg-vrc.mjs) |
| Ceremonies in the ToIP DTGWG ceremony-definition format (`encounter-scan`, `shared-connect`) | [`interop/ceremonies/`](https://github.com/real-life-org/trust-protocol/tree/main/interop/ceremonies) |
| The mediator wire used for measurements (TSP 1.0) | [`binding/`](https://github.com/real-life-org/trust-protocol/tree/main/binding) |
| Term register (SKOS, English and German) | [`terms/`](https://github.com/real-life-org/trust-protocol/tree/main/terms) |

To check a credential of your own with the reader (Node 22, no install, no network):

```sh
git clone https://github.com/real-life-org/trust-protocol
cd trust-protocol
node conformance/dtg-vrc.mjs your-credentials.json
```

## How RLTP meets the others

- **Identifiers:** `did:key` for RLTP anchors. The reader also resolves `did:peer:2`.
- **Credentials:** W3C VC 2.0 in the DTG profile, embedded `DataIntegrityProof` with `eddsa-jcs-2022`, verifiable offline.
- **Digests:** multibase-encoded multihash over JCS (RFC 8785).
- **Messages:** RLTP delivery documents are private Trust Task specifications.
- **Carrier:** TSP 1.0 through the VTI mediator. The specification names no transport; delivery sits behind a port.
- **Ceremonies:** expressed in the DTGWG ceremony-definition format.

## The app

The [Web of Trust app](https://web-of-trust.de) ([repository](https://github.com/real-life-org/web-of-trust), MIT) is the app people use. It runs the previous protocol generation today and is being brought to RLTP. In DTGWG terms it is a Personal Network Manager: local-first, keys on the device, no hosted agent required.

## Related

- [real-life-org/meta](https://github.com/real-life-org/meta): layer picture, seams and the shared term register of the Real Life projects.
- [real-life-org/wot-spec](https://github.com/real-life-org/wot-spec): the protocol generation that runs in the Web of Trust app today.

## Runs in this repository

- [`../rltp-geb/`](../rltp-geb/): VRCs and DID resolution with Consensual (Geb)
- [`../rltp-naoms/`](../rltp-naoms/): did:key and `eddsa-jcs-2022` with NAOMS
