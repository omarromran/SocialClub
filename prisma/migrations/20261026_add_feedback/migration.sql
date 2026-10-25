CREATE TABLE "feedback" (
  "id" BIGSERIAL NOT NULL,
  "user_id" BIGINT NOT NULL,
  "message" VARCHAR(2000) NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "feedback_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "feedback_user_created_idx" ON "feedback"("user_id", "created_at" DESC);
