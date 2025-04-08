require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

//Boilerplate
// This function initializes the passport authentication strategy
// It uses the LocalStrategy for username and password authentication
// It also serializes and deserializes user information for session management
// The function takes in passport, getUserByName, and getUserByUserId as parameters
// getUserByName is used to find a user by their username
// getUserByUserId is used to find a user by their user ID
// The function is exported for use in other parts of the application
// It is used in the app.js file to initialize passport with the necessary strategies
// bcrypt is used to hash and compare passwords securely

function initialize(passport, getUserByName, getUserByUserId) {
  const authenticateUser = async (userName, password, done) => {
    console.log("Authenticating user:", userName);
    const user = await getUserByName(userName);
    if (user == null) {
      console.log("No user with that email");
      return done(null, false, { message: "No user with that email" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        console.log("Password match");
        return done(null, user);
      } else {
        console.log("Password incorrect");
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (err) {
      console.error("Error during authentication:", err);
      return done(err);
    }
  };

  passport.use(
    new LocalStrategy({ usernameField: "userName" }, authenticateUser),
  );

  passport.serializeUser((user, done) => {
    console.log("Serializing user:", user);
    //refers to database objects
    done(null, { id: user.id, userName: user.userName });
  });

  //deserializes the user object from the session
  passport.deserializeUser((sessionData, done) => {
    console.log("Deserializing session data:", sessionData);
    getUserByUserId(sessionData.id)
      .then((user) => {
        if (user) {
          //refers variable outside of database
          user.userName = sessionData.userName;
        }
        done(null, user);
      })
      .catch((err) => done(err));
  });
}

module.exports = initialize;