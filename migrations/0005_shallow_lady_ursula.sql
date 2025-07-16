ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "inviteCode" text NOT NULL;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_inviteCode_unique" UNIQUE("inviteCode");