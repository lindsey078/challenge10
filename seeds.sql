INSERT INTO department (name) VALUES ('Sales'), ('Engineering'), ('Finance');

INSERT INTO role (title, salary, department_id) 
VALUES 
('Sales Manager', 70000, 1),
('Software Engineer', 80000, 2),
('Accountant', 60000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES 
('Lindsey', 'Doe', 1, NULL),
('Grant', 'Smith', 2, 1),
('Ava', 'Brown', 3, 1);
