# Employee Tracker

# Description
The Employee Tracker is a command-line application that allows business owners and managers to efficiently track and manage their employees, roles, and departments using a PostgreSQL database.

# Walkthrough Video

## Table of Contents
Installation 
Usage
Features
Technologies Used
Database Schema
Future Enhancements
License
Author

# Installation
Clone the repositor
'''sh
git clone git@github.com:lindsey078/challenge10.git
cd challenge10

Install Dependencies: npm install

Set up PostgreSQL Database: CREATE DATABASE employee_tracker;
Load the schema: psal -U your_postgres_user -d employee_tracker -f schema.sql

Configure Environment Variables:
Create a .env file in the root directory and add: 

DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password

#Start the Application
node index.js

Available Actions
View Departments: Displays a table of all company departments.
View Roles: Lists all job roles, associated departments, and salaries.
View Employees: Shows all employees along with their roles, salaries, and managers.
Add a Department: Creates a new department.
Add a Role: Adds a job role with salary and department.
Add an Employee: Adds an employee with their role and manager.
Update Employee Role: Updates an employee's job role.

# Technologies Used
Node.js (JavaScript runtime)
Inquirer.js (CLI interactions)
PostgreSQL (Relational database)
pg package (PostgreSQL client for Node.js)
dotenv (Environment variable management)

# Database Schema
The database consists of three tables:

department

id (Primary Key)
name (Department Name)
role

id (Primary Key)
title (Job Title)
salary (Decimal)
department_id (Foreign Key)
employee

id (Primary Key)
first_name
last_name
role_id (Foreign Key)
manager_id (Foreign Key, nullable)
