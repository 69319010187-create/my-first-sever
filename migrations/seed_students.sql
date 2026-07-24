-- migrations/seed_students.sql
-- ตัวอย่างข้อมูลเริ่มต้น
INSERT INTO students (student_name) VALUES
('สมชาย ใจดี'),
('สมหญิง ร่าเริง'),
('จิตร ภูมิใจ')
ON CONFLICT DO NOTHING;
