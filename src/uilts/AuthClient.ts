import { Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';

// Where the IDP should be servied from
const IDENTITY_URL =
  new URLSearchParams(document.location.search).get('internetIdentityUrl') ||
  import.meta.env.REACT_APP_INTERNET_IDENTITY_URL || 'https://identity.ic0.app' //|| 'http://localhost:8000?canisterId=rwlgt-iiaaa-aaaaa-aaaaa-cai';
 // 'https://identity.ic0.app';

/*
 * A simple wrapper for the official auth client to initialize it and wrap
 * some of the methods in promises
 */
class AuthClientWrapper {
  public authClient?: AuthClient;
  public ready = false;
  constructor() {
    return this;
  }

  // Create a new auth client and update it's ready state
  async create() {
    this.authClient = await AuthClient.create();
    await this.authClient?.isAuthenticated();
    this.ready = true;
  }

  async login(): Promise<Identity | undefined> {
    return new Promise(async (resolve) => {
      await this.authClient?.login({
        identityProvider: IDENTITY_URL,
        onSuccess: async () => {
          const i = this.authClient?.getIdentity();
          console.log('login', i)
          resolve(i);
        }
      });
    });
  }

  async logout() {
    return this.authClient?.logout({ returnTo: '/' });
  }

  async getIdentity() {
    return this.authClient?.getIdentity();
  }

  async isAuthenticated() {
    return this.authClient?.isAuthenticated();
  }
}

export const authClient = new AuthClientWrapper();
