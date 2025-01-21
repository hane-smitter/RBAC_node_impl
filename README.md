# Role-based Access Control implementation

**Role-based Access Control**(RBAC) is a security mechanism used in software systems to manage and restrict _access_ to resources according to predefined _role(s)_ assigned to _users_ of the system.

<!-- <br />Specific permissions are grouped under _roles_. Inturn, these roles are assigned to users. This approach makes permission assignment manageable by eliminating assignment of permissions directly to individuals; which could result in a high number of assignments. -->

## Getting started

This repository provides an implementation of Role-Based Access Control(RBAC) to secure a RESTful API by protecting resources from unauthorized access. It ensures that only authorized users—those with the required permissions for a specific resource—can gain access.  
_JSON_ serves as the representational format for the endpoints, facilitating seamless integration with front-end applications, whether web, mobile, or other platforms.

> **Note:** Users referred here are database-seeded. Scope of this repo is narrowed to focus on RBAC implementation. User signup and login is not covered here. If this is a feature you would like to build on top, this [repo](https://github.com/hane-smitter/MERN_login_system) is a meticulous guide with all features of a typical User Authentication, such as sign up, login, password reset, ....

Typescript is extensively used for strong type-safety.  
Project is open for suggestions, Bug reports and pull requests.

### Technologies used

- Typescript
- Node.js with [Express](https://expressjs.com/) framework
- [TypeORM](https://typeorm.io/) as ORM with MySQL as the database.

### How to run

Ensure you have [Node.js](https://nodejs.org/en/download) and [MySQL](https://www.mysql.com/downloads/) installed on the platform you wish to run this project. Node.js **v18.11+** is recommended.

1. #### Clone this repository

   Clone the project into your local computer:

   ```bash
   git clone https://github.com/hane-smitter/RBAC_node_impl.git
   ```

1. #### Install dependencies

   Change into directory with the project and run:

   ```bash
   npm install
   ```

1. #### Set up environment variables

   Copy `.env.example` file into a new file with the name: `.env`. The command in Linux:

   ```bash
   cp .env.example .env
   ```

   You should have the following variables:

   ```.env
   DB_USER=
   DB_PASS=
   DB_HOST=
   DB_PORT=
   SERVER_PORT=
   ```

   `DB_USER` - Is the database user name, e.g <i>root</i>  
   `DB_PASS` - Is the password of the database. Leave empty if no password is needed.  
   `DB_HOST` - Is the host of the database. If you have installed MySQL locally, this should be `127.0.0.1`.  
   `DB_PORT` - Is the port the database engine is listening to. MySQL default port is `3306`. If it is modified, just ensure you provide it here.  
   `SERVER_PORT` - Is the port our server will listen to when application is run. If left empty, it defaults to `3000`.

   In the `.env`, provide the values for these variables.

1. #### Seed users

   API routes are protected. Home(`/`) route is the only exception. You need to be a user with a role—that has the required permissions for a particular resource—to gain access.

   To seed users with assigned roles, run:

   ```bash
   npm run seed
   ```

   The following users with asssigned roles will be created:

   | firstName  | lastName  | role        |
   | ---------- | --------- | ----------- |
   | Hakuna     | Matata    | Super Admin |
   | Cinderella | Mitchell  | Manager     |
   | Malik      | Tembo     | Admin       |
   | John       | Doe       | User        |
   | Linda      | Okello    | Guest       |
   | Eva        | Stephanie | Guest       |

   The image below shows permissions under each role:
   <figure>
      <img src="https://raw.githubusercontent.com/hane-smitter/RBAC_node_impl/refs/heads/assets/role_permissions.jpg" width="700" >
      <figcaption>Roles with their permissions.</figcaption>
   </figure>

<!--

-> Role permissions Image URL: https://raw.githubusercontent.com/hane-smitter/RBAC_node_impl/refs/heads/assets/role_permissions.jpg

### Creating a new migration(Purpose is for permissions table to generate a new permission number which is a power of 2)
    For this, in terminal you run: `npx typeorm migration:create src/migrations/CreatePermissionsTrigger`.
    To run migrations: `npx typeorm migration:run`

    CONSIDERATION TO PICK POINT/BULLETS

    # Role-Based Access Control (RBAC) Implementation

A secure and scalable implementation of Role-Based Access Control in a web application using Express.js and MySQL. This system manages user permissions through a hierarchical role structure, enabling fine-grained access control across different resources and operations.

## Key Features

- **Granular Permission Control**: Manage user access through bitwise operations for efficient permission checking
- **Hierarchical Role Structure**: Define roles with inherited permissions for streamlined access management
- **RESTful API Integration**: Secure API endpoints with middleware-based permission validation
- **MySQL Database**: Robust data model for managing users, roles, and permissions relationships
- **Performance Optimized**: Efficient permission checks using bitwise operations instead of multiple database queries

## Use Cases

- User management systems requiring different access levels
- Content Management Systems (CMS) with editorial workflows
- Enterprise applications with department-specific access requirements
- Multi-tenant applications requiring role isolation
 -->
