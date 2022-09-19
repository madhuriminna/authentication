const express = require("express");
const path = require("path");
const dcrypt=require("dcrypt");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "userData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

app.post("/register/", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  const encrypPass = await bcrypt.hash(request.body.password, 10);
  const checkUser1 = `select * from user where username='${username}';`;
  const checkUser = await db.get(checkUser1);
  if (checkUser === undefined) {
    if (password.length < 5) {
      response.status(400);
      response.send("Password is too short");
    } else {
      const postQuery = `insert into user (username,name,password,gender,location)
         values ('${username}','${name}','${encrypPass}','${gender}','${location}');`;
      await db.run(postQuery);
      response.status(200);
      response.send("User created successfully");
    }
  } else {
    response.status(400);
    response.send("User already exists");
  }
});

app.post("/login/", async (request, response) => {
  const { username, password } = request.body;
  const checkUser1 = `select * from user where username='${username}';`;
  const checkUser = await db.get(checkUser1);
  if (checkUser === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const decrypt = await bcrypt.compare(password, checkUser.password);
    if (decrypt === true) {
      response.status(200);
      response.send("Login success!");
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  }
});

app.put("/change-password/", async (request, response) => {
  const { username, oldPassword, newPassword } = request.body;
  const decrypt = await bcrypt.compare(oldpassword, checkUser.password);
  if (decrypt === true) {
    if (newPassword < 5) {
      response.status(400);
      response.send("Password is too short");
    } else {
      response.status(200);
      response.send("Password updated");
    }
  } else {
    response.status(400);
    response.send("Invalid current password");
  }
});

module.exports = app;
