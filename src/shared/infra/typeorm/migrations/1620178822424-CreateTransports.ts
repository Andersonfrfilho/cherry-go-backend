import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTransports1620178822424 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "transports",
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
            name: "amount",
            type: "varchar",
          },
          {
            name: "origin_address_id",
            type: "uuid",
          },
          {
            name: "destination_address_id",
            type: "uuid",
          },
          {
            name: "confirm",
            type: "boolean",
          },
          {
            name: "initial_hour",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "departure_time",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "arrival_time_destination",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "arrival_time_return",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "return_time",
            type: "timestamp",
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
            name: "FKTypesTransports",
            referencedTableName: "transports_types",
            referencedColumnNames: ["id"],
            columnNames: ["transport_type_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
          {
            name: "FKOriginAddressesTransports",
            referencedTableName: "addresses",
            referencedColumnNames: ["id"],
            columnNames: ["origin_address_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
          {
            name: "FKDestinationAddressesTransports",
            referencedTableName: "addresses",
            referencedColumnNames: ["id"],
            columnNames: ["destination_address_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("transports");
  }
}
