      const countryData = {
        'Argentina': { code: 'AR', lang: 'es', cur: '$', banks: ['Banco Nación', 'Banco Galicia', 'Banco Macro', 'Santander Argentina', 'BBVA Argentina', 'Mercado Pago', 'Brubank', 'Banco Itaú', 'Banco Supervielle', 'Banco Hipotecario'] },
        'México': { code: 'MX', lang: 'es', cur: '$', banks: ['BBVA México', 'Banorte', 'Santander México', 'Citibanamex', 'HSBC México', 'Scotiabank México', 'Banco Azteca', 'BanCoppel', 'Inbursa', 'BanRegio'] },
        'España': { code: 'ES', lang: 'es', cur: '€', banks: ['Banco Santander', 'BBVA España', 'CaixaBank', 'Banco Sabadell', 'Bankinter', 'Unicaja Banco', 'Abanca', 'Kutxabank', 'Revolut España', 'N26'] },
        'USA': { code: 'US', lang: 'en', cur: '$', banks: ['JPMorgan Chase', 'Bank of America', 'Wells Fargo', 'Citigroup', 'US Bank', 'PNC Bank', 'Truist', 'Goldman Sachs', 'Capital One', 'TD Bank'] },
        'Brasil': { code: 'BR', lang: 'pt', cur: 'R$', banks: ['Itaú Unibanco', 'Bradesco', 'Nubank', 'Santander Brasil', 'Banco do Brasil', 'Caixa Econômica', 'Banco Inter', 'BTG Pactual Brasil', 'PicPay', 'C6 Bank'] },
        'Colombia': { code: 'CO', lang: 'es', cur: '$', banks: ['Bancolombia', 'Banco Davivienda', 'Nequi', 'Banco de Bogotá', 'BBVA Colombia', 'Scotiabank Colpatria', 'Banco de Occidente', 'Banco Popular', 'GNB Sudameris', 'Itau Colombia'] },
        'Chile': { code: 'CL', lang: 'es', cur: '$', banks: ['Banco de Chile', 'Banco Santander Chile', 'Banco Estado', 'BCI Chile', 'Scotiabank Chile', 'Itaú Chile', 'Banco Bice', 'Banco Security', 'Banco Consorcio', 'Tenpo'] },
        'Uruguay': { code: 'UY', lang: 'es', cur: '$', banks: ['BROU', 'Banco Itaú Uruguay', 'Banco Santander Uruguay', 'BBVA Uruguay', 'Scotiabank Uruguay', 'HSBC Uruguay', 'Prex', 'OCA Blue'] }
      };

      const t = {
        es: { total: 'TOTAL ESTE MES', pend: 'PENDIENTE', paid: 'PAGADO', status: 'Estado de Pagos', add: 'Añadir Nuevo Servicio', sync: 'Seguridad Bancaria', desc: 'Conecta tu banco para automatizar.', login: 'Acceso Seguro', user: 'Usuario / ID de Cliente', pass: 'Contraseña', connect: 'Verificar y Conectar', syncing: 'Sincronizando con ', error: '¡ERROR! Debes completar los datos', linked: 'CONEXIÓN CIFRADA ACTIVA' },
        en: { total: 'TOTAL THIS MONTH', pend: 'PENDING', paid: 'PAID', status: 'Payment Status', add: 'Add New Service', sync: 'Banking Security', desc: 'Connect your bank to automate.', login: 'Secure Access', user: 'Username / Client ID', pass: 'Personal Password', connect: 'Verify & Connect', syncing: 'Syncing with ', error: 'ERROR! Fields cannot be empty', linked: 'ENCRYPTED CONNECTION ACTIVE' },
        pt: { total: 'TOTAL ESTE MÊS', pend: 'PENDENTE', paid: 'PAGO', status: 'Status de Pagamento', add: 'Adicionar Novo Serviço', sync: 'Segurança Bancária', desc: 'Conecte seu banco para automatizar.', login: 'Acesso Seguro', user: 'Usuário / ID Cliente', pass: 'Senha Pessoal', connect: 'Verificar e Conectar', syncing: 'Sincronizando com ', error: 'ERRO! Preencha los campos', linked: 'CONEXÃO CRIPTOGRAFADA ATIVA' }
      };

      let services = [{id:1, name:'Luz', amount:15500, status:'pending', icon:'zap'}, {id:2, name:'Internet', amount:32000, status:'paid', icon:'wifi'}];
      let curCountry = 'Argentina';
      let connectedBank = null;

      function render() {
        const data = countryData[curCountry];
        document.getElementById('country-label').innerText = curCountry + ' (' + data.code + ')';
        document.getElementById('curr-sym').innerText = data.cur;
        
        const btn = document.getElementById('sync-btn');
        if (connectedBank) {
          document.getElementById('sync-title').innerText = connectedBank;
          document.getElementById('sync-desc').innerText = t[data.lang].linked;
          document.getElementById('wallet-icon').style.color = "#10b981";
          btn.style.display = "none";
        } else {
          btn.style.display = "block";
          document.getElementById('sync-title').innerText = t[data.lang].sync;
          document.getElementById('sync-desc').innerText = t[data.lang].desc;
          document.getElementById('wallet-icon').style.color = "#94a3b8";
        }

        const total = services.reduce((a,b) => a+b.amount,0);
        const pend = services.filter(s=>s.status==='pending').reduce((a,b)=>a+b.amount,0);
        const paid = services.filter(s=>s.status==='paid').reduce((a,b)=>a+b.amount,0);

        document.getElementById('total-val').innerText = total.toLocaleString();
        document.getElementById('pend-val').innerText = data.cur + ' ' + pend.toLocaleString();
        document.getElementById('paid-val').innerText = data.cur + ' ' + paid.toLocaleString();

        const listHtml = services.map(s => `
          <div class="service-item" style="opacity: ${s.status === 'paid' ? 0.6 : 1}" onclick="toggle(${s.id})">
            <div style="display:flex; align-items:center; gap:14px">
              <div class="icon-box"><i data-lucide="${s.status === 'paid' ? 'check-circle' : s.icon}"></i></div>
              <div><h4>${s.name}</h4><p style="font-size:0.75rem">${s.status==='paid'?'Pagado':'Vence el 10/04'}</p></div>
            </div>
            <div style="text-align:right"><p style="font-weight:800">${data.cur} ${s.amount.toLocaleString()}</p><span class="badge ${s.status==='paid'?'badge-paid':'badge-pending'}">${s.status.toUpperCase()}</span></div>
          </div>
        `).join('');
        document.getElementById('dashboard-list').innerHTML = listHtml;
        lucide.createIcons();
      }

      window.toggle = (id) => { services = services.map(s=>s.id===id?{...s,status:s.status==='paid'?'pending':'paid'}:s); render(); };

      document.getElementById('sync-btn').onclick = () => {
        const body = document.getElementById('modal-body');
        body.innerHTML = `
          <div style="display:flex; justify-content:space-between; margin-bottom:20px"><h3>Escoger Banco</h3><i data-lucide="x" onclick="closeM()" style="cursor:pointer"></i></div>
          <div style="max-height:300px; overflow-y:auto">
            ${countryData[curCountry].banks.map(b => `<div class="list-item" onclick="loginB('${b}')"><span>${b}</span><i data-lucide="chevron-right"></i></div>`).join('')}
          </div>
        `;
        document.getElementById('modal-container').style.display = 'flex';
        lucide.createIcons();
      };

      window.loginB = (b) => {
        const trans = t[countryData[curCountry].lang];
        document.getElementById('modal-body').innerHTML = `
          <div style="text-align:center; margin-bottom:24px">
            <i data-lucide="lock" color="#10b981" size="36"></i>
            <h3 style="margin-top:14px">${trans.login}</h3>
            <p style="color:var(--text-muted); font-size:0.9rem; font-weight:600">${b}</p>
          </div>
          <div id="e-lbl" class="error-label">${trans.error}</div>
          <input type="text" id="u-in" class="master-input" placeholder="${trans.user}">
          <input type="password" id="p-in" class="master-input" placeholder="${trans.pass}">
          <button class="btn-primary" onclick="vLog('${b}')">${trans.connect}</button>
        `;
        lucide.createIcons();
      };

      window.vLog = (b) => {
        const u = document.getElementById('u-in').value.trim();
        const p = document.getElementById('p-in').value.trim();
        if(!u || u.length < 3 || !p || p.length < 3) {
          document.getElementById('e-lbl').style.display = 'block';
          document.getElementById('u-in').classList.add('error');
          document.getElementById('p-in').classList.add('error');
          return;
        }
        const trans = t[countryData[curCountry].lang];
        document.getElementById('modal-body').innerHTML = `<div style="text-align:center; padding:30px"><div class="loader"></div><h4>${trans.syncing}${b}...</h4><p style="font-size:0.85rem; color:var(--text-muted)">Protocolo SSL 256 bits...</p></div>`;
        setTimeout(() => { connectedBank = b; closeM(); render(); }, 3500);
      };

      document.getElementById('country-trigger').onclick = () => {
        document.getElementById('modal-body').innerHTML = `
          <div style="display:flex; justify-content:space-between; margin-bottom:20px"><h3>País</h3><i data-lucide="x" onclick="closeM()" style="cursor:pointer"></i></div>
          ${Object.keys(countryData).map(c => `<div class="list-item" onclick="setCountry('${c}')"><span>${c}</span><i data-lucide="${c===curCountry?'check-circle':'chevron-right'}"></i></div>`).join('')}
        `;
        document.getElementById('modal-container').style.display = 'flex';
        lucide.createIcons();
      };

      window.setCountry = (c) => { curCountry = c; connectedBank = null; closeM(); render(); };
      window.closeM = () => { document.getElementById('modal-container').style.display = 'none'; };

      document.querySelectorAll('.nav-item').forEach(i => i.onclick = function() {
        document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
        document.getElementById(this.dataset.view + '-view').classList.add('active');
      });
      
      document.getElementById('add-btn').onclick = () => {
        document.getElementById('modal-body').innerHTML = `<div style="display:flex; justify-content:space-between; margin-bottom:20px"><h3>Nuevo Servicio</h3><i data-lucide="x" onclick="closeM()" style="cursor:pointer"></i></div><input type="text" id="n-s" class="master-input" placeholder="Nombre (ej: Gas)"><input type="number" id="m-s" class="master-input" placeholder="Monto"><button class="btn-primary" onclick="addS()">Añadir</button>`;
        document.getElementById('modal-container').style.display = 'flex';
        lucide.createIcons();
      };
      
      window.addS = () => {
        const n = document.getElementById('n-s').value;
        const a = parseInt(document.getElementById('m-s').value);
        if(n && a) { services.push({id:Date.now(), name:n, amount:a, status:'pending', icon:'file-text'}); closeM(); render(); }
      };

      render();
