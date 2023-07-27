const express = require("express");
const mysql = require("mysql");
const app = express();
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

// Create connection
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "linguaspeak",
});
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// Serve static files from the "public" folder
//if local host server is user

//if localhost server is used
app.get("/", (req, res) => {
  // Read the index.html file and send it as a response
  fs.readFile("index.html", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading index.html:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.send(ta);
  });
});

// Create "users" table if it doesn't exist
pool.query(
  "CREATE TABLE IF NOT EXISTS users(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255) NOT NULL,phone VARCHAR(255) NOT NULL,email VARCHAR(255) NOT NULL,password VARCHAR(255) NOT NULL)",
  (error, results) => {
    if (error) {
      console.error('error creating "users" table ', error);
    } else {
      console.log('Table "users" created successfully');
    }
  }
);
// Route for handling signup form submission
// ...

// Route for handling signup form submission
app.post("/signup", (req, res) => {
  const { name, phone, email, password } = req.body;

  // Perform form validation: Check if email or phone already exists
  pool.query(
    "SELECT * FROM users WHERE email = ? OR phone = ?",
    [email, phone],
    (error, results) => {
      if (error) {
        console.error("Error checking existing user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length > 0) {
        // User already exists with the given email or phone
        console.log("user already exists");
        return res.status(400).json({ error: "Email or phone already taken" });
      } else {
        // User does not exist, proceed with user creation
        console.log("user does not exists proceed wiht creation");
        const insertQuery =
          "INSERT INTO users (name, phone, email, password) VALUES (?, ?, ?, ?)";
        pool.query(
          insertQuery,
          [name, phone, email, password],
          (error, result) => {
            if (error) {
              console.error("Error creating new user:", error);
              return res.status(500).json({ error: "Internal Server Error" });
            } else {
              // User created successfully
              console.log("user created successfullly");
              console.log(
                "now we will create an object userData to send back data to successfull.html"
              );
              const userData = {
                Id: result.insertId,
                name: name,
                email: email,
                createdAt: new Date().toLocaleString(),
              };
              console.log("object userData created successfully");
              return res.status(200).json(userData);
            }
          }
        );
      }
    }
  );
});

// ...

//handling login form submission
// Route for handling login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (error, results) => {
      if (error) {
        console.error("Error retrieving user data:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        // User doesn't exist
        return res.status(404).json({ error: "User not found" });
      }

      const user = results[0];
      if (user.password !== password) {
        // Incorrect password
        return res.status(401).json({ error: "Incorrect password" });
      }
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      };
            
      // Authentication success
      // Redirect to successfull.html upon successful signup
      // Instead of passing the user data as query parameters, you can directly send the user data to the successfull.html page
      return res.status(200).json(userData);
    
    }
  );
});




//// Route for handling group creation
app.post("/create-group", (req, res) => {
  const { topic, maxPeople, language, ownerLevel, ownerId } = req.body;

  // Perform any necessary validations on the received data
  if (!topic || !maxPeople || !language || !ownerLevel || !ownerId) {
    return res.status(400).json({ error: "Please fill in all fields." });
  }

  //get current date and time
  const createdAt = new Date();

  // Check if the "groups" table exists, and create it if it doesn't
  pool.query(
    "CREATE TABLE IF NOT EXISTS groups (id INT AUTO_INCREMENT PRIMARY KEY, topic VARCHAR(255) NOT NULL, max_people INT NOT NULL, language VARCHAR(255) NOT NULL, owner_id INT NOT NULL, owner_level VARCHAR(255) NOT NULL, createdat DATETIME NOT NULL)",
    (error) => {
      if (error) {
        console.error('Error creating "groups" table ', error);
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        // Store the group data in the "groups" table
        pool.query(
          "INSERT INTO groups (topic, max_people, language, owner_id, owner_level, createdat) VALUES (?, ?, ?, ?, ?, ?)",
          [topic, maxPeople, language, ownerId, ownerLevel, createdAt],
          (error, results) => {
            if (error) {
              console.error("Error storing group data:", error);
              return res.status(500).json({ error: "Internal Server Error" });
            }
        
            const groupId = results.insertId;


            //fetch entire group data with newly generated groupid


            pool.query(
              "SELECT * FROM groups WHERE id = ?",
              [groupId],
              (error, result) => {
                if (error) {
                  console.error("Error fetching group data:", error);
                  return res.status(500).json({ error: "Internal Server Error" });
                }
             const groupData=result[0];

            console.log("group created successfully");
            console.log(groupData);
            
             res.json({ message: "Group created successfully", groupId, groupData });
              });
          }
        );
      }
    }
  );
});
// Route for getting groups data
app.get("/get-groups", (req, res) => {
  // Fetch groups data from the database
  pool.query("SELECT * FROM groups", (error, results) => {
    if (error) {
      console.error("Error fetching groups data:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
        
    // Send the groups data as a JSON response
    res.json({ groups: results });
  });
});

// By performing this process, the server fetches the groups data from the database and dynamically injects it into the groups.html template before sending it to the client. As a result, the client will receive the updated HTML page with the actual groups data displayed in the template.

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
