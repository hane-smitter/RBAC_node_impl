import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  Unique,
} from "typeorm";
import { User } from "./User";
import { Permission } from "./Permission";

@Entity({ name: "roles" })
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @ManyToMany(() => User, (user) => user.roles)
  users!: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    onDelete: "CASCADE",
  })
  @JoinTable({ name: "roles_permissions" })
  permissions!: Permission[];
}
