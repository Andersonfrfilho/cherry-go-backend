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
            type: "bigint",
            default: 0,
          },
          {
            name: "original_amount",
            type: "bigint",
            default: 0,
          },
          {
            name: "increment_amount",
            type: "bigint",
            default: 0,
          },
          {
            name: "discount_amount",
            type: "bigint",
            default: 0,
          },
          {
            name: "appointment_id",
            type: "uuid",
          },
          {
            name: "client_id",
            type: "uuid",
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
        foreignKeys: [
          {
            name: "FKAppointmentClientsTransactions",
            referencedTableName: "appointments",
            referencedColumnNames: ["id"],
            columnNames: ["appointment_id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
          {
            name: "FKClientsTransactionsAppointment",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["client_id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("transactions");
  }
}
