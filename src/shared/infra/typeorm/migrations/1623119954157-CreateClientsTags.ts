import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsersTags1623119954157 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "clients_tags",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "tag_id",
            type: "uuid",
          },
          {
            name: "client_id",
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
            name: "FKTagsClients",
            referencedTableName: "tags",
            referencedColumnNames: ["id"],
            columnNames: ["tag_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
          {
            name: "FKClientsTags",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["client_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
        ],
        indices: [{ columnNames: ["tag_id", "client_id"], isUnique: true }],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("clients_tags");
  }
}
