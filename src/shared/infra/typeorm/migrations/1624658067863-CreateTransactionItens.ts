import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTransactionItens1624658067863 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "transactions_itens",
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
            name: "elements",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "reference_key",
            type: "uuid",
          },
          {
            name: "type",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "increment_amount",
            type: "bigint",
            isNullable: true,
          },
          {
            name: "discount_amount",
            type: "bigint",
            isNullable: true,
          },
          {
            name: "value",
            type: "bigint",
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
            name: "FKTransactionsItens",
            referencedTableName: "transactions",
            referencedColumnNames: ["id"],
            columnNames: ["transaction_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("transactions_itens");
  }
}
