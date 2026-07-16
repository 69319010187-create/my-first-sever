// 1. เรียกใช้งาน Module ที่ชื่อว่า 'http' ซึ่งเป็นระบบพื้นฐานของ Node.js สําหรับทําเซิร์ฟเวอร์
 const http = require('http');

 // 2. กําหนดช่องทาง (Port) ที่เซิร์ฟเวอร์จะใช้สื่อสาร โดยให้ใช้ของที่ Cloud กําหนด
 const port = process.env.PORT || 3000;

 // 3. สร้างเครื่องแม่ข่าย (Server) ที่คอยรับคําขอ (req) และตอบกลับ (res)
 const server = http.createServer((req, res) => {

 // 3.1 ตั้งรหัสสถานะ 200 หมายถึง "ทํางานสําเร็จ (OK)"
 res.statusCode = 200;

 // 3.2 บอกเบราว์เซอร์ของผู้ใช้ว่า สิ่งที่ส่งกลับไปคือไฟล์ข้อความแบบ HTML แบบ UTF-8
 res.setHeader('Content-Type', 'text/html; charset=utf-8');

// 3.3 ส่งข้อมูลหน้าเว็บกลับไปหาผู้ใช้ (*** ชินพัฒน์ พรประเสริฐ ***)
res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      width: 100%;
      height: 100vh;
      background-image: url('https://images.hitpaw.com/topics/gif-tips/vibe-cat-gif.gif');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: Arial, sans-serif;
    }
    
    .container {
      background-color: rgba(190, 226, 237, 0.5);
      padding: 40px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    h1 {
      color: white;
      font-weight: bold;
      font-size: 32px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>สวัสดีครับ! นี่คือเซิร์ฟเวอร์ของ ชินพัฒน์ พรประเสริฐ</h1>
  </div>
</body>
</html>`);
 });

 // 4. สั่งให้เซิร์ฟเวอรเริ่มต้นเปิดรับฟังการเชื่อมต่อตาม Port ที่กําหนดไว้
 server.listen(port, () => {
 console.log(`Server is running! เครื่องแม่ข่ายเปิดทํางานแล้วที่ช่องทาง: ${port}`);
 });
