import "server-only";
import crypto from "node:crypto";

/** AES-256-GCM avec BANK_ENCRYPTION_KEY (32 octets en base64). Ne jamais régénérer la clé après usage. */
function key(): Buffer | null {
  const raw = process.env.BANK_ENCRYPTION_KEY;
  if (!raw) return null;
  const k = Buffer.from(raw, "base64");
  return k.length === 32 ? k : null;
}
export function encrypt(plain: string): string | null {
  const k = key();
  if (!k) return null;
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", k, iv);
  const enc = Buffer.concat([c.update(plain, "utf8"), c.final()]);
  return [iv, c.getAuthTag(), enc].map((b) => b.toString("base64")).join(".");
}
export function decrypt(payload: string): string | null {
  const k = key();
  if (!k) return null;
  try {
    const [iv, tag, enc] = payload.split(".").map((s) => Buffer.from(s, "base64"));
    const d = crypto.createDecipheriv("aes-256-gcm", k, iv);
    d.setAuthTag(tag);
    return Buffer.concat([d.update(enc), d.final()]).toString("utf8");
  } catch {
    return null;
  }
}
