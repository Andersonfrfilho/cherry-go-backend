import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAppointmentsClients1617669642961
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "appointments_clients",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "client_id",
            type: "uuid",
          },
          {
            name: "appointment_id",
            type: "uuid",
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
            name: "FKAppointmentsClients",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["client_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
          {
            name: "FKClientsAppointments",
            referencedTableName: "appointments",
            referencedColumnNames: ["id"],
            columnNames: ["appointment_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("appointments_clients");
  }
}
