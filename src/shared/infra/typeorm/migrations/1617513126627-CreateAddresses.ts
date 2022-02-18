import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAddresses1617513126627 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "addresses",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "street",
            type: "varchar",
          },
          {
            name: "number",
            type: "varchar",
          },
          {
            name: "zipcode",
            type: "varchar",
          },
          {
            name: "district",
            type: "varchar",
          },
          {
            name: "city",
            type: "varchar",
          },
          {
            name: "state",
            type: "varchar",
          },
          {
            name: "country",
            type: "varchar",
          },
          {
            name: "longitude",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "latitude",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "complement",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "reference",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "details",
            type: "jsonb",
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
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("addresses");
  }
}
