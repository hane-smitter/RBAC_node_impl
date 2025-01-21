import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Role } from "./Role";

@Entity({ name: "users" })
export class User {
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

  @ManyToMany(() => Role, (role) => role.users, { onDelete: "CASCADE" })
  @JoinTable({ name: "users_roles" })
  roles!: Role[];
}
