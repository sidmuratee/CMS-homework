-- drop database...
DROP DATABASE IF EXISTS employeeRecords_db;
CREATE DATABASE employeeRecords_db;

USE employeeRecords_db;

CREATE TABLE department (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR (30) NOT NULL);

CREATE TABLE roles (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(30) NOT NULL,
salary DECIMAL,
department_id INT,
FOREIGN KEY (department_id)
REFERENCES department(id)
ON DELETE SET NULL
);

CREATE TABLE employees (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT,
FOREIGN KEY (role_id)
REFERENCES roles(id)
ON DELETE CASCADE,
FOREIGN KEY (manager_id)
REFERENCES employees(id)
ON DELETE SET NULL
);

INSERT INTO department (name)
VALUES ("Executives"),
       ("Development"),
       ("Sales"),
	   ("Customer Service");
       
       
INSERT INTO roles (title, salary, department_id)
VALUES ("CEO", 200000, 1),
	   ("Vice President", 150000, 1),
       ("Training Manager", 65000, 2),
       ("Sales Rep", 60000, 3),
       ("CS Rep", 50000, 4);
       
       
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Meyton", "Panning", 1, null),
	   ("Bom", "Trady", 2, 1),
       ("Wurt", "Karner", 3, 2),
       ("Rony", "Tomo", 3, 2),
       ("Pak", "Drescott", 5, 3),
       ("Raron", "Aodgers", 4, 3);
       
SELECT * FROM employeeRecords_db.department;
SELECT * FROM employeeRecords_db.roles;
SELECT * FROM employeeRecords_db.employees;