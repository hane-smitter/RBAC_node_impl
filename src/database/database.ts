import { DataSourceOptions } from "typeorm";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import CustomDataSource from "./CustomDataSource";

export type MysqlOptions = Extract<DataSourceOptions, MysqlConnectionOptions>;
export type MySqlDbConfig = Pick<
  MysqlOptions,
  "username" | "password" | "host" | "port" | "database"
>;
const mySqldbConfigs: MySqlDbConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? "3306"),
  database: "RBAC_impl",
};

export const AppDataSource = new CustomDataSource({
  type: "mysql",
  host: mySqldbConfigs.host,
  port: mySqldbConfigs.port,
  username: mySqldbConfigs.username,
  password: mySqldbConfigs.password,
  database: mySqldbConfigs.database,
  entities: ["dist/entities/**/*.js"],
  synchronize: process.env.NODE_ENV !== "production",
  // logging: true,
  migrations: ["dist/migrations/*.js"],
});
