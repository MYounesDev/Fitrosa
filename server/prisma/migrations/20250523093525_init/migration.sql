-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "profileImage" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT false,
    "passwordChangedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "preferences" JSONB,
    "notificationPreferences" JSONB,
    "name" TEXT,
    "gender" TEXT,
    "session" TEXT,
    "section" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "birthDate" TEXT,
    "parentName" TEXT,
    "parentPhone" TEXT,
    "notes" TEXT,
    "startDate" TIMESTAMP(3),
    "performanceNotes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
