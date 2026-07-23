// 1. เรียกใช้งาน Module ที่ชื่อว่า 'http' ซึ่งเป็นระบบพื้นฐานของ Node.js สําหรับทําเซิร์ฟเวอร์
 const http = require('http');
 // 2. เรียกใช้งาน Pool จากไลบรารี pg สําหรับจัดการการเชื่อมต่อฐานข้อมูล
 const { Pool } = require('pg');
 // 3. ตั้งค่าการเชื่อมต่อ โดยดึง URL มาจาก Environment Variable
 const pool = new Pool({
   connectionString: process.env.DATABASE_URL,
 });

 // 4. กําหนดช่องทาง (Port) ที่เซิร์ฟเวอร์จะใช้สื่อสาร
 const port = process.env.PORT || 3000;

 // 5. สร้างเครื่องแม่ข่าย (Server) ที่คอยรับคําขอ (req) และตอบกลับ (res)
 const server = http.createServer(async (req, res) => {

 // 5.1 ตั้งรหัสสถานะ 200 หมายถึง "ทํางานสําเร็จ (OK)"
 res.statusCode = 200;

 // 5.2 บอกเบราว์เซอร์ของผู้ใช้ว่า สิ่งที่ส่งกลับไปคือไฟล์ข้อความแบบ HTML
 res.setHeader('Content-Type', 'text/html; charset=utf-8');

 try {
   // 6. ขอเชื่อมต่อและส่งคำสั่ง SQL ไปดึงข้อมูลจากตาราง students (ดึง 6 คน)
   const client = await pool.connect();
   const result = await client.query('SELECT * FROM students LIMIT 6');
   client.release(); // คืนการเชื่อมต่อเมื่อใช้งานเสร็จ

   // 7. สร้างแถวตาราง HTML จากข้อมูลที่ได้จากฐานข้อมูล
   let tableRows = '';
   result.rows.forEach(row => {
     tableRows += `<tr>
       <td>${row.student_id || 'N/A'}</td>
       <td>${row.student_name || 'N/A'}</td>
       <td>${row.nickname || 'N/A'}</td>
     </tr>`;
   });

// 8. ส่งข้อมูลหน้าเว็บกลับไปหาผู้ใช้
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
      min-height: 100vh;
      background-image: url('https://media.tenor.com/cRTQk6N_FxMAAAAe/swag-cat-swagbilli-cutecat-cats-cat-swag-ok-yooo-yo.png');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Arial', sans-serif;
      padding: 20px;
    }
    
    .container {
      background-color: rgba(190, 226, 237, 0.5);
      padding: 50px;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
      max-width: 800px;
      width: 100%;
      backdrop-filter: blur(5px);
    }
    
    h1 {
      color: white;
      font-weight: bold;
      font-size: 36px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      margin-bottom: 30px;
      letter-spacing: 1px;
      -webkit-text-stroke: 1px black;
      text-stroke: 1px black;
    }
    
    .info-table {
      width: 100%;
      margin: 20px auto;
      background-color: rgba(255, 255, 255, 0.5);
      border-collapse: collapse;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .info-table th,
    .info-table td {
      padding: 15px 20px;
      text-align: left;
      color: white;
      -webkit-text-stroke: 0.7px black;
      text-stroke: 0.7px black;
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    }

    .info-table th {
      background-color: rgba(255, 107, 157, 0.8);
      font-weight: bold;
      font-size: 16px;
      -webkit-text-stroke: 0.8px black;
      text-stroke: 0.8px black;
    }

    .info-table tr:last-child td {
      border-bottom: none;
    }

    .info-table tr:hover {
      background-color: rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
    }

    .info-table tbody tr:nth-child(even) {
      background-color: rgba(255, 255, 255, 0.1);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎵 รายชื่อนักศึกษา 🎮</h1>
    
    <table class="info-table">
      <thead>
        <tr>
          <th>รหัสนักศึกษา</th>
          <th>ชื่อ-นามสกุล</th>
          <th>ชื่อเล่น</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  </div>

  <script>
    function playSound() {
      const response = document.getElementById('catResponse');
      response.style.display = 'block';
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioContext.currentTime;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(400, now);
      oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.2);
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      
      oscillator.start(now);
      oscillator.stop(now + 0.2);
      
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      
      osc2.frequency.setValueAtTime(300, now + 0.25);
      osc2.frequency.exponentialRampToValueAtTime(150, now + 0.45);
      gain2.gain.setValueAtTime(0.3, now + 0.25);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      
      osc2.start(now + 0.25);
      osc2.stop(now + 0.45);
      
      setTimeout(() => {
        response.style.display = 'none';
      }, 500);
    }
  </script>
</body>
</html>`);
 } catch (err) {
   // กรณีเชื่อมต่อไม่ได้หรือเขียนชื่อตารางผิด
   console.error(err);
   res.end(`
     <!DOCTYPE html>
     <html>
     <head>
       <meta charset="utf-8">
       <style>
         body {
           font-family: Arial, sans-serif;
           display: flex;
           justify-content: center;
           align-items: center;
           height: 100vh;
           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
         }
         .error-container {
           background: white;
           padding: 40px;
           border-radius: 10px;
           box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
           text-align: center;
         }
         h1 {
           color: #d32f2f;
           margin-bottom: 20px;
         }
         p {
           color: #666;
           line-height: 1.6;
         }
       </style>
     </head>
     <body>
       <div class="error-container">
         <h1>❌ เกิดข้อผิดพลาด!</h1>
         <p><strong>ข้อความ:</strong> ${err.message}</p>
         <p>โปรดตรวจสอบการเชื่อมต่อฐานข้อมูลหรือชื่อตาราง</p>
       </div>
     </body>
     </html>
   `);
 }
 });

 // 9. สั่งให้เซิร์ฟเวอร์เริ่มต้นเปิดรับฟังการเชื่อมต่อตาม Port ที่กําหนดไว้
 server.listen(port, () => {
 console.log(`Server is running! เครื่องแม่ข่ายเปิดทํางานแล้วที่ช่องทาง: ${port}`);
 });
