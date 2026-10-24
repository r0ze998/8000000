// Cairo の値と JS の値の変換。starknet.js の ByteArray 変換は ASCII のみなので、
// 日本語（UTF-8）を扱うためにここで自前で組み立てる。

const BYTES_PER_WORD = 31;

const toHex = (bytes: Uint8Array) => '0x' + (bytes.length ? Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('') : '0');

export const utf8Length = (s: string) => new TextEncoder().encode(s).length;

/** 文字列を Cairo の ByteArray の calldata（[data_len, ...words, pending_word, pending_word_len]）にする */
export function encodeByteArray(s: string): string[] {
  const bytes = new TextEncoder().encode(s);
  const full = Math.floor(bytes.length / BYTES_PER_WORD);
  const out: string[] = [String(full)];
  for (let i = 0; i < full; i++) out.push(toHex(bytes.slice(i * BYTES_PER_WORD, (i + 1) * BYTES_PER_WORD)));
  const rest = bytes.slice(full * BYTES_PER_WORD);
  out.push(toHex(rest), String(rest.length));
  return out;
}

const feltToBytes = (felt: string, len: number) => {
  let n = BigInt(felt);
  const bytes = new Uint8Array(len);
  for (let i = len - 1; i >= 0; i--) {
    bytes[i] = Number(n & 0xffn);
    n >>= 8n;
  }
  return bytes;
};

/** felts[at] から ByteArray を読み、文字列と次の位置を返す */
export function decodeByteArray(felts: string[], at: number): { value: string; next: number } {
  const full = Number(BigInt(felts[at] ?? '0'));
  const parts: Uint8Array[] = [];
  for (let i = 0; i < full; i++) parts.push(feltToBytes(felts[at + 1 + i] ?? '0', BYTES_PER_WORD));
  const pendingLen = Number(BigInt(felts[at + 2 + full] ?? '0'));
  parts.push(feltToBytes(felts[at + 1 + full] ?? '0', pendingLen));
  const total = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) {
    total.set(p, o);
    o += p.length;
  }
  return { value: new TextDecoder().decode(total), next: at + 3 + full };
}

/** 31文字以内の ASCII の id を felt にする */
export function encodeShortId(id: string): string {
  if (!/^[\x20-\x7e]{1,31}$/.test(id)) throw new Error(`invalid id: ${id}`);
  return toHex(new TextEncoder().encode(id));
}

export function decodeShortId(felt: string): string {
  let n = BigInt(felt);
  const bytes: number[] = [];
  while (n > 0n) {
    bytes.unshift(Number(n & 0xffn));
    n >>= 8n;
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

export const encodeLat = (lat: number) => Math.round((lat + 90) * 1000);
export const encodeLng = (lng: number) => Math.round((lng + 180) * 1000);
export const decodeLat = (v: number) => v / 1000 - 90;
export const decodeLng = (v: number) => v / 1000 - 180;

/** チェーンと同じ「日本時間の日付」（1970-01-01 からの日数） */
export const jstDay = (ms: number) => Math.floor((ms / 1000 + 32400) / 86400);

export const toNum = (felt: string | undefined) => Number(BigInt(felt ?? '0'));
