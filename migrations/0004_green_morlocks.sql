CREATE TYPE "public"."teamRole" AS ENUM('ADMIN', 'MEMBER');--> statement-breakpoint
ALTER TABLE "teamMember" ADD COLUMN "role" "teamRole" DEFAULT 'MEMBER' NOT NULL;