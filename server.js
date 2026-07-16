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
      font-family: 'Arial', sans-serif;
    }
    
    .container {
      background-color: rgba(190, 226, 237, 0.5);
      padding: 50px;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
      max-width: 600px;
      width: 90%;
      backdrop-filter: blur(5px);
    }
    
    h1 {
      color: white;
      font-weight: bold;
      font-size: 36px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      margin-bottom: 20px;
      letter-spacing: 1px;
    }
    
    .info {
      color: white;
      font-size: 18px;
      line-height: 1.8;
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
    }
    
    .info-title {
      font-weight: bold;
      color: #fff;
      margin-top: 15px;
      font-size: 16px;
    }
    
    .student-id {
      background-color: rgba(255, 255, 255, 0.2);
      padding: 10px 15px;
      border-radius: 8px;
      margin: 15px 0;
      font-weight: bold;
      letter-spacing: 2px;
    }
    
    .nickname {
      color: #ffe066;
      font-weight: bold;
      font-size: 22px;
      margin: 10px 0;
    }
    
    .hobbies {
      background-color: rgba(255, 255, 255, 0.15);
      padding: 15px;
      border-radius: 8px;
      margin-top: 15px;
    }
    
    .hobby-item {
      display: inline-block;
      background-color: rgba(255, 255, 255, 0.25);
      padding: 8px 16px;
      margin: 5px;
      border-radius: 20px;
      font-size: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎵 ฟีโน่ 🎮</h1>
    
    <div class="student-id">
      รหัสนักศึกษา: 69319010187
    </div>
    
    <div class="info">
      <p><strong>ชื่อจริง:</strong> ชินพัฒน์ พรประเสริฐ</p>
      <p class="nickname">ชื่อเล่น: ฟีโน่ ✨</p>
      
      <div class="hobbies">
        <p class="info-title">🎯 สิ่งที่ชอบ:</p>
        <div>
          <span class="hobby-item">🎵 ฟังเพลง</span>
          <span class="hobby-item">🎮 เล่นเกม</span>
          <span class="hobby-item">💪 Weight Training</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`);
 });

 // 4. สั่งให้เซิร์ฟเวอรเริ่มต้นเปิดรับฟังการเชื่อมต่อตาม Port ที่กําหนดไว้
 server.listen(port, () => {
 console.log(`Server is running! เครื่องแม่ข่ายเปิดทํางานแล้วที่ช่องทาง: ${port}`);
 });
