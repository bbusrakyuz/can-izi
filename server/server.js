const express = require('express');
const cors = require('cors');
const os = require('os');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const signalsFile = path.join(__dirname, 'emergencySignals.json');

// Sinyalleri dosyadan yükle
let emergencySignals = [];
if (fs.existsSync(signalsFile)) {
  try {
    emergencySignals = JSON.parse(fs.readFileSync(signalsFile, 'utf8'));
  } catch (err) {
    console.error('Sinyaller dosyası okunamadı:', err);
  }
}

// Sinyalleri dosyaya kaydet
function saveSignals() {
  try {
    fs.writeFileSync(signalsFile, JSON.stringify(emergencySignals, null, 2));
  } catch (err) {
    console.error('Sinyaller dosyaya yazılamadı:', err);
  }
}

function getLocalIp() {
  const nets = os.networkInterfaces();
  const candidates = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('169.254')) {
        candidates.push({ name, address: net.address });
      }
    }
  }

  const wifi = candidates.find(item => /wi[-]?fi|wireless/i.test(item.name));
  if (wifi) return wifi.address;

  const ethernet = candidates.find(item => /ethernet/i.test(item.name));
  if (ethernet) return ethernet.address;

  return candidates.length > 0 ? candidates[0].address : 'localhost';
}

app.post('/emergency', (req, res) => {
  const { deviceName, battery, status } = req.body;
  const signal = { deviceName, battery, status, timestamp: new Date() };
  emergencySignals.push(signal);
  saveSignals(); // Dosyaya kaydet
  console.log('Acil durum sinyali alındı:', signal);
  res.status(200).send({ message: 'Sinyal alındı' });
});

app.get('/scan', (req, res) => {
  const deviceName = req.query.deviceName || '';
  const battery = parseInt(req.query.battery, 10) || 10;
  if (deviceName) {
    emergencySignals.push({ deviceName, battery, status: 'critical', timestamp: new Date() });
    saveSignals(); // Dosyaya kaydet
    console.log('Scan ile acil durum sinyali alındı:', { deviceName, battery });
  }
  res.send(`<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CAN-IZI Scan</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .box { padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
    button { background: red; color: white; border: none; padding: 14px 20px; font-size: 18px; cursor: pointer; border-radius: 8px; }
    input { width: 100%; padding: 12px; margin: 10px 0; font-size: 16px; }
  </style>
</head>
<body>
  <div class="box">
    <h1>CAN-IZI Scan</h1>
    ${deviceName ? `<p><strong>${deviceName}</strong> için acil durum sinyali gönderildi.</p>` : '<p>Device name QR ile gelmedi. Lütfen manuel olarak girin.</p>'}
    <form method="GET" action="/scan">
      <label for="deviceName">Device Name</label>
      <input id="deviceName" name="deviceName" placeholder="Redmi-9" value="${deviceName}" required />
      <label for="battery">Batarya seviyesi (%)</label>
      <input id="battery" name="battery" type="number" min="1" max="100" value="${battery}" />
      <button type="submit">Acil Durum Gönder</button>
    </form>
    <p>Radar uygulamanız artık <code>/signals</code> yolundan bu sinyali görebilir.</p>
  </div>
</body>
</html>`);
});

