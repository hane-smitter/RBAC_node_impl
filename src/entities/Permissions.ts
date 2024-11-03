import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  Unique,
} from "typeorm";
import { Roles } from "./Roles";

@Entity()
@Unique(["name"])
export class Permissions {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  // This column will be auto filled with MySQL trigger
  // refer; `migrations/1729947215244-CreatePermissionsTrigger.ts`
  @Column({ type: "bigint", unique: true })
  serial_id!: string;

  @Column({ type: "text" })
  description!: string;

  @ManyToMany(() => Roles, (roles) => roles.permissions, {
    onDelete:"CASCADE"
  })
  roles!: Roles[];
}
