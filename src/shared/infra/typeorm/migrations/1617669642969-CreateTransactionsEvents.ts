import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTransactionsEvents1617669642969
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "transactions_events",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "transaction_id",
            type: "uuid",
          },
          {
            name: "status",
            type: "varchar",
          },
          {
            name: "amount",
            type: "varchar",
          },
          {
            name: "payment_type_id",
            type: "uuid",
          },
          {
            name: "details",
            type: "varchar",
            isNullable: true,
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
            name: "FKTransactionsEventsPaymentType",
            referencedTableName: "transactions",
            referencedColumnNames: ["id"],
            columnNames: ["transaction_id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
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
    await queryRunner.dropTable("transactions_events");
  }
}