app.get('/', (req, res) => {
  const localIp = getLocalIp();
  res.send(`<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CAN-IZI API</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    input, button { width: 100%; padding: 12px; font-size: 16px; margin: 10px 0; }
    button { background: red; color: white; border: none; cursor: pointer; border-radius: 8px; }
    button:active { opacity: 0.9; }
    .qr { margin: 20px 0; }
    #status { margin-top: 16px; font-size: 16px; }
    small { color: #555; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js"></script>
</head>
<body>
  <h1>CAN-IZI API</h1>
  <p>Telefonunla QR okutarak hızlıca acil durum sinyali gönderebilirsin.</p>
  <p><strong>Bu PC’nin ağ adresi:</strong> <code>${localIp}:3000</code></p>
  <p>Telefonunla bu sayfayı açmak yerine, QR’ı taratıp otomatik gönderim yapabilirsin.</p>
  <label for="hostInput">Sunucu adresi</label>
  <input id="hostInput" type="text" value="${localIp}:3000" />
  <label for="deviceNameInput">Telefonunuzun Bluetooth/İsim</label>
  <input id="deviceNameInput" type="text" placeholder="Örn. Redmi-9 veya iPhone" />
  <label for="batteryInput">Batarya seviyesi (%)</label>
  <input id="batteryInput" type="number" min="1" max="100" value="10" />
  <button id="generateBtn">QR Oluştur</button>
  <div id="qrcode" class="qr"></div>
  <div id="status"></div>
  <script>
    const status = document.getElementById('status');
    const hostInput = document.getElementById('hostInput');
    const deviceNameInput = document.getElementById('deviceNameInput');
    const batteryInput = document.getElementById('batteryInput');
    const qrcodeEl = document.getElementById('qrcode');

    document.getElementById('generateBtn').addEventListener('click', () => {
      const host = hostInput.value.trim();
      const deviceName = deviceNameInput.value.trim();
      const battery = parseInt(batteryInput.value, 10) || 10;
      if (!host) {
        status.textContent = 'Lütfen sunucu adresini girin.';
        return;
      }
      if (!deviceName) {
        status.textContent = 'Lütfen cihaz ismini girin.';
        return;
      }
      const url = 'http://' + host + '/scan?deviceName=' + encodeURIComponent(deviceName) + '&battery=' + battery;
      status.textContent = 'QR oluşturuldu. Telefonla tara.';
      qrcodeEl.innerHTML = '';
      QRCode.toCanvas(document.createElement('canvas'), url, { width: 240 }, (err, canvas) => {
        if (err) {
          status.textContent = 'QR oluşturulamadı: ' + err.message;
          return;
        }
        qrcodeEl.innerHTML = '';
        qrcodeEl.appendChild(canvas);
        const link = document.createElement('p');
        link.innerHTML = '<small>Tarayıcı açarsa bu adrese gider: <a href="' + url + '" target="_blank">' + url + '</a></small>';
        qrcodeEl.appendChild(link);
      });
    });
  </script>
</body>
</html>`);
});

app.get('/signals', (req, res) => {
  res.json(emergencySignals);
});

app.get('/radar', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CAN-IZI Radar</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .signal { border: 1px solid #ccc; padding: 10px; margin: 10px 0; background: #ffe6e6; }
    .critical { background: #ffcccc; border-color: red; }
    .normal { background: #e6ffe6; border-color: green; }
    button { padding: 10px; background: blue; color: white; border: none; cursor: pointer; }
  </style>
</head>
<body>
  <h1>CAN-IZI Radar</h1>
  <button onclick="loadSignals()">Sinyalleri Güncelle</button>
  <div id="signals"></div>
  <script>
    function loadSignals() {
      fetch('/signals')
        .then(response => response.json())
        .then(signals => {
          const container = document.getElementById('signals');
          container.innerHTML = '';
          signals.forEach(signal => {
            const div = document.createElement('div');
            div.className = 'signal ' + (signal.status === 'critical' ? 'critical' : 'normal');
            div.innerHTML = \`<strong>\${signal.deviceName}</strong> - Batarya: \${signal.battery}% - Durum: \${signal.status} - Zaman: \${new Date(signal.timestamp).toLocaleString()}\`;
            container.appendChild(div);
          });
        })
        .catch(error => console.error('Sinyal yükleme hatası:', error));
    }
    // Otomatik güncelleme her 5 saniyede bir
    setInterval(loadSignals, 5000);
    loadSignals(); // İlk yükleme
  </script>
</body>
</html>`);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});