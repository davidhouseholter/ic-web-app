export const idlFactory = ({ IDL }) => {
  const ItemInit = IDL.Record({
    'name' : IDL.Text,
    'tags' : IDL.Vec(IDL.Text),
    'caption' : IDL.Text,
  });
  const ItemId = IDL.Text;
  const UserProfileFull = IDL.Record({
    'userName' : IDL.Text,
    'rewards' : IDL.Nat,
  });
  const UserId__1 = IDL.Text;
  const Timestamp = IDL.Int;
  const Item = IDL.Record({
    'itemId' : IDL.Text,
    'userId' : UserId__1,
    'name' : IDL.Text,
    'createdAt' : Timestamp,
    'tags' : IDL.Vec(IDL.Text),
    'viewCount' : IDL.Nat,
    'caption' : IDL.Text,
  });
  const UserId = IDL.Text;
  const UserProfile__1 = IDL.Record({ 'userName' : IDL.Text });
  const UserProfile = IDL.Record({ 'userName' : IDL.Text });
  const API = IDL.Service({
    'checkUsernameAvailable' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'createItem' : IDL.Func([ItemInit], [IDL.Opt(ItemId)], []),
    'createProfile' : IDL.Func([IDL.Text], [IDL.Opt(UserProfileFull)], []),
    'getFeedItems' : IDL.Func(
        [IDL.Opt(IDL.Nat)],
        [IDL.Opt(IDL.Vec(Item))],
        ['query'],
      ),
    'getProfileFull' : IDL.Func(
        [IDL.Opt(UserId), UserId],
        [IDL.Opt(UserProfileFull)],
        ['query'],
      ),
    'getUserNameByPrincipal' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(IDL.Vec(IDL.Text))],
        [],
      ),
    'getUserProfile' : IDL.Func([UserId], [IDL.Opt(UserProfile__1)], ['query']),
    'getUsersPublic' : IDL.Func(
        [IDL.Opt(IDL.Nat)],
        [IDL.Opt(IDL.Vec(UserProfile))],
        ['query'],
      ),
    'whoami' : IDL.Func([], [IDL.Principal], ['query']),
  });
  return API;
};
export const init = ({ IDL }) => { return []; };
