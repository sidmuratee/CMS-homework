const mysql = require('mysql2');
let inquirer = require("inquirer")

// let connection

// initialize()


// async function initialize(){
let connection = mysql.createConnection({ host: 'localhost', user: 'root', database: 'employeeRecords_db', password: "" })
// make sure to specify the workbench database**
// }
connection.connect(function () {
    main();

})

function main() {
    // get the client
    // create the connection
    const responseObject = inquirer.prompt([{
        type: 'list',
        name: "prompt",
        message: "What would you like to do?",
        choices: ["View all departments", "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "Exit"]

    },
    ])
        .then(response => {
            if (response.prompt === "View all departments") {
                viewDepartments()
            }
            else if (response.prompt === "View all roles") {
                viewRoles()
            }
            else if (response.prompt === "View all employees") {
                viewEmployees()
            }
            else if (response.prompt === "Add a role") {
                addRole()
            }
            else if (response.prompt === "Add an employee") {
                addEmployee()
            }
        })

    console.log(responseObject)


    // query database
    // const [rows] = await connection.execute(`SELECT * FROM employees where first_name = ?`,[responseObject.first_name] );
    // console.table(rows);

}

function viewDepartments() {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err
        console.table(res)
        main()
    })
}
function viewRoles() {
    connection.query(`SELECT roles.id, roles.title, roles.salary, department.name AS department
    FROM roles
    INNER JOIN department ON roles.department_id = department.id;`
, (err, res) => {
        if (err) throw err
        console.table(res)
        main()
    })
}
function viewEmployees() {
    connection.query(`SELECT employees.id, 
    employees.first_name, 
    employees.last_name, 
    roles.title, 
    department.name AS department,
    roles.salary, 
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN department ON roles.department_id = department.id
    LEFT JOIN employees manager ON employees.manager_id = manager.id;`
, (err, res) => {
        if (err) throw err
        console.table(res)
        main()
    })
}
function addRole() {
    connection.query("SELECT * FROM roles", (err, res) => {
        inquirer.prompt([

            {
                type: "input",
                name: "title",
                message: "What is your title?",
            },
            {
                type: "input",
                name: "salary",
                message: "What is your salary?",
            },
            {
                type: "list",
                name: "department_id",
                message: "which department?",
                choices: res.map(department => department.name),
            },
        ]).then(data => {
            const chosenDept = res.find(department_id => department_id.name === data.departments)
            connection.query("INSERT INTO roles SET ?", {
                title: data.title,
                salary: data.salary,
                department_id: chosenDept.id,
            })
            main()
        })
    })
}
// function addEmployee() {
//     connection.query("SELECT * FROM department", (err, res) => {
//         inquirer.prompt([

//             {
//                 type: "input",
//                 name: "first_name",
//                 message: "What is the employee's first name?",
//             },
//             {
//                 type: "input",
//                 name: "last_name",
//                 message: "What is the employee's last name?",
//             },
//             {
//                 type: "input",
//                 name: "role_name",
//                 message: "What is the employee's role?",
//             },
//             {
//                 type: "list",
//                 name: "manager_name",
//                 message: "Who is the employee's manager?",
//                 choices: res.map(department => department.name),
//             },
//         ]).then(data => {
//             const chosenDept = res.find(department => department.name === data.departments)
//             connection.query("INSERT INTO roles SET ?", {
//                 title: data.title,
//                 salary: data.salary,
//                 department_id: chosenDept.id,
//             })
//             main()
//         })
//     })
// }