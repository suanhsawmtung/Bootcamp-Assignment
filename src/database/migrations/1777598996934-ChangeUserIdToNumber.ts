import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUserIdToNumber1777598996934 implements MigrationInterface {
    name = 'ChangeUserIdToNumber1777598996934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx_reservations_status"`);
        await queryRunner.query(`CREATE TABLE "temporary_reservations" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" varchar NOT NULL, "ticketId" integer NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','COMPLETED','EXPIRED','CANCELLED') ) NOT NULL DEFAULT ('PENDING'), "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "FK_d7dbf48ad681965ca77e3cbde13" FOREIGN KEY ("ticketId") REFERENCES "tickets" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_reservations"("id", "userId", "ticketId", "status", "expiresAt", "createdAt", "updatedAt") SELECT "id", "userId", "ticketId", "status", "expiresAt", "createdAt", "updatedAt" FROM "reservations"`);
        await queryRunner.query(`DROP TABLE "reservations"`);
        await queryRunner.query(`ALTER TABLE "temporary_reservations" RENAME TO "reservations"`);
        await queryRunner.query(`CREATE INDEX "idx_reservations_status" ON "reservations" ("status") WHERE status = 'PENDING'`);
        await queryRunner.query(`DROP INDEX "idx_reservations_status"`);
        await queryRunner.query(`CREATE TABLE "temporary_reservations" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "ticketId" integer NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','COMPLETED','EXPIRED','CANCELLED') ) NOT NULL DEFAULT ('PENDING'), "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "FK_d7dbf48ad681965ca77e3cbde13" FOREIGN KEY ("ticketId") REFERENCES "tickets" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_reservations"("id", "userId", "ticketId", "status", "expiresAt", "createdAt", "updatedAt") SELECT "id", "userId", "ticketId", "status", "expiresAt", "createdAt", "updatedAt" FROM "reservations"`);
        await queryRunner.query(`DROP TABLE "reservations"`);
        await queryRunner.query(`ALTER TABLE "temporary_reservations" RENAME TO "reservations"`);
        await queryRunner.query(`CREATE INDEX "idx_reservations_status" ON "reservations" ("status") WHERE status = 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx_reservations_status"`);
        await queryRunner.query(`ALTER TABLE "reservations" RENAME TO "temporary_reservations"`);
        await queryRunner.query(`CREATE TABLE "reservations" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" varchar NOT NULL, "ticketId" integer NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','COMPLETED','EXPIRED','CANCELLED') ) NOT NULL DEFAULT ('PENDING'), "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "FK_d7dbf48ad681965ca77e3cbde13" FOREIGN KEY ("ticketId") REFERENCES "tickets" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "reservations"("id", "userId", "ticketId", "status", "expiresAt", "createdAt", "updatedAt") SELECT "id", "userId", "ticketId", "status", "expiresAt", "createdAt", "updatedAt" FROM "temporary_reservations"`);
        await queryRunner.query(`DROP TABLE "temporary_reservations"`);
        await queryRunner.query(`CREATE INDEX "idx_reservations_status" ON "reservations" ("status") WHERE status = 'PENDING'`);
        await queryRunner.query(`DROP INDEX "idx_reservations_status"`);
        await queryRunner.query(`ALTER TABLE "reservations" RENAME TO "temporary_reservations"`);
        await queryRunner.query(`CREATE TABLE "reservations" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" varchar NOT NULL, "ticketId" integer NOT NULL, "status" varchar CHECK( "status" IN ('PENDING','COMPLETED','EXPIRED','CANCELLED') ) NOT NULL DEFAULT ('PENDING'), "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "FK_d7dbf48ad681965ca77e3cbde13" FOREIGN KEY ("ticketId") REFERENCES "tickets" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "reservations"("id", "userId", "ticketId", "status", "expiresAt", "createdAt", "updatedAt") SELECT "id", "userId", "ticketId", "status", "expiresAt", "createdAt", "updatedAt" FROM "temporary_reservations"`);
        await queryRunner.query(`DROP TABLE "temporary_reservations"`);
        await queryRunner.query(`CREATE INDEX "idx_reservations_status" ON "reservations" ("status") WHERE status = 'PENDING'`);
    }

}
