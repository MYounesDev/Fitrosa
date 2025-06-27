-- delete all data from the tables
DELETE FROM public."AttendanceLog";
DELETE FROM public."ClassStudent";
DELETE FROM public."ClassCoach";
DELETE FROM public."Class";
DELETE FROM public."Sport";
DELETE FROM public."User";
DELETE FROM public."Role";
DELETE FROM public."Gender";
DELETE FROM public."FinancialTransaction";
DELETE FROM public."AuthLog";

-- insert data into the Role table
INSERT INTO public."Role" (
    role_id, "role_name"
            ) VALUES 
			(1,'admin'),
			(2,'coach'),
			(3,'student');
			
-- insert data into the Gender table
INSERT INTO public."Gender" (
    gender_id, "gender_name"
            ) VALUES 
			(1,'male'),
			(2,'female');			

-- insert data into the User table
INSERT INTO public."User" (
    id, "firstName", "lastName", email, password, role_id, gender_id, 
        active, "passwordChangedAt", "birthDate", "parentName", "parentPhone", 
            "createdAt", "updatedAt", "profileImage", "notes", "startDate"
            ) VALUES 
            -- Admin
            (999, 'Admin', 'User', 'admin@gmail.com', '$2b$10$XyaAHjjvZO3eLZgDUtITSOWXQD4/472LYORlNIU83RVVHmrz5GzXm', 1, 1, TRUE, '2023-05-23 10:01:00', NULL, NULL, NULL, '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, NULL, NULL),
            
            -- Coaches
            (653, 'Akif', 'Taşdemir', 'mehmet@gmail.com', '$2b$10$uGD3H.aOXLa9P7vqgnkGGORk3cFzsYPtjvb.b5A31VgoNUSVNVbY6', 2, 1, TRUE, '2023-05-23 10:01:00', '1985-09-01', NULL, NULL, '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Experienced football coach', '2022-01-15'),
            
            (370, 'Ahmet', 'Çetin', 'ahmet@gmail.com', '$2b$10$u0fALOUvQKUGERo/za2ktu0NCOLm5UqZ.6AFgM4N.Cnd8UjqoCaLG', 2, 1, TRUE, '2023-05-31 17:11:00', '1982-12-25', NULL, NULL, '2023-05-23 10:01:00', '2023-05-31 17:11:00', NULL, 'Basketball specialist', '2022-03-20'),
            
            (465, 'Mustafa', 'Öztürk', 'mustafa@gmail.com', '$2b$10$4FBEsvHxzBr/DqvUFaECO.QTXeBWvWqq0zs4eMnD1v8Qckkhr3gRu', 2, 1, TRUE, '2023-05-23 10:01:00', '1990-01-15', NULL, NULL, '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Swimming instructor', '2021-11-05'),
            
            (321, 'Zeynep', 'Polat', 'zeynep@gmail.com', '$2b$10$WKo6V7tHNkhJ9ryiADRDQ.3AX3UR3GV3pHJfaiNva2fTaXy4kYVUe', 2, 2, TRUE, '2023-05-23 10:01:00', '1988-10-01', NULL, NULL, '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Tennis coach', '2022-02-10'),
            
            (254, 'Seda', 'Yılmaz', 'seda@gmail.com', '$2b$10$WKo6V7tHNkhJ9ryiADRDQ.3AX3UR3GV3pHJfaiNva2fTaXy4kYVUe', 2, 2, TRUE, '2023-05-23 10:01:00', '1986-06-12', NULL, NULL, '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Volleyball specialist', '2021-09-15'),
            
            -- Students
            (789, 'Mehmet', 'Yılmaz', 'student@gmail.com', '$2b$10$Z8r0/GrVsoVWSQRQJgAUfeOGLVvPsIx1161QV1IzXd.fzc5Y1fp3y', 3, 1, TRUE, '2023-05-23 10:01:00', '2010-02-15', 'Ayşe Öztürk', '5552223344', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Talented football player', '2022-09-01'),
            
            (685, 'Ayşe', 'Demir', 'student2@gmail.com', '$2b$10$74aIIo4k3TqqoVzVdX52/uXbfuyo.7TMhHGZdmJsuf.FrIrk1Gicq', 3, 2, TRUE, '2023-05-23 10:01:00', '2011-05-20', 'Mehmet Kara', '5553334455', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Advanced swimming skills', '2022-06-15'),
            
            (486, 'Ali', 'Kaya', 'student3@gmail.com', '$2b$10$7Ve671Pf7jRENUAykl04TubtNCfoWOJ1/eeJWbRkL7Jua8C3e3bJi', 3, 1, TRUE, '2023-05-23 10:01:00', '2009-03-10', 'Selin Yıldız', '5554445566', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Basketball enthusiast', '2022-08-20'),
            
            (583, 'Fatma', 'Çelik', 'student4@gmail.com', '$2b$10$dVxFdRdRx5.dxRDPBpO3n.wuAqxbjRlv1.wbi3PDobkSh0YpcMu.O', 3, 2, TRUE, '2023-05-23 10:01:00', '2010-07-22', 'Murat Çelik', '5556667788', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Tennis player', '2022-09-15'),
            
            (741, 'Emre', 'Öztürk', 'student5@gmail.com', '$2b$10$0ZlZsA47fOk6T0x74iWZlO7P2ykvW2/5fk6wnucOBSObhSzkmPFFO', 3, 1, TRUE, '2023-05-23 10:01:00', '2011-11-05', 'Leyla Öztürk', '5557778899', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Volleyball player', '2022-10-01'),
            
            (852, 'Zeynep', 'Kara', 'student6@gmail.com', '$2b$10$0wN86vKoUWtXtYWSIV6ikOa.AfywrhOwUcq2q85MCLLd9eukONr9G', 3, 2, TRUE, '2023-05-23 10:01:00', '2009-09-18', 'Kemal Kara', '5558889900', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Promising footballer', '2022-07-15'),
            
            (682, 'Burak', 'Yıldız', 'student7@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 1, TRUE, '2023-05-23 10:01:00', '2010-04-30', 'Sevim Yıldız', '5559990011', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Good at basketball', '2022-09-10'),
            
            (553, 'Elif', 'Aydın', 'student8@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 2, TRUE, '2023-05-23 10:01:00', '2011-08-12', 'Ahmet Aydın', '5551122334', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Swimming talent', '2022-08-05'),
            
            (624, 'Can', 'Demir', 'student9@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 1, TRUE, '2023-05-23 10:01:00', '2010-06-25', 'Fatma Demir', '5552233445', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Tennis beginner', '2022-11-20'),
            
            (715, 'Selin', 'Koç', 'student10@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 2, TRUE, '2023-05-23 10:01:00', '2009-12-08', 'Mert Koç', '5553344556', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Volleyball enthusiast', '2022-10-15'),
            
            -- Additional Students (Football)
            (101, 'İbrahim', 'Aksoy', 'ibrahim@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 1, TRUE, '2023-05-23 10:01:00', '2010-03-15', 'Elif Aksoy', '5551234567', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Football striker', '2022-09-05'),
            (102, 'Yusuf', 'Demir', 'yusuf@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 1, TRUE, '2023-05-23 10:01:00', '2009-11-22', 'Hatice Demir', '5552345678', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Football midfielder', '2022-08-15'),
            (103, 'Esra', 'Yıldız', 'esra@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 2, TRUE, '2023-05-23 10:01:00', '2010-05-18', 'Osman Yıldız', '5553456789', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Football defender', '2022-09-20'),
            (104, 'Ömer', 'Kaya', 'omer@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 1, TRUE, '2023-05-23 10:01:00', '2009-07-30', 'Zehra Kaya', '5554567890', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Football goalkeeper', '2022-08-10'),
            (105, 'Ayşenur', 'Çelik', 'aysenur@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 2, TRUE, '2023-05-23 10:01:00', '2010-09-12', 'Mehmet Çelik', '5555678901', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Football winger', '2022-07-25'),
            
            -- Additional Students (Basketball)
            (201, 'Mustafa', 'Şahin', 'mustafas@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 1, TRUE, '2023-05-23 10:01:00', '2009-04-05', 'Fatma Şahin', '5556789012', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Basketball point guard', '2022-10-05'),
            (202, 'Zeynep', 'Yılmaz', 'zeynepy@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 2, TRUE, '2023-05-23 10:01:00', '2010-12-20', 'Ali Yılmaz', '5557890123', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Basketball shooting guard', '2022-09-18'),
            (203, 'Ahmet', 'Öztürk', 'ahmeto@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 1, TRUE, '2023-05-23 10:01:00', '2009-10-10', 'Ayşe Öztürk', '5558901234', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Basketball center', '2022-08-22'),
            (204, 'Emine', 'Korkmaz', 'emine@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 2, TRUE, '2023-05-23 10:01:00', '2010-06-15', 'Hüseyin Korkmaz', '5559012345', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Basketball forward', '2022-07-10'),
            (205, 'Hasan', 'Demirci', 'hasan@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 1, TRUE, '2023-05-23 10:01:00', '2009-08-25', 'Sema Demirci', '5550123456', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Basketball power forward', '2022-10-12'),
            
            -- Additional Students (Swimming)
            (301, 'Fatma', 'Arslan', 'fatmaa@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 2, TRUE, '2023-05-23 10:01:00', '2010-01-28', 'Mehmet Arslan', '5551123456', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Freestyle swimmer', '2022-06-10'),
            (302, 'Murat', 'Koç', 'murat@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 1, TRUE, '2023-05-23 10:01:00', '2009-05-14', 'Ayşe Koç', '5552234567', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Backstroke swimmer', '2022-07-05'),
            (303, 'Selin', 'Özdemir', 'selino@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 2, TRUE, '2023-05-23 10:01:00', '2010-07-08', 'Hakan Özdemir', '5553345678', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Butterfly swimmer', '2022-08-15'),
            (304, 'Cem', 'Yalçın', 'cem@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 1, TRUE, '2023-05-23 10:01:00', '2009-11-30', 'Melek Yalçın', '5554456789', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Breaststroke swimmer', '2022-09-05'),
            (305, 'Deniz', 'Kurt', 'deniz@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 2, TRUE, '2023-05-23 10:01:00', '2010-03-22', 'Serkan Kurt', '5555567890', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Medley swimmer', '2022-06-25'),
            
            -- Additional Students (Tennis)
            (401, 'Kerem', 'Aydın', 'kerem@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 1, TRUE, '2023-05-23 10:01:00', '2009-12-12', 'Serap Aydın', '5556678901', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Tennis singles player', '2022-08-01'),
            (402, 'Buse', 'Çetin', 'buse@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 2, TRUE, '2023-05-23 10:01:00', '2010-10-05', 'Orhan Çetin', '5557789012', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Tennis doubles player', '2022-09-15'),
            (403, 'Kaan', 'Kılıç', 'kaan@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 1, TRUE, '2023-05-23 10:01:00', '2009-06-18', 'Derya Kılıç', '5558890123', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Tennis forehand specialist', '2022-07-20'),
            
            -- Additional Students (Volleyball)
            (501, 'Gizem', 'Şen', 'gizem@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 2, TRUE, '2023-05-23 10:01:00', '2010-08-30', 'Erol Şen', '5559901234', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Volleyball setter', '2022-09-10'),
            (502, 'Umut', 'Güneş', 'umut@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 1, TRUE, '2023-05-23 10:01:00', '2009-09-15', 'Canan Güneş', '5550012345', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Volleyball libero', '2022-08-05'),
            (503, 'Ebru', 'Aslan', 'ebru@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 2, TRUE, '2023-05-23 10:01:00', '2010-02-25', 'Selim Aslan', '5551112233', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Volleyball spiker', '2022-10-10'),
            (504, 'Tolga', 'Eren', 'tolga@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 1, TRUE, '2023-05-23 10:01:00', '2009-07-05', 'Nurcan Eren', '5552223344', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Volleyball blocker', '2022-09-25'),
            (505, 'Melis', 'Yaman', 'melis@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 2, TRUE, '2023-05-23 10:01:00', '2010-04-12', 'Ferhat Yaman', '5553334455', '2023-05-23 10:01:00', '2023-05-23 10:01:00', NULL, 'Volleyball hitter', '2022-08-20');

-- insert data into the Sport tablekfşdl klşdgklşf gklşdfgk lşdfklş 
INSERT INTO public."Sport" (
    id, "sport_name", "createdAt", "updatedAt"
    ) VALUES 
    (1, 'Football', '2023-05-23 10:01:00', '2023-05-23 10:01:00'),
    (2, 'Basketball', '2023-05-23 10:01:00', '2023-05-23 10:01:00'),
    (3, 'Swimming', '2023-05-23 10:01:00', '2023-05-23 10:01:00'),
    (4, 'Tennis', '2023-05-23 10:01:00', '2023-05-23 10:01:00'),
    (5, 'Volleyball', '2023-05-23 10:01:00', '2023-05-23 10:01:00');

-- insert data into the Class table
INSERT INTO public."Class" (
    id, "sport_id", "section", "createdAt", "updatedAt"
    ) VALUES 
    (1, 1, 'A', '2023-05-23 10:01:00', '2023-05-23 10:01:00'),
    (2, 1, 'B', '2023-05-23 10:01:00', '2023-05-23 10:01:00'),
    (3, 2, 'Beginners', '2023-05-23 10:01:00', '2023-05-23 10:01:00'),
    (4, 2, 'Advanced', '2023-05-23 10:01:00', '2023-05-23 10:01:00'),
    (5, 3, 'Basics', '2023-05-23 10:01:00', '2023-05-23 10:01:00'),
    (6, 3, 'Competitive', '2023-05-23 10:01:00', '2023-05-23 10:01:00'),
    (7, 4, 'Beginners', '2023-05-23 10:01:00', '2023-05-23 10:01:00'),
    (8, 5, 'Team', '2023-05-23 10:01:00', '2023-05-23 10:01:00');

-- insert data into the ClassCoach table
INSERT INTO public."ClassCoach" (
    id, "class_id", "coach_id", "createdAt", "updatedAt"
    ) VALUES 
    (1, 1, 653, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Akif coaches Football A
    (2, 2, 653, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Akif coaches Football B
    (3, 3, 370, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Ahmet coaches Basketball Beginners
    (4, 4, 370, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Ahmet coaches Basketball Advanced
    (5, 5, 465, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Mustafa coaches Swimming Basics
    (6, 6, 465, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Mustafa coaches Competitive Swimming
    (7, 7, 321, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Zeynep coaches Tennis Beginners
    (8, 8, 254, '2023-05-23 10:01:00', '2023-05-23 10:01:00') -- Seda coaches Volleyball Team
    ;
-- insert data into the ClassStudent table
INSERT INTO public."ClassStudent" (
    id, "class_id", "student_id", "createdAt", "updatedAt"
    ) VALUES 
    -- Existing enrollments
    (1, 1, 789, '2023-05-23 10:01:00', '2023-05-23 10:01:00'),  -- Mehmet in Football A
    (2, 1, 852, '2023-05-23 10:01:00', '2023-05-23 10:01:00'),  -- Zeynep K in Football A
    (3, 2, 682, '2023-05-23 10:01:00', '2023-05-23 10:01:00'),  -- Burak in Football B
    (4, 3, 486, '2023-05-23 10:01:00', '2023-05-23 10:01:00'),  -- Ali in Basketball Beginners
    (5, 4, 624, '2023-05-23 10:01:00', '2023-05-23 10:01:00'),  -- Can in Basketball Advanced
    (6, 5, 685, '2023-05-23 10:01:00', '2023-05-23 10:01:00'),  -- Ayşe in Swimming Basics
    (7, 6, 553, '2023-05-23 10:01:00', '2023-05-23 10:01:00'),  -- Elif in Competitive Swimming
    (8, 7, 583, '2023-05-23 10:01:00', '2023-05-23 10:01:00'),  -- Fatma in Tennis Beginners
    (9, 8, 741, '2023-05-23 10:01:00', '2023-05-23 10:01:00'),  -- Emre in Volleyball Team
    (10, 8, 715, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Selin in Volleyball Team
    
    -- New Football enrollments
    (11, 1, 101, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- İbrahim in Football A
    (12, 1, 102, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Yusuf in Football A
    (13, 1, 103, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Esra in Football A
    (14, 2, 104, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Ömer in Football B
    (15, 2, 105, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Ayşenur in Football B
    
    -- New Basketball enrollments
    (16, 3, 201, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Mustafa in Basketball Beginners
    (17, 3, 202, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Zeynep Y in Basketball Beginners
    (18, 3, 203, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Ahmet in Basketball Beginners
    (19, 4, 204, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Emine in Basketball Advanced
    (20, 4, 205, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Hasan in Basketball Advanced
    
    -- New Swimming enrollments
    (21, 5, 301, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Fatma A in Swimming Basics
    (22, 5, 302, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Murat in Swimming Basics
    (23, 6, 303, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Selin Ö in Competitive Swimming
    (24, 6, 304, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Cem in Competitive Swimming
    (25, 6, 305, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Deniz in Competitive Swimming
    
    -- New Tennis enrollments
    (26, 7, 401, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Kerem in Tennis Beginners
    (27, 7, 402, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Buse in Tennis Beginners
    (28, 7, 403, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Kaan in Tennis Beginners
    
    -- New Volleyball enrollments
    (29, 8, 501, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Gizem in Volleyball Team
    (30, 8, 502, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Umut in Volleyball Team
    (31, 8, 503, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Ebru in Volleyball Team
    (32, 8, 504, '2023-05-23 10:01:00', '2023-05-23 10:01:00'), -- Tolga in Volleyball Team
    (33, 8, 505, '2023-05-23 10:01:00', '2023-05-23 10:01:00'); -- Melis in Volleyball Team

-- insert data into the AttendanceLog table
INSERT INTO public."AttendanceLog" (
    id, "class_student_id", "date", "status", "note", "createdAt", "updatedAt"
    ) VALUES 
    -- Existing attendance logs
    (1001, 1, '2023-06-01 09:00:00', 'attended', NULL, '2023-06-01 10:01:00', '2023-06-01 10:01:00'),
    (1002, 1, '2023-06-03 09:00:00', 'attended', NULL, '2023-06-03 10:01:00', '2023-06-03 10:01:00'),
    (1003, 1, '2023-06-05 09:00:00', 'not_attended', 'Student was sick', '2023-06-05 10:01:00', '2023-06-05 10:01:00'),
    (1004, 2, '2023-06-01 09:00:00', 'attended', NULL, '2023-06-01 10:01:00', '2023-06-01 10:01:00'),
    (1005, 2, '2023-06-03 09:00:00', 'not_attended', 'Family trip', '2023-06-03 10:01:00', '2023-06-03 10:01:00'),
    (1006, 2, '2023-06-05 09:00:00', 'attended', NULL, '2023-06-05 10:01:00', '2023-06-05 10:01:00'),
    (1007, 3, '2023-06-02 14:00:00', 'attended', NULL, '2023-06-02 15:01:00', '2023-06-02 15:01:00'),
    (1008, 3, '2023-06-04 14:00:00', 'with_report', 'Injured ankle', '2023-06-04 15:01:00', '2023-06-04 15:01:00'),
    (1009, 4, '2023-06-01 16:00:00', 'attended', NULL, '2023-06-01 17:01:00', '2023-06-01 17:01:00'),
    (1010, 4, '2023-06-03 16:00:00', 'attended', NULL, '2023-06-03 17:01:00', '2023-06-03 17:01:00'),
    (1011, 5, '2023-06-02 16:00:00', 'attended', NULL, '2023-06-02 17:01:00', '2023-06-02 17:01:00'),
    (1012, 5, '2023-06-04 16:00:00', 'day_off', 'Holiday', '2023-06-04 17:01:00', '2023-06-04 17:01:00'),
    (1013, 6, '2023-06-01 10:00:00', 'attended', NULL, '2023-06-01 11:01:00', '2023-06-01 11:01:00'),
    (1014, 7, '2023-06-02 10:00:00', 'attended', NULL, '2023-06-02 11:01:00', '2023-06-02 11:01:00'),
    (1015, 8, '2023-06-01 18:00:00', 'attended', NULL, '2023-06-01 19:01:00', '2023-06-01 19:01:00'),
    (1016, 9, '2023-06-03 18:00:00', 'attended', NULL, '2023-06-03 19:01:00', '2023-06-03 19:01:00'),
    (1017, 10, '2023-06-03 18:00:00', 'not_attended', 'Family emergency', '2023-06-03 19:01:00', '2023-06-03 19:01:00'),
    
    -- Football A class attendance (10for new students)
    (1018, 11, '2023-06-01 09:00:00', 'attended', NULL, '2023-06-01 10:01:00', '2023-06-01 10:01:00'),
    (1019, 11, '2023-06-03 09:00:00', 'attended', NULL, '2023-06-03 10:01:00', '2023-06-03 10:01:00'),
    (1020, 11, '2023-06-05 09:00:00', 'attended', NULL, '2023-06-05 10:01:00', '2023-06-05 10:01:00'),
    (1021, 12, '2023-06-01 09:00:00', 'not_attended', 'Doctor appointment', '2023-06-01 10:01:00', '2023-06-01 10:01:00'),
    (1022, 12, '2023-06-03 09:00:00', 'attended', NULL, '2023-06-03 10:01:00', '2023-06-03 10:01:00'),
    (1023, 12, '2023-06-05 09:00:00', 'attended', NULL, '2023-06-05 10:01:00', '2023-06-05 10:01:00'),
    (1024, 13, '2023-06-01 09:00:00', 'attended', NULL, '2023-06-01 10:01:00', '2023-06-01 10:01:00'),
    (1025, 13, '2023-06-03 09:00:00', 'attended', NULL, '2023-06-03 10:01:00', '2023-06-03 10:01:00'),
    (1026, 13, '2023-06-05 09:00:00', 'not_attended', 'Sick', '2023-06-05 10:01:00', '2023-06-05 10:01:00'),
    
    -- Football B class attendance
    (1027, 14, '2023-06-02 14:00:00', 'attended', NULL, '2023-06-02 15:01:00', '2023-06-02 15:01:00'),
    (1028, 14, '2023-06-04 14:00:00', 'attended', NULL, '2023-06-04 15:01:00', '2023-06-04 15:01:00'),
    (1029, 15, '2023-06-02 14:00:00', 'attended', NULL, '2023-06-02 15:01:00', '2023-06-02 15:01:00'),
    (1030, 15, '2023-06-04 14:00:00', 'not_attended', 'Family event', '2023-06-04 15:01:00', '2023-06-04 15:01:00'),
    
    -- Basketball Beginners attendance
    (1031, 16, '2023-06-01 16:00:00', 'attended', NULL, '2023-06-01 17:01:00', '2023-06-01 17:01:00'),
    (1032, 16, '2023-06-03 16:00:00', 'attended', NULL, '2023-06-03 17:01:00', '2023-06-03 17:01:00'),
    (1033, 17, '2023-06-01 16:00:00', 'attended', NULL, '2023-06-01 17:01:00', '2023-06-01 17:01:00'),
    (1034, 17, '2023-06-03 16:00:00', 'not_attended', 'Exam preparation', '2023-06-03 17:01:00', '2023-06-03 17:01:00'),
    (1035, 18, '2023-06-01 16:00:00', 'with_report', 'Minor injury', '2023-06-01 17:01:00', '2023-06-01 17:01:00'),
    (1036, 18, '2023-06-03 16:00:00', 'attended', NULL, '2023-06-03 17:01:00', '2023-06-03 17:01:00'),
    
    -- Basketball Advanced attendance
    (1037, 19, '2023-06-02 16:00:00', 'attended', NULL, '2023-06-02 17:01:00', '2023-06-02 17:01:00'),
    (1038, 19, '2023-06-04 16:00:00', 'attended', NULL, '2023-06-04 17:01:00', '2023-06-04 17:01:00'),
    (1039, 20, '2023-06-02 16:00:00', 'attended', NULL, '2023-06-02 17:01:00', '2023-06-02 17:01:00'),
    (1040, 20, '2023-06-04 16:00:00', 'attended', NULL, '2023-06-04 17:01:00', '2023-06-04 17:01:00'),
    
    -- Swimming Basics attendance
    (1041, 21, '2023-06-01 10:00:00', 'attended', NULL, '2023-06-01 11:01:00', '2023-06-01 11:01:00'),
    (1042, 21, '2023-06-08 10:00:00', 'attended', NULL, '2023-06-08 11:01:00', '2023-06-08 11:01:00'),
    (1043, 22, '2023-06-01 10:00:00', 'not_attended', 'Out of town', '2023-06-01 11:01:00', '2023-06-01 11:01:00'),
    (1044, 22, '2023-06-08 10:00:00', 'attended', NULL, '2023-06-08 11:01:00', '2023-06-08 11:01:00'),
    
    -- Competitive Swimming attendance
    (1045, 23, '2023-06-02 10:00:00', 'attended', NULL, '2023-06-02 11:01:00', '2023-06-02 11:01:00'),
    (1046, 23, '2023-06-09 10:00:00', 'attended', NULL, '2023-06-09 11:01:00', '2023-06-09 11:01:00'),
    (1047, 24, '2023-06-02 10:00:00', 'attended', NULL, '2023-06-02 11:01:00', '2023-06-02 11:01:00'),
    (1048, 24, '2023-06-09 10:00:00', 'with_report', 'Ear infection', '2023-06-09 11:01:00', '2023-06-09 11:01:00'),
    (1049, 25, '2023-06-02 10:00:00', 'day_off', 'Competition preparation', '2023-06-02 11:01:00', '2023-06-02 11:01:00'),
    (1050, 25, '2023-06-09 10:00:00', 'attended', NULL, '2023-06-09 11:01:00', '2023-06-09 11:01:00'),
    
    -- Tennis attendance
    (1051, 26, '2023-06-01 18:00:00', 'attended', NULL, '2023-06-01 19:01:00', '2023-06-01 19:01:00'),
    (1052, 26, '2023-06-08 18:00:00', 'attended', NULL, '2023-06-08 19:01:00', '2023-06-08 19:01:00'),
    (1053, 27, '2023-06-01 18:00:00', 'attended', NULL, '2023-06-01 19:01:00', '2023-06-01 19:01:00'),
    (1054, 27, '2023-06-08 18:00:00', 'not_attended', 'Family vacation', '2023-06-08 19:01:00', '2023-06-08 19:01:00'),
    (1055, 28, '2023-06-01 18:00:00', 'not_attended', 'Wrist pain', '2023-06-01 19:01:00', '2023-06-01 19:01:00'),
    (1056, 28, '2023-06-08 18:00:00', 'attended', NULL, '2023-06-08 19:01:00', '2023-06-08 19:01:00'),
    
    -- Volleyball attendance
    (1057, 29, '2023-06-03 18:00:00', 'attended', NULL, '2023-06-03 19:01:00', '2023-06-03 19:01:00'),
    (1058, 29, '2023-06-10 18:00:00', 'attended', NULL, '2023-06-10 19:01:00', '2023-06-10 19:01:00'),
    (1059, 30, '2023-06-03 18:00:00', 'attended', NULL, '2023-06-03 19:01:00', '2023-06-03 19:01:00'),
    (1060, 30, '2023-06-10 18:00:00', 'not_attended', 'Personal reasons', '2023-06-10 19:01:00', '2023-06-10 19:01:00'),
    (1061, 31, '2023-06-03 18:00:00', 'attended', NULL, '2023-06-03 19:01:00', '2023-06-03 19:01:00'),
    (1062, 31, '2023-06-10 18:00:00', 'attended', NULL, '2023-06-10 19:01:00', '2023-06-10 19:01:00'),
    (1063, 32, '2023-06-03 18:00:00', 'with_report', 'Ankle sprain', '2023-06-03 19:01:00', '2023-06-03 19:01:00'),
    (1064, 32, '2023-06-10 18:00:00', 'with_report', 'Recovery', '2023-06-10 19:01:00', '2023-06-10 19:01:00'),
    (1065, 33, '2023-06-03 18:00:00', 'attended', NULL, '2023-06-03 19:01:00', '2023-06-03 19:01:00'),
    (1066, 33, '2023-06-10 18:00:00', 'attended', NULL, '2023-06-10 19:01:00', '2023-06-10 19:01:00');

-- insert data into the FinancialTransaction table
INSERT INTO public."FinancialTransaction" (
    id, transaction_type, user_id, amount, currency, description, transaction_date, created_at, updated_at
) VALUES
    -- June 2023 Transactions
    (1004, 'salary', 321, -2200.00, 'USD', 'Monthly salary for Zeynep', '2023-06-01 09:00:00', '2023-06-01 09:00:00', '2023-06-01 09:00:00'),
    (1005, 'salary', 254, -2100.00, 'USD', 'Monthly salary for Seda', '2023-06-01 09:00:00', '2023-06-01 09:00:00', '2023-06-01 09:00:00'),
    (1007, 'expense', NULL, -200.00, 'USD', 'Facility maintenance', '2023-06-03 11:00:00', '2023-06-03 11:00:00', '2023-06-03 11:00:00'),
    (1008, 'income', 999, 1000.00, 'USD', 'Membership fee', '2023-06-04 12:00:00', '2023-06-04 12:00:00', '2023-06-04 12:00:00'),
    (1009, 'income', 789, 150.00, 'USD', 'Student payment', '2023-06-05 13:00:00', '2023-06-05 13:00:00', '2023-06-05 13:00:00'),
    (1010, 'income', 685, 150.00, 'USD', 'Student payment', '2023-06-05 13:05:00', '2023-06-05 13:05:00', '2023-06-05 13:05:00'),
    (1011, 'income', 486, 1500.00, 'USD', 'Student payment', '2023-06-05 13:10:00', '2023-06-05 13:10:00', '2023-06-05 13:10:00'),
    (1012, 'income', 583, 150.00, 'USD', 'Student payment', '2023-06-05 13:15:00', '2023-06-05 13:15:00', '2023-06-05 13:15:00'),
    (1013, 'income', 741, 150.00, 'USD', 'Student payment', '2023-06-05 13:20:00', '2023-06-05 13:20:00', '2023-06-05 13:20:00'),
    (1014, 'income', 852, 150.00, 'USD', 'Student payment', '2023-06-05 13:25:00', '2023-06-05 13:25:00', '2023-06-05 13:25:00'),
    (1015, 'income', 682, 150.00, 'USD', 'Student payment', '2023-06-05 13:30:00', '2023-06-05 13:30:00', '2023-06-05 13:30:00'),
    (1016, 'income', 553, 150.00, 'USD', 'Student payment', '2023-06-05 13:35:00', '2023-06-05 13:35:00', '2023-06-05 13:35:00'),
    (1017, 'income', 624, 150.00, 'USD', 'Student payment', '2023-06-05 13:40:00', '2023-06-05 13:40:00', '2023-06-05 13:40:00'),
    (1018, 'income', 715, 150.00, 'USD', 'Student payment', '2023-06-05 13:45:00', '2023-06-05 13:45:00', '2023-06-05 13:45:00'),
    (1019, 'income', 101, 150.00, 'USD', 'Student payment', '2023-06-05 13:50:00', '2023-06-05 13:50:00', '2023-06-05 13:50:00'),
    (1020, 'income', 102, 150.00, 'USD', 'Student payment', '2023-06-05 13:55:00', '2023-06-05 13:55:00', '2023-06-05 13:55:00'),
    (1021, 'income', 103, 150.00, 'USD', 'Student payment', '2023-06-05 14:00:00', '2023-06-05 14:00:00', '2023-06-05 14:00:00'),
    (1022, 'income', 104, 150.00, 'USD', 'Student payment', '2023-06-05 14:05:00', '2023-06-05 14:05:00', '2023-06-05 14:05:00'),
    (1023, 'income', 105, 150.00, 'USD', 'Student payment', '2023-06-05 14:10:00', '2023-06-05 14:10:00', '2023-06-05 14:10:00'),
    (1024, 'loss', NULL, -100.00, 'USD', 'Lost equipment', '2023-06-06 15:00:00', '2023-06-06 15:00:00', '2023-06-06 15:00:00'),
    (1025, 'expense', NULL, -300.00, 'USD', 'Travel expenses', '2023-06-07 16:00:00', '2023-06-07 16:00:00', '2023-06-07 16:00:00'),
    (1026, 'income', 789, 200.00, 'USD', 'Private lesson payment', '2023-06-08 17:00:00', '2023-06-08 17:00:00', '2023-06-08 17:00:00'),
    (1027, 'income', 685, 200.00, 'USD', 'Private lesson payment', '2023-06-08 17:05:00', '2023-06-08 17:05:00', '2023-06-08 17:05:00'),
    (1028, 'income', 486, 200.00, 'USD', 'Private lesson payment', '2023-06-08 17:10:00', '2023-06-08 17:10:00', '2023-06-08 17:10:00'),
    (1029, 'income', 583, 200.00, 'USD', 'Private lesson payment', '2023-06-08 17:15:00', '2023-06-08 17:15:00', '2023-06-08 17:15:00'),
    (1030, 'income', 741, 200.00, 'USD', 'Private lesson payment', '2023-06-08 17:20:00', '2023-06-08 17:20:00', '2023-06-08 17:20:00'),
    (1031, 'income', 852, 200.00, 'USD', 'Private lesson payment', '2023-06-08 17:25:00', '2023-06-08 17:25:00', '2023-06-08 17:25:00'),
    (1032, 'income', 682, 200.00, 'USD', 'Private lesson payment', '2023-06-08 17:30:00', '2023-06-08 17:30:00', '2023-06-08 17:30:00'),
    (1033, 'income', 553, 200.00, 'USD', 'Private lesson payment', '2023-06-08 17:35:00', '2023-06-08 17:35:00', '2023-06-08 17:35:00'),
    (1034, 'income', 624, 200.00, 'USD', 'Private lesson payment', '2023-06-08 17:40:00', '2023-06-08 17:40:00', '2023-06-08 17:40:00'),
    (1035, 'income', 715, 200.00, 'USD', 'Private lesson payment', '2023-06-08 17:45:00', '2023-06-08 17:45:00', '2023-06-08 17:45:00'),
    (1036, 'income', 101, 200.00, 'USD', 'Private lesson payment', '2023-06-08 17:50:00', '2023-06-08 17:50:00', '2023-06-08 17:50:00'),
    (1037, 'income', 102, 200.00, 'USD', 'Private lesson payment', '2023-06-08 17:55:00', '2023-06-08 17:55:00', '2023-06-08 17:55:00'),
    (1038, 'income', 103, 200.00, 'USD', 'Private lesson payment', '2023-06-08 18:00:00', '2023-06-08 18:00:00', '2023-06-08 18:00:00'),
    (1039, 'income', 104, 200.00, 'USD', 'Private lesson payment', '2023-06-08 18:05:00', '2023-06-08 18:05:00', '2023-06-08 18:05:00'),
    (1040, 'income', 105, 200.00, 'USD', 'Private lesson payment', '2023-06-08 18:10:00', '2023-06-08 18:10:00', '2023-06-08 18:10:00'),
    (1041, 'expense', NULL, -120.00, 'USD', 'Snacks for event', '2023-06-09 19:00:00', '2023-06-09 19:00:00', '2023-06-09 19:00:00'),
    (1042, 'loss', NULL, -50.00, 'USD', 'Lost tennis balls', '2023-06-10 20:00:00', '2023-06-10 20:00:00', '2023-06-10 20:00:00'),
    (1043, 'income', 789, 300.00, 'USD', 'Tournament prize', '2023-06-11 21:00:00', '2023-06-11 21:00:00', '2023-06-11 21:00:00'),
    (1044, 'income', 685, 300.00, 'USD', 'Tournament prize', '2023-06-11 21:05:00', '2023-06-11 21:05:00', '2023-06-11 21:05:00'),
    (1045, 'income', 486, 300.00, 'USD', 'Tournament prize', '2023-06-11 21:10:00', '2023-06-11 21:10:00', '2023-06-11 21:10:00'),
    (1046, 'income', 583, 300.00, 'USD', 'Tournament prize', '2023-06-11 21:15:00', '2023-06-11 21:15:00', '2023-06-11 21:15:00'),
    (1047, 'income', 741, 300.00, 'USD', 'Tournament prize', '2023-06-11 21:20:00', '2023-06-11 21:20:00', '2023-06-11 21:20:00'),
    (1048, 'income', 852, 300.00, 'USD', 'Tournament prize', '2023-06-11 21:25:00', '2023-06-11 21:25:00', '2023-06-11 21:25:00'),
    (1049, 'income', 682, 300.00, 'USD', 'Tournament prize', '2023-06-11 21:30:00', '2023-06-11 21:30:00', '2023-06-11 21:30:00'),
    (1050, 'income', 553, 300.00, 'USD', 'Tournament prize', '2023-06-11 21:35:00', '2023-06-11 21:35:00', '2023-06-11 21:35:00'),
    
    -- July 2023 Transactions
    (1051, 'salary', 653, -2500.00, 'USD', 'Monthly salary for Akif', '2025-04-01 09:00:00', '2025-04-01 09:00:00', '2025-04-01 09:00:00'),
    (1055, 'salary', 254, -2100.00, 'USD', 'Monthly salary for Seda', '2025-04-01 09:00:00', '2025-04-01 09:00:00', '2025-04-01 09:00:00'),
    (1056, 'expense', NULL, -800.00, 'USD', 'New equipment purchase', '2025-04-02 10:00:00', '2025-04-02 10:00:00', '2025-04-02 10:00:00'),
    (1057, 'expense', NULL, -350.00, 'USD', 'Facility renovation', '2025-04-03 11:00:00', '2025-04-03 11:00:00', '2025-04-03 11:00:00'),
    (1058, 'income', 999, 1200.00, 'USD', 'Membership fee', '2025-04-04 12:00:00', '2025-04-04 12:00:00', '2025-04-04 12:00:00'),
    (1059, 'income', 201, 150.00, 'USD', 'Student payment', '2025-04-05 13:00:00', '2025-04-05 13:00:00', '2025-04-05 13:00:00'),
    (1060, 'income', 202, 150.00, 'USD', 'Student payment', '2025-04-05 13:05:00', '2025-04-05 13:05:00', '2025-04-05 13:05:00'),
    (1061, 'income', 203, 150.00, 'USD', 'Student payment', '2025-04-05 13:10:00', '2025-04-05 13:10:00', '2025-04-05 13:10:00'),
    (1062, 'income', 204, 150.00, 'USD', 'Student payment', '2025-04-05 13:15:00', '2025-04-05 13:15:00', '2025-04-05 13:15:00'),
    (1063, 'income', 205, 150.00, 'USD', 'Student payment', '2025-04-05 13:20:00', '2025-04-05 13:20:00', '2025-04-05 13:20:00'),
    (1064, 'income', 301, 150.00, 'USD', 'Student payment', '2025-04-05 13:25:00', '2025-04-05 13:25:00', '2025-04-05 13:25:00'),
    (1065, 'income', 302, 150.00, 'USD', 'Student payment', '2025-04-05 13:30:00', '2025-04-05 13:30:00', '2025-04-05 13:30:00'),
    (1066, 'income', 303, 150.00, 'USD', 'Student payment', '2025-04-05 13:35:00', '2025-04-05 13:35:00', '2025-04-05 13:35:00'),
    (1067, 'income', 304, 150.00, 'USD', 'Student payment', '2025-04-05 13:40:00', '2025-04-05 13:40:00', '2025-04-05 13:40:00'),
    (1068, 'income', 305, 150.00, 'USD', 'Student payment', '2025-04-05 13:45:00', '2025-04-05 13:45:00', '2025-04-05 13:45:00'),
    (1069, 'income', 401, 150.00, 'USD', 'Student payment', '2025-04-05 13:50:00', '2025-04-05 13:50:00', '2025-04-05 13:50:00'),
    (1070, 'income', 402, 150.00, 'USD', 'Student payment', '2025-04-05 13:55:00', '2025-04-05 13:55:00', '2025-04-05 13:55:00'),
    (1071, 'income', 403, 150.00, 'USD', 'Student payment', '2025-04-05 14:00:00', '2025-04-05 14:00:00', '2025-04-05 14:00:00'),
    (1072, 'income', 501, 150.00, 'USD', 'Student payment', '2025-04-05 14:05:00', '2025-04-05 14:05:00', '2025-04-05 14:05:00'),
    (1073, 'income', 502, 150.00, 'USD', 'Student payment', '2025-04-05 14:10:00', '2025-04-05 14:10:00', '2025-04-05 14:10:00'),
    (1074, 'income', 503, 150.00, 'USD', 'Student payment', '2025-04-05 14:15:00', '2025-04-05 14:15:00', '2025-04-05 14:15:00'),
    (1075, 'income', 504, 150.00, 'USD', 'Student payment', '2025-04-05 14:20:00', '2025-04-05 14:20:00', '2025-04-05 14:20:00'),
    (1076, 'income', 505, 150.00, 'USD', 'Student payment', '2025-04-05 14:25:00', '2025-04-05 14:25:00', '2025-04-05 14:25:00'),
    (1077, 'loss', NULL, -75.00, 'USD', 'Damaged equipment', '2025-04-06 15:00:00', '2025-04-06 15:00:00', '2025-04-06 15:00:00'),
    (1078, 'expense', NULL, -450.00, 'USD', 'Tournament organization', '2025-04-07 16:00:00', '2025-04-07 16:00:00', '2025-04-07 16:00:00'),
    (1079, 'income', 201, 250.00, 'USD', 'Private lesson payment', '2025-04-08 17:00:00', '2025-04-08 17:00:00', '2025-04-08 17:00:00'),
    (1080, 'income', 202, 250.00, 'USD', 'Private lesson payment', '2025-04-08 17:05:00', '2025-04-08 17:05:00', '2025-04-08 17:05:00'),
    (1081, 'income', 203, 250.00, 'USD', 'Private lesson payment', '2025-04-08 17:10:00', '2025-04-08 17:10:00', '2025-04-08 17:10:00'),
    (1082, 'income', 204, 250.00, 'USD', 'Private lesson payment', '2025-04-08 17:15:00', '2025-04-08 17:15:00', '2025-04-08 17:15:00'),
    (1083, 'income', 205, 250.00, 'USD', 'Private lesson payment', '2025-04-08 17:20:00', '2025-04-08 17:20:00', '2025-04-08 17:20:00'),
    (1084, 'income', 301, 250.00, 'USD', 'Private lesson payment', '2025-04-08 17:25:00', '2025-04-08 17:25:00', '2025-04-08 17:25:00'),
    (1085, 'income', 302, 250.00, 'USD', 'Private lesson payment', '2025-04-08 17:30:00', '2025-04-08 17:30:00', '2025-04-08 17:30:00'),
    (1086, 'income', 303, 250.00, 'USD', 'Private lesson payment', '2025-04-08 17:35:00', '2025-04-08 17:35:00', '2025-04-08 17:35:00'),
    (1087, 'income', 304, 250.00, 'USD', 'Private lesson payment', '2025-04-08 17:40:00', '2025-04-08 17:40:00', '2025-04-08 17:40:00'),
    (1088, 'income', 305, 250.00, 'USD', 'Private lesson payment', '2025-04-08 17:45:00', '2025-04-08 17:45:00', '2025-04-08 17:45:00'),
    (1089, 'income', 401, 250.00, 'USD', 'Private lesson payment', '2025-04-08 17:50:00', '2025-04-08 17:50:00', '2025-04-08 17:50:00'),
    (1090, 'income', 402, 250.00, 'USD', 'Private lesson payment', '2025-04-08 17:55:00', '2025-04-08 17:55:00', '2025-04-08 17:55:00'),
    (1091, 'income', 403, 250.00, 'USD', 'Private lesson payment', '2025-04-08 18:00:00', '2025-04-08 18:00:00', '2025-04-08 18:00:00'),
    (1092, 'income', 501, 250.00, 'USD', 'Private lesson payment', '2025-04-08 18:05:00', '2025-04-08 18:05:00', '2025-04-08 18:05:00'),
    (1093, 'income', 502, 250.00, 'USD', 'Private lesson payment', '2025-04-08 18:10:00', '2025-04-08 18:10:00', '2025-04-08 18:10:00'),
    (1094, 'income', 503, 250.00, 'USD', 'Private lesson payment', '2025-04-08 18:15:00', '2025-04-08 18:15:00', '2025-04-08 18:15:00'),
    (1095, 'income', 504, 250.00, 'USD', 'Private lesson payment', '2025-04-08 18:20:00', '2025-04-08 18:20:00', '2025-04-08 18:20:00'),
    (1096, 'income', 505, 250.00, 'USD', 'Private lesson payment', '2025-04-08 18:25:00', '2025-04-08 18:25:00', '2025-04-08 18:25:00'),
    (1097, 'expense', NULL, -180.00, 'USD', 'Refreshments for tournament', '2025-04-09 19:00:00', '2025-04-09 19:00:00', '2025-04-09 19:00:00'),
    (1098, 'loss', NULL, -30.00, 'USD', 'Lost basketball', '2025-04-10 20:00:00', '2025-04-10 20:00:00', '2025-04-10 20:00:00'),
    (1099, 'income', 201, 400.00, 'USD', 'Tournament prize', '2025-04-11 21:00:00', '2025-04-11 21:00:00', '2025-04-11 21:00:00'),
    (1100, 'income', 202, 400.00, 'USD', 'Tournament prize', '2025-04-11 21:05:00', '2025-04-11 21:05:00', '2025-04-11 21:05:00');

-- insert data into the AuthLog table
INSERT INTO public."AuthLog" (
    id, email, status, ip_address, user_agent, failure_reason, created_at
) VALUES
    (1001, 'admin@gmail.com', 'success', '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NULL, '2023-06-01 08:30:15'),
    (1002, 'mehmet@gmail.com', 'success', '192.168.1.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15', NULL, '2023-06-01 09:15:22'),
    (1003, 'student@gmail.com', 'fail', '192.168.1.103', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1', 'Invalid password', '2023-06-01 10:05:33'),
    (1004, 'student@gmail.com', 'success', '192.168.1.103', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1', NULL, '2023-06-01 10:06:12'),
    (1005, 'ahmet@gmail.com', 'success', '192.168.1.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NULL, '2023-06-01 11:22:45'),
    (1006, 'unknown@example.com', 'fail', '192.168.1.105', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36', 'User not found', '2023-06-01 12:10:19'),
    (1007, 'zeynep@gmail.com', 'success', '192.168.1.106', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15', NULL, '2023-06-01 13:45:29'),
    (1008, 'student2@gmail.com', 'success', '192.168.1.107', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0', NULL, '2023-06-01 14:20:33'),
    (1009, 'admin@gmail.com', 'fail', '192.168.1.108', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', 'Invalid password', '2023-06-02 08:12:44'),
    (1010, 'admin@gmail.com', 'success', '192.168.1.108', 'Mozilla/5.0 (10Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (10KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NULL, '2023-06-02 08:13:22'),
    (1011, 'student3@gmail.com', 'success', '192.168.1.109', 'Mozilla/5.0 (10Android 11; Mobile; rv:88.0) Gecko/88.0 Firefox/88.0', NULL, '2023-06-02 09:30:15'),
    (1012, 'mustafa@gmail.com', 'success', '192.168.1.110', 'Mozilla/5.0 (10iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (10KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1', NULL, '2023-06-02 10:45:36'),
    (1013, 'seda@gmail.com', 'success', '192.168.1.111', 'Mozilla/5.0 (10Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (10KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NULL, '2023-06-02 11:17:29'),
    (1014, 'hacker@evil.com', 'fail', '192.168.1.112', 'Mozilla/5.0 (10compatible; Googlebot/2.1; +http://www.google.com/bot.html)', 'User not found', '2023-06-02 12:05:11'),
    (1015, 'student4@gmail.com', 'success', '192.168.1.113', 'Mozilla/5.0 (10Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (10KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36', NULL, '2023-06-02 13:22:47'),
    (1016, 'student5@gmail.com', 'success', '192.168.1.114', 'Mozilla/5.0 (10Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0', NULL, '2023-06-02 14:33:18'),
    (1017, 'student6@gmail.com', 'fail', '192.168.1.115', 'Mozilla/5.0 (10iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (10KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1', 'Account locked', '2023-06-02 15:10:22'),
    (1018, 'student7@gmail.com', 'success', '192.168.1.116', 'Mozilla/5.0 (10Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (10KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NULL, '2023-06-02 16:05:44'),
    (1019, 'student8@gmail.com', 'success', '192.168.1.117', 'Mozilla/5.0 (10Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0', NULL, '2023-06-03 08:47:12'),
    (1020, 'student9@gmail.com', 'fail', '192.168.1.118', 'Mozilla/5.0 (10Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (10KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', 'Invalid password', '2023-06-03 09:15:33'),
    (1021, 'student9@gmail.com', 'success', '192.168.1.118', 'Mozilla/5.0 (10Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (10KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NULL, '2023-06-03 09:16:05'),
    (1022, 'student10@gmail.com', 'success', '192.168.1.119', 'Mozilla/5.0 (10iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (10KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1', NULL, '2023-06-03 10:22:39'),
    (1023, 'admin@gmail.com', 'success', '192.168.1.120', 'Mozilla/5.0 (10Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (10KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NULL, '2023-06-03 11:05:16'),
    (1024, 'mehmet@gmail.com', 'success', '192.168.1.121', 'Mozilla/5.0 (10Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (10KHTML, like Gecko) Version/14.1.1 Safari/605.1.15', NULL, '2023-06-03 12:33:45'),
    (1025, 'ibrahim@gmail.com', 'success', '192.168.1.122', 'Mozilla/5.0 (10Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0', NULL, '2023-06-03 13:17:29'),
    (1026, 'yusuf@gmail.com', 'success', '192.168.1.123', 'Mozilla/5.0 (10Android 11; Mobile; rv:88.0) Gecko/88.0 Firefox/88.0', NULL, '2023-06-03 14:22:51'),
    (1027, 'esra@gmail.com', 'fail', '192.168.1.124', 'Mozilla/5.0 (10Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (10KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', 'Session expired', '2023-06-03 15:10:18'),
    (1028, 'esra@gmail.com', 'success', '192.168.1.124', 'Mozilla/5.0 (10Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (10KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NULL, '2023-06-03 15:11:02'),
    (1029, 'omer@gmail.com', 'success', '192.168.1.125', 'Mozilla/5.0 (10iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (10KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1', NULL, '2023-06-04 09:22:45'),
    (1030, 'aysenur@gmail.com', 'success', '192.168.1.126', 'Mozilla/5.0 (10Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (10KHTML, like Gecko) Version/14.1.1 Safari/605.1.15', NULL, '2023-06-04 10:05:33'),
    (1031, 'bot@malicious.com', 'fail', '192.168.1.127', 'python-requests/2.25.1', 'IP blocked', '2023-06-04 11:15:44'),
    (1032, 'admin@gmail.com', 'success', '192.168.1.128', 'Mozilla/5.0 (10Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (10KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NULL, '2023-06-04 12:30:19'),
    (1033, 'mustafas@gmail.com', 'success', '192.168.1.129', 'Mozilla/5.0 (10Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0', NULL, '2023-06-04 13:45:22'),
    (1034, 'zeynepy@gmail.com', 'success', '192.168.1.130', 'Mozilla/5.0 (10iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (10KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1', NULL, '2023-06-04 14:22:33'),
    (1035, 'ahmeto@gmail.com', 'fail', '192.168.1.131', 'Mozilla/5.0 (10Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (10KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', 'Invalid password', '2023-06-04 15:10:19'),
    (1036, 'ahmeto@gmail.com', 'success', '192.168.1.131', 'Mozilla/5.0 (10Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (10KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NULL, '2023-06-04 15:11:05'),
    (1037, 'emine@gmail.com', 'success', '192.168.1.132', 'Mozilla/5.0 (10Android 11; Mobile; rv:88.0) Gecko/88.0 Firefox/88.0', NULL, '2023-06-05 08:33:15'),
    (1038, 'hasan@gmail.com', 'success', '192.168.1.133', 'Mozilla/5.0 (10Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0', NULL, '2023-06-05 09:15:27'),
    (1039, 'fatmaa@gmail.com', 'success', '192.168.1.134', 'Mozilla/5.0 (10Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (10KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36', NULL, '2023-06-05 10:22:45'),
    (1040, 'murat@gmail.com', 'success', '192.168.1.135', 'Mozilla/5.0 (10iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (10KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1', NULL, '2023-06-05 11:10:33'),
    (1041, 'admin@gmail.com', 'fail', '192.168.1.136', 'Mozilla/5.0 (10Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (10KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', 'Session timeout', '2023-06-05 12:05:19'),
    (1042, 'admin@gmail.com', 'success', '192.168.1.136', 'Mozilla/5.0 (10Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (10KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NULL, '2023-06-05 12:06:02'),
    (1043, 'selino@gmail.com', 'success', '192.168.1.137', 'Mozilla/5.0 (10Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (10KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NULL, '2023-06-05 13:22:17'),
    (1044, 'cem@gmail.com', 'success', '192.168.1.138', 'Mozilla/5.0 (10Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (10KHTML, like Gecko) Version/14.1.1 Safari/605.1.15', NULL, '2023-06-05 14:33:28'),
    (1045, 'deniz@gmail.com', 'success', '192.168.1.139', 'Mozilla/5.0 (10Android 11; Mobile; rv:88.0) Gecko/88.0 Firefox/88.0', NULL, '2023-06-05 15:19:41'),
    (1046, 'kerem@gmail.com', 'success', '192.168.1.140', 'Mozilla/5.0 (10iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (10KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1', NULL, '2023-06-06 09:05:22'),
    (1047, 'buse@gmail.com', 'fail', '192.168.1.141', 'Mozilla/5.0 (10Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (10KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', 'Invalid password', '2023-06-06 10:15:33'),
    (1048, 'buse@gmail.com', 'fail', '192.168.1.141', 'Mozilla/5.0 (10Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (10KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', 'Invalid password', '2023-06-06 10:16:12'),
    (1049, 'buse@gmail.com', 'success', '192.168.1.141', 'Mozilla/5.0 (10Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (10KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NULL, '2023-06-06 10:17:05'),
    (1050, 'kaan@gmail.com', 'success', '192.168.1.142', 'Mozilla/5.0 (10Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0', NULL, '2023-06-06 11:22:44'),
    (1051, 'gizem@gmail.com', 'success', '192.168.1.143', 'Mozilla/5.0 (10Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0', NULL, '2023-06-06 12:33:19'),
    (1052, 'umut@gmail.com', 'success', '192.168.1.144', 'Mozilla/5.0 (10iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (10KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1', NULL, '2023-06-06 13:45:28'),
    (1053, 'ebru@gmail.com', 'success', '192.168.1.145', 'Mozilla/5.0 (10Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (10KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NULL, '2023-06-06 14:22:37'),
    (1054, 'unknown2@example.com', 'fail', '192.168.1.146', 'Mozilla/5.0 (10compatible; Googlebot/2.1; +http://www.google.com/bot.html)', 'User not found', '2023-06-06 15:10:23'),
    (1055, 'tolga@gmail.com', 'success', '192.168.1.147', 'Mozilla/5.0 (10Android 11; Mobile; rv:88.0) Gecko/88.0 Firefox/88.0', NULL, '2023-06-07 08:33:17'),
    (1056, 'melis@gmail.com', 'success', '192.168.1.148', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15', NULL, '2023-06-07 09:22:45');


    