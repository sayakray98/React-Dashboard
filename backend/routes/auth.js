const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_TOKEN } = require("./config");
const { body } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const passport = require("passport");

/* ================= SIGNUP ================= */

router.post("/createuser", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({
      $or: [{ name }, { email: email.toLowerCase() }],
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
    });

    const token = jwt.sign({ user: { id: user.id } }, JWT_TOKEN, {
      expiresIn: "1d",
    });

    res.json({ authtoken: token });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* ================= LOGIN ================= */

router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await User.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (!user) {
      return res.status(400).json({ error: "No user exists" });
    }

    if (!user.password) {
      return res
        .status(400)
        .json({ error: "Please login using Google" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ user: { id: user.id } }, JWT_TOKEN, {
      expiresIn: "1d",
    });

    res.json({ authtoken: token, name: user.name });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getuser", fetchuser, async (req, res) => {
  try {
    let userid = req.user.id;
    let user = await User.findById(userid).select("-password -cnfpassword");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.put("/update/:id", fetchuser, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const newdata = {};
    if (name) {
      newdata.name = name;
    }
    if (!req.params) {
      return res.status(404).json({ error: "User not found" });
    }
    let dataupadte = await User.findById(req.params.id).select(
      "-password -cnfpassword",
    );

    dataupadte = await User.findByIdAndUpdate(
      id,
      { $set: newdata },
      { new: true },
    ).select("-password -cnfpassword");

    res.json(dataupadte);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.delete("/delete/:id", fetchuser, async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.params) {
      return res.status(404).json({ error: "User not found" });
    }
    let Datadelete = await User.findById(req.params.id);

    Datadelete = await User.findByIdAndDelete(id);

    res.status(200).json({ Datadelete: "Deleted Data !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/search/:key", fetchuser, async (req, res) => {
  try {
    const key = req.params.key;

    let search = await User.find({
      $or: [{ name: { $regex: key, $options: "i" } }],
    });

    if (search.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ search });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/* ================= GOOGLE OAUTH ================= */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/google/failure",
  }),
  (req, res) => {
    if (!req.user) {
      return res.status(500).json({ error: "Google auth failed" });
    }

    const token = jwt.sign(
      { user: { id: req.user.id } },
      process.env.JWT_TOKEN,
      { expiresIn: "1d" }
    );

    // ✅ GitHub Pages + HashRouter
    return res.redirect(
      "https://sayakray98.github.io/React-Dashboard/#/login?token=" + token
    );
  }
);

router.get("/google/failure", (req, res) => {
  res.status(401).json({ error: "Google authentication failed" });
});

module.exports = router;
