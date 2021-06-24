import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAppointmentsProvidersTransports1617669642967
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "appointments_providers_transports",
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
            name: "appointment_id",
            type: "uuid",
          },
          {
            name: "transport_id",
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
            name: "FKProvidersAppointmentsTransports",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["provider_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
          {
            name: "FKAppointmentsProvidersTransports",
            referencedTableName: "appointments",
            referencedColumnNames: ["id"],
            columnNames: ["appointment_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
          {
            name: "FKTransportsAppointmentsProviders",
            referencedTableName: "transports",
            referencedColumnNames: ["id"],
            columnNames: ["transport_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("appointments_providers_transports");
  }
}
