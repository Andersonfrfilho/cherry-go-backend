import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { DAYS_WEEK } from "@modules/accounts/enums/DaysProviders.enum";

export class CreateProvidersAvailabilityWeek1623717319841
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "providers_availabilities_days",
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
            name: "day",
            type: "enum",
            enum: Array.from(
              { length: Object.keys(DAYS_WEEK).length },
              (_, index): DAYS_WEEK => Object.values(DAYS_WEEK)[index]
            ),
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
            name: "FKProviderAvailabilityTime",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["provider_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("providers_availability_day");
  }
}
