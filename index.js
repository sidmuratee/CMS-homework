const mysql = require("mysql2");
let inquirer = require("inquirer");
// const mysql = require("mysql2/promise");


// let connection

// initialize()

// async function initialize(){
let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "employeeRecords_db",
    password: "",
});
// make sure to specify the workbench database**
// }
// connection.connect(function () {
main();

// })

async function main() {
    // get the client
    // create the connection
    const responseObject = await inquirer
        .prompt([
            {
                type: "list",
                name: "prompt",
                message: "What would you like to do?",
                choices: [
                    "View all departments",
                    "View all roles",
                    "View all employees",
                    "Add a department",
                    "Add a role",
                    "Add an employee",
                    "Update an employee role",
                    "Exit",
                ],
            },
        ])
        .then((response) => {
            if (response.prompt === "View all departments") {
                viewDepartments();
            } else if (response.prompt === "View all roles") {
                viewRoles();
            } else if (response.prompt === "View all employees") {
                viewEmployees();
            } else if (response.prompt === "Add a role") {
                addRole();
            } else if (response.prompt === "Add an employee") {
                addEmployee();
            } else if ( response.prompt === "Update an employee role") {
                updateEmpRole();
            }
        });

    console.log(responseObject);

    // query database
    // const [rows] = await connection.execute(`SELECT * FROM employees where first_name = ?`,[responseObject.first_name] );
    // console.table(rows);
}

function viewDepartments() {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res);
        main();
    });
}
function viewRoles() {
    connection.query(
        `SELECT roles.id, roles.title, roles.salary, department.name AS department
    FROM roles
    INNER JOIN department ON roles.department_id = department.id;`,
        (err, res) => {
            if (err) throw err;
            console.table(res);
            main();
        }
    );
}
function viewEmployees() {
    connection.query(
        `SELECT employees.id, 
    employees.first_name, 
    employees.last_name, 
    roles.title, 
    department.name AS department,
    roles.salary, 
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN department ON roles.department_id = department.id
    LEFT JOIN employees manager ON employees.manager_id = manager.id;`,
        (err, res) => {
            if (err) throw err;
            console.table(res);
            main();
        }
    );
}
function addRole() {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw (err)
        console.log(res);
        let roleAdd = inquirer
            .prompt([
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
                    choices: res.map((department) => ({
                        name: department.name,
                        value: department.id,
                    })),
                },
            ])
            .then((data) => {
                // const chosenDept = res.find((department_id) => department_id.name === data.departments);
                console.log(data);
                connection.promise().query("INSERT INTO roles SET ?", {
                    title: data.title,
                    salary: data.salary,
                    department_id: data.department_id,
                }).then(() => {
                    console.log("added");
                    main();
                })
            });
        //   console.log(roleAdd)
    });

}
function addEmployee() {
    connection.query("SELECT * FROM employees", (err, res) => {
        if (err) throw (err)
        // console.log(res);
        let empAdd = inquirer
            .prompt([
                {
                    type: "input",
                    name: "Emp_first_name",
                    message: "What is the employee's first name?",
                },
                {
                    type: "input",
                    name: "Emp_last_name",
                    message: "What is the employee's last name?",
                },
                {
                    type: "input",
                    name: "Emp_role",
                    message: "What is the new employees role?",
                },
                {
                    type: "list",
                    name: "Emp_manager",
                    message: "Who is the employee's manager?",
                    choices: res.map((employees) => ({
                        name: employees.name,
                        value: employees.manager_id,
                    })),
                },
            ])
            .then((data) => {
                // const chosenDept = res.find((department_id) => department_id.name === data.departments);
                console.log(data);
                connection.promise().query("INSERT INTO employees SET ?", {
                    first_name: data.Emp_first_name,
                    last_name: data.Emp_last_name,
                    role_id: data.Emp_role,
                    manager_id: data.Emp_manager,
                }).then(() => {
                    console.log("added")

                    main();
                }).catch(err => console.log(err))
            });
        //   console.log(roleAdd)
    });
}

function updateEmpRole() {
    let allEmployees = connection.promise().query("select * from employees")
    let allRoles = connection.promise().query("select * from roles")
    allEmployees.then((employee)=>{
        let employee_list = employee[0].map((employees) => ({
            name: employees.first_name,
            value: employees.id,
        }))
        // console.log(employee_list)
        allRoles.then((role)=>{
            let roles = role[0].map((role) => ({
                name: role.title,
                value: role.id,
            }))
            console.log(roles)
            inquirer.prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "Select the employee to update?",
                    choices: employee_list
                },
                {
                    type: "list",
                    name: "role",
                    message: "Select the role to assign?",
                    choices: roles
                },
                
            ]).then((data)=>{
                connection.promise().query(`update employees set role_id = ${data.role} where id = ${data.employee}`).then((data,error)=>{
                    if (error) console.log(error)
                    console.log("role updated successfully")
                    console.log(data)
                    main()
                })
            })
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