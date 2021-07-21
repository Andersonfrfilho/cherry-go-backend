import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProvidersPaymentsTypes1617669642951
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "providers_payments_types",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "provider_id",
            type: "uuid",
          },
          {
            name: "payment_type_id",
            type: "uuid",
          },
          {
            name: "active",
            type: "boolean",
            default: true,
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
            name: "FKUserPaymentType",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["provider_id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
          {
            name: "FKPaymentTypeUser",
            referencedTableName: "payments_types",
            referencedColumnNames: ["id"],
            columnNames: ["payment_type_id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
        indices: [
          {
            columnNames: ["provider_id", "payment_type_id"],
            isUnique: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("providers_payments_types");
  }
}
