USE employee_db;

INSERT INTO department
    (name)
VALUES
    ('Operations'),
    ('Analystics'),
    ('Marketing'),
    ('Executive');

    INSERT INTO role
    (title, salary, department_id)
VALUES
    ('General Manager', 11000000, 1),
    ('Coach', 4000000, 1),
    ('Team Lead Analyst', 15000000, 2),
    ('Team Analyst', 8000000, 2),
    ('Media Manager', 7000000, 3),
    ('Media Specialist', 3000000, 3),
    ('CEO', 45000000, 4),
    ('CEO Assistant', 25000000, 4);
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Stockton', 1, NULL),
    ('Karl', 'Malone', 2, 1),
    ('Michael', 'Jordan', 3, NULL),
    ('Steve', 'Kerr', 4, 3),
    ('Shawn', 'Kemp', 5, NULL),
    ('Gary', 'Peyton', 6, 5),
    ('Magic', 'Johnson', 7, NULL),
    ('Larry', 'Bird', 8, 7);
    