const mysql = require('mysql');
const inquire = require('inquirer')
const consoleTable = require("console.table");
const promisemysql = require("promise-mysql");
const inquirer = require('inquirer');

// Creating connection

const connection = mysql.createConnection({
  host     : 'localhost',
  port: 3360,
  user     : 'root',
  password : 'Meytuty24',
  database : 'employee_db',
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
        name: 'userchoice',
        type:'list',
        message: 'Main Menu',
        choices: [
        
        'View all employees', 
        'View all employees by role', 
        'View all employees by department', 
        'Add role', 
        'Add employee', 
        'Add department', 
        'Update employee role', 
        ]
    })
    .then((answer) => {
        switch(answer.userchoice) {
            case 'View all employees':
                viewEmployees();
                break;

            case 'View all employees by role':
                viewEmplByRole();
                break;
            
            case 'View all employees by department':
                viewEmpByDept();
                break;

            case 'Add role':
                addRole();
                break;

            case 'Add department':
                addDepartment();
                break;

            case 'Add employee':
                 addEmployee();
                break;

            case 'Update employee role':
                updateEmployeeRole();
                break;
                    

        }
    })
    





}



/// Start prompts when connection is started

//
// connection.end();