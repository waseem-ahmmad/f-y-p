const express = require("express");
const mysql = require("mysql");
const app = express();
const port = process.env.PORT || 3000;

// Create connection
const pool = mysql.createPool({
  host: "your-mysql-hostname",
  user: "your-mysql-username",
  password: "your-mysql-password",
  database: "your-mysql-database",
});
app.set('view engine', 'ejs');

app.use(express.json());

// Create "users" table if it doesn't exist
pool.query(
  "CREATE TABLE IF NOT EXISTS usere(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255) NOT NULL,phone VARCHAR(255) NOT NULL,email VARCHAR(255) NOT NULL,password VARCHAR(255) NOT NULL)",
  (error, results) => {
    if (error) {
      console.error('error creating "users" table ', error);
    } else {
      console.log('Table "users" created successfully');
    }
  }
);
// Route for handling signup form submission
app.post("/signup", (req, res) => {
  const { name, phone, email, password } = req.body;

  // Perform validation checks
  pool.query(
    "SELECT * FROM users WHERE email = ? OR phone = ?",
    [email, phone],
    (error, results) => {
      if (error) {
        console.error("Error checking existing user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length > 0) {
        // User already exists
        return res.status(400).json({ error: "Email or phone already taken" });
      }

      // Store data in the database
      pool.query(
        "INSERT INTO users (name, phone, email, password) VALUES (?, ?, ?, ?)",
        [name, phone, email, password],
        (error, results) => {
          if (error) {
            console.error("Error storing user data:", error);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          // Get the inserted user ID
          const userId = results.insertId;
          // Fetch the user details from the database
          pool.query(
            "SELECT * FROM users WHERE id = ?",
            [userId],
            (error, results) => {
              if (error) {
                console.error("Error retrieving user details:", error);
                return res.status(500).json({ error: "Internal Server Error" });
              }

              if (results.length === 0) {
                // User not found
                return res.status(404).json({ error: "User not found" });
              }

              // Get the user details
              const user = results[0];

              // Render the successfull.html template with user details
              res.render("successfull", { user });
            }
          );
        }
      );
    }
  );
});

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

      // Authentication success
      // Redirect to successfull.html upon successful signup
      res.render("successfull", { user });
    }
  );
});

// Route for handling group creation
app.post("/create-group", (req, res) => {
  const { topic, maxPeople, language, ownerLevel } = req.body;

  // Perform any necessary validations on the received data
  if (!topic || !maxPeople || !language || !ownerLevel) {
    return res.status(400).json({ error: "Please fill in all fields." });
  }

  const ownerId = req.user.id; // Assuming you have the authenticated user ID stored in req.user.id
     
  //get curernt data and time
  const createdAt=new Date();
  // Store the group data in the "groups" table
  pool.query(
    "INSERT INTO groups (topic, max_people, language, owner_id, owner_level,createdat) VALUES (?, ?, ?, ?, ?,?)",
    [topic, maxPeople, language, ownerId, ownerLevel,createdAt],
    (error, results) => {
      if (error) {
        console.error("Error storing group data:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const groupId = results.insertId;
      res.json({ message: "Group created successfully", groupId });
    }
  );
});

// Route for fetching all groups
app.get("/get-groups", (req, res) => {
  pool.query("SELECT * FROM groups ORDER BY id DESC", (error, results) => {
    if (error) {
      console.error("Error fetching groups:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Pass the groups data to the groups.ejs template
    res.render("groups", { groups: results });
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
