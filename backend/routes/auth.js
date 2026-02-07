const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_TOKEN } = require("./config"); // ✅ FIXED PATH
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const passport = require("passport");

/* ================= SIGNUP ================= */

router.post(
  "/createuser",
  [
    body("name").isLength({ min: 6 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("cnfpassword").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // ✅ Check by name OR email
      let user = await User.findOne({
        $or: [
          { name: req.body.name },
          { email: req.body.email.toLowerCase() }
        ],
      });

      if (user) {
        return res.status(400).json({
          error: "User already exists with this name or email",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const userdata = new User({
        name: req.body.name,
        email: req.body.email.toLowerCase(),
        phone: req.body.phone,
        password: hashedPassword,
        cnfpassword: hashedPassword,
      });

      await userdata.save();

      const token = jwt.sign(
        { user: { id: userdata.id } },
        JWT_TOKEN,
        { expiresIn: "1d" }
      );

      res.json({ authtoken: token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

/* ================= LOGIN ================= */

router.post(
  "/login",
  [body("name").notEmpty(), body("password").isLength({ min: 6 })],
  async (req, res) => {
    try {
      const { name, password } = req.body;

      const user = await User.findOne({
        name: { $regex: `^${name}$`, $options: "i" },
      });

      if (!user) {
        return res.status(400).json({ error: "No user exists" });
      }

      // ✅ Block Google users from password login
      if (!user.password) {
        return res.status(400).json({
          error: "Please login using Google or Microsoft",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          error: "Password is incorrect",
        });
      }

      const token = jwt.sign(
        { user: { id: user.id } },
        JWT_TOKEN,
        { expiresIn: "1d" }
      );

      res.json({ authtoken: token, name: user.name });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

/* ================= GET USER ================= */

router.get("/getuser", fetchuser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -cnfpassword"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* ================= GOOGLE LOGIN ================= */

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      // ✅ MUST be absolute in production
      callbackURL:
        "https://react-dashboard-5odm.onrender.com/api/google/callback",
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
    }
  )
);


/* ================= MICROSOFT LOGIN ================= */

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { user: { id: req.user.id } },
      process.env.JWT_TOKEN,
      { expiresIn: "1d" }
    );

    // ✅ GitHub Pages + HashRouter redirect
    res.redirect(
      `https://sayakray98.github.io/React-Dashboard/#/login?token=${token}`
    );
  }
);

module.exports = router;
