const mysql = require('mysql2/promise');
let inquirer = require("inquirer")

let connection

initialize()
main();


async function initialize(){
    connection = await mysql.createConnection({host:'localhost', user: 'root', database: ''})
// make sure to specify the workbench database**
}


async function main() {
    // get the client
    // create the connection
    const responseObject = await inquirer.prompt([ {
        type: 'list',
        name: 'first_name',
        message: "What would you like to do?",
        choices: ["View all departments", "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Exit"]

      },
      {
        type: 'input',
        name: 'last_name',
        message: "What's your last name",
        default() {
          return 'Doe';
        },
      }])

      console.log(responseObject)


    // query database
    const [rows] = await connection.execute(`SELECT * FROM employees where firstname = ?`,[responseObject.first_name] );
    console.table(rows);



  }