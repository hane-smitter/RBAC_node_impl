import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
  Unique,
} from "typeorm";
import { Users } from "./Users";
import { Permissions } from "./Permissions";

@Entity()
@Unique(["name"])
export class Roles extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @ManyToMany(() => Users, (users) => users.roles)
  users!: Users[];

  @ManyToMany(() => Permissions, (permissions) => permissions.roles, {
    cascade: true,
  })
  @JoinTable({ name: "roles_permissions" })
  permissions!: Permissions[];
}
