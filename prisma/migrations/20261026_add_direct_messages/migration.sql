CREATE TABLE "direct_messages" (
  "id" BIGSERIAL NOT NULL,
  "sender_id" BIGINT NOT NULL,
  "recipient_id" BIGINT NOT NULL,
  "content" VARCHAR(2000) NOT NULL,
  "is_read" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "direct_messages_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "direct_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "direct_messages_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "direct_messages_conversation_idx" ON "direct_messages"("sender_id", "recipient_id", "created_at" DESC);
CREATE INDEX "direct_messages_recipient_read_idx" ON "direct_messages"("recipient_id", "is_read");
CREATE INDEX "direct_messages_recipient_created_idx" ON "direct_messages"("recipient_id", "created_at" DESC);
