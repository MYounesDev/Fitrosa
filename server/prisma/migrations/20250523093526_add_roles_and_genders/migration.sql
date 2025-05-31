-- Create roles table
CREATE TABLE "Role" (
    "role_id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,
    CONSTRAINT "Role_pkey" PRIMARY KEY ("role_id")
);

-- Create genders table
CREATE TABLE "Gender" (
    "gender_id" SERIAL NOT NULL,
    "gender_name" TEXT NOT NULL,
    CONSTRAINT "Gender_pkey" PRIMARY KEY ("gender_id")
);

-- Insert default roles
INSERT INTO "Role" ("role_name") VALUES ('admin'), ('coach'), ('student');

-- Insert default genders
INSERT INTO "Gender" ("gender_name") VALUES ('male'), ('female');

-- Add new columns to User table
ALTER TABLE "User" ADD COLUMN "role_id" INTEGER;
ALTER TABLE "User" ADD COLUMN "gender_id" INTEGER;

-- Add foreign key constraints
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("role_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "User" ADD CONSTRAINT "User_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "Gender"("gender_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Migrate existing data
UPDATE "User" u
SET role_id = r.role_id
FROM "Role" r
WHERE u.role = r.role_name;

UPDATE "User" u
SET gender_id = g.gender_id
FROM "Gender" g
WHERE LOWER(u.gender) = LOWER(g.gender_name);

-- Drop old columns
ALTER TABLE "User" DROP COLUMN "role";
ALTER TABLE "User" DROP COLUMN "gender";

-- Make role_id required
ALTER TABLE "User" ALTER COLUMN "role_id" SET NOT NULL; 