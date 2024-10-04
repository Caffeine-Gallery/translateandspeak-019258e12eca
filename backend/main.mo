import Func "mo:base/Func";

import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import Text "mo:base/Text";

actor {
  // Define a type for storing translations
  type Translation = {
    original: Text;
    translated: Text;
    targetLanguage: Text;
  };

  // Create a stable array to store translations
  stable var stableTranslations : [Translation] = [];

  // Create a buffer to store recent translations
  var translationsBuffer = Buffer.Buffer<Translation>(0);

  // Function to add a new translation
  public func addTranslation(original: Text, translated: Text, targetLanguage: Text) : async () {
    let newTranslation : Translation = {
      original;
      translated;
      targetLanguage;
    };
    translationsBuffer.add(newTranslation);

    // Keep only the last 10 translations
    if (translationsBuffer.size() > 10) {
      let _ = translationsBuffer.remove(0);
    };
  };

  // Function to get recent translations
  public query func getRecentTranslations() : async [Translation] {
    Buffer.toArray(translationsBuffer)
  };

  // System functions for upgrades
  system func preupgrade() {
    stableTranslations := Buffer.toArray(translationsBuffer);
  };

  system func postupgrade() {
    translationsBuffer := Buffer.fromArray(stableTranslations);
  };
}
