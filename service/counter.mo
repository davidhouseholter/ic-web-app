import Principal "mo:base/Principal";

actor {

    stable var currentValue: Nat = 0;

    public func increment(): async () {
        currentValue += 1;
    };

    public query func getValue(): async Nat {
        currentValue;
    };

    public shared({caller}) func whoami() : async Principal {
        return caller;
    };

    // Return the principal of the message caller/user identity
    public shared({ caller }) func callerPrincipal() : async Principal {
        return caller;
    };
};
