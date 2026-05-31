-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sender" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "maskedPii" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditReceipt" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'protectmcp:decision',
    "tool_name" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "policy_digest" TEXT NOT NULL,
    "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issuer_id" TEXT NOT NULL,
    "reason" TEXT,
    "claimed_issuer_tier" INTEGER,
    "signature_alg" TEXT NOT NULL DEFAULT 'EdDSA',
    "signature_sig" TEXT NOT NULL,

    CONSTRAINT "AuditReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityFinding" (
    "vector" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "evidence" TEXT NOT NULL,
    "dataFlow" TEXT[],
    "remediation" TEXT NOT NULL,
    "amplifiedBy" TEXT[],

    CONSTRAINT "SecurityFinding_pkey" PRIMARY KEY ("vector")
);

-- CreateTable
CREATE TABLE "LogEntry" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "LogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommandLog" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "command" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "exitCode" INTEGER NOT NULL,
    "cedarDecision" TEXT NOT NULL,

    CONSTRAINT "CommandLog_pkey" PRIMARY KEY ("id")
);
