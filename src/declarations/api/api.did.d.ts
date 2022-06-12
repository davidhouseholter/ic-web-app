import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface API {
  'checkUsernameAvailable' : ActorMethod<[string], boolean>,
  'createItem' : ActorMethod<[ItemInit], [] | [ItemId]>,
  'createProfile' : ActorMethod<[string], [] | [UserProfileFull]>,
  'getFeedItems' : ActorMethod<[[] | [bigint]], [] | [Array<Item>]>,
  'getProfileFull' : ActorMethod<
    [[] | [UserId], UserId],
    [] | [UserProfileFull],
  >,
  'getUserNameByPrincipal' : ActorMethod<[Principal], [] | [Array<string>]>,
  'getUserProfile' : ActorMethod<[UserId], [] | [UserProfile__1]>,
  'getUsersPublic' : ActorMethod<[[] | [bigint]], [] | [Array<UserProfile>]>,
  'whoami' : ActorMethod<[], Principal>,
}
export interface Item {
  'itemId' : string,
  'userId' : UserId__1,
  'name' : string,
  'createdAt' : Timestamp,
  'tags' : Array<string>,
  'viewCount' : bigint,
  'caption' : string,
}
export type ItemId = string;
export interface ItemInit {
  'name' : string,
  'tags' : Array<string>,
  'caption' : string,
}
export type Timestamp = bigint;
export type UserId = string;
export type UserId__1 = string;
export interface UserProfile { 'userName' : string }
export interface UserProfileFull { 'userName' : string, 'rewards' : bigint }
export interface UserProfile__1 { 'userName' : string }
export interface _SERVICE extends API {}
