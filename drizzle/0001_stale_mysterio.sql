CREATE TABLE "ctf_solves" (
	"user_id" uuid NOT NULL,
	"challenge_id" text NOT NULL,
	"hints_used" integer DEFAULT 0 NOT NULL,
	"solved_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ctf_solves_user_id_challenge_id_pk" PRIMARY KEY("user_id","challenge_id")
);
--> statement-breakpoint
ALTER TABLE "ctf_solves" ADD CONSTRAINT "ctf_solves_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ctf_solves_challenge_idx" ON "ctf_solves" USING btree ("challenge_id");