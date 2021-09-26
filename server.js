const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
  const db = mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "Toadally222000Awesome41968!?",
      database: "cli_db"
    },
    console.log(`Connected to the cli_db database.`)
  );

// Validates user input
const customValidation = (value) => {
  const regex = /[a-z]/g;
  regex.test(value);

}

//Cleans the user input
const firstLetterUpper = (data) => {
  const newEntry = data.department;
  const newEntryclean = newEntry.toLowerCase();
  const newEntryFormat = newEntryclean.charAt(0).toUpperCase() + newEntryclean.slice(1);
  return newEntryFormat;
}

// function that return the list of departments
const departmentList = () => {
  db.query(`SELECT department_name FROM department`, (err, rows) => {
    if (err) {
      console.log({ error: err.message });
      return;
    }
    const departmentList = [];
    departmentList.push(...rows);
    console.log(departmentList);
    return departmentList;
  });
}

// Function for adding a department into the database
const addDept = () => {
  inquirer.prompt([
    {
      type: "input",
      name: "department",
      message: "Please enter the department to add",
      //validate: value => customValidation(value)
    }
  ]).then((data) => {
    // Cleans the input to be put in the database
    const department = firstLetterUpper(data);
    // SQL query to add the department to the database
    const addDepartmentSQL = `INSERT INTO department (department_name) VALUES (?);`
    db.query(addDepartmentSQL, department, (err, result) => {
      if (err) {
        console.log(err);
      } console.log(`Successfully added ${department} to the database \n`);
      cliFunc();
    });
  });
};

const addRole = () => {
  inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Please enter the role to add",
    },
    {
      type: "input",
      name: "salary",
      message: "Please enter the salary",
    },
    {
      type: "list",
      name: "department",
      choices: ["Sales", "Engineering", "Finance", "Legal"],
    }
  ]).then((data) => {

    const department_id = (data) => {
      switch (data.department) {
        case "Sales":
          return 1;
        case "Engineering":
          return 2;
        case "Finance":
          return 3;
        case "Legal":
          return 4;
    };
  };

    const addRoleSQL = `INSERT INTO role (title, salary, department_id) VALUES ("${data.title}", ${data.salary}, ${department_id(data.department)});`

    db.query(addRoleSQL, (err, result) => {
      if (err) {
        console.log(err);
      } console.log(`Successfully added ${data.title} to the database \n`);
      cliFunc();
    });

  });
}



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
          const deptSQL =
            `SELECT * FROM department`;
          db.query(deptSQL, (err, rows) => {
            if (err) {
              console.log({ error: err.message });
              return;
            }
            console.table([...rows]);
            cliFunc();
          });
          break;
        case "View all roles":
          const roleSQL =
            `SELECT role.id, role.title, role.salary, department.department_name 
          FROM role INNER JOIN department ON role.department_id = department.id;`;
          db.query(roleSQL, (err, rows) => {
            if (err) {
              console.log({ error: err.message });
              return;
            }
            console.table([...rows]);
            cliFunc();
          });
          break;
        case "View all employees":
          const employeeSQL =
            `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name
          FROM employee
          JOIN role 
          ON employee.role_id = role.id
          JOIN department 
          ON role.department_id = department.id;`;
          db.query(employeeSQL, (err, rows) => {
            if (err) {
              console.log({ error: err.message });
              return;
            }
            console.table([...rows]);
            cliFunc();
          });
          break;
        case "Add a department":
          addDept();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          break;
        case "Update an employee role":
          break;
        case "Exit":
          console.log("Thank you!");
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

cliFunc();
