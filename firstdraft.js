const mysql = require('mysql2');
const consoleTable = require("console.table");
const inquirer = require('inquirer');

// Creating connection

const connection = mysql.createConnection({
  host:'localhost',
  port: 3306,
  user:'root',
  password:'Listuty19',
  database:'employee_db',
});

// Starting connection 

connection.connect((err) => {

    if(err) throw err;
    console.log("WELCOME TO YOUR EMPLOYEE TRACKER ");
    startPrompt();
});

// Start Prompt

function startPrompt() {

    inquirer.prompt({
        name: 'action',
        type:'list',
        message: 'Main Menu',
        choices: [
        
        'View all employees', 
        'View all employees by role', 
        'View all employees by department', 
        'Add employee', 
        'Add department', 
        'Add role',
        'Update employee role', 
        ]
    })
    .then((answer) => {
        switch(answer.action) {
            case 'View all employees':
                viewEmployees();
                break;

            case 'View all employees by role':
                viewEmplByRole();
                break;
            
            case 'View all employees by department':
                viewEmpByDept();
                break;

           
            case 'Add department':
                addDepartment();
                break;

            case 'Add employee':
                 addEmployee();
                break;

            case 'Add role':
                addRole();
                break;

            case 'Update employee role':
                updateEmployeeRole();
                break;
                    

        }
    });
    


}

function viewEmployees() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW ALL EMPLOYEES');
        console.log('\n');
        console.table(res);
        startPrompt();
    });
}

function viewEmplByRole() {
    const query = `SELECT role.title, employee.id, employee.first_name, employee.last_name, department.name AS department
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY role.title;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEE BY ROLE');
        console.log('\n');
        console.table(res);
        startPrompt();
    });
    
}

function viewEmpByDept() {

     const query = `SELECT department.name AS department, role.title, employee.id, employee.first_name, employee.last_name
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY department.name;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEE BY DEPARTMENT');
        console.log('\n');
        console.table(res);
        startPrompt();
    });
}



async function addEmployee () {

    const employeeName = await inquirer.prompt(askName());
    
   
    connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the employee role?: '
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query('SELECT * FROM employee', async (err, res) => {
            if (err) throw err;
            let choices = res.map(res => `${res.first_name} ${res.last_name}`);
            choices.push('none');
            let { manager } = await inquirer.prompt([
                {
                    name: 'manager',
                    type: 'list',
                    choices: choices,
                    message: 'Choose the employee Manager: '
                }
            ]);
            let managerId;
            let managerName;
            if (manager === 'none') {
                managerId = null;
            } else {
                for (const data of res) {
                    data.fullName = `${data.first_name} ${data.last_name}`;
                    if (data.fullName === manager) {
                        managerId = data.id;
                        managerName = data.fullName;
                        console.log(managerId);
                        console.log(managerName);
                        continue;
                    }
                }
            }
            console.log('New Employee has been added.');

            // Insert the new employee to the table
            
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: res.first,
                    last_name: res.last,
                    role_id: res.roleId,
                    manager_id: parseInt(managerId)
                },
                (err, res) => {
                    if (err) throw err;
                    startPrompt();

                }
            );
        });
    });



}

async function updateEmployeeRole () {
    const employeeId = await inquirer.prompt(askId());

    connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the new employee role?: '
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query(`UPDATE employee 
        SET role_id = ${roleId}
        WHERE employee.id = ${employeeId.name}`, async (err, res) => {
            if (err) throw err;
            console.log('Role has been updated..')
            startPrompt();
        });
    });
}

function addDepartment() {

    inquirer.prompt({

        
        name: "deptName",
        type: "input",
        message: "Department Name: "
    }).then((answer) => {
            
        connection.query(`INSERT INTO department (name)VALUES ("${answer.deptName}");`, (err, res) => {
            if(err) return err;
            console.log("\n DEPARTMENT ADDED...\n ");
            startPrompt();
        });

    });
    
}

function askName() {
    return ([
        {
            name: 'fist',
            type: 'input',
            message:'Enter the fist name of the employee you would like to add'
        },

        {
            name: 'last',
            type: 'input',
            message:'Enter the last name of the employee you would like to add'
        },


    ])
    
}

function askId() {
    return ([
        {
            name: "name",
            type: "input",
            message: "What is the employe ID?:  "
        }
    ]);
}

