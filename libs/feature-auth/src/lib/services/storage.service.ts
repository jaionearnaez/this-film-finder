import { Injectable, InjectionToken } from '@angular/core';
import {
  calculateSHA256Hash,
  decrypt,
  encrypt,
  generateRandomString,
} from '../helpers/crypto';

export const SessionStorageService = new InjectionToken<StorageService>(
  'SessionStorageService'
);

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  #_PASSWDS: { [index: string]: string } = {};
  readonly #_defaultStoreName = 'default';

  #_isPersistent = true;

  constructor(private _storage: Storage = localStorage) {
    this.#_isPersistent = this._storage === localStorage;
  }

  async setItem<T>(
    _key: string,
    _value: T,
    storeName = this.#_defaultStoreName
  ): Promise<T> {
    const _keyphrase = await this.#_retrieveKeyPhrase(storeName);

    const encryptedValue = await this.#_encrypt(_value, _keyphrase);
    const key = await this.#_buildKey(_key, storeName);
    await this._storage.setItem(key, encryptedValue);
    return _value;
  }

  async getItem<T>(
    _key: string,
    storeName = this.#_defaultStoreName
  ): Promise<T | null> {
    const _keyphrase = await this.#_retrieveKeyPhrase(storeName);

    const key = await this.#_buildKey(_key, storeName);
    const rawValue = await this._storage.getItem(key);
    if (rawValue == null || rawValue === '') {
      return null;
    }

    const decryptedValue = await this.#_decrypt<T>(rawValue, _keyphrase);
    return decryptedValue;
  }

  async removeItem(
    _key: string,
    storeName = this.#_defaultStoreName
  ): Promise<void> {
    const key = await this.#_buildKey(_key, storeName);
    await this._storage.removeItem(key);
  }

  async clearAll(): Promise<void> {
    await this._storage.clear();
  }

  async #_retrieveKeyPhrase(
    storeName = this.#_defaultStoreName
  ): Promise<string> {
    if (this.#_PASSWDS[storeName]) {
      return this.#_PASSWDS[storeName];
    } else {
      const key = await this.#_buildKey('_____MASTERKEY', storeName);
      const savedKeyphrase = await this._storage.getItem(key);

      if (savedKeyphrase === null) {
        const _p = await generateRandomString(32);
        const pass = await calculateSHA256Hash(_p);
        await this._storage.setItem(key, pass);
        this.#_PASSWDS[storeName] = pass;

        return pass;
      } else {
        this.#_PASSWDS[storeName] = savedKeyphrase;
        return savedKeyphrase;
      }
    }
  }

  async #_encrypt(_value: unknown, _keyphrase: string): Promise<string> {
    const cryptedValue = await encrypt(_value, _keyphrase);
    return cryptedValue;
  }

  async #_decrypt<T>(_value: string, _keyphrase: string): Promise<T | null> {
    const decryptedValue = await decrypt<T>(_value, _keyphrase);
    return decryptedValue;
  }

  async #_buildKey(
    _key: string,
    _store = this.#_defaultStoreName
  ): Promise<string> {
    const clearKey = `${_store}!${_key}!${
      this.#_isPersistent ? 'persistent' : 'volatile'
    }`;
    return await calculateSHA256Hash(`__${clearKey}**`);
  }
}
