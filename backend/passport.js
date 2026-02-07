const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const MicrosoftStrategy = require("passport-microsoft").Strategy;
const User = require("./models/User");

/* ================= GOOGLE ================= */

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://react-dashboard-5odm.onrender.com/api/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value.toLowerCase();

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            password: null,
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);

/* ================= MICROSOFT (SAFE) ================= */

// if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
//   passport.use(
//     new MicrosoftStrategy(
//       {
//         clientID: process.env.MICROSOFT_CLIENT_ID,
//         clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
//         callbackURL: "/api/microsoft/callback",
//         scope: ["openid", "profile", "email"],
//         tenant: "common",
//         prompt: "select_account",
//       },
//       async (accessToken, refreshToken, profile, done) => {
//         try {
//           const email = profile.emails?.[0]?.value?.toLowerCase();

//           let user = await User.findOne({ email });
//           if (!user) {
//             user = await User.create({
//               name: profile.displayName,
//               email,
//               password: null,
//             });
//           }

//           done(null, user);
//         } catch (err) {
//           done(err, null);
//         }
//       },
//     ),
//   );
// } else {
//   console.warn("⚠️ Microsoft OAuth disabled (env vars missing)");
// }

module.exports = passport;
