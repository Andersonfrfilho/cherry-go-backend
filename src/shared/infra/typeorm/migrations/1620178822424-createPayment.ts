import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePayment1620178822424 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "payment",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "current_value",
            type: "varchar",
          },
          {
            name: "type_id",
            type: "uuid",
          },
          {
            name: "origin_value",
            type: "varchar",
          },
          {
            name: "discount",
            type: "varchar",
          },
          {
            name: "increment",
            type: "varchar",
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
            name: "FKPaymentType",
            referencedTableName: "payment_types",
            referencedColumnNames: ["id"],
            columnNames: ["type_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("payment");
  }
}
