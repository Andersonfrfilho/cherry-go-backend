import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsersPhones1617477675034 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users_phones",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "user_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "phone_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "active",
            type: "boolean",
            default: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "deleted_at",
            type: "timestamp",
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: "FKUsersPhones",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["user_id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
          {
            name: "FKPhonesUsers",
            referencedTableName: "phones",
            referencedColumnNames: ["id"],
            columnNames: ["phone_id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
        indices: [
          {
            columnNames: ["user_id", "phone_id"],
            isUnique: true,
          },
        ],
      })
    );
    // await queryRunner.createIndex(
    //   "phones",
    //   new TableIndex({
    //     name: "index_phone_with_country_code_ddd_id_user",
    //     columnNames: ["country_code", "ddd", "number"],
    //     isUnique: true,
    //   })
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users_phones");
  }
}
