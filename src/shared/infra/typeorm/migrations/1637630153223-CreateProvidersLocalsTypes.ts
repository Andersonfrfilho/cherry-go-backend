import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProvidersLocalsTypes1637630153223
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "providers_locals_types",
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
            name: "local_type",
            type: "varchar",
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
            name: "FKProviderLocalsTypes",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["provider_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
        ],
        indices: [
          {
            columnNames: ["provider_id", "local_type"],
            isUnique: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("providers_locals_types");
  }
}
