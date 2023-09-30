# MEAN Stack Posting App

## Introduction
Welcome to the documentation for our MEAN (MongoDB, Express.js, Angular, Node.js) stack Post Posting App. This application allows users to create, read, update, and delete posts. It features authentication and authorization, pagination, and uses both template-driven and reactive forms for input. This documentation provides an overview of the application's architecture, features, dependencies, and known issues.


<br />

## Table of Contents
* [Application Architecture](https://github.com/umangutkarsh/myPosts-app/tree/main#application-architecture)
* [Features](https://github.com/umangutkarsh/myPosts-app/tree/main#features)
* [Dependencies](https://github.com/umangutkarsh/myPosts-app/tree/main#dependencies)
* [Known Issues](https://github.com/umangutkarsh/myPosts-app/tree/main#known-issues)
  

<br />

## Application Architecture
* Frontend (Angular)
  * **Angular:** The frontend of the application is built using Angular. Angular is a powerful and popular framework for building web applications.

* Backend (Node.js and Express.js)
  * **Node.js:** The server-side logic of the application is powered by Node.js, a JavaScript runtime.
  * **Express.js:** Express is used as the backend framework to build robust and scalable APIs.
  * **MongoDB:** MongoDB is used as the NoSQL database to store posts and user data.
  * **Mongoose:** Mongoose is an elegant MongoDB object modeling tool used to interact with the database.
  * **bcrypt:** This library is used for password hashing and securing user data.
  * **jsonwebtoken (JWT):** JWT is employed for user authentication and authorization.
  * **body-parser:** Body-parser is used to parse incoming request bodies in the middleware.
  * **RxJS:** RxJS is used to handle asynchronous operations and data streams in Angular.

* Frontend Styling
  * **Angular Material:** Angular Material is used for creating a sleek and responsive user interface.


<br />

## Features
* Authentication and Authorization: Users can sign up, log in, and log out. Only authorized users can create, update, or delete posts.

* Pagination: Posts are paginated, ensuring a smoother browsing experience when there are many posts.

* Two Types of Forms: The application uses both template-driven and reactive forms to handle user input.

* Post Actions: Users can create, read, update, and delete their posts.


<br />

## Dependencies
Here is a list of the key dependencies used in this application:

* Angular: Frontend framework.
* Angular Material: UI components.
* RxJS: Handling asynchronous operations.
* Node.js: Server runtime.
* Express.js: Backend framework.
* MongoDB: NoSQL database.
* Mongoose: MongoDB object modeling tool.
* bcrypt: Password hashing library.
* jsonwebtoken (JWT): Authentication and authorization.
* body-parser: Parsing request bodies.

<br />


## Known Issues
While our MEAN Stack Post Posting App is functional and secure, there are some known issues:

* Deletion Issues: In some cases, users may encounter issues when deleting posts. We are actively working on resolving this issue.
* Deployment Pending: The application is currently only available for local development. Deployment to a production server is pending.

