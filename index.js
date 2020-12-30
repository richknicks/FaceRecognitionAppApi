require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
// const db = knex({
//   client: "pg",
//   connection: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: true,
//   },
// });
const { Pool } = require("pg");
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const server = express();
server.use(express.json());
server.use(cors());
const PORT = process.env.PORT || 5000;

server.get("/", (req, res) => {
  res.status(200).json("Success");
});

server.get("/db", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM users");
    const results = { results: result ? result.rows : null };
    res.render("pages/db", results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

server.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

server.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

server.get("/profile/:id", (req, res) => {
  profile.hanldleProfileGet(req, res, db);
});

server.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

server.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

server.listen(PORT, () => {
  console.log(`**Server is running on port ${PORT}`);
});
