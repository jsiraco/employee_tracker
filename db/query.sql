SELECT *
FROM employee
INNER JOIN role ON employee.role_id = role.id
INNER JOIN department ON role.department_id = department_id;

SELECT *
FROM role
LEFT JOIN department ON role.department_id = department.id;

SELECT * FROM department;

SELECT *
FROM employee
INNER JOIN role ON employee.role_id = role.id
INNER JOIN department ON role.department_id = department_id;

-- Need to get manager_id working to display the managers name

INSERT INTO department (id, department_name)
VALUES 
	(5, "Outreach");