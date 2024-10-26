import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePermissionsTrigger1729947215244
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELIMITER //

        CREATE TRIGGER set_unique_permission_number BEFORE INSERT ON permissions
        FOR EACH ROW
        BEGIN
        DECLARE max_value BIGINT;
        
        -- Find the current largest power of 2 in the column
        SELECT COALESCE(MAX(serial_id), 1) INTO max_value FROM permissions;
        
        -- Set the new value to the next power of 2
        SET NEW.serial_id = max_value * 2;
        
        END //

        DELIMITER ;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the trigger, function, and log table if we roll back this migration
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS set_unique_permission_number ON permissions;`
    );
    // await queryRunner.query(`DROP FUNCTION IF EXISTS log_user_changes;`);
    // await queryRunner.query(`DROP TABLE IF EXISTS user_changes;`);
  }
}
