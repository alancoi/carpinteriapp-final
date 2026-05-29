import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Admin() {
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('usuarios');
  const [createUserModal, setCreateUserModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPlan, setNewUserPlan] = useState('basico');
  const [createUserMessage, setCreateUserMessage] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const ADMIN_PASSWORD = 'Admin123456'; // Cambiar después

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      loadAllData();
    } else {
      alert('❌ Contraseña incorrecta');
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Cargar usuarios
      const usersRes = await fetch('/api/admin/usuarios');
      const usersData = await usersRes.json();
      if (usersData.success) setUsuarios(usersData.usuarios || []);

      // Cargar contactos
      const contactosRes = await fetch('/api/admin/contactos');
      const contactosData = await contactosRes.json();
      if (contactosData.success) setContactos(contactosData.contactos || []);

      // Cargar calificaciones
      const ratingRes = await fetch('/api/admin/calificaciones');
      const ratingData = await ratingRes.json();
      if (ratingData.success) setCalificaciones(ratingData.calificaciones || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
    setLoading(false);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (!newUserEmail.trim()) {
      setCreateUserMessage('Por favor ingresa un email');
      return;
    }

    try {
      const response = await fetch('/api/auth/auto-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUserEmail,
          plan: newUserPlan,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCreateUserMessage(`✓ Usuario creado! Email: ${data.user.email} | Contraseña: ${data.user.tempPassword}`);
        setNewUserEmail('');
        setNewUserPlan('basico');
        
        setTimeout(() => {
          setCreateUserMessage('');
          setCreateUserModal(false);
          loadAllData();
        }, 2000);
      } else {
        setCreateUserMessage('❌ Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setCreateUserMessage('❌ Error creando usuario');
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <>
        <Head>
          <title>CarpinteriAPP - Admin</title>
        </Head>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #0A0E27 0%, #141B33 100%)',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1F2A47 0%, #141B33 100%)',
            padding: '2rem',
            borderRadius: '15px',
            border: '1px solid #2D3A52',
            width: '350px',
            textAlign: 'center',
          }}>
            <h1 style={{ color: '#FF8C00', marginBottom: '1rem', fontSize: '24px' }}>🔐 Admin Login</h1>
            <form onSubmit={handleAdminLogin}>
              <input
                type="password"
                placeholder="Contraseña Admin"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  marginBottom: '1rem',
                  background: '#0A0E27',
                  border: '1px solid #2D3A52',
                  color: '#fff',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: 'linear-gradient(135deg, #0D47A1, #FF8C00)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Ingresar
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>CarpinteriAPP - Admin Dashboard</title>
      </Head>
      <div style={{
        minHeight: '100vh',
        background: '#0A0E27',
        color: '#A0AEC0',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}>
        {/* HEADER */}
        <div style={{
          background: 'linear-gradient(135deg, #1F2A47 0%, #141B33 100%)',
          padding: '1.5rem',
          borderBottom: '1px solid #2D3A52',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h1 style={{ color: '#FF8C00', margin: 0, fontSize: '24px' }}>📊 Panel Admin</h1>
          <button
            onClick={() => {
              setIsAdminLoggedIn(false);
              setAdminPassword('');
            }}
            style={{
              padding: '0.6rem 1rem',
              background: '#F44336',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Logout
          </button>
        </div>

        {/* TABS */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          padding: '1rem',
          borderBottom: '1px solid #2D3A52',
          background: '#141B33',
        }}>
          {['usuarios', 'contactos', 'calificaciones'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.6rem 1.2rem',
                background: activeTab === tab ? '#FF8C00' : 'transparent',
                color: activeTab === tab ? 'white' : '#A0AEC0',
                border: activeTab === tab ? 'none' : '1px solid #2D3A52',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: activeTab === tab ? '700' : '500',
                transition: 'all 0.3s',
              }}
            >
              {tab === 'usuarios' && `👥 Usuarios (${usuarios.length})`}
              {tab === 'contactos' && `📧 Reportes (${contactos.length})`}
              {tab === 'calificaciones' && `⭐ Calificaciones (${calificaciones.length})`}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div style={{ padding: '2rem' }}>
          {loading ? (
            <p style={{ textAlign: 'center' }}>Cargando...</p>
          ) : (
            <>
              {/* USUARIOS */}
              {activeTab === 'usuarios' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ color: '#FF8C00', margin: 0 }}>Usuarios Registrados ({usuarios.length})</h2>
                    <button
                      onClick={() => setCreateUserModal(true)}
                      style={{
                        padding: '0.8rem 1.2rem',
                        background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '700',
                      }}
                    >
                      ➕ Crear Usuario
                    </button>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      background: 'linear-gradient(135deg, #1F2A47 0%, #141B33 100%)',
                      border: '1px solid #2D3A52',
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #2D3A52' }}>
                          <th style={{ padding: '1rem', textAlign: 'left', color: '#FF8C00', fontWeight: '700' }}>Email</th>
                          <th style={{ padding: '1rem', textAlign: 'left', color: '#FF8C00', fontWeight: '700' }}>Plan</th>
                          <th style={{ padding: '1rem', textAlign: 'left', color: '#FF8C00', fontWeight: '700' }}>Proyectos</th>
                          <th style={{ padding: '1rem', textAlign: 'left', color: '#FF8C00', fontWeight: '700' }}>Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usuarios.map((user) => (
                          <tr key={user._id} style={{ borderBottom: '1px solid #2D3A52' }}>
                            <td style={{ padding: '1rem' }}>{user.email}</td>
                            <td style={{ padding: '1rem', color: user.plan === 'premium' ? '#4CAF50' : '#A0AEC0' }}>{user.plan}</td>
                            <td style={{ padding: '1rem' }}>{user.proyectosGuardados}</td>
                            <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{new Date(user.createdAt).toLocaleDateString('es-AR')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CONTACTOS */}
              {activeTab === 'contactos' && (
                <div>
                  <h2 style={{ color: '#FF8C00', marginTop: 0 }}>Reportes de Error</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                    {contactos.map((contacto) => (
                      <div
                        key={contacto._id}
                        style={{
                          background: 'linear-gradient(135deg, #1F2A47 0%, #141B33 100%)',
                          border: '1px solid #2D3A52',
                          borderLeft: '4px solid #F44336',
                          padding: '1rem',
                          borderRadius: '8px',
                        }}
                      >
                        <p style={{ margin: '0 0 0.5rem 0', color: '#FF8C00', fontWeight: '700' }}>📧 {contacto.email}</p>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>{contacto.mensaje}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>
                          {new Date(contacto.createdAt).toLocaleString('es-AR')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CALIFICACIONES */}
              {activeTab === 'calificaciones' && (
                <div>
                  <h2 style={{ color: '#FF8C00', marginTop: 0 }}>Calificaciones</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                    {calificaciones.map((cal) => (
                      <div
                        key={cal._id}
                        style={{
                          background: 'linear-gradient(135deg, #1F2A47 0%, #141B33 100%)',
                          border: '1px solid #2D3A52',
                          borderLeft: `4px solid ${cal.estrellas >= 4 ? '#4CAF50' : cal.estrellas >= 3 ? '#FFC107' : '#F44336'}`,
                          padding: '1rem',
                          borderRadius: '8px',
                        }}
                      >
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
                          {'⭐'.repeat(cal.estrellas)}
                        </p>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#FF8C00', fontWeight: '700' }}>📧 {cal.email}</p>
                        {cal.opinion && <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>"{cal.opinion}"</p>}
                        {cal.mejoras && <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#FFC107' }}>💡 {cal.mejoras}</p>}
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>
                          {new Date(cal.createdAt).toLocaleString('es-AR')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MODAL CREAR USUARIO */}
      {createUserModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1F2A47 0%, #141B33 100%)',
            padding: '2rem',
            borderRadius: '15px',
            border: '1px solid #2D3A52',
            width: '90%',
            maxWidth: '400px',
          }}>
            <h2 style={{ color: '#FF8C00', marginTop: 0 }}>➕ Crear Usuario Manual</h2>
            
            <form onSubmit={handleCreateUser}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: '#A0AEC0', marginBottom: '0.5rem', fontWeight: '600' }}>Email</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="usuario@email.com"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    background: '#0A0E27',
                    border: '1px solid #2D3A52',
                    color: '#fff',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: '#A0AEC0', marginBottom: '0.5rem', fontWeight: '600' }}>Plan</label>
                <select
                  value={newUserPlan}
                  onChange={(e) => setNewUserPlan(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    background: '#0A0E27',
                    border: '1px solid #2D3A52',
                    color: '#fff',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="basico">Básico</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              {createUserMessage && (
                <div style={{
                  padding: '1rem',
                  background: createUserMessage.includes('✓') ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                  border: `1px solid ${createUserMessage.includes('✓') ? '#4CAF50' : '#F44336'}`,
                  color: createUserMessage.includes('✓') ? '#4CAF50' : '#F44336',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                  wordBreak: 'break-all',
                }}>
                  {createUserMessage}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                  type="submit"
                  style={{
                    padding: '0.8rem',
                    background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '700',
                  }}
                >
                  ✓ Crear
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreateUserModal(false);
                    setNewUserEmail('');
                    setCreateUserMessage('');
                  }}
                  style={{
                    padding: '0.8rem',
                    background: '#F44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '700',
                  }}
                >
                  ✕ Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
// Updated at Fri May 29 18:50:37 UTC 2026
