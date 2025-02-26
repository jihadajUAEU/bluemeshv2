import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddWorkflowExecution1708775520000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("workflows", [
            new TableColumn({
                name: "execution_status",
                type: "enum",
                enum: ["not_started", "running", "completed", "failed", "cancelled"],
                default: "'not_started'",
                isNullable: false
            }),
            new TableColumn({
                name: "current_phase",
                type: "varchar",
                isNullable: true
            }),
            new TableColumn({
                name: "execution_progress",
                type: "float",
                isNullable: true
            }),
            new TableColumn({
                name: "last_status_message",
                type: "text",
                isNullable: true
            }),
            new TableColumn({
                name: "last_executed_at",
                type: "timestamp",
                isNullable: true
            }),
            new TableColumn({
                name: "last_executed_by",
                type: "varchar",
                isNullable: true
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns("workflows", [
            "execution_status",
            "current_phase",
            "execution_progress",
            "last_status_message",
            "last_executed_at",
            "last_executed_by"
        ]);
    }
}
