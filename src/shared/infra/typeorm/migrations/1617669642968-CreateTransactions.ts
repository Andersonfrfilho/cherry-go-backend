import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTransactions1617669642968 implements MigrationInterface {
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
            name: "current_amount",
            type: "varchar",
          },
          {
            name: "original_amount",
            type: "varchar",
          },
          {
            name: "increment_amount",
            type: "varchar",
          },
          {
            name: "discount_amount",
            type: "varchar",
          },
          {
            name: "status",
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
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("transactions");
  }
}
