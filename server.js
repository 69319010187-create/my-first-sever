// 1. เรียกใช้งาน Module ที่ชื่อว่า 'http' ซึ่งเป็นระบบพื้นฐานของ Node.js สําหรับทําเซิร์ฟเวอร์
 const http = require('http');

 // 2. กําหนดช่องทาง (Port) ที่เซิร์ฟเวอร์จะใช้สื่อสาร โดยให้ใช้ของที่ Cloud กําหนด
 const port = process.env.PORT || 3000;

 // 3. สร้างเครื่องแม่ข่าย (Server) ที่คอยรับคําขอ (req) และตอบกลับ (res)
 const server = http.createServer((req, res) => {

 // 3.1 ตั้งรหัสสถานะ 200 หมายถึง "ทํางานสําเร็จ (OK)"
 res.statusCode = 200;

 // 3.2 บอกเบราว์เซอร์ของผู้ใช้ว่า สิ่งที่ส่งกลับไปคือไฟล์ข้อความแบบ HTML
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

    .cat-button {
      background: linear-gradient(135deg, #ff6b9d, #feca57);
      border: none;
      color: white;
      padding: 15px 30px;
      font-size: 18px;
      font-weight: bold;
      border-radius: 25px;
      cursor: pointer;
      margin-top: 20px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    }

    .cat-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }

    .cat-button:active {
      transform: scale(0.95);
    }

    .cat-response {
      margin-top: 15px;
      font-size: 40px;
      animation: bounce 0.5s ease;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }

    .music-player {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(255, 107, 157, 0.9);
      padding: 15px;
      border-radius: 50px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      z-index: 1000;
      font-size: 24px;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .music-player:hover {
      transform: scale(1.1);
      background: rgba(255, 107, 157, 1);
    }

    .music-player.playing {
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .music-modal {
      display: none;
      position: fixed;
      z-index: 2000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
    }

    .music-modal.show {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .music-content {
      position: relative;
      background: rgba(190, 226, 237, 0.95);
      padding: 20px;
      border-radius: 15px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
      max-width: 560px;
      width: 90%;
    }

    .close-music {
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 28px;
      font-weight: bold;
      color: white;
      cursor: pointer;
      background: rgba(255, 107, 157, 0.8);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-music:hover {
      background: rgba(255, 107, 157, 1);
    }

    .youtube-embed {
      position: relative;
      width: 100%;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
      border-radius: 10px;
    }

    .youtube-embed iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 10px;
    }
  </style>
</head>
<body>
  <!-- Music Player Button -->
  <div class="music-player" id="musicPlayer" onclick="openMusicPlayer()">
    🎵
  </div>

  <!-- Music Modal -->
  <div class="music-modal" id="musicModal">
    <div class="music-content">
      <button class="close-music" onclick="closeMusicPlayer()">✕</button>
      <div class="youtube-embed">
        <iframe 
          width="100%" 
          height="315" 
          src="https://www.youtube.com/embed/_LIaHrSm2Ek?autoplay=1&controls=1&modestbranding=1" 
          title="Background Music" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>
    </div>
  </div>

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

      <button class="cat-button" onclick="playSound()">🐱 Cat Sound</button>
      <div class="cat-response" id="catResponse" style="display: none;">Meow! 🐱</div>
    </div>
  </div>

  <script>
    function playSound() {
      // Show the cat response
      const response = document.getElementById('catResponse');
      response.style.display = 'block';
      
      // Use Web Audio API to create cat sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Meow sound frequencies
      const now = audioContext.currentTime;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // First meow - higher pitch
      oscillator.frequency.setValueAtTime(400, now);
      oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.2);
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      
      oscillator.start(now);
      oscillator.stop(now + 0.2);
      
      // Second meow - lower pitch
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
      
      // Hide response after animation
      setTimeout(() => {
        response.style.display = 'none';
      }, 500);
    }

    function openMusicPlayer() {
      const modal = document.getElementById('musicModal');
      const player = document.getElementById('musicPlayer');
      modal.classList.add('show');
      player.classList.add('playing');
    }

    function closeMusicPlayer() {
      const modal = document.getElementById('musicModal');
      const player = document.getElementById('musicPlayer');
      modal.classList.remove('show');
      player.classList.remove('playing');
    }

    // Close modal when clicking outside
    document.getElementById('musicModal').addEventListener('click', function(event) {
      if (event.target === this) {
        closeMusicPlayer();
      }
    });
  </script>
</body>
</html>`);
 });

 // 4. สั่งให้เซิร์ฟเวอรเริ่มต้นเปิดรับฟังการเชื่อมต่อตาม Port ที่กําหนดไว้
 server.listen(port, () => {
 console.log(`Server is running! เครื่องแม่ข่ายเปิดทํางานแล้วที่ช่องทาง: ${port}`);
 });
