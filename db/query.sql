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

-- Need to get manager_id working to display the managers name

-- Add department
INSERT INTO department (department_name)
VALUES 
	("Custodial");


INSERT INTO role (title, salary, department_id)
VALUES 
	("Executioner", 80000, 7);