import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1708775510000 implements MigrationInterface {
    name = 'InitialMigration1708775510000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "workflows" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" varchar NOT NULL,
                "description" text,
                "status" varchar(50) NOT NULL DEFAULT 'draft',
                "metadata" jsonb,
                "encrypted_data" bytea,
                "encryption_iv" bytea,
                "data_classification" varchar(50) NOT NULL DEFAULT 'standard',
                "consent_status" jsonb,
                "data_retention_date" TIMESTAMP WITH TIME ZONE,
                "created_by" uuid NOT NULL,
                "last_accessed_by" uuid,
                "last_accessed_at" TIMESTAMP WITH TIME ZONE,
                "access_history" jsonb,
                "data_region" varchar(50) NOT NULL,
                "cross_border_allowed" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "workflow_nodes" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "workflow_id" uuid NOT NULL,
                "type" varchar(50) NOT NULL,
                "name" varchar NOT NULL,
                "config" jsonb,
                "position" jsonb,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "fk_workflow_nodes_workflow" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE CASCADE
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "workflow_edges" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "workflow_id" uuid NOT NULL,
                "source_node_id" uuid NOT NULL,
                "target_node_id" uuid NOT NULL,
                "condition" jsonb,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "fk_workflow_edges_workflow" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE CASCADE,
                CONSTRAINT "fk_workflow_edges_source" FOREIGN KEY ("source_node_id") REFERENCES "workflow_nodes"("id") ON DELETE CASCADE,
                CONSTRAINT "fk_workflow_edges_target" FOREIGN KEY ("target_node_id") REFERENCES "workflow_nodes"("id") ON DELETE CASCADE
            )
        `);

        await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "workflow_edges"`);
        await queryRunner.query(`DROP TABLE "workflow_nodes"`);
        await queryRunner.query(`DROP TABLE "workflows"`);
    }
}
