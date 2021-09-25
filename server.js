const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "frootboot",
    database: "cli_db"
  },
  console.log(`Connected to the cli_db database.`)
);

// View all departments 
app.get("/api/departments", (req, res) => {
  const sql = `SELECT * FROM department`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows
    });
  });
});

const cliFunc = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        message: "Which would you like to do?",
        choices:
          [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "Exit"
          ]
      }
    ]).then((choices) => {
      switch (choices.choices) {
        case "View all departments":
          //console.log("Test");
          const sql = `SELECT * FROM department`;
          db.query(sql, (err, rows) => {
            if (err) {
              console.log({ error: err.message });
              return;
            }
            //console.log(rows);
            console.table([...rows]);
            return;
          });
          break;
        case "View all roles":
          break;
        case "View all employees":
          break;
        case "Add a department":
          break;
        case "Add a role":
          break;
        case "Add an employee":
          break;
        case "Update an employee role":
          break;
        case "Exit":
          return;
      }
    }).catch((error) => {
      console.log(error);
      return;
    })
}

// View all roles
app.get("/api/roles", (req, res) => {
  const sql = `SELECT * FROM role`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.log(rows);
    res.json({
      message: "success",
      data: rows
    });
  });
});

// View all employees
app.get("/api/employees", (req, res) => {
  const sql = `SELECT * FROM employee`

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows
    });
  });
});

// Add department
app.post('/api/new-department', (req, res) => {
  const sql = `INSERT INTO department (id, department_name)
      VALUES (?)`;
  const params = [req.id, req.department_name];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: req
    });
  });
});

// Add role
app.post('/api/new-role', (req, res) => {
  const sql = `INSERT INTO department (id, title, salary, department_id)
      VALUES (?)`;
  const params = [req.id, req.title, req.salary, req.department_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: req
    });
  });
});

// Add employee
app.post('/api/new-employee', (req, res) => {
  const sql = `INSERT INTO employee (id, first_name, last_name, manager_id, role_id)
      VALUES (?)`;
  const params = [req.id, req.title, req.salary, req.department_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: req
    });
  });
});

// Listening 
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });