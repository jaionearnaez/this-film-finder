export async function load(): Promise<Crypto> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any)['asmCrypto'] = await import('asmcrypto.js');
  await import('webcrypto-liner');
  return window.crypto;
}
