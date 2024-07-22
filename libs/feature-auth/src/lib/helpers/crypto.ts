async function loadCrypto(): Promise<Crypto> {
  return window.crypto; // : (await import('./crypto-polyfill')).load();
}

export async function encrypt(
  data: unknown,
  password: string
): Promise<string> {
  const _crypto = await loadCrypto();
  const dataStr = JSON.stringify(data);
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(dataStr);

  const passwordBuffer = encoder.encode(password);
  const iv = _crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await _crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const derivedKey = await _crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new Uint8Array(16),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-CBC', length: 256 },
    false,
    ['encrypt']
  );

  const ciphertext = await _crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    derivedKey,
    encodedData
  );

  const encryptedArray = new Uint8Array(ciphertext);
  const combinedArray = new Uint8Array(iv.length + encryptedArray.length);
  combinedArray.set(iv);
  combinedArray.set(encryptedArray, iv.length);

  const encryptedHex = Array.prototype.map
    .call(combinedArray, (byte) => {
      return ('00' + byte.toString(16)).slice(-2);
    })
    .join('');

  return encryptedHex;
}

export async function decrypt<ResponseType>(
  encryptedText: string,
  password: string
): Promise<ResponseType | null> {
  const matches = encryptedText.match(/.{1,2}/g);
  if (!matches) {
    throw 'Invalid text';
  }

  const _crypto = await loadCrypto();
  const encryptedArray = new Uint8Array(
    matches.map((byte) => parseInt(byte, 16))
  );
  const iv = encryptedArray.slice(0, 16);
  const ciphertext = encryptedArray.slice(16);

  const passwordBuffer = new TextEncoder().encode(password);

  const keyMaterial = await _crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const derivedKey = await _crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new Uint8Array(16),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-CBC', length: 256 },
    false,
    ['decrypt']
  );

  try {
    const decryptedData = await _crypto.subtle.decrypt(
      { name: 'AES-CBC', iv },
      derivedKey,
      ciphertext
    );

    const decoder = new TextDecoder();
    const decryptedText = decoder.decode(decryptedData);
    return JSON.parse(decryptedText) as ResponseType;
  } catch (error) {
    console.error('Error decrypting:', error);
    return null;
  }
}

export async function generateRandomString(length: number): Promise<string> {
  const _crypto = await loadCrypto();
  const randomValues = new Uint8Array(length);
  _crypto.getRandomValues(randomValues);

  return Array.from(randomValues, (value) =>
    value.toString(16).padStart(2, '0')
  ).join('');
}

export async function calculateSHA256Hash(input: string): Promise<string> {
  const _crypto = await loadCrypto();

  const data = new TextEncoder().encode(input);

  const hashBuffer = await _crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}
