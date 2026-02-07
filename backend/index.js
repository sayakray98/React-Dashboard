const express = require("express");
const cors = require("cors");
const passport = require("./passport"); // 👈 MUST import passport
const authRoutes = require("./routes/auth");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://sayakray98.github.io"
  ],
  credentials: true
}));

app.use(express.json());
app.use(passport.initialize()); // 👈 MUST be here

app.use("/api", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.listen(process.env.PORT || 10000, () =>
  console.log("Server running")
);
