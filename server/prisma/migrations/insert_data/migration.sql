-- delete all data from the tables
delete from public."AttendanceLog";
delete from public."User";
delete from public."Role";
delete from public."Gender";

-- insert data into the Role table if not exists
INSERT INTO public."Role" (
    "role_name"
            ) VALUES 
			('admin'),
			('coach'),
			('student');
			
-- insert data into the Gender table if not exists
INSERT INTO public."Gender" (
    "gender_name"
            ) VALUES 
			('male'),
			('female');			

-- insert data into the User table
INSERT INTO public."User" (
    id, "firstName", "lastName", email, password, role_id, gender_id, 
        active, "passwordChangedAt", "birthDate", "parentName", "parentPhone", 
            "createdAt", "updatedAt"
            ) VALUES 
            (999, NULL, NULL, 'admin@gmail.com', '$2b$10$XyaAHjjvZO3eLZgDUtITSOWXQD4/472LYORlNIU83RVVHmrz5GzXm', 1, NULL, TRUE, '2025-05-23 10:01:00', NULL, NULL, NULL, '2025-05-23 10:01:00', '2025-05-23 10:01:00'),
            
            (653, 'Akif', 'Taşdemir', 'mehmet@gmail.com', '$2b$10$uGD3H.aOXLa9P7vqgnkGGORk3cFzsYPtjvb.b5A31VgoNUSVNVbY6', 2, 1, FALSE, '2025-05-23 10:01:00', '2023-09-01 00:00:00', 'Ali Yılmaz', '5551234567', '2025-05-23 10:01:00', '2025-05-23 10:01:00'),
            
            (370, 'Ahmet', 'Çetin', 'ahmet@gmail.com', '$2b$10$u0fALOUvQKUGERo/za2ktu0NCOLm5UqZ.6AFgM4N.Cnd8UjqoCaLG', 2, 1, FALSE, '2025-05-31 17:11:00', '2025-12-25 00:00:00', 'Fatma Demir', '5559876543', '2025-05-23 10:01:00', '2025-05-31 17:11:00'),
            
            (465, 'Mustafa', 'Öztürk', 'mustafa@gmail.com', '$2b$10$4FBEsvHxzBr/DqvUFaECO.QTXeBWvWqq0zs4eMnD1v8Qckkhr3gRu', 2, 1, FALSE, '2025-05-23 10:01:00', '2024-01-15 00:00:00', 'Veli Kaya', '5556543210', '2025-05-23 10:01:00', '2025-05-23 10:01:00'),
            
            (321, 'Zeynep', 'Polat', 'zeynep@gmail.com', '$2b$10$WKo6V7tHNkhJ9ryiADRDQ.3AX3UR3GV3pHJfaiNva2fTaXy4kYVUe', 2, 2, FALSE, '2025-05-23 10:01:00', '2023-10-01 00:00:00', 'Hasan Çelik', '5551112233', '2025-05-23 10:01:00', '2025-05-23 10:01:00'),
            
            (789, 'Mehmet', 'Yılmaz', 'student@gmail.com', '$2b$10$Z8r0/GrVsoVWSQRQJgAUfeOGLVvPsIx1161QV1IzXd.fzc5Y1fp3y', 3, 1, FALSE, '2025-05-23 10:01:00', '2024-02-15 00:00:00', 'Ayşe Öztürk', '5552223344', '2025-05-23 10:01:00', '2025-05-23 10:01:00'),
            
            (685, 'Ayşe', 'Demir', 'student2@gmail.com', '$2b$10$74aIIo4k3TqqoVzVdX52/uXbfuyo.7TMhHGZdmJsuf.FrIrk1Gicq', 3, 2, FALSE, '2025-05-23 10:01:00', '2024-05-20 00:00:00', 'Mehmet Kara', '5553334455', '2025-05-23 10:01:00', '2025-05-23 10:01:00'),
            
            (486, 'Ali', 'Kaya', 'student3@gmail.com', '$2b$10$7Ve671Pf7jRENUAykl04TubtNCfoWOJ1/eeJWbRkL7Jua8C3e3bJi', 3, 1, FALSE, '2025-05-23 10:01:00', '2025-03-10 00:00:00', 'Selin Yıldız', '5554445566', '2025-05-23 10:01:00', '2025-05-23 10:01:00'),
            
            (583, 'Fatma', 'Çelik', 'student4@gmail.com', '$2b$10$dVxFdRdRx5.dxRDPBpO3n.wuAqxbjRlv1.wbi3PDobkSh0YpcMu.O', 3, 2, FALSE, '2025-05-23 10:01:00', NULL, NULL, NULL, '2025-05-23 10:01:00', '2025-05-23 10:01:00'),
            
            (741, 'Emre', 'Öztürk', 'student5@gmail.com', '$2b$10$0ZlZsA47fOk6T0x74iWZlO7P2ykvW2/5fk6wnucOBSObhSzkmPFFO', 3, 1, FALSE, '2025-05-23 10:01:00', NULL, NULL, NULL, '2025-05-23 10:01:00', '2025-05-23 10:01:00'),
            
            (852, 'Zeynep', 'Kara', 'student6@gmail.com', '$2b$10$0wN86vKoUWtXtYWSIV6ikOa.AfywrhOwUcq2q85MCLLd9eukONr9G', 3, 2, FALSE, '2025-05-23 10:01:00', NULL, NULL, NULL, '2025-05-23 10:01:00', '2025-05-23 10:01:00'),
            
            (682, 'Burak', 'Yıldız', 'student7@gmail.com', '$2b$10$1C7hAdeIi.xUqxaK9uFIXeCUK.q9GcoLl0czGmu7tgPciIxJClXgG', 3, 1, FALSE, '2025-05-23 10:01:00', NULL, NULL, NULL, '2025-05-23 10:01:00', '2025-05-23 10:01:00');
			
			
			
			
			
			
			

