import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePermissionsTrigger1729947215244
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        -- Statements are executed individually, so no need of 'DELIMITER //'
        CREATE TRIGGER set_permission_unique_id BEFORE INSERT ON permissions
        FOR EACH ROW
        BEGIN
        DECLARE max_value BIGINT;
        
        -- Find the current largest power of 2 in the column
        SELECT COALESCE(MAX(serial_id), 1) INTO max_value FROM permissions;
        
        -- Check if max_value is 1 (initial insert)
        IF max_value = 1 THEN
          SET NEW.serial_id = 1;
        ELSE
          -- Set the new value to the next power of 2
          SET NEW.serial_id = max_value * 2;
        END IF;
        
        END;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the trigger, function, and log table if we roll back this migration
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS set_permission_unique_id;`
    );
  }
}
