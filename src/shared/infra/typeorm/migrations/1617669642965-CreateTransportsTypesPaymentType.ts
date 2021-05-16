import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTransportsTypes1617669642965 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "transports_types_payments_types",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "transport_type_id",
            type: "uuid",
          },
          {
            name: "payment_type_id",
            type: "uuid",
          },
          {
            name: "active",
            type: "boolean",
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
            name: "FKTransportsTypePaymentsTypes",
            referencedTableName: "transports_types",
            referencedColumnNames: ["id"],
            columnNames: ["transport_type_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
          {
            name: "FKPaymentsTypesTransportsType",
            referencedTableName: "payments_types",
            referencedColumnNames: ["id"],
            columnNames: ["payment_type_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("transports_types");
  }
}
