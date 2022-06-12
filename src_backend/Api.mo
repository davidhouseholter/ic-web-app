
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";

import Database "./Database";
import Event "./lib/Event";
import Types "./Types";

shared ({caller = initPrincipal}) actor class API () {
  public type UserProfile = Types.UserProfile;
  public type UserProfileFull = Types.UserProfileFull;
  public type UserId = Types.UserId;


  var state = Database.empty({ admin = initPrincipal });

  public query ({caller}) func whoami() : async Principal {
    return caller;
  };

  public query func checkUsernameAvailable(userName_ : Text): async Bool {

    switch (state.profiles.get(userName_)) {
      case (?_) { /* error -- ID already taken. */ false };
      case null { /* ok, not taken yet. */ true };
    }
  };

  public shared(msg) func createProfile(userName : Text) : async ?UserProfileFull {
    do ? {
      accessCheck(msg.caller, #create, #user userName)!;
      createProfile_(userName, ?msg.caller)!;
      // return the full profile info
      getProfileFull_(?userName, userName)! // self-view
    }
  };

  public shared(msg) func getUserNameByPrincipal(p:Principal) : async ?[Text] {
    if ( msg.caller == p ) {
      getUserNameByPrincipal_(p);
    } else {
      // access control check fails; do not reveal username of p.
      null
    }
  };

  func  getUserNameByPrincipal_(p:Principal) : ?[Text] {
    ?state.access.userPrincipal.get1(p)
  };

  func createProfile_(userName_ : Text, p: ?Principal) : ?() {
    switch (state.profiles.get(userName_)) {
      case (?_) { /* error -- ID already taken. */ null };
      case null { /* ok, not taken yet. */
        let now = timeNow_();
        state.profiles.put(userName_, {
            userName = userName_ ;
            createdAt = now ;
        });
        logEvent(#createProfile({userName=userName_;}));

        state.access.userRole.put(userName_, #user);
        switch p {
          case null { }; // no related principals, yet.
          case (?p) { state.access.userPrincipal.put(userName_, p); }
        };
        // success
        ?()
      };
    }
  };
  
  public query(msg) func getProfileFull(caller: ?UserId, target: UserId): async ?UserProfileFull {
    do ? {
      accessCheck(msg.caller, #view, #user target)!;
      switch caller {
        case null { getProfileFull_(null, target)! };
        case (?callerUserName) {
          // has private access to our caller view?
          accessCheck(msg.caller, #update, #user callerUserName)!;
          getProfileFull_(?callerUserName, target)!
        };
      }
    }
  };

  public query(msg) func getUserProfile(userId : UserId) : async ?UserProfile {
    do ? {
      //accessCheck(msg.caller, #view, #user)!;
      Debug.print("getUserProfile");
      Debug.print(userId);
      getUserProfile_(userId)!
    }
  };

  public query(msg) func getUsersPublic(limit : ?Nat) : async ?[Types.UserProfile] {
    do ? {
      Debug.print("getUsersPublic");
      //accessCheck(msg.caller, #view, #allItems)!;
      getUsersPublic_(limit)!;
    }
  };

  func getUsersPublic_(limit : ?Nat) : ?[Types.UserProfile] {
    do ? {
      Debug.print("getUsersPublic_");
      let buf = Buffer.Buffer<Types.UserProfile>(0);
      label loopAllUsers
      for ((itemId, item) in state.profiles.entries()) {
        
        switch limit { case null { }; case (?l) { if (buf.size() == l) { break loopAllUsers } } };
        let vs = getUserProfile_(itemId)!;
        buf.add(vs);
      };
      buf.toArray()
    }
  };

  func getFeedItems_(limit : ?Nat) : ?[Types.Item] {
    do ? {
      let buf = Buffer.Buffer<Types.Item>(0);
      label loopItems
      for ((itemId, item) in state.items.entries()) {
        switch limit { case null { }; case (?l) { if (buf.size() == l) { break loopItems } } };
        let vs = getItem_(itemId)!;
        buf.add(vs);
      };
      buf.toArray()
    }
  };


  func getUserProfile_(userId : UserId) : ?UserProfile {
    do ? {
            Debug.print(userId);
      let profile = state.profiles.get(userId)!;
      {
        userName = profile.userName; }
    
    }
  };

  func getProfileFull_(caller: ?UserId, userId: UserId): ?UserProfileFull {
    do ? {
      let profile = state.profiles.get(userId)!;
      {
        userName = profile.userName; rewards=0
      }
    }
  };

  public query(msg) func getFeedItems(limit : ?Nat) : async ?[Types.Item] {
    do ? {
      // privacy check: because we personalize the feed (example is abuse flag information).
      accessCheck(msg.caller, #view, #allItems)!;
      getFeedItems_(limit)!;
    }
  };

  
  func getItem_ (itemId : Types.ItemId) : ?Types.Item {
      do ? {
        let v = state.items.get(itemId)!;
        {
          itemId = itemId ;
          userId = v.userId ;
          createdAt = v.createdAt ;
          caption = v.caption ;
          tags = v.tags ;
          viewCount = v.viewCount ;
          name = v.name ;
        }
      }
    };

    public shared(msg) func createItem(i : Types.ItemInit) : async ?Types.ItemId {
      do ? {
        let username = getUserNameByPrincipal_(msg.caller)!;
    
        accessCheck(msg.caller, #update, #user(username[0]))!;
        createItem_(username[0], i)!
      }
    };

    
  // internal function for adding metadata
  func createItem_(userId:Types.UserId, i : Types.ItemInit) : ?Types.ItemId {
    let now = timeNow_();
    let itemId = userId # "-" # i.name # "-" # (Int.toText(now));
    switch (state.items.get(itemId)) {
    case (?_) { /* error -- ID already taken. */ null };
    case null { /* ok, not taken yet. */
           state.items.put(itemId,
            {
              itemId = itemId;
              userId = userId ;
              name = i.name ;
              createdAt = now ;
              caption =  i.caption ;
              tags = i.tags ;
              viewCount = 0 ;
            });
           logEvent(#createItem({info = i}));
           ?itemId
         };
    }
  };
    
    func accessCheck(caller : Principal, action : Types.UserAction, target : Types.ActionTarget) : ?() {
      state.access.check(timeNow_(), caller, action, target)
    };
    
    var timeMode : {#ic ; #script} =
      switch (Types.timeMode) {
      case (#ic) #ic;
      case (#script _) #script
    };

    var scriptTime : Int = 0;

    func timeNow_() : Int {
      switch timeMode {
        case (#ic) { Time.now() };
        case (#script) { scriptTime };
      }
    };

    
    /// log the given event kind, with a unique ID and current time
    func logEvent(ek : Event.EventKind) {
      
      state.eventLog.add(
        {
          id = state.eventCount;
          time = timeNow_();
          kind = ek
        });
      
      state.eventCount += 1;
    };

  }
  
