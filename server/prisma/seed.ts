import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;

  const users = [
    { email: "admin@gmail.com", password: "admin", role: "admin", profileImage: "" },
    { 
      name: "Mehmet Cansız", 
      gender: "male", 
      email: "mehmet@gmail.com", 
      password: "123", 
      session: "Football", 
      section: "A", 
      role: "coach", 
      profileImage: "" 
    },
    { 
      name: "Ahmet Çetin", 
      gender: "male", 
      email: "ahmet@gmail.com", 
      password: "123", 
      session: "Football", 
      section: "B", 
      role: "coach", 
      profileImage: "" 
    },
    { 
      name: "Mustafa Öztürk", 
      gender: "male", 
      email: "mustafa@gmail.com", 
      password: "123", 
      session: "Basketbol", 
      section: "A", 
      role: "coach", 
      profileImage: "" 
    },
    { 
      name: "Zeynep Polat", 
      gender: "female", 
      email: "zeynep@gmail.com", 
      password: "123", 
      session: "Volleyball", 
      section: "A", 
      role: "coach", 
      profileImage: "" 
    },
    {
      email: "student@gmail.com",
      password: "123",
      session: "Football",
      section: "A",
      role: "student",
      firstName: "Mehmet",
      lastName: "Yılmaz",
      birthDate: "2010-05-15",
      gender: "male",
      parentName: "Ali Yılmaz",
      parentPhone: "5551234567",
      notes: "Örnek öğrenci",
      startDate: new Date("2023-09-01"),
      performanceNotes: { notes: [] },
      profileImage: ""
    },
    {
      email: "student2@gmail.com",
      password: "123",
      session: "Football",
      section: "B",
      role: "student",
      firstName: "Ayşe",
      lastName: "Demir",
      birthDate: "2011-03-20",
      gender: "female",
      parentName: "Fatma Demir",
      parentPhone: "5559876543",
      notes: "Örnek öğrenci 2",
      startDate: new Date("2025-12-25"),
      performanceNotes: { notes: [] },
      profileImage: ""
    },
    {
      email: "student3@gmail.com",
      password: "123",
      session: "Basketbol",
      section: "A",
      role: "student",
      firstName: "Ali",
      lastName: "Kaya",
      birthDate: "2012-07-10",
      gender: "male",
      parentName: "Veli Kaya",
      parentPhone: "5556543210",
      notes: "Örnek öğrenci 3",
      startDate: new Date("2024-01-15"),
      performanceNotes: { notes: [] },
      profileImage: ""
    },
    {
      email: "student4@gmail.com",
      password: "123",
      session: "Volleyball",
      section: "A",
      role: "student",
      firstName: "Fatma",
      lastName: "Çelik",
      birthDate: "2013-02-18",
      gender: "female",
      parentName: "Hasan Çelik",
      parentPhone: "5551112233",
      notes: "Örnek öğrenci 4",
      startDate: new Date("2023-10-01"),
      performanceNotes: { notes: [] },
      profileImage: ""
    },
    {
      email: "student5@gmail.com",
      password: "123",
      session: "Football",
      section: "B",
      role: "student",
      firstName: "Emre",
      lastName: "Öztürk",
      birthDate: "2014-06-25",
      gender: "male",
      parentName: "Ayşe Öztürk",
      parentPhone: "5552223344",
      notes: "Örnek öğrenci 5",
      startDate: new Date("2024-02-15"),
      performanceNotes: { notes: [] },
      profileImage: ""
    },
    {
      email: "student6@gmail.com",
      password: "123",
      session: "Basketbol",
      section: "A",
      role: "student",
      firstName: "Zeynep",
      lastName: "Kara",
      birthDate: "2015-09-12",
      gender: "female",
      parentName: "Mehmet Kara",
      parentPhone: "5553334455",
      notes: "Örnek öğrenci 6",
      startDate: new Date("2024-05-20"),
      performanceNotes: { notes: [] },
      profileImage: ""
    },
    {
      email: "student7@gmail.com",
      password: "123",
      session: "Volleyball",
      section: "A",
      role: "student",
      firstName: "Burak",
      lastName: "Yıldız",
      birthDate: "2012-11-30",
      gender: "male",
      parentName: "Selin Yıldız",
      parentPhone: "5554445566",
      notes: "Örnek öğrenci 7",
      startDate: new Date("2025-03-10"),
      performanceNotes: { notes: [] },
      profileImage: ""
    }
  ];

  // Clear existing data
  await prisma.user.deleteMany();

  // Insert new data
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
        active: false,
        passwordChangedAt: new Date(),
      },
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 