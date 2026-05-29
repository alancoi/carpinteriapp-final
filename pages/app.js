import { useState } from 'react';
import Head from 'next/head';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [costModalOpen, setCostModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [projectsModalOpen, setProjectsModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [costMaterials, setCostMaterials] = useState('');
  const [costHours, setCostHours] = useState('');
  const [costHourlyRate, setCostHourlyRate] = useState('');
  const [costOperative, setCostOperative] = useState('');
  const [desiredMargin, setDesiredMargin] = useState(50);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const mimeType = file.type || 'image/jpeg'; // Detectar tipo automáticamente

    const reader = new FileReader();
    reader.onload = async (event) => {
      setPreview(event.target.result);
      setLoading(true);
      setAnalysis(null);
      setFeedback(null);

      const base64Image = event.target.result.split(',')[1];

      try {
        const response = await fetch('/api/claude-vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64Image, mimeType: mimeType }),
        });

        const responseText = await response.text();
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error('JSON Parse Error. Raw response:', responseText.substring(0, 200));
          throw new Error('Error al procesar respuesta del servidor');
        }

        if (!response.ok) {
          throw new Error(data.message || data.details || data.error || 'Error desconocido');
        }

        setAnalysis(data.analysis);
      } catch (error) {
        setAnalysis(`❌ ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFeedback = (isUseful) => {
    setFeedback(isUseful ? 'positive' : 'negative');
    setTimeout(() => {
      setFeedback(null);
    }, 2000);
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', text: chatInput };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: chatInput,
          previousMessages: chatMessages,
        }),
      });

      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', text: '❌ Error conectando. Intenta de nuevo.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const saveProject = () => {
    if (!analysis) return;
    
    const newProject = {
      id: Date.now(),
      name: `Proyecto ${new Date().toLocaleDateString('es-AR')}`,
      date: new Date().toLocaleString('es-AR'),
      analysis: analysis,
      preview: preview,
      description: analysis.substring(0, 100) + '...',
    };

    setProjects([newProject, ...projects]);
  };

  const handleChangePassword = () => {
    if (!newPassword || !confirmPassword) {
      setPasswordMessage('Por favor completa todos los campos');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage('Las contraseñas no coinciden');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setPassword(newPassword);
    setPasswordMessage('✓ Contraseña actualizada correctamente');
    setNewPassword('');
    setConfirmPassword('');
    
    setTimeout(() => {
      setPasswordMessage('');
    }, 2000);
  };

  if (!isLoggedIn) {
    return (
      <>
        <Head>
          <title>CarpinteriAPP - Login</title>
          <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
        </Head>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0f0f0; }
          .login-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; background: linear-gradient(180deg, #0A0E27 0%, #141B33 100%); }
          .login-box { width: 350px; background: linear-gradient(135deg, #1F2A47 0%, #141B33 100%); padding: 40px; border-radius: 20px; border: 1px solid #2D3A52; text-align: center; }
          .logo-img { width: 80px; height: 80px; margin: 0 auto 20px; border-radius: 15px; border: 2px solid rgba(255, 255, 255, 0.3); overflow: hidden; }
          .logo-img img { width: 100%; height: 100%; object-fit: cover; }
          h1 { color: #fff; margin-bottom: 10px; font-size: 28px; }
          .slogan { color: #FF8C00; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 30px; }
          .form-group { margin-bottom: 20px; text-align: left; }
          .label { color: #A0AEC0; font-size: 12px; margin-bottom: 8px; display: block; }
          input { width: 100%; background: #1F2A47; border: 1px solid #2D3A52; color: #fff; padding: 12px; border-radius: 8px; font-size: 14px; }
          input:focus { outline: none; border-color: #FF8C00; }
          .btn-login { width: 100%; background: linear-gradient(135deg, #0D47A1, #FF8C00); color: white; border: none; padding: 14px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
          .btn-login:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(255, 140, 0, 0.3); }
        `}</style>
        
        <div className="login-container">
          <div className="login-box">
            <div className="logo-img">
              <img src="https://i.postimg.cc/XpQvP00b/image.png" alt="CarpinteriAPP" />
            </div>
            <h1>CarpinteriAPP</h1>
            <p className="slogan">El Futuro de la Carpintería</p>
            
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="label">Email (Usuario)</label>
                <input 
                  type="email" 
                  placeholder="tu@email.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="label">Contraseña</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" className="btn-login">Iniciar Sesión</button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>CarpinteriAPP - Dashboard</title>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      </Head>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0f0f0; padding: 10px; }
        .phone-frame { width: 390px; height: 844px; background: linear-gradient(180deg, #0A0E27 0%, #141B33 100%); border-radius: 50px; padding: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); margin: 20px auto; overflow: hidden; border: 10px solid #000; position: relative; }
        .notch { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 150px; height: 28px; background: #000; border-radius: 0 0 40px 40px; z-index: 100; }
        .phone-content { width: 100%; height: 100%; overflow-y: auto; background: linear-gradient(180deg, #0A0E27 0%, #141B33 100%); color: #FFFFFF; padding: 60px 15px 15px 15px; border-radius: 45px; }
        .container { width: 100%; }
        .header { padding: 1.5rem; border-radius: 15px; margin-bottom: 1.2rem; text-align: center; }
        .header-logo { width: 70px; height: 70px; border-radius: 15px; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.8rem; border: 2px solid rgba(255, 255, 255, 0.3); overflow: hidden; }
        .header-logo img { width: 100%; height: 100%; object-fit: cover; }
        .header h1 { font-size: 1.6rem; margin-bottom: 0.3rem; font-weight: 900; letter-spacing: -0.5px; background: linear-gradient(135deg, #FFFFFF, #A0AEC0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-transform: uppercase; }
        .header-slogan { font-size: 0.85rem; color: #FF8C00; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; font-style: italic; }
        .user-section { background: linear-gradient(135deg, #1F2A47 0%, #141B33 100%); border: 1px solid #2D3A52; border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
        .user-info { flex: 1; }
        .user-name { font-size: 1rem; color: #FFFFFF; font-weight: 700; margin-bottom: 0.2rem; word-break: break-all; }
        .user-email { color: #A0AEC0; font-size: 0.7rem; margin-bottom: 0.4rem; }
        .plan-badge { display: inline-block; background: linear-gradient(135deg, #0D47A1, #FF8C00); padding: 0.3rem 0.7rem; border-radius: 15px; font-size: 0.65rem; font-weight: 700; }
        .logout-btn { padding: 0.5rem 0.8rem; background: rgba(255, 140, 0, 0.2); color: #FF8C00; border: 1px solid rgba(255, 140, 0, 0.3); border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.75rem; white-space: nowrap; transition: all 0.3s; }
        .logout-btn:hover { background: rgba(255, 140, 0, 0.3); }
        .menu-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-bottom: 1.5rem; }
        .menu-card { background: linear-gradient(135deg, #1F2A47 0%, #141B33 100%); border: 2px solid #2D3A52; border-radius: 12px; padding: 1.2rem; cursor: pointer; transition: all 0.3s; text-align: center; }
        .menu-card:hover { border-color: #FF8C00; box-shadow: 0 10px 30px rgba(255, 140, 0, 0.2); transform: translateY(-3px); }
        .menu-icon { font-size: 2.2rem; margin-bottom: 0.6rem; display: block; }
        .menu-title { font-size: 1rem; font-weight: 700; margin-bottom: 0.3rem; color: #FFFFFF; }
        .menu-desc { color: #A0AEC0; font-size: 0.75rem; line-height: 1.3; }
        .premium-button { width: 100%; padding: 1rem; background: linear-gradient(135deg, #0D47A1, #FF8C00); color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 0.95rem; cursor: pointer; margin-bottom: 1rem; box-shadow: 0 10px 30px rgba(255, 140, 0, 0.3); transition: all 0.3s; }
        .premium-button:hover { transform: translateY(-2px); }
        .modal-overlay { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); z-index: 1000; }
        .modal-overlay.active { display: flex; align-items: flex-end; justify-content: center; }
        .modal-content { background: linear-gradient(135deg, #1F2A47 0%, #141B33 100%); border: 1px solid #2D3A52; border-radius: 20px 20px 0 0; padding: 1.5rem; width: 100%; max-height: 80vh; overflow-y: auto; animation: slideUp 0.3s ease-out; }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; border-bottom: 1px solid #2D3A52; padding-bottom: 0.8rem; }
        .modal-header h2 { font-size: 1.3rem; color: #FF8C00; }
        .close-btn { background: none; border: none; color: #A0AEC0; font-size: 1.6rem; cursor: pointer; padding: 0; transition: color 0.3s; }
        .close-btn:hover { color: #FF8C00; }
        .premium-price { text-align: center; margin: 1.2rem 0; padding: 1.2rem 0; border-bottom: 1px solid #2D3A52; }
        .premium-price .price { font-size: 2rem; color: #FF8C00; font-weight: 800; }
        .premium-price .sub { color: #A0AEC0; font-size: 0.8rem; margin-top: 0.4rem; }
        .premium-features { display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1.5rem; }
        .feature-item { display: flex; align-items: center; gap: 0.8rem; padding: 0.8rem; background: rgba(255, 140, 0, 0.05); border: 1px solid #2D3A52; border-radius: 8px; border-left: 3px solid #FF8C00; }
        .feature-item i { font-size: 1.4rem; color: #FF8C00; min-width: 25px; }
        .feature-item span { color: #A0AEC0; font-size: 0.85rem; }
        
        .coming-soon-container { text-align: center; padding: 1.5rem; }
        .coming-soon-icon { font-size: 3rem; margin-bottom: 1rem; display: block; }
        .coming-soon-container h3 { color: #FF8C00; font-size: 1.5rem; margin-bottom: 1rem; }
        .coming-soon-container p { color: #A0AEC0; font-size: 0.95rem; margin-bottom: 1.5rem; }
        .coming-soon-features { display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1.5rem; }
        .coming-soon-text { color: #666; font-size: 0.85rem; font-style: italic; margin-top: 1rem; }
        
        .btn-primary { width: 100%; padding: 0.9rem; background: linear-gradient(135deg, #0D47A1, #FF8C00); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.95rem; transition: all 0.3s; }
        .btn-primary:active { transform: scale(0.98); }
        .file-input-wrapper { margin: 1rem 0; }
        .file-input-wrapper input { width: 100%; cursor: pointer; color: #A0AEC0; padding: 12px; background: #1F2A47; border: 2px dashed #2D3A52; border-radius: 8px; text-align: center; }
        .upload-preview { margin: 1rem 0; text-align: center; }
        .upload-preview img { max-width: 100%; border-radius: 8px; max-height: 300px; }
        .loading { display: flex; flex-direction: column; align-items: center; justify-content: center; color: #FF8C00; padding: 2rem 1rem; text-align: center; }
        .spinner { display: inline-block; width: 40px; height: 40px; border: 4px solid rgba(255, 140, 0, 0.2); border-top-color: #FF8C00; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-text { font-size: 0.9rem; font-weight: 600; color: #A0AEC0; }
        .analysis-result { background: #0A0E27; border: 1px solid #0D47A1; border-left: 4px solid #FF8C00; color: #A0AEC0; padding: 1.5rem; border-radius: 8px; font-size: 0.75rem; max-height: 400px; overflow-y: auto; white-space: pre-wrap; font-family: 'Courier New', monospace; margin-top: 1rem; line-height: 1.8; letter-spacing: 0.3px; }
        .analysis-result strong { color: #FF8C00; font-weight: 700; }
        .feedback-section { margin-top: 1.2rem; padding-top: 1rem; border-top: 1px solid #2D3A52; }
        .feedback-label { font-size: 0.85rem; color: #A0AEC0; margin-bottom: 0.8rem; display: block; }
        .feedback-buttons { display: flex; gap: 0.8rem; }
        .feedback-btn { flex: 1; padding: 0.7rem; background: #1F2A47; border: 1px solid #2D3A52; color: #A0AEC0; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.8rem; transition: all 0.3s; }
        .feedback-btn:hover { border-color: #FF8C00; }
        .feedback-btn.positive { background: rgba(76, 175, 80, 0.2); border-color: #4CAF50; color: #4CAF50; }
        .feedback-btn.negative { background: rgba(244, 67, 54, 0.2); border-color: #F44336; color: #F44336; }
        .feedback-message { text-align: center; color: #4CAF50; font-size: 0.8rem; margin-top: 0.8rem; }
        
        /* COSTOS Y GANANCIAS - ESTILOS PREMIUM */
        .cost-calculator { display: flex; flex-direction: column; gap: 1.5rem; }
        .cost-section { background: rgba(13, 71, 161, 0.1); border: 1px solid #0D47A1; border-radius: 12px; padding: 1.2rem; border-left: 4px solid #FF8C00; }
        .cost-section h3 { margin: 0 0 1rem 0; font-size: 1rem; color: #FF8C00; font-weight: 700; }
        .cost-group { margin-bottom: 1rem; }
        .cost-group label { display: block; font-size: 0.85rem; font-weight: 600; color: #A0AEC0; margin-bottom: 0.5rem; }
        .cost-input { width: 100%; padding: 0.75rem; background: #1F2A47; border: 1px solid #2D3A52; color: #FFFFFF; border-radius: 8px; font-size: 0.9rem; font-family: 'Courier New', monospace; transition: all 0.3s; }
        .cost-input:focus { outline: none; border-color: #FF8C00; box-shadow: 0 0 0 2px rgba(255, 140, 0, 0.2); }
        .cost-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        
        .price-options { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        .price-card { padding: 1.5rem; border-radius: 12px; border: 2px solid #2D3A52; text-align: center; transition: all 0.3s; position: relative; overflow: hidden; }
        .price-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0; transition: opacity 0.3s; }
        .price-card:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.3); }
        
        .price-card.basic { background: linear-gradient(135deg, #1F2A47 0%, #141B33 100%); border-color: #2D3A52; }
        .price-card.normal { background: linear-gradient(135deg, rgba(13, 71, 161, 0.2) 0%, rgba(13, 71, 161, 0.1) 100%); border-color: #0D47A1; }
        .price-card.premium { background: linear-gradient(135deg, rgba(255, 140, 0, 0.2) 0%, rgba(255, 140, 0, 0.1) 100%); border: 2px solid #FF8C00; box-shadow: 0 0 20px rgba(255, 140, 0, 0.3); }
        .price-card.premium::after { content: '⭐ RECOMENDADO'; position: absolute; top: 10px; right: 10px; background: #FF8C00; color: #0A0E27; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.65rem; font-weight: 700; }
        
        .price-level { font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem; color: #FFFFFF; }
        .price-margin { font-size: 0.8rem; color: #A0AEC0; margin-bottom: 0.8rem; }
        .price-value { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; font-family: 'Courier New', monospace; }
        .price-card.basic .price-value { color: #A0AEC0; }
        .price-card.normal .price-value { color: #0D47A1; }
        .price-card.premium .price-value { color: #FF8C00; }
        .price-profit { font-size: 0.9rem; color: #4CAF50; font-weight: 700; }
        
        .cost-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        .cost-table tr { border-bottom: 1px solid #2D3A52; }
        .cost-table td { padding: 0.8rem; text-align: left; font-size: 0.85rem; color: #A0AEC0; }
        .cost-table td.cost-value { text-align: right; color: #FF8C00; font-weight: 700; font-family: 'Courier New', monospace; }
        .cost-table tr.cost-total { background: rgba(255, 140, 0, 0.15); }
        .cost-table tr.cost-total td { font-weight: 700; color: #FF8C00; padding: 1rem 0.8rem; }
        
        .recommendations { margin-top: 1rem; }
        .recommendation-list { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        .recommendation-item { padding: 1rem; border-radius: 8px; border-left: 4px solid #2D3A52; }
        .recommendation-item.basic { border-left-color: #999; background: rgba(100, 100, 100, 0.1); }
        .recommendation-item.normal { border-left-color: #0D47A1; background: rgba(13, 71, 161, 0.1); }
        .recommendation-item.premium { border-left-color: #FF8C00; background: rgba(255, 140, 0, 0.1); }
        .rec-title { font-weight: 700; color: #FFFFFF; margin-bottom: 0.3rem; font-size: 0.95rem; }
        .rec-desc { color: #A0AEC0; font-size: 0.8rem; margin-bottom: 0.5rem; }
        .rec-margin { color: #FF8C00; font-weight: 600; font-size: 0.85rem; }
        
        .margin-slider-container { display: flex; flex-direction: column; gap: 1rem; }
        .margin-slider { width: 100%; height: 6px; border-radius: 3px; background: linear-gradient(90deg, #2D3A52 0%, #0D47A1 50%, #FF8C00 100%); outline: none; -webkit-appearance: none; cursor: pointer; }
        .margin-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; border-radius: 50%; background: #FF8C00; cursor: pointer; box-shadow: 0 0 10px rgba(255, 140, 0, 0.5); border: 2px solid #0A0E27; }
        .margin-slider::-moz-range-thumb { width: 24px; height: 24px; border-radius: 50%; background: #FF8C00; cursor: pointer; box-shadow: 0 0 10px rgba(255, 140, 0, 0.5); border: 2px solid #0A0E27; }
        .margin-display { display: flex; justify-content: center; }
        .margin-value { font-size: 2rem; font-weight: 800; color: #FF8C00; font-family: 'Courier New', monospace; }
        
        .result-section { background: linear-gradient(135deg, rgba(255, 140, 0, 0.15) 0%, rgba(13, 71, 161, 0.15) 100%); border: 2px solid #FF8C00; }
        .final-result { display: flex; flex-direction: column; gap: 1.2rem; margin-top: 1rem; }
        .result-row { display: flex; justify-content: space-between; align-items: center; padding: 0.8rem; background: rgba(13, 71, 161, 0.2); border-radius: 8px; }
        .result-row.highlight { background: rgba(255, 140, 0, 0.2); border: 1px solid #FF8C00; padding: 1rem; }
        .result-label { color: #A0AEC0; font-size: 0.9rem; font-weight: 600; }
        .result-value { font-size: 1.3rem; color: #FFFFFF; font-weight: 700; font-family: 'Courier New', monospace; }
        .result-value-big { font-size: 1.8rem; color: #FF8C00; font-weight: 800; font-family: 'Courier New', monospace; }
        .result-profit { font-size: 1.4rem; color: #4CAF50; font-weight: 800; font-family: 'Courier New', monospace; }
        
        /* CHAT STYLES */
        .chat-modal { display: flex; flex-direction: column; height: 80vh; padding: 0; }
        .chat-container { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .chat-messages { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .chat-welcome { text-align: center; padding: 2rem 1rem; }
        .chat-welcome-icon { font-size: 3rem; margin-bottom: 1rem; }
        .chat-welcome h3 { color: #FF8C00; margin-bottom: 0.5rem; font-size: 1.2rem; }
        .chat-welcome p { color: #A0AEC0; margin-bottom: 0.8rem; font-size: 0.9rem; }
        .chat-welcome ul { list-style: none; text-align: left; display: inline-block; color: #A0AEC0; font-size: 0.85rem; }
        .chat-welcome li { margin: 0.5rem 0; }
        
        .chat-message { display: flex; margin-bottom: 0.5rem; }
        .chat-message.user { justify-content: flex-end; }
        .chat-message.assistant { justify-content: flex-start; }
        .chat-text { max-width: 80%; padding: 0.8rem 1rem; border-radius: 12px; word-wrap: break-word; line-height: 1.5; }
        .chat-message.user .chat-text { background: linear-gradient(135deg, #0D47A1, #FF8C00); color: #FFFFFF; border-radius: 12px 2px 12px 12px; }
        .chat-message.assistant .chat-text { background: rgba(13, 71, 161, 0.2); color: #A0AEC0; border: 1px solid #0D47A1; border-radius: 2px 12px 12px 12px; }
        
        .chat-typing { display: flex; gap: 4px; padding: 0.8rem 1rem; }
        .chat-typing span { width: 8px; height: 8px; border-radius: 50%; background: #FF8C00; animation: typing 1.4s infinite; }
        .chat-typing span:nth-child(2) { animation-delay: 0.2s; }
        .chat-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing { 0%, 60%, 100% { opacity: 0.3; } 30% { opacity: 1; } }
        
        .chat-input-container { display: flex; gap: 0.8rem; padding: 1rem; background: linear-gradient(135deg, #1F2A47 0%, #141B33 100%); border-top: 1px solid #2D3A52; }
        .chat-input { flex: 1; padding: 0.8rem; background: #0A0E27; border: 1px solid #2D3A52; color: #FFFFFF; border-radius: 8px; font-size: 0.9rem; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
        .chat-input:focus { outline: none; border-color: #FF8C00; box-shadow: 0 0 0 2px rgba(255, 140, 0, 0.2); }
        .chat-input:disabled { opacity: 0.5; cursor: not-allowed; }
        .chat-send-btn { padding: 0.8rem 1.2rem; background: linear-gradient(135deg, #0D47A1, #FF8C00); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 600; transition: all 0.3s; }
        .chat-send-btn:hover:not(:disabled) { transform: scale(1.05); }
        .chat-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        
        /* PROJECTS STYLES */
        .projects-list { display: flex; flex-direction: column; gap: 1rem; }
        .project-card { padding: 1.2rem; background: linear-gradient(135deg, #1F2A47 0%, #141B33 100%); border: 1px solid #2D3A52; border-radius: 12px; cursor: pointer; transition: all 0.3s; }
        .project-card:hover { border-color: #FF8C00; box-shadow: 0 10px 30px rgba(255, 140, 0, 0.2); transform: translateY(-3px); }
        .project-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; }
        .project-header h4 { margin: 0; color: #FFFFFF; font-size: 1rem; }
        .project-date { font-size: 0.75rem; color: #A0AEC0; }
        .project-desc { margin: 0 0 0.8rem 0; color: #A0AEC0; font-size: 0.85rem; line-height: 1.4; }
        .project-action { color: #FF8C00; font-weight: 600; font-size: 0.85rem; }
        
        .empty-projects { text-align: center; padding: 3rem 1rem; }
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        .empty-projects h3 { color: #A0AEC0; margin-bottom: 0.5rem; }
        .empty-projects p { color: #666; font-size: 0.9rem; }
        
        .project-detail { display: flex; flex-direction: column; gap: 1rem; }
        .back-btn { padding: 0.6rem 1rem; background: none; border: 1px solid #2D3A52; color: #A0AEC0; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s; margin-bottom: 1rem; }
        .back-btn:hover { border-color: #FF8C00; color: #FF8C00; }
        .project-detail h3 { color: #FF8C00; margin: 0; font-size: 1.3rem; }
        .project-meta { display: flex; gap: 1rem; color: #A0AEC0; font-size: 0.85rem; }
        .project-preview { text-align: center; max-height: 300px; margin: 1rem 0; border-radius: 8px; overflow: hidden; }
        .project-preview img { max-width: 100%; max-height: 300px; border-radius: 8px; }
        .btn-delete { width: 100%; padding: 0.9rem; background: linear-gradient(135deg, #F44336, #d32f2f); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s; margin-top: 1rem; }
        .btn-delete:hover { transform: translateY(-2px); }
        
        /* SETTINGS STYLES */
        .settings-container { display: flex; flex-direction: column; gap: 1.5rem; }
        .settings-section { background: linear-gradient(135deg, rgba(13, 71, 161, 0.1) 0%, rgba(13, 71, 161, 0.05) 100%); border: 1px solid #0D47A1; border-radius: 12px; padding: 1.5rem; border-left: 4px solid #FF8C00; }
        .settings-section h3 { margin: 0 0 1.2rem 0; color: #FF8C00; font-size: 1.1rem; }
        
        .settings-item { margin-bottom: 1rem; }
        .settings-item label { display: block; color: #A0AEC0; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; }
        .settings-value { color: #FFFFFF; font-size: 1rem; padding: 0.8rem; background: rgba(10, 14, 39, 0.5); border-radius: 8px; }
        
        .plan-badge { display: inline-block; background: linear-gradient(135deg, #0D47A1, #FF8C00); padding: 0.5rem 1rem; border-radius: 20px; font-weight: 700; }
        
        .settings-input-group { margin-bottom: 1rem; }
        .settings-input-group label { display: block; color: #A0AEC0; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; }
        .settings-input { width: 100%; padding: 0.8rem; background: #1F2A47; border: 1px solid #2D3A52; color: #FFFFFF; border-radius: 8px; font-size: 0.9rem; transition: all 0.3s; }
        .settings-input:focus { outline: none; border-color: #FF8C00; box-shadow: 0 0 0 2px rgba(255, 140, 0, 0.2); }
        
        .settings-message { padding: 0.8rem 1rem; border-radius: 8px; font-weight: 600; margin-bottom: 1rem; }
        .settings-message.success { background: rgba(76, 175, 80, 0.2); border: 1px solid #4CAF50; color: #4CAF50; }
        .settings-message.error { background: rgba(244, 67, 54, 0.2); border: 1px solid #F44336; color: #F44336; }
        
        .info-section { background: linear-gradient(135deg, rgba(255, 140, 0, 0.1) 0%, rgba(255, 140, 0, 0.05) 100%); border: 1px solid #FF8C00; }
        .info-box { background: rgba(10, 14, 39, 0.5); padding: 1rem; border-radius: 8px; }
        .info-box p { margin: 0.5rem 0; color: #A0AEC0; font-size: 0.9rem; }
        .info-box strong { color: #FF8C00; }
        
        .danger-section { background: linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%); border: 1px solid #F44336; }
        .btn-danger { width: 100%; padding: 0.9rem; background: linear-gradient(135deg, #F44336, #d32f2f); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
        .btn-danger:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(244, 67, 54, 0.3); }
        
        .modal-wide { max-width: 100%; }
      `}</style>

      <div className="phone-frame">
        <div className="notch"></div>
        <div className="phone-content">
          <div className="container">
            <div className="header">
              <div className="header-logo">
                <img src="https://i.postimg.cc/XpQvP00b/image.png" alt="CarpinteriAPP" />
              </div>
              <h1>CarpinteriAPP</h1>
              <p className="header-slogan">El Futuro de la Carpintería</p>
            </div>

            <div className="user-section">
              <div className="user-info">
                <div className="user-name">{email}</div>
                <div className="user-email">Usuario activo</div>
                <div className="plan-badge">Plan Básico</div>
              </div>
              <button className="logout-btn" onClick={() => {setIsLoggedIn(false); setEmail(''); setPassword('');}}>
                <i className="fas fa-sign-out-alt"></i> Salir
              </button>
            </div>

            <div className="menu-grid">
              <div className="menu-card" onClick={() => setUploadModalOpen(true)}>
                <span className="menu-icon">🖼️</span>
                <div className="menu-title">Subir Fotos</div>
                <p className="menu-desc">Carga fotos y obtén planos exactos</p>
              </div>

              <div className="menu-card" onClick={() => setCostModalOpen(true)} style={{cursor: 'pointer'}}>
                <span className="menu-icon">💰</span>
                <div className="menu-title">Calcular Costos</div>
                <p className="menu-desc">Presupuestos y ganancias automáticos</p>
              </div>

              <div className="menu-card" onClick={() => setChatModalOpen(true)} style={{cursor: 'pointer'}}>
                <span className="menu-icon">💬</span>
                <div className="menu-title">Chat 24/7 IA</div>
                <p className="menu-desc">Asesor disponible siempre</p>
              </div>

              <div className="menu-card" onClick={() => setProjectsModalOpen(true)} style={{cursor: 'pointer'}}>
                <span className="menu-icon">📊</span>
                <div className="menu-title">Mis Proyectos</div>
                <p className="menu-desc">Historial de trabajos</p>
              </div>

              <div className="menu-card" onClick={() => setSettingsModalOpen(true)} style={{cursor: 'pointer'}}>
                <span className="menu-icon">⚙️</span>
                <div className="menu-title">Configuración</div>
                <p className="menu-desc">Tu perfil y preferencias</p>
              </div>
            </div>

            <button className="premium-button" onClick={() => setPremiumModalOpen(true)}>
              <i className="fas fa-crown"></i> Beneficios Plan Premium
            </button>
          </div>
        </div>
      </div>

      {/* MODAL PREMIUM */}
      <div className={`modal-overlay ${premiumModalOpen ? 'active' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>✨ Plan Premium</h2>
            <button className="close-btn" onClick={() => setPremiumModalOpen(false)}>×</button>
          </div>

          <div className="coming-soon-container">
            <div className="coming-soon-icon">🚀</div>
            <h3>¡Próximamente!</h3>
            <p>Estamos trabajando en opciones premium exclusivas para llevar tu experiencia al siguiente nivel.</p>
            
            <div className="coming-soon-features">
              <div className="feature-item">
                <i className="fas fa-infinity"></i>
                <span>Uso Ilimitado de todas las funciones</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-file-pdf"></i>
                <span>Exportar planos en PDF</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-file-excel"></i>
                <span>Presupuestos en Excel</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-history"></i>
                <span>Historial ilimitado de proyectos</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-star"></i>
                <span>Acceso prioritario a nuevas funciones</span>
              </div>
            </div>

            <p className="coming-soon-text">Te notificaremos cuando esté disponible</p>
          </div>
        </div>
      </div>

      {/* MODAL UPLOAD */}
      <div className={`modal-overlay ${uploadModalOpen ? 'active' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>📸 Subir Foto de Mueble</h2>
            <button className="close-btn" onClick={() => {setUploadModalOpen(false); setPreview(null); setAnalysis(null); setFeedback(null);}}>×</button>
          </div>

          <div className="file-input-wrapper">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload}
              placeholder="Seleccionar archivo"
            />
          </div>

          {preview && (
            <div className="upload-preview">
              <img src={preview} alt="Vista previa" />
            </div>
          )}

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <div className="loading-text">Analizando imagen, dame un momento...</div>
            </div>
          )}

          {analysis && !loading && (
            <>
              <div className="analysis-result">
                {analysis}
              </div>
              
              {!analysis.includes('❌') && !analysis.includes('⚠️') && !analysis.includes('📐') && (
                <div className="feedback-section">
                  <label className="feedback-label">¿Fue útil este análisis?</label>
                  <div className="feedback-buttons">
                    <button 
                      className={`feedback-btn ${feedback === 'positive' ? 'positive' : ''}`}
                      onClick={() => handleFeedback(true)}
                    >
                      👍 Sí, muy útil
                    </button>
                    <button 
                      className={`feedback-btn ${feedback === 'negative' ? 'negative' : ''}`}
                      onClick={() => handleFeedback(false)}
                    >
                      👎 Necesita mejora
                    </button>
                  </div>
                  {feedback && (
                    <div className="feedback-message">
                      ✓ Gracias por tu feedback, nos ayuda a mejorar
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {analysis && !analysis.includes('❌') && !analysis.includes('⚠️') && !analysis.includes('📐') && (
            <button className="btn-primary save-project-btn" onClick={saveProject} style={{marginBottom: '0.8rem', background: 'linear-gradient(135deg, #4CAF50, #45a049)'}}>
              💾 Guardar Proyecto
            </button>
          )}

          <button className="btn-primary" onClick={() => {setUploadModalOpen(false); setPreview(null); setAnalysis(null); setFeedback(null);}}>
            Cerrar
          </button>
        </div>
      </div>

      {/* MODAL COSTOS Y GANANCIAS */}
      <div className={`modal-overlay ${costModalOpen ? 'active' : ''}`}>
        <div className="modal-content modal-wide">
          <div className="modal-header">
            <h2>💰 Costos y Ganancias</h2>
            <button className="close-btn" onClick={() => setCostModalOpen(false)}>×</button>
          </div>

          <div className="modal-body">
            <div className="cost-calculator">
              {/* INPUTS */}
              <div className="cost-section">
                <h3>📝 Datos del Proyecto</h3>
                
                <div className="cost-group">
                  <label>💵 Costo Materiales (ARS)</label>
                  <input 
                    type="number" 
                    placeholder="Ej: 5000"
                    value={costMaterials}
                    onChange={(e) => setCostMaterials(e.target.value)}
                    className="cost-input"
                  />
                </div>

                <div className="cost-row">
                  <div className="cost-group">
                    <label>⏱️ Horas de Trabajo</label>
                    <input 
                      type="number" 
                      placeholder="Ej: 8"
                      value={costHours}
                      onChange={(e) => setCostHours(e.target.value)}
                      className="cost-input"
                    />
                  </div>
                  <div className="cost-group">
                    <label>💼 Tarifa/Hora (ARS)</label>
                    <input 
                      type="number" 
                      placeholder="Ej: 500"
                      value={costHourlyRate}
                      onChange={(e) => setCostHourlyRate(e.target.value)}
                      className="cost-input"
                    />
                  </div>
                </div>

                <div className="cost-group">
                  <label>📦 Gastos Operativos (ARS)</label>
                  <input 
                    type="number" 
                    placeholder="Ej: 1000 (transporte, embalaje)"
                    value={costOperative}
                    onChange={(e) => setCostOperative(e.target.value)}
                    className="cost-input"
                  />
                </div>
              </div>

              {/* DESGLOSE DE COSTOS */}
              {costMaterials || costHours || costOperative ? (
                <div className="cost-section">
                  <h3>📊 Desglose de Costos</h3>
                  <table className="cost-table">
                    <tbody>
                      <tr>
                        <td>Materiales</td>
                        <td className="cost-value">${Number(costMaterials || 0).toLocaleString('es-AR')}</td>
                      </tr>
                      {costHours && costHourlyRate && (
                        <tr>
                          <td>Mano de obra ({costHours}h × ${costHourlyRate}/h)</td>
                          <td className="cost-value">${(Number(costHours || 0) * Number(costHourlyRate || 0)).toLocaleString('es-AR')}</td>
                        </tr>
                      )}
                      {costOperative && (
                        <tr>
                          <td>Gastos operativos</td>
                          <td className="cost-value">${Number(costOperative || 0).toLocaleString('es-AR')}</td>
                        </tr>
                      )}
                      <tr className="cost-total">
                        <td>COSTO TOTAL</td>
                        <td className="cost-value">${(Number(costMaterials || 0) + (Number(costHours || 0) * Number(costHourlyRate || 0)) + Number(costOperative || 0)).toLocaleString('es-AR')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : null}

              {/* INPUT DE % GANANCIA */}
              {costMaterials ? (
                <div className="cost-section">
                  <h3>💰 ¿Cuánto % quieres ganar?</h3>
                  <div className="margin-slider-container">
                    <input 
                      type="range" 
                      min="10" 
                      max="200" 
                      value={desiredMargin}
                      onChange={(e) => setDesiredMargin(Number(e.target.value))}
                      className="margin-slider"
                    />
                    <div className="margin-display">
                      <span className="margin-value">{desiredMargin}%</span>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* RESULTADO DE PRECIO */}
              {costMaterials && desiredMargin ? (
                <div className="cost-section result-section">
                  <h3>✅ Tu Precio de Venta</h3>
                  {(() => {
                    const total = Number(costMaterials || 0) + (Number(costHours || 0) * Number(costHourlyRate || 0)) + Number(costOperative || 0);
                    const salePrice = total * (1 + desiredMargin / 100);
                    const profit = salePrice - total;
                    return (
                      <div className="final-result">
                        <div className="result-row">
                          <span className="result-label">Costo Total:</span>
                          <span className="result-value">${total.toLocaleString('es-AR', {maximumFractionDigits: 0})}</span>
                        </div>
                        <div className="result-row highlight">
                          <span className="result-label">Precio de Venta:</span>
                          <span className="result-value-big">${salePrice.toLocaleString('es-AR', {maximumFractionDigits: 0})}</span>
                        </div>
                        <div className="result-row">
                          <span className="result-label">Tu Ganancia:</span>
                          <span className="result-profit">${profit.toLocaleString('es-AR', {maximumFractionDigits: 0})}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : null}

              {/* RECOMENDACIONES */}
              {costMaterials ? (
                <div className="cost-section recommendations">
                  <h3>📌 Recomendaciones de Precio</h3>
                  <div className="recommendation-list">
                    <div className="recommendation-item basic">
                      <div className="rec-title">🏠 Trabajo Básico</div>
                      <div className="rec-desc">Mobiliario simple, sin detalles</div>
                      <div className="rec-margin">Margen recomendado: 30%</div>
                    </div>
                    <div className="recommendation-item normal">
                      <div className="rec-title">🏢 Trabajo Normal</div>
                      <div className="rec-desc">Muebles estándar, detalles regulares</div>
                      <div className="rec-margin">Margen recomendado: 50%</div>
                    </div>
                    <div className="recommendation-item premium">
                      <div className="rec-title">✨ Trabajo Premium</div>
                      <div className="rec-desc">Diseño personalizado, alta calidad</div>
                      <div className="rec-margin">Margen recomendado: 70%</div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <button className="btn-primary" onClick={() => setCostModalOpen(false)}>
            Cerrar
          </button>
        </div>
      </div>

      {/* MODAL CHAT 24/7 */}
      <div className={`modal-overlay ${chatModalOpen ? 'active' : ''}`}>
        <div className="modal-content chat-modal">
          <div className="modal-header">
            <h2>💬 Chat IA 24/7</h2>
            <button className="close-btn" onClick={() => {setChatModalOpen(false); setChatMessages([]);}}>×</button>
          </div>

          <div className="chat-container">
            <div className="chat-messages">
              {chatMessages.length === 0 && (
                <div className="chat-welcome">
                  <div className="chat-welcome-icon">🤖</div>
                  <h3>Resuelvo todas tus dudas sobre carpintería</h3>
                  <p>¿En qué te puedo ayudar?</p>
                  <ul>
                    <li>💡 Consultas de carpintería</li>
                    <li>📐 Diseño de muebles</li>
                    <li>💰 Presupuestos</li>
                    <li>🔧 Técnicas y materiales</li>
                  </ul>
                </div>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.role}`}>
                  <div className="chat-text">{msg.text}</div>
                </div>
              ))}
              {chatLoading && (
                <div className="chat-message assistant">
                  <div className="chat-typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
            </div>

            <div className="chat-input-container">
              <input
                type="text"
                className="chat-input"
                placeholder="Escribe tu pregunta..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                disabled={chatLoading}
              />
              <button
                className="chat-send-btn"
                onClick={handleChatSend}
                disabled={chatLoading || !chatInput.trim()}
              >
                ✈️
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL MIS PROYECTOS */}
      <div className={`modal-overlay ${projectsModalOpen ? 'active' : ''}`}>
        <div className="modal-content modal-wide">
          <div className="modal-header">
            <h2>📊 Mis Proyectos</h2>
            <button className="close-btn" onClick={() => {setProjectsModalOpen(false); setSelectedProject(null);}}>×</button>
          </div>

          <div className="modal-body">
            {selectedProject ? (
              <div className="project-detail">
                <button className="back-btn" onClick={() => setSelectedProject(null)}>← Volver</button>
                <h3>{selectedProject.name}</h3>
                <div className="project-meta">
                  <span>📅 {selectedProject.date}</span>
                </div>
                <div className="project-preview">
                  {selectedProject.preview && <img src={selectedProject.preview} alt="Vista previa" />}
                </div>
                <div className="analysis-result">
                  {selectedProject.analysis}
                </div>
                <button className="btn-delete" onClick={() => {setProjects(projects.filter(p => p.id !== selectedProject.id)); setSelectedProject(null);}}>
                  🗑️ Eliminar Proyecto
                </button>
              </div>
            ) : (
              <div className="projects-list">
                {projects.length === 0 ? (
                  <div className="empty-projects">
                    <div className="empty-icon">📂</div>
                    <h3>Sin proyectos aún</h3>
                    <p>Los proyectos que guardes aparecerán aquí</p>
                  </div>
                ) : (
                  projects.map(project => (
                    <div key={project.id} className="project-card" onClick={() => setSelectedProject(project)}>
                      <div className="project-header">
                        <h4>{project.name}</h4>
                        <span className="project-date">{project.date}</span>
                      </div>
                      <p className="project-desc">{project.description}</p>
                      <div className="project-action">Ver detalles →</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <button className="btn-primary" onClick={() => {setProjectsModalOpen(false); setSelectedProject(null);}}>
            Cerrar
          </button>
        </div>
      </div>

      {/* MODAL CONFIGURACIÓN */}
      <div className={`modal-overlay ${settingsModalOpen ? 'active' : ''}`}>
        <div className="modal-content modal-wide">
          <div className="modal-header">
            <h2>⚙️ Configuración</h2>
            <button className="close-btn" onClick={() => setSettingsModalOpen(false)}>×</button>
          </div>

          <div className="modal-body">
            <div className="settings-container">
              {/* INFORMACIÓN DE CUENTA */}
              <div className="settings-section">
                <h3>👤 Información de Cuenta</h3>
                <div className="settings-item">
                  <label>Email</label>
                  <div className="settings-value">{email}</div>
                </div>
                <div className="settings-item">
                  <label>Plan</label>
                  <div className="settings-value plan-badge">Plan Básico</div>
                </div>
                <div className="settings-item">
                  <label>Proyectos Guardados</label>
                  <div className="settings-value">{projects.length} proyectos</div>
                </div>
              </div>

              {/* CAMBIAR CONTRASEÑA */}
              <div className="settings-section">
                <h3>🔐 Cambiar Contraseña</h3>
                
                <div className="settings-input-group">
                  <label>Nueva Contraseña</label>
                  <input
                    type="password"
                    placeholder="Ej: MiNuevaContraseña123"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="settings-input"
                  />
                </div>

                <div className="settings-input-group">
                  <label>Confirmar Contraseña</label>
                  <input
                    type="password"
                    placeholder="Repite tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="settings-input"
                  />
                </div>

                {passwordMessage && (
                  <div className={`settings-message ${passwordMessage.includes('✓') ? 'success' : 'error'}`}>
                    {passwordMessage}
                  </div>
                )}

                <button className="btn-primary" onClick={handleChangePassword} style={{marginTop: '1rem'}}>
                  🔒 Actualizar Contraseña
                </button>
              </div>

              {/* INFORMACIÓN */}
              <div className="settings-section info-section">
                <h3>ℹ️ Información</h3>
                <div className="info-box">
                  <p><strong>Versión:</strong> 1.0.0</p>
                  <p><strong>Creador:</strong> CarpinteriAPP Team</p>
                  <p><strong>Soporte:</strong> support@carpinteriapp.com</p>
                </div>
              </div>

              {/* CERRAR SESIÓN */}
              <div className="settings-section danger-section">
                <button 
                  className="btn-danger"
                  onClick={() => {
                    setIsLoggedIn(false);
                    setEmail('');
                    setPassword('');
                    setSettingsModalOpen(false);
                  }}
                >
                  🚪 Cerrar Sesión
                </button>
              </div>
            </div>
          </div>

          <button className="btn-primary" onClick={() => setSettingsModalOpen(false)}>
            Cerrar
          </button>
        </div>
      </div>
    </>
  );
}


export const styles = `
  .cost-calculator {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .cost-section {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid #FF8C00;
  }

  .cost-section h3 {
    margin: 0 0 1.5rem 0;
    font-size: 1.1rem;
    color: #0D47A1;
    font-weight: 600;
  }

  .cost-group {
    margin-bottom: 1rem;
  }

  .cost-group label {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .cost-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    font-family: 'Courier New', monospace;
  }

  .cost-input:focus {
    outline: none;
    border-color: #FF8C00;
    box-shadow: 0 0 0 2px rgba(255, 140, 0, 0.1);
  }

  .cost-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .price-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  .price-card {
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    border: 2px solid #ddd;
  }

  .price-card.basic { background: #f0f0f0; border-color: #999; }
  .price-card.normal { background: #E3F2FD; border-color: #0D47A1; }
  .price-card.premium { background: #FFF3E0; border-color: #FF8C00; }

  .price-level { font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem; }
  .price-value { font-size: 1.8rem; font-weight: 700; color: #0D47A1; font-family: monospace; }
  .price-profit { font-size: 0.9rem; color: #28a745; font-weight: 600; }

  .cost-table { width: 100%; border-collapse: collapse; }
  .cost-table tr { border-bottom: 1px solid #ddd; }
  .cost-table td { padding: 0.75rem; text-align: left; font-family: monospace; }
  .cost-table tr.cost-total { background: #FFF3E0; font-weight: 700; }
`;
