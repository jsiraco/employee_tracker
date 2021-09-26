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
const customLetterValidation = (value) => {
  const regex = /[a-z]/g;
  regex.test(value);
};

// Validates the number input
const customNumberValidation = (value) => {
  const regex = /[0-9]/g;
  regex.test(value);
};

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

// Function for adding a role to the database
const addRole = () => {
  db.query(`SELECT * FROM department`, (err, rows) => {
    if (err) {
      console.log({ error: err.message });
      return;
    }
    let departmentArray = [];
    rows.forEach((department) => {
      departmentArray.push(department.department_name);
    });

    inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Please enter the role to add",
      },
      {
        type: "number",
        name: "salary",
        message: "Please enter the salary",
      },
      {
        type: "list",
        name: "department",
        choices: departmentArray,
      }
    ]).then((data) => {
      const { title, salary, department } = data;

      const departmentId = departmentArray.indexOf(department) + 1;
      const titleClean = title.toLowerCase();
      const titleFormat = titleClean.charAt(0).toUpperCase() + titleClean.slice(1);

      const addRoleSQL = `INSERT INTO role (title, salary, department_id) VALUES ("${titleFormat}", ${salary}, ${departmentId});`

      db.query(addRoleSQL, (err, result) => {
        if (err) {
          console.log(err);
        } console.log(`Successfully added ${titleFormat} to the database \n`);
        cliFunc();
      });

    });
  });
};

// Function for adding an employee to the database
const addEmployee = () => {
  db.query("SELECT employee.id, employee.first_name, employee.last_name, CONCAT(manager.first_name,' ',manager.last_name) AS manager, role.title, role.salary, department.department_name FROM employee JOIN role ON role.id = employee.role_id JOIN department ON department.id = role.department_id LEFT JOIN employee manager ON manager.id = employee.manager_id;",
    (err, rows) => {
      if (err) {
        console.log({ error: err.message });
        return;
      }
      let employeeArray = [];
      let roleArray = [];
      rows.forEach((employee) => {
        employeeArray.push(`${employee.first_name} ${employee.last_name}`);
      });
      rows.forEach((role) => {
        roleArray.push(role.title);
      })

      inquirer.prompt([
        {
          type: "input",
          name: "firstName",
          message: "Please enter the employee's first name"
        },
        {
          type: "input",
          name: "lastName",
          message: "Please enter the employee's last name"
        },
        {
          type: "list",
          name: "manager",
          message: "Please select this employee's manager",
          choices: employeeArray,
        },
        {
          type: "list",
          name: "role",
          message: "Please choose this employee's role",
          choices: roleArray
        }
      ]).then((data) => {
        const { firstName, lastName, manager, role } = data;

        const roleId = roleArray.indexOf(role) + 1;
        const managerId = employeeArray.indexOf(manager) + 1;

        const cleanedName = (name) => {
          const toLower = name.toLowerCase();
          const toFormat = toLower.charAt(0).toUpperCase() + toLower.slice(1);
          return toFormat;
        }

        const addEmployeeSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", ${roleId}, ${managerId});`

        db.query(addEmployeeSql, (err, result) => {
          if (err) {
            console.log(err);
          } console.log(`Successfully added ${firstName} ${lastName} to the database \n`);
          cliFunc();
        });
      });
    });
};


//Starts the CLI application
const cliFunc = () => {
  inquirer.prompt([
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
          FROM role 
          INNER JOIN department ON role.department_id = department.id;`;
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
          `SELECT employee.id, employee.first_name, employee.last_name, 
          CONCAT(manager.first_name,' ',manager.last_name) AS manager, role.title, role.salary, department.department_name 
          FROM employee 
          JOIN role ON role.id = employee.role_id 
          JOIN department ON department.id = role.department_id 
          LEFT JOIN employee manager ON manager.id = employee.manager_id;`;
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
        addEmployee();
        break;
      case "Update an employee role":
        break;
      case "Exit":
        console.log("You may now close the application");
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
    };
    res.json({
      message: 'success',
      data: req
    });
  });
});

cliFunc();
