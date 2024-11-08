import { DataSource, DataSourceOptions } from "typeorm";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";

type MysqlOptions = Extract<DataSourceOptions, MysqlConnectionOptions>;
type MySqlDbConfig = Pick<
  MysqlOptions,
  "username" | "password" | "host" | "port" | "database"
>;
// type Mutable<T> = {
//   -readonly [P in keyof T]: T[P] extends readonly any[]
//     ? Mutable<T[P][number]>[]
//     : T[P] extends object
//     ? Mutable<T[P]>
//     : T[P];
// };

export class CustomDataSource extends DataSource {
  #dbInitOpt: DataSourceOptions;

  constructor(options: DataSourceOptions) {
    super(options);
    this.#dbInitOpt = options;
  }

  async initialize(): Promise<this> {
    if (
      this.#dbInitOpt.type === "mysql" ||
      this.#dbInitOpt.type === "mariadb" ||
      this.#dbInitOpt.type === "postgres"
    )
      await this.#createDBIfNotExist(this.#dbInitOpt as MysqlOptions);

    // Call the original initialize function
    await super.initialize();

    return this;
  }

  #createDBIfNotExist(dbOpts: MysqlOptions) {
    return new Promise<void>((resolve, reject) => {
      const dbName = dbOpts.database;
      if (!dbName) {
        resolve();
      }

      const dbInitConfigs = this.#dbInitOpt as MysqlOptions;
      type GeneralMysqlCfg = Pick<MysqlOptions, keyof MySqlDbConfig | "type">;
      // type MutableMysqlOpts = Mutable<GeneralMysqlCfg>;

      // We do not include `database`, to allow to create a connection and create DB(if it DOES NOT exist)
      const preInitConfigs: GeneralMysqlCfg = {
        type: dbInitConfigs.type,
        username: dbInitConfigs.username,
        host: dbInitConfigs.host,
        password: dbInitConfigs.password,
        port: dbInitConfigs.port,
      };
      const dbPreInitialization = new DataSource({ ...preInitConfigs });

      try {
        // Initialize the temporary connection
        dbPreInitialization.initialize().then(async () => {
          // Create database if it doesn't exist
          await dbPreInitialization.query(
            `CREATE DATABASE IF NOT EXISTS ${dbName}`
          );

          // Close temporary connection
          await dbPreInitialization.destroy();

          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

const mySqldbConfigs: MySqlDbConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
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
  logging: true,
  migrations: ["dist/migrations/*.js"],
});
