-- CreateTable
CREATE TABLE "FilesystemDrift" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filePath" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "diff" TEXT,
    "reconciled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FilesystemDrift_pkey" PRIMARY KEY ("id")
);
