import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  Unique,
} from "typeorm";
import { Users } from "./Users";
import { Permissions } from "./Permissions";

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @ManyToMany(() => Users, (users) => users.roles)
  users!: Users[];

  @ManyToMany(() => Permissions, (permissions) => permissions.roles, {
    onDelete: "CASCADE",
  })
  @JoinTable({ name: "roles_permissions" })
  permissions!: Permissions[];
}
