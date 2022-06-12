
module {

    public type Timestamp = Int; // See mo:base/Time and Time.now()
    public type UserId = Text; // system generated
    public type ItemId = Text; // system generated

    public type UserProfile = {
      userName: Text;
      // add other properties of the user
    };

    /// User profile.
    public type Profile = {
      userName : Text ;
      createdAt : Timestamp;
    };

    public type UserProfileFull = {
      userName: Text;
      rewards: Nat;
    };

    /// Notification messages
    public type Message = {
      id: Nat;
      time: Timestamp;
      event: Text;
    };

    public type Service = actor {
      createProfile : (userName : Text) -> async ?UserId;
      getUserProfile : query (userId : UserId) -> async ?UserProfile;
      getProfileFull : query (userId : UserId) -> async ?UserProfileFull;
    }; 

    /// Role for a caller into the service API.
    /// Common case is #user.
    public type Role = {
      // caller is a user
      #user;
      // caller is the admin
      #admin;
      // caller is not yet a user; just a guest
      #guest
    };

    /// Action is an API call classification for access control logic.
    public type UserAction = {
      /// Create a new user name, associated with a principal and role #user.
      #create;
      /// Update an existing profile, or add to its videos, etc.
      #update;
      /// View an existing profile, or its videos, etc.
      #view;
      /// Admin action, e.g., getting a dump of logs, etc
      #admin
    };

    /// An ActionTarget identifies the target of a UserAction.
    public type ActionTarget = {
      /// User's profile or videos are all potential targets of action.
      #user : UserId ;
      /// Exactly one video is the target of the action.
      #item : ItemId ;

      #allItems;
      /// Everything is a potential target of the action.
      #all;
      /// Everything public is a potential target (of viewing only)
      #pubViewOnly
    };

    /// item information provided by front end to service, upon creation.
    public type ItemInit = {
      name: Text;
      caption: Text;
      tags: [Text];
    };

    
    /// Item
    public type Item = {
      itemId: Text;
      userId : UserId;
      name: Text;
      caption: Text;
      //pic: ?ItemPic;
      createdAt : Timestamp;   
      tags: [Text];
      viewCount: Nat;
    };
    
    public type ItemPic = [Nat8]; // encoded as a PNG file
    public type ItemResult = (Item, ?ItemPic);
    public type ItemResults = [ItemResult];

    /// For test scripts, the script controls how time advances, and when.
    /// For real deployment, the service uses the IC system as the time source.
    public type TimeMode = { #ic ; #script : Int };

    /// Time mode.
    ///
    /// Controls how the actor records time and names unique IDs.
    ///
    /// For deployment (timeMode = #ic), the time is system time (nanoseconds since 1970-01-01).
    ///
    /// For scripts and CI-based testing, we want to predict and control time from a #script.
    public let timeMode : {#script; #ic} =
      #ic; // deterministic, small-number times in scripts.

}
