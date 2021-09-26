-- Department
SELECT * FROM department;

-- Role
SELECT role.id, role.title, role.salary, department.department_name 
FROM role 
INNER JOIN department ON role.department_id = department.id;

-- Employee
SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name
FROM employee
JOIN role 
ON employee.role_id = role.id
JOIN department 
ON role.department_id = department.id;

-- Employee
SELECT employee.id, employee.first_name, employee.last_name, CONCAT(manager.first_name,' ',manager.last_name) AS manager, 
role.title, role.salary, department.department_name 
FROM employee 
JOIN role ON role.id = employee.role_id 
JOIN department ON department.id = role.department_id 
LEFT JOIN employee manager ON manager.id = employee.manager_id;

-- Role Titles
SELECT title FROM role;

-- Need to get manager_id working to display the managers name

-- Add department
INSERT INTO department (department_name)
VALUES 
	("Custodial");

-- Add a role
INSERT INTO role (title, salary, department_id)
VALUES 
	("Executioner", 80000, 7);

-- Add an employee
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
	("Maru", "Wade", 3, 1);