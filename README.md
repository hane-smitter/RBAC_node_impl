# Role Based Access Control implementation

This repository is an implementation of Role-Based Access Control (RBAC) in a web application to ensure access to specific resources are restricted to authorized users based on their assigned roles.

This repo guides on developing a scalable Role-Based Access Control(RBAC) system to manage user permissions. Access rights are assigned to users based on roles(not directly to individual users). That is: Permissions are assigned to roles, inturn, these roles are assigned to users.

<!-- 

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
