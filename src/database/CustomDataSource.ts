import { DataSource, DataSourceOptions } from "typeorm";
import type { MysqlOptions, MySqlDbConfig } from "./database";

// type Mutable<T> = {
//   -readonly [P in keyof T]: T[P] extends readonly any[]
//     ? Mutable<T[P][number]>[]
//     : T[P] extends object
//     ? Mutable<T[P]>
//     : T[P];
// };
class CustomDataSource extends DataSource {
  #dbInitOpt: DataSourceOptions;

  constructor(options: DataSourceOptions) {
    super(options);
    this.#dbInitOpt = options;
  }

  async initialize(): Promise<this> {
    if (this.#dbInitOpt.type === "mysql" || this.#dbInitOpt.type === "mariadb")
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

export default CustomDataSource;
