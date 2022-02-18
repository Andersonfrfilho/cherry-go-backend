import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProvidersTransportAcceptType1624409789268
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "providers_transports_types",
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
            name: "transport_type_id",
            type: "uuid",
          },
          {
            name: "active",
            type: "boolean",
          },
          {
            name: "details",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "amount",
            type: "float8",
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
            name: "FKProviderTransportsTypes",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["provider_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
          {
            name: "FKTransportsTypesProvider",
            referencedTableName: "transports_types",
            referencedColumnNames: ["id"],
            columnNames: ["transport_type_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("providers_transports_types");
  }
}
