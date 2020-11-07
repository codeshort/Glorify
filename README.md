# Project Name:-

## Glorify

# About Project:-
## Objective
 The website helps company to glorify their work culture by bringing all employees under one  umbrella .
## Sign Up/LogIn
Any employee first needs to create an account on the website by signing up. Then after login the employee would be directed again to home page but this time with options of viewing profile, joining a company or hosting a company. 

## Profile Page
The profile page will contain all information about the rewards and badges received and given by the person. 
The status of tasks assigned to the employee will also be present in profile page.
## Hosting a Company
Registration of the company has to be done by HR and then **a code would be generated**. Now employees can join the company portal using company code and company name . 
## Joining a Company
After joining the company they will be redirected to a post page where the employees can post to appreciate someone. The post page will also contain **leader-board** of all the employees of the company.
## Project Tracking
From their profile page users can keep a track of their project. **Any task can be assigned to an employee by another employee based on their hierarchy level**.

**Any project will have one of the three status-To do, Working or Done.**
- If the task is yet to be started the employee can add task in the *To do* section. 
- If the task has been started but not yet completed the employee can add task in the *Working* section. 
- If the task has been completed the employee can add task in the *Done* section.
### Explaining Feature for Project Tracking

**In To Do section every task will have three buttons.**
- One button can be used to *push the task to **Working section.***
- Second button can be used to *push the task to **Done section.*** 
- and, third button can be used to **delete task**.

**In Working section every task will have three buttons.**
- One button can be used to *push the task to **To Do section***. 
- Second button can be used to *push the task to **Done section***
- and, third button can be used to **delete task**.

**In Done section every task will have four buttons.**
- One button can be used to *push the task to **To-do section.***
- Second button can be used to *push the task to **Working section,***
- third button can be used to **delete task**
 - And,
- ***There will be a fourth button that can be used to send a mail about completion of task.Tasks in done section will contain a send-mail button. On clicking this button a mail would be sent automatically to the person who has assigned the task and he/she will be informed that the task is completed.***


## Functionalities:-
- •	Allows employees to keep records of their to do, working and done tasks along with the date at which task was assigned.
- •	Allows employees to give rewards or badges to each other.(Note:-Only an employee having higher or equal hierarchy to other one can give rewards or badges to him/her.)
- •	Allows employees to upload posts on company page and improve communication with each other
 
## Tech-Stack:-
**nodejs
mongodb
express
mongoose
bootstrap
Sendgrid API
Mongo DB Clutser
Geo Location API
HandleBars**

## Routes:-

- **\** :- For signup

- **\login** :- For login
- **\after_login** :- For home page
- **\join** :- For joining a company
- **\company** :- For hosting a company
- **\profile\:id** :- For opening profile of the person having id equal to id passed in the route.
- **\post** :- For opening the post page of a company.
- **\search** :- For opening a search page where employees can search other employees.


## APIs Used:-
- 	A sendgrid API key is used for sending mails.
- 	MongoDB cluster connection string is required to connect to online database.


## Setting up project on your machine
   - Clone the project
   - Install the packages
         
    
- 	Open command prompt
- 	Change the current directory to Glorify using command "cd dirName"
- 	Then use the following command to install packages "npm install"

   Running the project:-
- 	Open command prompt
- 	Change the current directory to Glorify using command "cd dirName"
- 	Type nodemon app.js
- 	Open browser
- 	Enter url localhost:3000/
- 	Now you can explore the functionalities of project


## How to run the web application:-
- **Use a browser and visit the link:- https://glorify.herokuapp.com/**
- **complete signup and login and then you are good to explore the website.**
## For details refer to this video on how to use the app:- https://youtu.be/k2NWW0Gt9P4

## Targeted towards:-
-	It will benefit organisations in improving their work culture by bringing the employees together.
-	The badges and reward system would increase confidence level in employees and will keep       them motivated
-	Keeping track of their tasks would help employee in better office management



