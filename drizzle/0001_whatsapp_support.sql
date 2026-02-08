ALTER TABLE "users" ADD COLUMN "phone_number" text;
ALTER TABLE "users" ADD COLUMN "whatsapp_state" text;
ALTER TABLE "users" ADD COLUMN "whatsapp_step" integer;
ALTER TABLE "users" ADD COLUMN "whatsapp_context" json;
ALTER TABLE "users" ADD CONSTRAINT "users_phone_number_unique" UNIQUE("phone_number");

CREATE TABLE "messages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "direction" text NOT NULL,
  "body" text NOT NULL,
  "raw" json,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
