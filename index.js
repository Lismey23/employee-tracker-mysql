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
    const query1 = 'SELECT id, title FROM role';
    const query2 = 'SELECT id, first_name, last_name FROM employee WHERE manager_id != role_id';
    var roleChoices = [];
    var managerChoices = [];

    connection.query(query1, (err, res) => {
        if (err) throw err;
        roleChoices = res.map(({ id, title }) => ({
            name: title,
            value: id,
        }));
        connection.query(query2, (err, res) => {
            if (err) throw err;
            managerChoices = res.map(({ id, first_name, last_name }) => ({
                name: [first_name + ' ' + last_name],
                value: id,
            }));
            addEmployeeHelper(roleChoices, managerChoices);
        });
    });
};

const addEmployeeHelper = (roleChoices, managerChoices) => {
    inquirer.prompt(
        [
            {
                name: 'first_name',
                type: 'input',
                message: "What is the employee's first name?",
            },
            {
                name: 'last_name',
                type: 'input',
                message: "What is the employee's last name?",
            },
            {
                name: 'role',
                type: 'list',
                message: "What is the employee's role?",
                choices: roleChoices
            },
            {
                name: 'manager',
                type: 'list',
                message: "Who is the employee's manager?",
                choices: managerChoices
            }
        ]
    )
        .then((res) => {
            //console.log('Inserting new employee...\n');
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: res.first_name,
                    last_name: res.last_name,
                    role_id: res.role,
                    manager_id: res.manager
                },
                function (err, res) {
                    if (err) throw err;
                    const promise1 = new Promise((resolve, reject) => {
                        console.log(res.affectedRows + " employee added!\n");
                        resolve('Success!');
                    });
                    promise1.then(() => {
                        startPrompt();
                    });
                }
            );
        });
};





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


function askId() {
    return ([
        {
            name: "name",
            type: "input",
            message: "What is the employe ID?:  "
        }
    ]);
}

const addRole = () => {
    const query = 'SELECT id, name FROM department';
    var depChoices = [];

    connection.query(query, (err, res) => {
        if (err) throw err;
        depChoices = res.map(({ id, name }) => ({
            value: id,
            name: name,
        }));
        addRoleHelper(depChoices);
    });
    
};

const addRoleHelper = (depChoices) => {
    inquirer
    .prompt(
        [
            {
                name: 'role',
                type: 'input',
                message: "What is the name of the role?",
            },
            {
                name: 'salary',
                type: 'number',
                message: "What is their salary?",
            },
            {
                name: 'department',
                type: 'list',
                message: "What is their department?",
                choices: depChoices
            }
        ]
    )
    .then((res) => {
        connection.query(
            'INSERT INTO role SET ?',
            {
                title: res.role,
                salary: res.salary,
                department_id: res.department,
            },
            function (err, res) {
                if (err) throw err;
                const promise1 = new Promise((resolve, reject) => {
                    console.log(res.affectedRows + " role added!\n");
                    resolve('Success!');
                });
                promise1.then(() => {
                    startPrompt();
                });
            }
        )
    });
}
