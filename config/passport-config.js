require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

//confirm working

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
    done(null, { id: user.userid, userName: user.username });
  });

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