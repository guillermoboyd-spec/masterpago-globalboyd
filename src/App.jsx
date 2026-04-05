import React, { useState, useEffect } from 'react';
import { 
  Plus, LayoutDashboard, History, Wallet, Settings, Droplets, Flame, Wifi, Zap, 
  CreditCard, CheckCircle2, AlertCircle, ChevronRight, Bell, PlusCircle, FileText, 
  X, Loader2, Lock, Building2, Globe, ChevronDown
} from 'lucide-react';

const MasterPagoApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [bankStage, setBankStage] = useState('selection');
  const [bankConnected, setBankConnected] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  
  // Multi-Country & Translation Data
  const [country, setCountry] = useState('Argentina');
  const countryData = {
    'Argentina': { code: 'AR', lang: 'es', currency: '$', banks: ['Santander', 'BBVA', 'Galicia', 'Macro', 'Nación', 'Mercado Pago'] },
    'México': { code: 'MX', lang: 'es', currency: '$', banks: ['BBVA México', 'Banorte', 'Santander México', 'Citibanamex', 'Nexi'] },
    'Brasil': { code: 'BR', lang: 'pt', currency: 'R$', banks: ['Itaú', 'Bradesco', 'Nubank', 'Santander Brasil', 'Banco do Brasil'] },
    'USA': { code: 'US', lang: 'en', currency: '$', banks: ['Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'Capital One'] },
    'España': { code: 'ES', lang: 'es', currency: '€', banks: ['Santander', 'BBVA España', 'CaixaBank', 'Sabadell', 'Revolut'] },
    'Colombia': { code: 'CO', lang: 'es', currency: '$', banks: ['Bancolombia', 'Davivienda', 'Davivienda', 'Nequi'] },
    'Chile': { code: 'CL', lang: 'es', currency: '$', banks: ['Banco de Chile', 'Santander', 'BCI', 'Banco Estado'] },
    'Uruguay': { code: 'UY', lang: 'es', currency: '$', banks: ['BROU', 'Itaú Uruguay', 'Santander Uruguay'] },
  };

  const translations = {
    es: {
      hi: 'Hola, Guillermo', total: 'Total este mes', pending: 'PENDIENTE', paid: 'PAGADO', status: 'Estado de Pagos', 
      view_all: 'Ver Todo', add: 'Añadir Nuevo Servicio', sync_title: 'Integración Bancaria', 
      sync_desc: 'Conecta tu banco para automatizar.', conn_btn: 'Configurar Conexión', select_bank: 'Selecciona tu Banco',
      secure: 'Acceso Seguro', syncing: 'Sincronizando...', success: '¡Todo Listo!', back: 'Volver', save: 'Guardar',
      home: 'Home', payments: 'Pagos', history: 'Historial', settings: 'Ajustes', new_service: 'Nuevo Servicio',
      name: 'Nombre', amount: 'Monto', due: 'Vencimiento', overdue: 'Vencido', paid_msg: 'Pago Realizado', 
      app_name: 'Master Pago'
    },
    en: {
      hi: 'Hello, Guillermo', total: 'Total this month', pending: 'PENDING', paid: 'PAID', status: 'Payment Status', 
      view_all: 'View All', add: 'Add New Service', sync_title: 'Banking Integration', 
      sync_desc: 'Connect your bank to automate.', conn_btn: 'Setup Connection', select_bank: 'Select your Bank',
      secure: 'Secure Access', syncing: 'Syncing...', success: 'All Set!', back: 'Go Back', save: 'Save',
      home: 'Home', payments: 'Payments', history: 'History', settings: 'Settings', new_service: 'New Service',
      name: 'Name', amount: 'Amount', due: 'Due Date', overdue: 'Overdue', paid_msg: 'Payment Completed'
    },
    pt: {
      hi: 'Olá, Guillermo', total: 'Total este mês', pending: 'PENDENTE', paid: 'PAGO', status: 'Status do Pagamento', 
      view_all: 'Ver Tudo', add: 'Adicionar Novo Serviço', sync_title: 'Integração Bancária', 
      sync_desc: 'Conecte seu banco para automatizar.', conn_btn: 'Configurar Conexão', select_bank: 'Selecione seu Banco',
      secure: 'Acesso Seguro', syncing: 'Sincronizando...', success: 'Tudo Pronto!', back: 'Voltar', save: 'Salvar',
      home: 'Home', payments: 'Pagamentos', history: 'Histórico', settings: 'Ajustes', new_service: 'Novo Serviço',
      name: 'Nome', amount: 'Preço', due: 'Vencimento', overdue: 'Atrasado', paid_msg: 'Pagamento Realizado'
    }
  };

  const t = (key) => translations[countryData[country].lang][key] || key;

  const [services, setServices] = useState([
    { id: 1, name: 'Luz', amount: 15500, dueDate: '2026-04-10', status: 'pending', icon: 'zap' },
    { id: 2, name: 'Agua', amount: 8200, dueDate: '2026-04-15', status: 'pending', icon: 'droplets' },
    { id: 3, name: 'Internet', amount: 32000, dueDate: '2026-04-20', status: 'paid', icon: 'wifi' },
  ]);

  const [newService, setNewService] = useState({ name: '', amount: '', dueDate: '', icon: 'zap' });

  const toggleStatus = (id) => setServices(services.map(s => s.id === id ? { ...s, status: s.status === 'paid' ? 'pending' : 'paid' } : s));
  const startBankSync = () => { setBankStage('sync'); setTimeout(() => { setBankStage('success'); setBankConnected(true); }, 3500); };

  const getIcon = (iconName) => {
    switch(iconName) {
      case 'zap': return <Zap size={20} />;
      case 'droplets': return <Droplets size={20} />;
      case 'wifi': return <Wifi size={20} />;
      default: return <FileText size={20} />;
    }
  };

  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  const Dashboard = () => (
    <div className="flex-column fade-in">
      {deferredPrompt && (
        <div className="card fade-in" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', marginBottom: '20px', textAlign: 'center' }}>
          <h4 style={{ color: '#10b981', marginBottom: '10px' }}>¡Instala Master Pago en tu Escritorio!</h4>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '15px' }}>Accede más rápido y sin navegadores abiertos.</p>
          <button className="btn-primary" onClick={handleInstallClick}>Instalar Ahora</button>
        </div>
      )}
      <header className="flex-column" style={{ marginBottom: '32px', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <div className="logo-glow"></div>
          <img src="/logo.png" alt="MasterPago" style={{ width: '80px', height: '80px', borderRadius: '18px', zIndex: '2', position: 'relative' }} />
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Master Pago</h2>
        
        <div onClick={() => setShowCountryModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '20px', marginTop: '8px', cursor: 'pointer' }}>
          <Globe size={14} color="#10b981" />
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>{country} ({countryData[country].code})</span>
          <ChevronDown size={14} color="#10b981" />
        </div>
        <p style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600', marginTop: '12px' }}>by Global Boyd Global</p>
      </header>

      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(22,24,33,0.7) 100%)' }}>
        <p className="card-title">{t('total')} ({countryData[country].currency})</p>
        <div className="flex-row" style={{ alignItems: 'baseline' }}>
          <span className="currency">{countryData[country].currency}</span>
          <h1 className="amount">{(services.reduce((a, b) => a + b.amount, 0)).toLocaleString()}</h1>
        </div>
        <div className="flex-row mt-20" style={{ gap: '15px' }}>
          <div style={{ flex: 1 }}>
             <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{t('pending')}</p>
             <p style={{ fontWeight: '600', color: '#f59e0b' }}>{countryData[country].currency} {(services.filter(s => s.status !== 'paid').reduce((a, b) => a + b.amount, 0)).toLocaleString()}</p>
          </div>
          <div style={{ flex: 1 }}>
             <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{t('paid')}</p>
             <p style={{ fontWeight: '600', color: '#10b981' }}>{countryData[country].currency} {(services.filter(s => s.status === 'paid').reduce((a, b) => a + b.amount, 0)).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 16px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{t('status')}</h3>
        <p style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600' }} onClick={() => setCurrentView('services')}>{t('view_all')}</p>
      </div>

      {services.sort((a,b) => (a.status === 'paid' ? 1 : -1)).slice(0, 5).map(service => (
        <div key={service.id} className="service-item" onClick={() => toggleStatus(service.id)} style={{ opacity: service.status === 'paid' ? 0.6 : 1 }}>
          <div className="service-info">
            <div className="service-icon">{service.status === 'paid' ? <CheckCircle2 size={20} color="#10b981" /> : getIcon(service.icon)}</div>
            <div className="service-details">
              <h4 style={{ textDecoration: service.status === 'paid' ? 'line-through' : 'none' }}>{service.name}</h4>
              <p>{service.status === 'paid' ? t('paid_msg') : `${t('due')} ${new Date(service.dueDate).toLocaleDateString()}`}</p>
            </div>
          </div>
          <div className="flex-column" style={{ alignItems: 'flex-end' }}>
            <p style={{ fontWeight: '700' }}>{countryData[country].currency} {service.amount.toLocaleString()}</p>
            <span className={`badge ${service.status === 'paid' ? 'badge-paid' : 'badge-pending'}`}>{service.status === 'paid' ? t('paid') : t('pending')}</span>
          </div>
        </div>
      ))}

      <button className="btn-primary mt-20" onClick={() => setShowAddModal(true)}><PlusCircle size={20} /> {t('add')}</button>

      <div className="card mt-20" style={{ background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
        <Wallet size={32} color={bankConnected ? "#10b981" : "#94a3b8"} style={{ marginBottom: '10px' }} />
        <h4>{bankConnected ? selectedBank : t('sync_title')}</h4>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '16px' }}>{t('sync_desc')}</p>
        <button className="btn-secondary" onClick={() => { if(!bankConnected) { setShowBankModal(true); setBankStage('selection'); } }}>{bankConnected ? t('success') : t('conn_btn')}</button>
      </div>
    </div>
  );

  const ServiceList = () => (
    <div className="fade-in">
       <header style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.4rem' }}>{t('payments')}</h2>
       </header>
       {services.map(service => (
          <div key={service.id} className="service-item" onClick={() => toggleStatus(service.id)}>
             <div className="service-info">
               <div className="service-icon">{getIcon(service.icon)}</div>
               <div className="service-details"><h4>{service.name}</h4><p>{t('due')} {service.dueDate}</p></div>
             </div>
             <p style={{ fontWeight: '700' }}>{countryData[country].currency} {service.amount.toLocaleString()}</p>
          </div>
       ))}
    </div>
  );

  return (
    <div className="app-container">
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'services' && <ServiceList />}
      {currentView === 'history' && <div className="fade-in"><h3>{t('history')}</h3><p style={{ color: '#94a3b8', marginTop: '20px' }}>Loading events...</p></div>}
      {currentView === 'settings' && (
        <div className="fade-in">
          <h3>{t('settings')}</h3>
          <div className="master-list-item mt-20"><span>{country}</span><Globe size={18} /></div>
          <div className="master-list-item"><span>Global Boyd Premium</span><div className="badge badge-paid">ACTIVE</div></div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content card fade-in">
            <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3>{t('new_service')}</h3><X size={24} onClick={() => setShowAddModal(false)} />
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowAddModal(false); }}>
              <input type="text" className="master-input" placeholder={t('name')} required />
              <input type="number" className="master-input" placeholder={t('amount')} required />
              <input type="date" className="master-input" title={t('due')} required />
              <button type="submit" className="btn-primary mt-20">{t('save')}</button>
            </form>
          </div>
        </div>
      )}

      {showCountryModal && (
        <div className="modal-overlay">
          <div className="modal-content card fade-in" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: '20px', position: 'sticky', top: 0, background: '#111218' }}>
              <h3>{t('settings')}</h3><X size={24} onClick={() => setShowCountryModal(false)} />
            </div>
            {Object.keys(countryData).map(c => (
              <div key={c} className="master-list-item" onClick={() => { setCountry(c); setShowCountryModal(false); setBankConnected(false); }}>
                <span>{c}</span>{country === c && <CheckCircle2 size={18} color="#10b981" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {showBankModal && (
        <div className="modal-overlay">
          <div className="modal-content card fade-in" style={{ textAlign: 'center' }}>
            <div className="flex-row" style={{ justifyContent: 'flex-end' }}><X size={24} onClick={() => setShowBankModal(false)} /></div>
            {bankStage === 'selection' && (
              <div className="fade-in">
                <Building2 size={42} color="#10b981" style={{ margin: '0 auto 16px' }} />
                 <h3>{t('select_bank')}</h3>
                 <div className="flex-column gap-10 mt-20">
                   {countryData[country].banks.map(bank => (
                     <div key={bank} className="master-list-item" onClick={() => { setSelectedBank(bank); setBankStage('login'); }}>
                       <span>{bank}</span><ChevronRight size={18} />
                     </div>
                   ))}
                 </div>
              </div>
            )}
            {bankStage === 'login' && (
              <div className="fade-in">
                <Lock size={32} color="#10b981" style={{ margin: '0 auto 20px' }} />
                <h3>{t('secure')}</h3>
                <div className="flex-column gap-10 mt-20">
                  <input type="text" className="master-input" placeholder="User / ID" />
                  <input type="password" title="password" className="master-input" placeholder="Password" />
                  <button className="btn-primary mt-20" onClick={startBankSync}>{t('conn_btn')}</button>
                </div>
              </div>
            )}
            {bankStage === 'sync' && (
               <div className="fade-in" style={{ padding: '40px 0' }}>
                 <Loader2 size={64} className="animate-spin" color="#10b981" style={{ margin: '0 auto' }} />
                 <h3 className="mt-20">{t('syncing')}</h3>
               </div>
            )}
            {bankStage === 'success' && (
              <div className="fade-in">
                <CheckCircle2 size={64} color="#10b981" style={{ margin: '0 auto 20px' }} />
                <h3>{t('success')}</h3>
                <button className="btn-primary mt-20" onClick={() => setShowBankModal(false)}>{t('back')}</button>
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        <div className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentView('dashboard')}><LayoutDashboard /><span>{t('home')}</span></div>
        <div className={`nav-item ${currentView === 'services' ? 'active' : ''}`} onClick={() => setCurrentView('services')}><Wallet /><span>{t('payments')}</span></div>
        <div className={`nav-item ${currentView === 'history' ? 'active' : ''}`} onClick={() => setCurrentView('history')}><History /><span>{t('history')}</span></div>
        <div className={`nav-item ${currentView === 'settings' ? 'active' : ''}`} onClick={() => setCurrentView('settings')}><Settings /><span>{t('settings')}</span></div>
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        .fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .master-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px; color: #fff; width: 100%; margin-bottom: 10px; }
        .master-list-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: rgba(255,255,255,0.03); border-radius: 14px; cursor: pointer; margin-bottom: 8px; }
        .btn-secondary { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 8px 16px; border-radius: 12px; font-size: 0.8rem; cursor: pointer; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default MasterPagoApp;
