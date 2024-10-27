import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
} from "typeorm";
import { Roles } from "./Roles";

@Entity()
export class Permissions extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  // This column will be auto filled with MySQL trigger
  // refer; `migrations/1729947215244-CreatePermissionsTrigger.ts`
  @Column({ type: "bigint", unique: true })
  serial_id!: string;

  @Column({ type: "text" })
  description!: string;

  @ManyToMany(() => Roles, (roles) => roles.permissions)
  roles!: Roles[];
}
