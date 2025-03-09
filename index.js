import inquirer from 'inquirer';
import pool from './db.js';  // Ensure .js is included in the import

async function startApp() {
    const { choice } = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        }
    ]);

    switch (choice) {
        case 'View all departments': return viewDepartments();
        case 'View all roles': return viewRoles();
        case 'View all employees': return viewEmployees();
        case 'Add a department': return addDepartment();
        case 'Add a role': return addRole();
        case 'Add an employee': return addEmployee();
        case 'Update an employee role': return updateEmployeeRole();
        default:
            console.log('Goodbye!');
            process.exit();
    }
}

async function viewDepartments() {
    const { rows } = await pool.query('SELECT * FROM department');
    console.table(rows);
    startApp();
}

async function viewRoles() {
    const query = `
        SELECT role.id, role.title, department.name AS department, role.salary 
        FROM role 
        JOIN department ON role.department_id = department.id;
    `;
    const { rows } = await pool.query(query);
    console.table(rows);
    startApp();
}

async function viewEmployees() {
    const query = `
        SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, 
        COALESCE(m.first_name || ' ' || m.last_name, 'None') AS manager
        FROM employee e
        JOIN role ON e.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee m ON e.manager_id = m.id;
    `;
    const { rows } = await pool.query(query);
    console.table(rows);
    startApp();
}

async function addDepartment() {
    const { name } = await inquirer.prompt([
        { type: 'input', name: 'name', message: 'Enter department name:' }
    ]);
    await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log(`Department '${name}' added!`);
    startApp();
}

async function addRole() {
    const departments = await pool.query('SELECT * FROM department');
    const { title, salary, department_id } = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Enter role title:' },
        { type: 'input', name: 'salary', message: 'Enter role salary:' },
        { type: 'list', name: 'department_id', message: 'Select department:', choices: departments.rows.map(d => ({ name: d.name, value: d.id })) }
    ]);
    await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
    console.log(`Role '${title}' added!`);
    startApp();
}

async function addEmployee() {
    const roles = await pool.query('SELECT * FROM role');
    const employees = await pool.query('SELECT * FROM employee');

    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        { type: 'input', name: 'first_name', message: 'Enter first name:' },
        { type: 'input', name: 'last_name', message: 'Enter last name:' },
        { type: 'list', name: 'role_id', message: 'Select role:', choices: roles.rows.map(r => ({ name: r.title, value: r.id })) },
        { type: 'list', name: 'manager_id', message: 'Select manager:', choices: [{ name: 'None', value: null }, ...employees.rows.map(e => ({ name: e.first_name + ' ' + e.last_name, value: e.id }))] }
    ]);

    await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
    console.log(`Employee '${first_name} ${last_name}' added!`);
    startApp();
}

async function updateEmployeeRole() {
    const employees = await pool.query('SELECT * FROM employee');
    const roles = await pool.query('SELECT * FROM role');

    const { employee_id, role_id } = await inquirer.prompt([
        { type: 'list', name: 'employee_id', message: 'Select employee:', choices: employees.rows.map(e => ({ name: e.first_name + ' ' + e.last_name, value: e.id })) },
        { type: 'list', name: 'role_id', message: 'Select new role:', choices: roles.rows.map(r => ({ name: r.title, value: r.id })) }
    ]);

    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
    console.log('Employee role updated!');
    startApp();
}

startApp();

