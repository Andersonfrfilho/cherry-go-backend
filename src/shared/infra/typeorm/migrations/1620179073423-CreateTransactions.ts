import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTransactions1620179073423 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "transactions",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "original_amount",
            type: "varchar",
          },
          {
            name: "current_amount",
            type: "varchar",
          },
          {
            name: "discount_amount",
            type: "varchar",
          },
          {
            name: "payment_type_id",
            type: "uuid",
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
    await queryRunner.dropTable("transactions");
  }
}
