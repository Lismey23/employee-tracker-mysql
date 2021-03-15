const mysql = require('mysql');
const inquire = require('inquirer')



const connection = mysql.createConnection({
  host     : 'localhost',
  port: 3360,
  user     : 'root',
  password : 'Meytuty24',
  database : 'employee_db',
});

connection.connect((err)=>{

    if(err) throw err;
    console.log("connection stated ")
});

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });


// connection.end();