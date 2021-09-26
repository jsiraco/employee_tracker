INSERT INTO department (id, department_name)
VALUES (1, "Sales"),
       (2, "Engineering"),
       (3, "Finance"),
       (4, "Legal");

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Salesperson", 70000, 1),
       (2, "Lead Engineer", 150000, 2),
       (3, "Software Engineer", 120000, 2),
       (4, "Account Manager", 160000, 3),
       (5, "Accountant", 90000, 3),
       (6, "Legal Team Lead", 250000, 4),
       (7, "Human Resources", 75000, 4),
       (8, "Lawyer", 190000, 4);

INSERT INTO employee (id, first_name, last_name, manager_id, role_id)
VALUES  (1, "Robin", "Wade", null, 1),
        (2, "Sebastian", "Robinson", null, 2),
        (3, "Abigail", "Blackwell", 2, 3),
        (4, "Hailey", "Harpswell", null, 4),
        (5, "Willy", "Pete", 4, 5),
        (6, "Emily", "Haprswell", null, 6),
        (7, "Leah", "Dahlia", 6, 7),
        (8, "Sam", "Valentine", 6, 8);