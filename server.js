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


//Cleans the user inputs
const cleanedName = (name) => {
  const toLower = name.toLowerCase();
  const toFormat = toLower.charAt(0).toUpperCase() + toLower.slice(1);
  return toFormat;
}

// View all departments
const departmentView = () => {
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
}

// View all roles
const roleView = () => {
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
}

// View all employees
const employeeView = () => {
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
}

// Function for adding a department into the database
const addDept = () => {
  inquirer.prompt([
    {
      type: "input",
      name: "department",
      message: "Please enter the department to add",
    }
  ]).then((data) => {
    const { department } = data;

    // Cleans the input to be put in the database
    const cleanDepartment = cleanedName(department);

    // SQL query to add the department to the database
    const addDepartmentSQL = `INSERT INTO department (department_name) VALUES (?);`
    db.query(addDepartmentSQL, cleanDepartment, (err, result) => {
      if (err) {
        console.log(err);
      } console.log(`Successfully added ${cleanDepartment} to the database \n`);
      cliFunc();
    });
  });
};

// Function for adding a role to the database
const addRole = () => {

  // Gets the departments and puts them in an array to be used as choices in the prompt
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
      const cleanTitle = cleanedName(title);

      const addRoleSQL = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);`

      db.query(addRoleSQL, [cleanTitle, salary, departmentId], (err, result) => {
        if (err) {
          console.log(err);
        } console.log(`Successfully added ${cleanTitle} to the database \n`);
        cliFunc();
      });

    });
  });
};

// Function for adding an employee to the database
const addEmployee = () => {

  //Gets all employee information and joins the managers, as well as department and role tables
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
          message: "Please enter the employee's first name",
        },
        {
          type: "input",
          name: "lastName",
          message: "Please enter the employee's last name",
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

        const cleanFirst = cleanedName(firstName);
        const cleanLast = cleanedName(lastName);

        const addEmployeeSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`

        db.query(addEmployeeSql, [cleanFirst, cleanLast, roleId, managerId], (err, result) => {
          if (err) {
            console.log(err);
          } console.log(`Successfully added ${cleanFirst} ${cleanLast} to the database \n`);
          cliFunc();
        });
      });
    });
};

// Updates an employee
const updateEmployee = () => {
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
          type: "list",
          name: "employee",
          message: "Please select this employee to edit",
          choices: employeeArray,
        },
        {
          type: "list",
          name: "role",
          message: "Please choose this employee's role",
          choices: roleArray
        }
      ]).then((data) => {
        const { employee, role } = data;

        const roleId = roleArray.indexOf(role) + 1;
        const employeeId = employeeArray.indexOf(employee) + 1;

        const updateEmployeeSql = `UPDATE employee SET role_id = ? WHERE id = ?;`

        db.query(updateEmployeeSql, [roleId, employeeId], (err, result) => {
          if (err) {
            console.log(err);
          } console.log(`Successfully updated ${employee}\n`);
          cliFunc();
        });
      });
    });
}


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

    // Depending on the selection the switch statements starts different functions
    switch (choices.choices) {
      case "View all departments":
        departmentView();
        break;
      case "View all roles":
        roleView();
        break;
      case "View all employees":
        employeeView();
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
        updateEmployee();
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

//Starts the application
cliFunc();
