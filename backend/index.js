const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToMongoose = require("./db");
const authRoutes = require("./routes/auth");
const passport = require("./passport");


const app = express();
const port = process.env.PORT || 3000;

// Connect DB
connectToMongoose();

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://sayakray98.github.io",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());


// Routes
app.use("/api", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Backend running!");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