-- insert data into the AttendanceLog table
INSERT INTO public."AttendanceLog" (
    id, "student_id", "date", status, note,"createdAt", "updatedAt"
            ) VALUES 
			('3','789','2025-05-15 00:00:00','not_attended','','2025-05-30 11:53:23.447','2025-05-30 11:53:23.447'),
('5','789','2025-05-16 00:00:00','attended','','2025-05-30 11:55:42.978','2025-05-30 11:55:42.978'),
('685','789','2025-05-17 00:00:00','attended','','2025-05-30 11:55:48.373','2025-05-30 11:55:48.373'),
('7','789','2025-05-18 00:00:00','with_report','Late arrival with doctors note','2025-05-30 11:58:27.667','2025-05-06 00:00:00'),
('8','789','2025-05-19 00:00:00','day_off','holiday','2025-05-30 11:58:27.753','2025-05-05 00:00:00'),
('9','685','2025-05-16 21:00:00','day_off','','2025-05-30 12:48:33.166','2025-05-30 12:48:33.166'),
('10','685','2025-05-23 21:00:00','attended','','2025-05-30 12:48:41.421','2025-05-30 12:48:41.421'),
('14','685','2025-05-24 21:00:00','with_report','','2025-05-30 12:49:20.638','2025-05-30 12:49:20.638'),
('15','685','2025-05-15 21:00:00','not_attended','','2025-05-31 19:44:33.771','2025-05-31 19:44:33.771'),
('16','685','2025-06-03 21:00:00','attended','','2025-05-31 21:16:55.099','2025-05-31 21:16:55.099'),
('17','685','2025-06-04 21:00:00','attended','','2025-05-31 21:16:57.741','2025-05-31 21:16:57.741'),
('18','685','2025-06-05 21:00:00','not_attended','','2025-05-31 21:17:01.332','2025-05-31 21:17:01.332'),
('19','685','2025-06-06 21:00:00','with_report','doctor','2025-05-31 21:17:08.625','2025-05-31 21:17:08.625');
