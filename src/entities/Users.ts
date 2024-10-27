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
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  age!: number;

  @ManyToMany(() => Roles, (roles) => roles.users)
  @JoinTable({ name: "users_roles" })
  roles!: Roles[];
}
