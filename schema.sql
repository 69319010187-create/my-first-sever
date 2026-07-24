-- สร้างตาราง students ถ้าไม่มีอยู่แล้ว
CREATE TABLE IF NOT EXISTS students (
  student_id SERIAL PRIMARY KEY,
  student_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- เพิ่มข้อมูลตัวอย่าง (เฉพาะในครั้งแรก)
INSERT INTO students (student_name) VALUES 
  ('สมชาย ใจดี'),
  ('สมหญิง ฉลาด'),
  ('นวล ร่วมสุข'),
  ('มานะ ขยัน'),
  ('จิตรา สวย'),
  ('พัฒน์ เพชร');
