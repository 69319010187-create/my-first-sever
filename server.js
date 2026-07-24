// 1. เรียกใช้งาน Module ที่ชื่อว่า 'http' ซึ่งเป็นระบบพื้นฐานของ Node.js สำหรับทำเซิร์ฟเวอร์
const http = require('http');
const url = require('url');
// 2. เรียกใช้งาน Pool จากไลบรารี pg สำหรับจัดการการเชื่อมต่อฐานข้อมูล
const { Pool } = require('pg');
// 3. ตั้งค่าการเชื่อมต่อ โดยดึง URL มาจาก Environment Variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 4. กำหนดช่องทาง (Port) ที่เซิร์ฟเวอร์จะใช้สื่อสาร
const port = process.env.PORT || 3000;

function sendJSON(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(obj));
}

function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // ป้องกัน body ใหญ่เกินไป
      if (body.length > 1e6) {
        req.connection.destroy();
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve(null);
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        // ถ้าไม่ใช่ JSON พยายาม parse แบบ urlencoded
        const params = new URLSearchParams(body);
        const obj = {};
        for (const [k, v] of params.entries()) obj[k] = v;
        resolve(obj);
      }
    });
    req.on('error', err => reject(err));
  });
}

// 5. สร้างเครื่องแม่ข่าย (Server) ที่คอยรับคำขอ (req) และตอบกลับ (res)
const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // API: GET /students  => คืนค่า JSON list ของนักศึกษา
    if (req.method === 'GET' && pathname === '/students') {
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT * FROM students ORDER BY student_id LIMIT 100');
        client.release();
        return sendJSON(res, 200, { rows: result.rows });
      } catch (err) {
        client.release();
        console.error(err);
        return sendJSON(res, 500, { error: err.message });
      }
    }

    // API: POST /students  => เพิ่มนักศึกษาใหม่ (รับ JSON { student_name })
    if (req.method === 'POST' && pathname === '/students') {
      const body = await parseRequestBody(req);
      const name = (body && body.student_name) ? String(body.student_name).trim() : null;
      if (!name) return sendJSON(res, 400, { error: 'student_name is required' });

      const client = await pool.connect();
      try {
        const result = await client.query('INSERT INTO students (student_name) VALUES ($1) RETURNING *', [name]);
        client.release();
        return sendJSON(res, 201, { row: result.rows[0] });
      } catch (err) {
        client.release();
        console.error(err);
        return sendJSON(res, 500, { error: err.message });
      }
    }

    // API: PUT /students/:id  => แก้ไขชื่อนักศึกษา
    if (req.method === 'PUT' && pathname.startsWith('/students/')) {
      const id = pathname.split('/')[2];
      const body = await parseRequestBody(req);
      const name = (body && body.student_name) ? String(body.student_name).trim() : null;
      if (!name) return sendJSON(res, 400, { error: 'student_name is required' });

      const client = await pool.connect();
      try {
        const result = await client.query('UPDATE students SET student_name = $1 WHERE student_id = $2 RETURNING *', [name, id]);
        client.release();
        if (result.rows.length === 0) return sendJSON(res, 404, { error: 'student not found' });
        return sendJSON(res, 200, { row: result.rows[0] });
      } catch (err) {
        client.release();
        console.error(err);
        return sendJSON(res, 500, { error: err.message });
      }
    }

    // API: DELETE /students/:id  => ลบนักศึกษา
    if (req.method === 'DELETE' && pathname.startsWith('/students/')) {
      const id = pathname.split('/')[2];
      const client = await pool.connect();
      try {
        const result = await client.query('DELETE FROM students WHERE student_id = $1 RETURNING *', [id]);
        client.release();
        if (result.rows.length === 0) return sendJSON(res, 404, { error: 'student not found' });
        return sendJSON(res, 200, { row: result.rows[0] });
      } catch (err) {
        client.release();
        console.error(err);
        return sendJSON(res, 500, { error: err.message });
      }
    }

    // หน้าเว็บหลัก: GET / (หรือ /index.html)
    if (req.method === 'GET' && (pathname === '/' || pathname === '/index.html')) {
      // ส่ง HTML ที่มี UI สำหรับเพิ่ม/แก้ไข/ลบ พร้อม JavaScript ที่เรียก API ข้างต้น
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 100%; min-height: 100vh;
      background-image: url('https://media.tenor.com/cRTQk6N_FxMAAAAe/swag-cat-swagbilli-cutecat-cats-cat-swag-ok-yooo-yo.png');
      background-size: cover; background-position: center; background-attachment: fixed;
      display: flex; justify-content: center; align-items: center; font-family: 'Arial', sans-serif; padding: 20px;
    }
    .container { background-color: rgba(190,226,237,0.85); padding: 30px; border-radius: 12px; text-align: center; box-shadow: 0 8px 16px rgba(0,0,0,0.3); max-width: 900px; width: 100%; }
    h1 { color: #111; font-weight: bold; font-size: 32px; margin-bottom: 20px; }
    .controls { display:flex; gap:10px; justify-content:center; margin-bottom:10px; }
    input[type='text']{ padding:10px; font-size:16px; width:300px; border-radius:6px; border:1px solid #ccc; }
    button { padding:10px 16px; font-size:16px; border-radius:6px; border:none; cursor:pointer; }
    button.add { background:#4caf50; color:white; }
    button.update { background:#2196f3; color:white; }
    button.cancel { background:#9e9e9e; color:white; }
    .info-table { width:100%; margin: 20px auto; background-color: rgba(255,255,255,0.6); border-collapse: collapse; border-radius:8px; overflow:hidden; }
    .info-table th, .info-table td { padding:12px 16px; text-align:left; color:#111; border-bottom:1px solid rgba(0,0,0,0.08); }
    .info-table th { background: rgba(255,107,157,0.9); color:white; }
    .actions button { margin-right:6px; }
    .msg { margin-top:8px; color:#333; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎵 รายชื่อนักศึกษา 🎮</h1>

    <div class="controls">
      <input id="studentName" type="text" placeholder="ชื่อ-นามสกุล" />
      <button id="addBtn" class="add">เพิ่มรายชื่อ</button>
      <button id="updateBtn" class="update" style="display:none">บันทึกการแก้ไข</button>
      <button id="cancelBtn" class="cancel" style="display:none">ยกเลิก</button>
    </div>
    <div class="msg" id="msg"></div>

    <table class="info-table">
      <thead>
        <tr>
          <th>รหัสนักศึกษา</th>
          <th>ชื่อ-นามสกุล</th>
          <th>การกระทำ</th>
        </tr>
      </thead>
      <tbody id="studentsBody">
        <!-- rows จะถูกเติมโดย JavaScript -->
      </tbody>
    </table>
  </div>

  <script>
    let editingId = null;

    async function loadStudents(){
      const res = await fetch('/students');
      const data = await res.json();
      const tbody = document.getElementById('studentsBody');
      tbody.innerHTML = '';
      (data.rows || []).forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `\n          <td>${row.student_id || 'N/A'}</td>\n          <td>${(row.student_name) ? escapeHtml(row.student_name) : 'N/A'}</td>\n          <td class="actions">\n            <button data-id="${row.student_id}" data-name="${escapeAttr(row.student_name)}" onclick="onEdit(this)">แก้ไข</button>\n            <button data-id="${row.student_id}" onclick="onDelete(this)">ลบ</button>\n          </td>\n        `;
        tbody.appendChild(tr);
      });
    }

    function escapeHtml(str){
      if (!str) return '';
      return str.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#39;");
    }
    function escapeAttr(str){ return (str||'').replaceAll('"','&quot;'); }

    document.getElementById('addBtn').addEventListener('click', async () => {
      const nameEl = document.getElementById('studentName');
      const name = nameEl.value.trim();
      const msg = document.getElementById('msg');
      if (!name) { msg.textContent = 'กรุณากรอกชื่อก่อน'; return; }
      try {
        const res = await fetch('/students', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ student_name: name }) });
        const data = await res.json();
        if (res.ok) {
          msg.textContent = 'เพิ่มสำเร็จ';
          nameEl.value = '';
          loadStudents();
        } else {
          msg.textContent = data.error || 'ไม่สามารถเพิ่มได้';
        }
      } catch (err) {
        msg.textContent = err.message;
      }
    });

    function onEdit(btn){
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      editingId = id;
      document.getElementById('studentName').value = name;
      document.getElementById('addBtn').style.display = 'none';
      document.getElementById('updateBtn').style.display = 'inline-block';
      document.getElementById('cancelBtn').style.display = 'inline-block';
      document.getElementById('msg').textContent = '';
    }

    document.getElementById('cancelBtn').addEventListener('click', () => {
      resetForm();
    });

    document.getElementById('updateBtn').addEventListener('click', async () => {
      const nameEl = document.getElementById('studentName');
      const name = nameEl.value.trim();
      const msg = document.getElementById('msg');
      if (!editingId) { msg.textContent = 'ไม่มีรายการให้แก้ไข'; return; }
      if (!name) { msg.textContent = 'กรุณากรอกชื่อก่อน'; return; }
      try {
        const res = await fetch('/students/' + editingId, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ student_name: name }) });
        const data = await res.json();
        if (res.ok) {
          msg.textContent = 'แก้ไขสำเร็จ';
          resetForm();
          loadStudents();
        } else {
          msg.textContent = data.error || 'ไม่สามารถแก้ไขได้';
        }
      } catch (err) {
        msg.textContent = err.message;
      }
    });

    async function onDelete(btn){
      if (!confirm('ต้องการลบรายการนี้หรือไม่?')) return;
      const id = btn.getAttribute('data-id');
      const msg = document.getElementById('msg');
      try {
        const res = await fetch('/students/' + id, { method: 'DELETE' });
        const data = await res.json();
        if (res.ok) {
          msg.textContent = 'ลบสำเร็จ';
          loadStudents();
        } else {
          msg.textContent = data.error || 'ไม่สามารถลบได้';
        }
      } catch (err) {
        msg.textContent = err.message;
      }
    }

    function resetForm(){
      editingId = null;
      document.getElementById('studentName').value = '';
      document.getElementById('addBtn').style.display = 'inline-block';
      document.getElementById('updateBtn').style.display = 'none';
      document.getElementById('cancelBtn').style.display = 'none';
      document.getElementById('msg').textContent = '';
    }

    // โหลดรายการตอนเริ่ม
    loadStudents();
  </script>
</body>
</html>`);
    }

    // route not found
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Not Found');

  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`<html><body><h1>❌ เกิดข้อผิดพลาด!</h1><pre>${err.message}</pre></body></html>`);
  }
});

// 9. สั่งให้เซิร์ฟเวอร์เริ่มต้นเปิดรับฟังการเชื่อมต่อตาม Port ที่กำหนดไว้
server.listen(port, () => {
  console.log(`Server is running! เครื่องแม่ข่ายเปิดทำงานแล้วที่ช่องทาง: ${port}`);
});
