// Runs RLTP's reader (conformance/dtg-vrc.mjs) on Geb's two credentials and on changed copies.
//   usage: node tamper-check.mjs <path to a trust-protocol checkout> geb-vrcs.json
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import crypto from 'node:crypto'

const repo = resolve(process.argv[2])
const { checkVrc } = await import(pathToFileURL(resolve(repo, 'conformance/dtg-vrc.mjs')).href)
const { jcs } = await import(pathToFileURL(resolve(repo, 'conformance/lib.mjs')).href)
const f = JSON.parse(readFileSync(process.argv[3], 'utf8'))
const sha = (x) => crypto.createHash('sha256').update(x).digest('hex')
const verdict = (c) => checkVrc(c).failures.map((x) => x.check).join(',') || 'ACCEPTED'

for (const [k, h] of [['response_vrc_by_bob_about_alice', 'response'], ['completion_vrc_by_alice_about_bob', 'completion']]) {
  const c = f[k]
  const { proofValue, ...opts } = c.proof
  const { proof, ...doc } = c
  console.log(k)
  console.log('  hashData equals Geb\'s:', sha(jcs(opts)) + sha(jcs(doc)) === f.hashData_hex[h])
  const r = checkVrc(c)
  console.log('  genuine: failures', r.failures.length, '· passed', r.passed.join(','))
  const t1 = structuredClone(c); t1.credentialSubject.nonce = '00' + t1.credentialSubject.nonce.slice(2)
  console.log('  changed nonce →', verdict(t1))
  const t2 = structuredClone(c); t2.validFrom = '2026-11-09T12:00:01Z'
  console.log('  changed validFrom →', verdict(t2))
  const other = k.startsWith('response') ? f.completion_vrc_by_alice_about_bob : f.response_vrc_by_bob_about_alice
  const t3 = structuredClone(c); t3.proof.verificationMethod = other.proof.verificationMethod
  console.log('  other party\'s verificationMethod →', verdict(t3))
  const t4 = structuredClone(c); t4.proof.verificationMethod = c.proof.verificationMethod.replace('#key-1', '#key-3')
  console.log('  keyAgreement key (#key-3) →', verdict(t4))
}
