import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePhones1617477675033 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "phones",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "country_code",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "ddd",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "number",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "user_id",
            type: "uuid",
            isNullable: false,
            isUnique: true,
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
            name: "FKUserPhone",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["user_id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
        indices: [
          {
            columnNames: ["country_code", "ddd", "number"],
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
    await queryRunner.dropTable("phones");
  }
}
