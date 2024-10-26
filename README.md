# RBAC System

This repo guides on developing a scalable Role-Based Access Control(RBAC) system to manage user permissions. Access rights are assigned to users based on roles(not directly to individual users). That is: Permissions are assigned to roles, inturn, these roles are assigned to users.

<!-- 

### Creating a new migration(Purpose is for permissions table to generate a new permission number which is a power of 2)
    For this, in terminal you run: `npx typeorm migration:create src/migrations/CreatePermissionsTrigger`.
    To run migrations: `npx typeorm migration:run`
 -->
