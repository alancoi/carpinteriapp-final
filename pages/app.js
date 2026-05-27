import { useState } from 'react';
import Head from 'next/head';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
    }
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
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f0f0f0;
            padding: 10px;
        }

        .phone-frame {
            width: 390px;
            height: 844px;
            background: linear-gradient(180deg, #0A0E27 0%, #141B33 100%);
            border-radius: 50px;
            padding: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            margin: 20px auto;
            overflow: hidden;
            border: 10px solid #000;
            position: relative;
        }

        .notch {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 150px;
            height: 28px;
            background: #000;
            border-radius: 0 0 40px 40px;
            z-index: 100;
        }

        .phone-content {
            width: 100%;
            height: 100%;
            overflow-y: auto;
            background: linear-gradient(180deg, #0A0E27 0%, #141B33 100%);
            color: #FFFFFF;
            padding: 60px 15px 15px 15px;
            border-radius: 45px;
        }

        .container {
            width: 100%;
        }

        .header {
            padding: 1.5rem;
            border-radius: 15px;
            margin-bottom: 1.2rem;
            text-align: center;
        }

        .header-logo {
            width: 70px;
            height: 70px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 0.8rem;
            border: 2px solid rgba(255, 255, 255, 0.3);
            overflow: hidden;
        }

        .header-logo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .header h1 {
            font-size: 1.6rem;
            margin-bottom: 0.3rem;
            font-weight: 900;
            letter-spacing: -0.5px;
            background: linear-gradient(135deg, #FFFFFF, #A0AEC0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-transform: uppercase;
        }

        .header-slogan {
            font-size: 0.85rem;
            color: #FF8C00;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            font-style: italic;
        }

        .user-section {
            background: linear-gradient(135deg, #1F2A47 0%, #141B33 100%);
            border: 1px solid #2D3A52;
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        }

        .user-info {
            flex: 1;
        }

        .user-name {
            font-size: 1rem;
            color: #FFFFFF;
            font-weight: 700;
            margin-bottom: 0.2rem;
            word-break: break-all;
        }

        .user-email {
            color: #A0AEC0;
            font-size: 0.7rem;
            margin-bottom: 0.4rem;
        }

        .plan-badge {
            display: inline-block;
            background: linear-gradient(135deg, #0D47A1, #FF8C00);
            padding: 0.3rem 0.7rem;
            border-radius: 15px;
            font-size: 0.65rem;
            font-weight: 700;
        }

        .logout-btn {
            padding: 0.5rem 0.8rem;
            background: rgba(255, 140, 0, 0.2);
            color: #FF8C00;
            border: 1px solid rgba(255, 140, 0, 0.3);
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.75rem;
            white-space: nowrap;
            transition: all 0.3s;
        }

        .logout-btn:hover {
            background: rgba(255, 140, 0, 0.3);
        }

        .menu-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .menu-card {
            background: linear-gradient(135deg, #1F2A47 0%, #141B33 100%);
            border: 2px solid #2D3A52;
            border-radius: 12px;
            padding: 1.2rem;
            cursor: pointer;
            transition: all 0.3s;
            text-align: center;
        }

        .menu-card:hover {
            border-color: #FF8C00;
            box-shadow: 0 10px 30px rgba(255, 140, 0, 0.2);
            transform: translateY(-3px);
        }

        .menu-card:active {
            transform: scale(0.98);
        }

        .menu-icon {
            font-size: 2.2rem;
            margin-bottom: 0.6rem;
            display: block;
        }

        .menu-title {
            font-size: 1rem;
            font-weight: 700;
            margin-bottom: 0.3rem;
            color: #FFFFFF;
        }

        .menu-desc {
            color: #A0AEC0;
            font-size: 0.75rem;
            line-height: 1.3;
        }

        .premium-button {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, #0D47A1, #FF8C00);
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 700;
            font-size: 0.95rem;
            cursor: pointer;
            margin-bottom: 1rem;
            box-shadow: 0 10px 30px rgba(255, 140, 0, 0.3);
            transition: all 0.3s;
        }

        .premium-button:hover {
            transform: translateY(-2px);
        }

        .premium-button:active {
            transform: scale(0.98);
        }

        .modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 1000;
        }

        .modal-overlay.active {
            display: flex;
            align-items: flex-end;
            justify-content: center;
        }

        .modal-content {
            background: linear-gradient(135deg, #1F2A47 0%, #141B33 100%);
            border: 1px solid #2D3A52;
            border-radius: 20px 20px 0 0;
            padding: 1.5rem;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
            from {
                transform: translateY(100%);
            }
            to {
                transform: translateY(0);
            }
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.2rem;
            border-bottom: 1px solid #2D3A52;
            padding-bottom: 0.8rem;
        }

        .modal-header h2 {
            font-size: 1.3rem;
            color: #FF8C00;
        }

        .close-btn {
            background: none;
            border: none;
            color: #A0AEC0;
            font-size: 1.6rem;
            cursor: pointer;
            padding: 0;
            transition: color 0.3s;
        }

        .close-btn:hover {
            color: #FF8C00;
        }

        .premium-price {
            text-align: center;
            margin: 1.2rem 0;
            padding: 1.2rem 0;
            border-bottom: 1px solid #2D3A52;
        }

        .premium-price .price {
            font-size: 2rem;
            color: #FF8C00;
            font-weight: 800;
        }

        .premium-price .sub {
            color: #A0AEC0;
            font-size: 0.8rem;
            margin-top: 0.4rem;
        }

        .premium-features {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            margin-bottom: 1.5rem;
        }

        .feature-item {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            padding: 0.8rem;
            background: rgba(255, 140, 0, 0.05);
            border: 1px solid #2D3A52;
            border-radius: 8px;
            border-left: 3px solid #FF8C00;
        }

        .feature-item i {
            font-size: 1.4rem;
            color: #FF8C00;
            min-width: 25px;
        }

        .feature-item span {
            color: #A0AEC0;
            font-size: 0.85rem;
        }

        .btn-primary {
            width: 100%;
            padding: 0.9rem;
            background: linear-gradient(135deg, #0D47A1, #FF8C00);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            font-size: 0.95rem;
            transition: all 0.3s;
        }

        .btn-primary:active {
            transform: scale(0.98);
        }
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
              <div className="menu-card">
                <span className="menu-icon">🖼️</span>
                <div className="menu-title">Subir Fotos</div>
                <p className="menu-desc">Carga fotos y obtén planos exactos</p>
              </div>

              <div className="menu-card">
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
    </>
  );
}
