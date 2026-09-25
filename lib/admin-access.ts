import { env } from 'cloudflare:workers';
import { headers } from 'next/headers';
import { createRemoteJWKSet, jwtVerify } from 'jose';

let cachedKeys: ReturnType<typeof createRemoteJWKSet> | undefined;
let cachedIssuer = '';

export async function adminUser() {
  const issuer = env.ACCESS_TEAM_DOMAIN?.replace(/\/$/, '');
  const audience = env.ACCESS_AUD;
  const allowlist = (env.ADMIN_EMAILS ?? '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
  // Fail closed until Access is configured. Never trust raw email headers.
  if (!issuer || !/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(issuer) || !audience || !allowlist.length) return null;
  const token = (await headers()).get('cf-access-jwt-assertion');
  if (!token) return null;
  try {
    if (!cachedKeys || cachedIssuer !== issuer) {
      cachedKeys = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
      cachedIssuer = issuer;
    }
    const { payload } = await jwtVerify(token, cachedKeys, {
      issuer, audience, algorithms: ['RS256'], requiredClaims: ['exp', 'sub', 'email'],
    });
    if (typeof payload.email !== 'string' || !allowlist.includes(payload.email.toLowerCase())) return null;
    return { userId: payload.sub!, email: payload.email };
  } catch {
    return null;
  }
}
