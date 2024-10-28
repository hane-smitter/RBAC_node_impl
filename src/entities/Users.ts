import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Roles } from "./Roles";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  age!: number;

  // @Column()
  // email!: number;

  @ManyToMany(() => Roles, (roles) => roles.users)
  @JoinTable({ name: "users_roles" })
  roles!: Roles[];
}
