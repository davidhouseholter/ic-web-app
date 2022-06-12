import Hash "mo:base/Hash";
import Prelude "mo:base/Prelude";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Trie "mo:base/Trie";
import TrieMap "mo:base/TrieMap";

// import non-base primitives
import Access "./lib/Access";
import Event "./lib/Event";
import Types "./Types";
import Role "./lib/Role";
import Rel "./lib/Rel";
import RelObj "./lib/RelObj";
import SeqObj "./lib/SeqObj";


/// Parameters to the service's publicly visible behavior
module {


   // Our representation of (binary) relations.
  public type RelShared<X, Y> = Rel.RelShared<X, Y>;
  public type Rel<X, Y> = RelObj.RelObj<X, Y>;

  // Our representation of finite mappings.
  public type MapShared<X, Y> = Trie.Trie<X, Y>;
  public type Map<X, Y> = TrieMap.TrieMap<X, Y>;


 
  /// Database (api storeed state).
  ///
  /// Not a shared type because of OO containers and HO functions.
  /// So, cannot send in messages or store in stable memory.
  ///

  public type Database = {
    access : Access.Access;

    /// event log.
    eventLog : Event.Log;
    var eventCount : Nat;

    /// all profiles.
    profiles : Map<Types.UserId, Types.Profile>;

    messages: Rel<Types.UserId, Types.Message>;

    items : Map<Types.ItemId, Types.Item>;
  };

 
  
  public func empty (init : { admin : Principal }) : Database {
    let equal = (Text.equal, Text.equal);
    let hash = (Text.hash, Text.hash);
    func messageEqual(a: Types.Message, b: Types.Message) : Bool = a == b;
    func messageHash(m: Types.Message) : Hash.Hash = Int.hash(m.id); 
    let itemsOwnedFunc = RelObj.RelObj<Types.UserId, Types.ItemId>(hash, equal);

    let storedDatabase : Database = {
      access = Access.Access({ admin = init.admin; itemsOwned = itemsOwnedFunc });
      profiles = TrieMap.TrieMap<Types.UserId, Types.Profile>(Text.equal, Text.hash);
      messages = RelObj.RelObj((Text.hash, messageHash), (Text.equal, messageEqual));
      eventLog = SeqObj.Seq<Event.Event>(Event.equal, null);
      items = TrieMap.TrieMap<Types.ItemId, Types.Item>(Text.equal, Text.hash);
      var eventCount = 0;
    };

    storedDatabase // return
  };
}