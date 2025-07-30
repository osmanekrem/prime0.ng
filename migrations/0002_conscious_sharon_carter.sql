ALTER TABLE "fragment" ALTER COLUMN "sandboxUrl" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "fragment" ADD COLUMN "benchmarkData" text;