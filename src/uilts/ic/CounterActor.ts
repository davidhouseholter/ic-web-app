import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import {
  idlFactory as Counter_idl,
  canisterId as Counter_canister_id,
} from "../../declarations/counter/";

import dfxConfig from "../../../dfx.json";
import { _SERVICE } from "@/declarations/counter/counter.did";

const DFX_NETWORK = import.meta.env.DFX_NETWORK || "local";
const isLocalEnv = DFX_NETWORK === "local";

function getHost() {
  // Setting host to undefined will default to the window location 👍🏻
  return isLocalEnv ? dfxConfig.networks.local.bind : undefined;
}

const host = getHost();

function createActor(identity?: Identity) {
  const agent = new HttpAgent({ host, identity });
  const actor = Actor.createActor<_SERVICE>(Counter_idl, {
    agent,
    canisterId: Counter_canister_id, 
  });
  return { actor, agent };
}

/*
 * Responsible for keeping track of the actor, whether the user has logged
 * in again or not. A logged in user uses a different actor with their
 * Identity, to ensure their Principal is passed to the backend.
 */
class ActorController {
  _actor: Promise<_SERVICE>;
  _isAuthenticated: boolean = false;

  constructor() {
    this._actor = this.initBaseActor();
  }

  async initBaseActor(identity?: Identity) {
    const { agent, actor } = createActor(identity);
    // The root key only has to be fetched for local development environments
    if (isLocalEnv) {
      console.log('sdfd')
      //await agent.fetchRootKey();

      await agent.fetchRootKey().then(() => {
        console.log('here')
      }).catch((err) => {
        console.warn(
          "Unable to fetch root key. Check to ensure that your local replica is running"
        );
        console.error(err);
      });
    }
    return actor;
  }

  /*
   * Get the actor instance to run commands on the canister.
   */
  get actor() {
    console.log('CounterActor',this._isAuthenticated)
    return this._actor;
  }

  /*
   * Once a user has authenticated and has an identity pass this identity
   * to create a new actor with it, so they pass their Principal to the backend.
   */
  async authenticateActor(identity: Identity) {
    console.log("authenticateActor")
    this._actor = this.initBaseActor(identity);
    this._isAuthenticated = true;
  }

  /*
   * If a user unauthenticates, recreate the actor without an identity.
   */
  unauthenticateActor() {
    this._actor = this.initBaseActor();
    this._isAuthenticated = false;
  }
}

export const actorController = new ActorController();
