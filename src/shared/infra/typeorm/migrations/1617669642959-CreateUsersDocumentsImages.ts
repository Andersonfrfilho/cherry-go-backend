import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsersDocumentsImages1617669642959
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users_documents_images",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "user_id",
            type: "uuid",
          },
          {
            name: "image_id",
            type: "uuid",
          },
          {
            name: "value",
            type: "varchar",
          },
          {
            name: "description",
            type: "varchar",
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
            name: "FKDocumentsImages",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["user_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
          {
            name: "FKImagesDocuments",
            referencedTableName: "images",
            referencedColumnNames: ["id"],
            columnNames: ["image_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
        ],
        indices: [{ columnNames: ["user_id", "value"], isUnique: true }],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users_documents_images");
  }
}
