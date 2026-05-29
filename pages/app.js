import { useState } from 'react';
import Head from 'next/head';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [costModalOpen, setCostModalOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [costMaterials, setCostMaterials] = useState('');
  const [costLabor, setCostLabor] = useState('');
  const [salePrice, setSalePrice] = useState('');

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
    // Aquí guardarías el feedback en BD para mejorar
    setTimeout(() => {
      setFeedback(null);
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

              <div className="menu-card">
                <span className="menu-icon">💬</span>
                <div className="menu-title">Chat 24/7 IA</div>
                <p className="menu-desc">Asesor disponible siempre</p>
              </div>

              <div className="menu-card">
                <span className="menu-icon">📊</span>
                <div className="menu-title">Mis Proyectos</div>
                <p className="menu-desc">Historial de trabajos</p>
              </div>

              <div className="menu-card">
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

          <div className="premium-price">
            <div className="price">$9.000</div>
            <div className="sub">por mes - Acceso ilimitado</div>
          </div>

          <div className="premium-features">
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

          <button className="btn-primary">
            <i className="fas fa-credit-card"></i> Actualizar Ahora - $9.000/mes
          </button>
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
                <h3>📝 Datos del Presupuesto</h3>
                
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
                  <div className="cost-group half">
                    <label>⏱️ Horas de Trabajo</label>
                    <input 
                      type="number" 
                      placeholder="Ej: 8"
                      value={costLabor}
                      onChange={(e) => setCostLabor(e.target.value)}
                      className="cost-input"
                    />
                  </div>
                  <div className="cost-group half">
                    <label>💼 Tarifa/Hora (ARS)</label>
                    <input 
                      type="number" 
                      placeholder="Ej: 500"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      className="cost-input"
                    />
                  </div>
                </div>

                <div className="cost-group">
                  <label>📦 Gastos Operativos (ARS)</label>
                  <input 
                    type="number" 
                    placeholder="Ej: 1000 (transporte, embalaje)"
                    value={costMaterials ? '' : ''}
                    onChange={(e) => setCostMaterials(e.target.value)}
                    className="cost-input"
                  />
                </div>
              </div>

              {/* RESULTADOS */}
              <div className="cost-section">
                <h3>💡 Opciones de Precio</h3>
                <div className="price-options">
                  <div className="price-card basic">
                    <div className="price-level">BÁSICO</div>
                    <div className="price-margin">30% margen</div>
                    <div className="price-value">$15.500</div>
                    <div className="price-profit">+4.500 ganancia</div>
                  </div>

                  <div className="price-card normal">
                    <div className="price-level">NORMAL</div>
                    <div className="price-margin">50% margen</div>
                    <div className="price-value">$19.000</div>
                    <div className="price-profit">+8.000 ganancia</div>
                  </div>

                  <div className="price-card premium">
                    <div className="price-level">PREMIUM</div>
                    <div className="price-margin">70% margen</div>
                    <div className="price-value">$22.500</div>
                    <div className="price-profit">+11.500 ganancia</div>
                  </div>
                </div>
              </div>

              {/* DESGLOSE */}
              <div className="cost-section">
                <h3>📊 Desglose de Costos</h3>
                <table className="cost-table">
                  <tr>
                    <td>Materiales</td>
                    <td className="cost-value">$5.000</td>
                  </tr>
                  <tr>
                    <td>Mano de obra (8h × $500)</td>
                    <td className="cost-value">$4.000</td>
                  </tr>
                  <tr>
                    <td>Gastos operativos</td>
                    <td className="cost-value">$1.000</td>
                  </tr>
                  <tr className="cost-total">
                    <td>COSTO TOTAL</td>
                    <td className="cost-value">$10.000</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <button className="btn-primary" onClick={() => setCostModalOpen(false)}>
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
