import { useState, useEffect } from 'react';
import Head from 'next/head';

const AnalysisRenderer = ({ data }) => {
  if (!data || !data.tipo_mueble) return null;
  
  return (
    <div style={{ padding: '15px', fontSize: '13px', lineHeight: '1.6', color: '#333', fontFamily: 'Arial, sans-serif' }}>
      
      {/* ENCABEZADO */}
      <div style={{ marginBottom: '20px', paddingBottom: '12px', borderBottom: '3px solid #FF8C00' }}>
        <h2 style={{ color: '#1565C0', fontSize: '18px', marginTop: 0, marginBottom: '3px' }}>Análisis Técnico de Mueble</h2>
        <p style={{ color: '#999', fontSize: '11px', marginTop: 0, marginBottom: 0 }}>CarpinteriAPP</p>
      </div>

      {/* TIPO Y ESTILO - SOLO TEXTO */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ color: '#1565C0', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' }}>
          {data.tipo_mueble} • {data.estilo}
        </div>
      </div>

      {/* MEDIDAS PRINCIPALES */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ color: '#1565C0', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '10px' }}>Medidas</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '10px' }}>
          <div style={{ background: '#FFF3E0', padding: '12px', border: '2px solid #FF8C00', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontSize: '9px', color: '#E65100', fontWeight: 'bold', marginBottom: '6px' }}>LARGO</div>
            <div style={{ fontSize: '18px', color: '#FF8C00', fontWeight: 'bold' }}>{data.medidas.largo}cm</div>
          </div>
          <div style={{ background: '#FFF3E0', padding: '12px', border: '2px solid #FF8C00', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontSize: '9px', color: '#E65100', fontWeight: 'bold', marginBottom: '6px' }}>ANCHO</div>
            <div style={{ fontSize: '18px', color: '#FF8C00', fontWeight: 'bold' }}>{data.medidas.ancho}cm</div>
          </div>
          <div style={{ background: '#FFF3E0', padding: '12px', border: '2px solid #FF8C00', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontSize: '9px', color: '#E65100', fontWeight: 'bold', marginBottom: '6px' }}>ALTO</div>
            <div style={{ fontSize: '18px', color: '#FF8C00', fontWeight: 'bold' }}>{data.medidas.alto}cm</div>
          </div>
        </div>
      </div>

      {/* MATERIALES */}
      {data.materiales && data.materiales.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: '#1565C0', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Materiales</div>
          <div style={{ background: '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
            {data.materiales.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderBottom: i < data.materiales.length - 1 ? '1px solid #eee' : 'none', fontSize: '12px' }}>
                <span style={{ fontWeight: '500', wordBreak: 'break-word' }}>{m.nombre}</span>
                <span style={{ color: '#FF8C00', fontWeight: 'bold', marginLeft: '10px', whiteSpace: 'nowrap' }}>{m.cantidad}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMPONENTES */}
      {data.componentes && data.componentes.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: '#1565C0', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Componentes</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
            {data.componentes.map((c, i) => (
              <div key={i} style={{ background: '#f0f7ff', padding: '10px', border: '1px solid #1565C0', borderRadius: '4px', fontSize: '11px' }}>
                <div style={{ fontWeight: 'bold', color: '#1565C0', marginBottom: '6px', wordBreak: 'break-word' }}>{c.nombre}</div>
                <div style={{ lineHeight: '1.5', color: '#555' }}>
                  <div><strong>Cant:</strong> {c.cantidad}</div>
                  <div><strong>Med:</strong> {c.medidas}</div>
                  {c.espesor && c.espesor !== 'N/A' && <div><strong>Esp:</strong> {c.espesor}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TABLA DE CORTES */}
      {data.cortes && data.cortes.length > 0 && (
        <div style={{ marginBottom: '20px', overflowX: 'auto' }}>
          <div style={{ color: '#1565C0', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Cortes</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', minWidth: '280px' }}>
            <thead>
              <tr style={{ background: '#1565C0', color: 'white' }}>
                <th style={{ padding: '8px', textAlign: 'left', fontWeight: 'bold', wordBreak: 'break-word', fontSize: '10px' }}>Componente</th>
                <th style={{ padding: '8px', textAlign: 'left', fontWeight: 'bold' }}>Medidas</th>
                <th style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>Cant</th>
                <th style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>Desp%</th>
              </tr>
            </thead>
            <tbody>
              {data.cortes.map((c, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fafafa' : 'white', borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '8px', fontWeight: '500', wordBreak: 'break-word' }}>{c.componente.substring(0, 15)}</td>
                  <td style={{ padding: '8px', wordBreak: 'break-word' }}>{c.medidas}</td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>{c.cantidad}</td>
                  <td style={{ padding: '8px', textAlign: 'center', color: '#FF8C00', fontWeight: 'bold' }}>{c.desperdicio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DESPERDICIO */}
      {data.desperdicio_total && (
        <div style={{ marginBottom: '20px', padding: '12px', background: '#FFF3E0', border: '2px solid #FF8C00', borderRadius: '4px' }}>
          <div style={{ fontSize: '10px', color: '#E65100', fontWeight: 'bold', marginBottom: '6px' }}>DESPERDICIO TOTAL DE PLACA (275×183cm)</div>
          <div style={{ fontSize: '18px', color: '#FF8C00', fontWeight: 'bold' }}>{data.desperdicio_total}</div>
        </div>
      )}

      {/* RECOMENDACIONES */}
      {data.notas && data.notas.length > 0 && (
        <div style={{ marginBottom: '15px', padding: '12px', background: '#f0f7ff', border: '2px solid #1565C0', borderRadius: '4px' }}>
          <div style={{ color: '#1565C0', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Recomendaciones</div>
          <div style={{ fontSize: '11px', color: '#555', lineHeight: '1.6' }}>
            {data.notas.map((n, i) => (
              <div key={i} style={{ display: 'flex', marginBottom: i < data.notas.length - 1 ? '8px' : '0', wordBreak: 'break-word' }}>
                <span style={{ color: '#FF8C00', fontWeight: 'bold', marginRight: '8px', minWidth: '16px' }}>•</span>
                <span>{n}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PIE */}
      <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '10px', fontSize: '10px', color: '#999', textAlign: 'center' }}>
        Medidas aproximadas en cm
      </div>

    </div>
  );
};

// Función para generar HTML desde datos JSON del mueble
const generateAnalysisHTML = (data) => {
  if (!data.tipo_mueble) return '';

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 900px; margin: 0 auto;">
      
      <!-- ENCABEZADO -->
      <div style="border-bottom: 3px solid #FF8C00; padding-bottom: 20px; margin-bottom: 30px;">
        <h2 style="color: #1565C0; font-size: 24px; margin-bottom: 5px;">Análisis Técnico de Mueble</h2>
        <p style="color: #999; font-size: 13px; margin: 0;">CarpinteriAPP - Análisis profesional para carpinteros</p>
      </div>

      <!-- TIPO Y ESTILO -->
      <div style="margin-bottom: 30px;">
        <div style="color: #1565C0; font-size: 16px; font-weight: 600; border-left: 4px solid #FF8C00; padding-left: 12px; margin-bottom: 15px;">Tipo de Mueble</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="padding: 12px; background: #f9f9f9; border-radius: 6px; border-left: 3px solid #FF8C00;">
            <div style="font-size: 12px; color: #999; text-transform: uppercase; font-weight: 600; margin-bottom: 5px;">Clasificación</div>
            <div style="font-size: 16px; color: #1565C0; font-weight: 600;">${data.tipo_mueble}</div>
          </div>
          <div style="padding: 12px; background: #f9f9f9; border-radius: 6px; border-left: 3px solid #FF8C00;">
            <div style="font-size: 12px; color: #999; text-transform: uppercase; font-weight: 600; margin-bottom: 5px;">Estilo</div>
            <div style="font-size: 16px; color: #1565C0; font-weight: 600;">${data.estilo}</div>
          </div>
        </div>
      </div>

      <!-- MEDIDAS PRINCIPALES -->
      <div style="margin-bottom: 30px;">
        <div style="color: #1565C0; font-size: 16px; font-weight: 600; border-left: 4px solid #FF8C00; padding-left: 12px; margin-bottom: 15px;">Medidas Principales</div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
          <div style="background: linear-gradient(135deg, #FFF3E0 0%, #FFECB3 100%); border: 2px solid #FF8C00; border-radius: 8px; padding: 15px; text-align: center;">
            <div style="font-size: 12px; color: #E65100; font-weight: 600; margin-bottom: 8px; text-transform: uppercase;">Largo</div>
            <div style="font-size: 22px; color: #FF8C00; font-weight: 700;">${data.medidas.largo}cm</div>
          </div>
          <div style="background: linear-gradient(135deg, #FFF3E0 0%, #FFECB3 100%); border: 2px solid #FF8C00; border-radius: 8px; padding: 15px; text-align: center;">
            <div style="font-size: 12px; color: #E65100; font-weight: 600; margin-bottom: 8px; text-transform: uppercase;">Ancho</div>
            <div style="font-size: 22px; color: #FF8C00; font-weight: 700;">${data.medidas.ancho}cm</div>
          </div>
          <div style="background: linear-gradient(135deg, #FFF3E0 0%, #FFECB3 100%); border: 2px solid #FF8C00; border-radius: 8px; padding: 15px; text-align: center;">
            <div style="font-size: 12px; color: #E65100; font-weight: 600; margin-bottom: 8px; text-transform: uppercase;">Alto</div>
            <div style="font-size: 22px; color: #FF8C00; font-weight: 700;">${data.medidas.alto}cm</div>
          </div>
        </div>
      </div>

      <!-- MATERIALES -->
      <div style="margin-bottom: 30px;">
        <div style="color: #1565C0; font-size: 16px; font-weight: 600; border-left: 4px solid #FF8C00; padding-left: 12px; margin-bottom: 15px;">Materiales</div>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; border-left: 3px solid #1565C0;">
          ${data.materiales.map((m, i) => `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; ${i === data.materiales.length - 1 ? 'border-bottom: none;' : ''}">
              <span style="font-weight: 600; color: #333;">${m.nombre}</span>
              <span style="color: #FF8C00; font-weight: 600;">${m.cantidad}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- COMPONENTES -->
      <div style="margin-bottom: 30px;">
        <div style="color: #1565C0; font-size: 16px; font-weight: 600; border-left: 4px solid #FF8C00; padding-left: 12px; margin-bottom: 15px;">Componentes Principales</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          ${data.componentes.map(c => `
            <div style="background: #f0f7ff; border: 1px solid #1565C0; border-radius: 6px; padding: 15px;">
              <div style="font-weight: 600; color: #1565C0; margin-bottom: 8px;">${c.nombre}</div>
              <div style="font-size: 13px; color: #666; line-height: 1.6;">
                <strong>Cantidad:</strong> ${c.cantidad}<br>
                <strong>Medidas:</strong> ${c.medidas}<br>
                ${c.espesor ? `<strong>Espesor:</strong> ${c.espesor}` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- TABLA CORTES -->
      <div style="margin-bottom: 30px;">
        <div style="color: #1565C0; font-size: 16px; font-weight: 600; border-left: 4px solid #FF8C00; padding-left: 12px; margin-bottom: 15px;">Especificación de Cortes</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr>
              <th style="background: #1565C0; color: white; padding: 12px; text-align: left; font-weight: 600;">Componente</th>
              <th style="background: #1565C0; color: white; padding: 12px; text-align: left; font-weight: 600;">Medidas</th>
              <th style="background: #1565C0; color: white; padding: 12px; text-align: left; font-weight: 600;">Cantidad</th>
              <th style="background: #1565C0; color: white; padding: 12px; text-align: left; font-weight: 600;">Desperdicio</th>
            </tr>
          </thead>
          <tbody>
            ${data.cortes.map((c, i) => `
              <tr style="background: ${i % 2 === 0 ? '#f9f9f9' : 'white'};">
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${c.componente}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${c.medidas}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${c.cantidad}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; color: #FF8C00; font-weight: 600;">${c.desperdicio}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- DESPERDICIO -->
      <div style="margin-bottom: 30px;">
        <div style="background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%); border: 2px solid #FF8C00; border-radius: 8px; padding: 15px;">
          <div style="font-weight: 600; color: #E65100; margin-bottom: 8px; font-size: 14px;">Resumen de Desperdicio</div>
          <div style="font-size: 13px; color: #666; line-height: 1.6;">
            <strong>Desperdicio total estimado:</strong> <span style="color: #FF8C00; font-weight: 700; font-size: 16px;">${data.desperdicio_total}</span>
          </div>
        </div>
      </div>

      <!-- NOTAS -->
      <div style="margin-bottom: 30px;">
        <div style="color: #1565C0; font-size: 16px; font-weight: 600; border-left: 4px solid #FF8C00; padding-left: 12px; margin-bottom: 15px;">Recomendaciones</div>
        <div style="background: #f0f7ff; border-left: 4px solid #1565C0; padding: 15px; border-radius: 6px;">
          ${data.notas.map(nota => `
            <div style="display: flex; margin-bottom: 10px; font-size: 13px; color: #555; line-height: 1.5;">
              <span style="color: #FF8C00; font-weight: 700; margin-right: 10px; min-width: 20px;">•</span>
              <span>${nota}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- PIE -->
      <div style="border-top: 1px solid #eee; padding-top: 15px; font-size: 12px; color: #999; text-align: center;">
        <p style="margin: 0;">⚠️ Todas las medidas son aproximadas en centímetros basadas en el análisis de la imagen recibida.</p>
      </div>

    </div>
  `;
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [plan, setPlan] = useState('basico');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerMode, setRegisterMode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [costModalOpen, setCostModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [projectsModalOpen, setProjectsModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [purchaseCredentials, setPurchaseCredentials] = useState(null);
  const [contactMessage, setContactMessage] = useState('');
  const [contactError, setContactError] = useState('');
  const [stars, setStars] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingImprovement, setRatingImprovement] = useState('');
  const [ratingMessage, setRatingMessage] = useState('');
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    if (registerMode && !nombre) {
      setAuthError('Por favor completa tu nombre');
      return;
    }
    
    if (!email || !password) {
      setAuthError('Por favor completa todos los campos');
      return;
    }

    try {
      const endpoint = registerMode ? '/api/auth/register' : '/api/auth/login';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerMode ? { nombre, email, password } : { email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthError(data.error || 'Error en autenticación');
        return;
      }

      setUserId(data.user.id);
      setNombre(data.user.nombre);
      setPlan(data.user.plan || 'basico');
      setIsLoggedIn(true);
      setAuthError('');
      setRegisterMode(false);
      
      // Cargar proyectos del usuario
      if (data.user.id) {
        loadProjects(data.user.id);
      }
    } catch (error) {
      setAuthError('Error conectando con el servidor');
      console.error(error);
    }
  };

  const loadProjects = async (uid) => {
    try {
      const response = await fetch(`/api/proyectos/get?userId=${uid}`);
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error cargando proyectos:', error);
    }
  };

  // Función para comprimir imagen automáticamente
  const compressImage = (base64String, mimeType) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Redimensionar si es muy grande (máx 2000px)
        if (width > 2000 || height > 2000) {
          const ratio = Math.min(2000 / width, 2000 / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Comprimir con calidad 0.8 (80%)
        const compressedBase64 = canvas.toDataURL(mimeType, 0.8).split(',')[1];
        resolve(compressedBase64);
      };
      img.src = 'data:' + mimeType + ';base64,' + base64String;
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const mimeType = file.type || 'image/jpeg';

    const reader = new FileReader();
    reader.onload = async (event) => {
      setPreview(event.target.result);
      setLoading(true);
      setAnalysis(null);
      setFeedback(null);

      try {
        const base64Original = event.target.result.split(',')[1];
        
        // Comprimir imagen automáticamente
        const base64Compressed = await compressImage(base64Original, mimeType);

        const response = await fetch('/api/claude-vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64Compressed, mimeType: mimeType }),
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

        // Parsear JSON de Claude Vision
        try {
          const parsed = JSON.parse(data.analysis);
          if (parsed.error) {
            setAnalysis(parsed.error);
          } else {
            // Guardar como objeto para renderizar con React
            setAnalysis(parsed);
          }
        } catch (e) {
          setAnalysis(data.analysis);
        }
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

  const downloadPDF = () => {
    if (!analysis || typeof analysis !== 'object') {
      alert('Por favor completa un análisis primero');
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    
    script.onload = () => {
      try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const w = 210;
        const h = 297;
        const margin = 12;
        const contentW = w - (margin * 2);
        let y = margin;
        
        // COLORES
        const azul = [21, 101, 192];
        const naranja = [255, 140, 0];
        const gris = [100, 100, 100];
        const grisClaro = [220, 220, 220];
        
        // FUNCIONES HELPER
        const addSection = (title, minSpaceNeeded = 25) => {
          // Si no hay espacio para título + contenido, pasar a página nueva
          if (y + minSpaceNeeded > h - margin) {
            pdf.addPage();
            y = margin;
          }
          
          pdf.setFontSize(13);
          pdf.setTextColor(...azul);
          pdf.setFont(undefined, 'bold');
          pdf.text(title, margin, y);
          y += 8;
          pdf.setDrawColor(...naranja);
          pdf.line(margin, y - 2, w - margin, y - 2);
          y += 6;
        };
        
        const addSpacing = (space = 3) => { y += space; };
        
        // PORTADA
        pdf.setFontSize(24);
        pdf.setTextColor(...azul);
        pdf.setFont(undefined, 'bold');
        pdf.text('ANÁLISIS TÉCNICO', w / 2, y, { align: 'center' });
        y += 10;
        pdf.setFontSize(24);
        pdf.text('DE MUEBLE', w / 2, y, { align: 'center' });
        y += 18;
        
        pdf.setFontSize(11);
        pdf.setTextColor(...gris);
        pdf.setFont(undefined, 'normal');
        pdf.text(`${analysis.tipo_mueble} • ${analysis.estilo}`, w / 2, y, { align: 'center' });
        y += 12;
        
        pdf.setFontSize(9);
        pdf.setTextColor(180, 180, 180);
        const fecha = new Date().toLocaleDateString('es-AR');
        pdf.text(`CarpinteriAPP • ${fecha}`, w / 2, y, { align: 'center' });
        y += 25;
        
        // MEDIDAS PRINCIPALES
        addSection('MEDIDAS PRINCIPALES', 30);
        
        const medWidth = (contentW - 8) / 3;
        const measures = [
          { label: 'LARGO', value: `${analysis.medidas.largo}cm` },
          { label: 'ANCHO', value: `${analysis.medidas.ancho}cm` },
          { label: 'ALTO', value: `${analysis.medidas.alto}cm` }
        ];
        
        let xMed = margin;
        measures.forEach((m) => {
          // Recuadro
          pdf.setFillColor(255, 243, 224);
          pdf.setDrawColor(...naranja);
          pdf.setLineWidth(0.5);
          pdf.rect(xMed, y, medWidth, 18, 'FD');
          
          // Label
          pdf.setFontSize(8);
          pdf.setTextColor(230, 81, 0);
          pdf.setFont(undefined, 'bold');
          pdf.text(m.label, xMed + medWidth / 2, y + 4, { align: 'center' });
          
          // Valor
          pdf.setFontSize(12);
          pdf.setTextColor(...naranja);
          pdf.setFont(undefined, 'bold');
          pdf.text(m.value, xMed + medWidth / 2, y + 12, { align: 'center' });
          
          xMed += medWidth + 4;
        });
        y += 25;
        addSpacing();
        
        // MATERIALES
        if (analysis.materiales && analysis.materiales.length > 0) {
          // Calcular espacio necesario
          const materialesSpace = 20 + (analysis.materiales.length * 6);
          if (y + materialesSpace > h - margin) {
            pdf.addPage();
            y = margin;
          }
          
          addSection('MATERIALES', 20);
          
          pdf.setFontSize(8);
          pdf.setTextColor(...gris);
          pdf.setFont(undefined, 'normal');
          
          analysis.materiales.forEach((m, idx) => {
            // Línea alternada
            if (idx % 2 === 0) {
              pdf.setFillColor(249, 249, 249);
              pdf.rect(margin, y - 2, contentW, 5, 'F');
            }
            
            // Nombre del material con límite de ancho
            const maxWidthNombre = contentW - 60;
            const lineasNombre = pdf.splitTextToSize(m.nombre, maxWidthNombre);
            if (lineasNombre.length > 0) {
              pdf.text(lineasNombre[0], margin + 2, y);
            }
            
            // Cantidad alineada a la derecha
            pdf.setFont(undefined, 'bold');
            pdf.setTextColor(...naranja);
            pdf.text(m.cantidad, w - margin - 2, y, { align: 'right' });
            pdf.setFont(undefined, 'normal');
            pdf.setTextColor(...gris);
            
            y += 5;
          });
          addSpacing(3);
        }
        
        // COMPONENTES
        if (analysis.componentes && analysis.componentes.length > 0) {
          // Calcular espacio necesario
          const componentesSpace = 20 + (analysis.componentes.length * 8);
          if (y + componentesSpace > h - margin) {
            pdf.addPage();
            y = margin;
          }
          
          addSection('COMPONENTES PRINCIPALES', 25);
          
          pdf.setFontSize(8);
          pdf.setTextColor(...gris);
          pdf.setFont(undefined, 'normal');
          
          analysis.componentes.forEach((c, idx) => {
            if (y > h - 20) {
              pdf.addPage();
              y = margin;
            }
            
            pdf.setTextColor(...azul);
            pdf.setFont(undefined, 'bold');
            const lineasComp = pdf.splitTextToSize(c.nombre, contentW - 4);
            pdf.text(lineasComp[0], margin + 2, y);
            
            y += 4;
            pdf.setTextColor(...gris);
            pdf.setFont(undefined, 'normal');
            pdf.setFontSize(7);
            
            pdf.text(`Cant: ${c.cantidad}  •  Med: ${c.medidas}`, margin + 3, y);
            if (c.espesor && c.espesor !== 'N/A') {
              y += 3;
              pdf.text(`Espesor: ${c.espesor}`, margin + 3, y);
            }
            
            y += 5;
            pdf.setFontSize(8);
          });
          addSpacing(2);
        }
        
        // TABLA DE CORTES
        if (analysis.cortes && analysis.cortes.length > 0) {
          // Calcular espacio necesario (título + headers + mínimo 3 filas)
          const cortesSpace = 25 + (Math.min(analysis.cortes.length, 3) * 5);
          if (y + cortesSpace > h - margin) {
            pdf.addPage();
            y = margin;
          }
          
          addSection('CORTES DE PLACA', 40);
          
          const colW = [55, 40, 20, 25];
          const headers = ['Componente', 'Medidas', 'Cant.', 'Desp.'];
          
          // Headers
          pdf.setFillColor(...azul);
          pdf.setTextColor(255, 255, 255);
          pdf.setFont(undefined, 'bold');
          pdf.setFontSize(8);
          
          let xCol = margin;
          headers.forEach((h, i) => {
            pdf.rect(xCol, y, colW[i], 6, 'F');
            pdf.text(h, xCol + 1, y + 4);
            xCol += colW[i];
          });
          y += 7;
          
          // Rows
          pdf.setFont(undefined, 'normal');
          pdf.setTextColor(...gris);
          pdf.setFontSize(7);
          
          let rowCount = 0;
          analysis.cortes.forEach((c, idx) => {
            // Si quedan menos de 10mm, pasar a nueva página con título
            if (y + 5 > h - 15) {
              pdf.addPage();
              y = margin;
              
              // Repetir el título en la nueva página
              pdf.setFontSize(13);
              pdf.setTextColor(...azul);
              pdf.setFont(undefined, 'bold');
              pdf.text('CORTES DE PLACA (continuación)', margin, y);
              y += 8;
              pdf.setDrawColor(...naranja);
              pdf.line(margin, y - 2, w - margin, y - 2);
              y += 6;
              
              // Repetir headers
              pdf.setFillColor(...azul);
              pdf.setTextColor(255, 255, 255);
              pdf.setFont(undefined, 'bold');
              pdf.setFontSize(8);
              
              xCol = margin;
              headers.forEach((h, i) => {
                pdf.rect(xCol, y, colW[i], 6, 'F');
                pdf.text(h, xCol + 1, y + 4);
                xCol += colW[i];
              });
              y += 7;
              
              pdf.setFont(undefined, 'normal');
              pdf.setTextColor(...gris);
              pdf.setFontSize(7);
              rowCount = 0;
            }
            
            if (rowCount % 2 === 0) {
              pdf.setFillColor(250, 250, 250);
              pdf.rect(margin, y, contentW, 5, 'F');
            }
            
            xCol = margin;
            
            pdf.setTextColor(...gris);
            pdf.setFont(undefined, 'normal');
            pdf.text(c.componente.substring(0, 20), xCol + 1, y + 3);
            xCol += colW[0];
            
            pdf.text(c.medidas, xCol + 1, y + 3);
            xCol += colW[1];
            
            pdf.text(c.cantidad.toString(), xCol + 1, y + 3);
            xCol += colW[2];
            
            pdf.setTextColor(...naranja);
            pdf.setFont(undefined, 'bold');
            pdf.text(c.desperdicio, xCol + 1, y + 3);
            
            y += 5;
            rowCount++;
          });
          addSpacing(3);
        }
        
        // DESPERDICIO TOTAL
        addSection('DESPERDICIO TOTAL DE PLACA', 25);
        
        pdf.setFillColor(255, 243, 224);
        pdf.setDrawColor(...naranja);
        pdf.setLineWidth(1);
        pdf.rect(margin, y, contentW, 15, 'FD');
        
        pdf.setFontSize(8);
        pdf.setTextColor(230, 81, 0);
        pdf.setFont(undefined, 'bold');
        pdf.text('275 × 183 cm', margin + 5, y + 4);
        
        pdf.setFontSize(18);
        pdf.setTextColor(...naranja);
        pdf.text(analysis.desperdicio_total, margin + 5, y + 11);
        
        y += 20;
        addSpacing(3);
        
        // RECOMENDACIONES
        if (analysis.notas && analysis.notas.length > 0) {
          addSection('RECOMENDACIONES TÉCNICAS', 30);
          
          pdf.setFontSize(8);
          pdf.setTextColor(...gris);
          pdf.setFont(undefined, 'normal');
          
          analysis.notas.forEach((n, idx) => {
            if (y > h - 20) {
              pdf.addPage();
              y = margin;
              
              // Repetir el título
              pdf.setFontSize(13);
              pdf.setTextColor(...azul);
              pdf.setFont(undefined, 'bold');
              pdf.text('RECOMENDACIONES TÉCNICAS (continuación)', margin, y);
              y += 8;
              pdf.setDrawColor(...naranja);
              pdf.line(margin, y - 2, w - margin, y - 2);
              y += 6;
              
              pdf.setFontSize(8);
              pdf.setTextColor(...gris);
              pdf.setFont(undefined, 'normal');
            }
            
            const lines = pdf.splitTextToSize(`${idx + 1}. ${n}`, contentW - 5);
            lines.forEach(line => {
              pdf.text(line, margin + 3, y);
              y += 4;
            });
            y += 2;
          });
        }
        
        // PIE DE PÁGINA
        const pageCount = pdf.internal.pages.length - 1;
        for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);
          pdf.setFontSize(7);
          pdf.setTextColor(180, 180, 180);
          pdf.text(`Página ${i} de ${pageCount}`, w / 2, h - 5, { align: 'center' });
          pdf.text('CarpinteriAPP - Análisis Profesional para Carpinteros', w / 2, h - 2, { align: 'center' });
        }
        
        // Descargar
        const filename = `Analisis_${analysis.tipo_mueble}_${new Date().getTime()}.pdf`;
        pdf.save(filename);
        
      } catch (error) {
        console.error('Error generando PDF:', error);
        alert('Error al generar PDF: ' + error.message);
      }
    };
    
    script.onerror = () => {
      alert('Error: No se pudo cargar la librería de PDF');
    };
    
    document.head.appendChild(script);
  };

  // Auto-scroll a los botones cuando aparece el análisis
  useEffect(() => {
    if (analysis && (typeof analysis === 'object' || !analysis.includes('❌'))) {
      setTimeout(() => {
        const buttons = document.querySelector('.modal-body');
        if (buttons) {
          buttons.scrollTop = buttons.scrollHeight;
        }
      }, 300);
    }
  }, [analysis]);

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

  const saveProject = async () => {
    if (!analysis || !userId) {
      alert('No hay análisis o usuario no identificado');
      return;
    }
    
    try {
      const response = await fetch('/api/proyectos/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: `Proyecto ${new Date().toLocaleDateString('es-AR')}`,
          date: new Date().toLocaleString('es-AR'),
          analysis,
          preview,
          description: analysis.tipo_mueble ? `${analysis.tipo_mueble} - ${analysis.estilo}` : 'Análisis de mueble',
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setProjects([data.project, ...projects]);
        alert('✓ Proyecto guardado en la nube');
      } else {
        alert('Error guardando proyecto: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error guardando proyecto');
    }
  };

  const handleChangePassword = async () => {
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
    
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPasswordMessage('✓ Contraseña actualizada correctamente');
        setNewPassword('');
        setConfirmPassword('');
        
        setTimeout(() => {
          setPasswordMessage('');
        }, 2000);
      } else {
        setPasswordMessage('❌ Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setPasswordMessage('❌ Error actualizando contraseña');
    }
  };

  const deleteProject = async (projectId) => {
    try {
      const response = await fetch('/api/proyectos/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });

      const data = await response.json();

      if (data.success) {
        setProjects(projects.filter(p => p._id !== projectId));
        setSelectedProject(null);
        alert('✓ Proyecto eliminado');
      } else {
        alert('Error eliminando proyecto: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error eliminando proyecto');
    }
  };

  const handleSendContact = async () => {
    if (!contactError.trim()) {
      setContactMessage('Por favor describe el problema o error');
      return;
    }
    
    try {
      const response = await fetch('/api/contacto/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || null,
          email: email || null,
          mensaje: contactError,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setContactMessage('✓ Mensaje enviado. Gracias por reportar, nuestro equipo lo revisará pronto');
        setContactError('');
        
        setTimeout(() => {
          setContactMessage('');
          setContactModalOpen(false);
        }, 2000);
      } else {
        setContactMessage('❌ Error enviando mensaje: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setContactMessage('❌ Error conectando con el servidor');
    }
  };

  const handleSubmitRating = async () => {
    if (stars === 0) {
      setRatingMessage('Por favor selecciona una calificación');
      return;
    }
    
    try {
      const response = await fetch('/api/calificacion/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || null,
          email: email || null,
          estrellas: stars,
          opinion: ratingComment,
          mejoras: ratingImprovement,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRatingMessage('✓ ¡Gracias por tu calificación! Tu feedback nos ayuda a mejorar');
        setStars(0);
        setRatingComment('');
        setRatingImprovement('');
        
        setTimeout(() => {
          setRatingMessage('');
          setRatingModalOpen(false);
        }, 2000);
      } else {
        setRatingMessage('❌ Error enviando calificación: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setRatingMessage('❌ Error conectando con el servidor');
    }
  };

  const simulatePremiumPurchase = async () => {
    try {
      // Simular compra en MercadoPago
      // En producción, esto vendría desde MercadoPago webhook
      
      const response = await fetch('/api/auth/auto-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `premium-${Date.now()}@carpinteria.com`, // Email temporal
          plan: 'premium',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPurchaseCredentials({
          email: data.user.email,
          password: data.user.tempPassword,
          plan: data.user.plan,
        });
        setPremiumModalOpen(false);
        setPurchaseModalOpen(true);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error procesando compra');
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
              <h2 style={{fontSize: '1.3rem', marginBottom: '1.5rem', color: '#FF8C00'}}>
                {registerMode ? '📝 Registro' : '🔐 Login'}
              </h2>
              
              {registerMode && (
                <div className="form-group">
                  <label className="label">Nombre Completo</label>
                  <input 
                    type="text" 
                    placeholder="Tu nombre" 
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)} 
                    required 
                  />
                </div>
              )}
              
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

              {authError && (
                <div style={{background: 'rgba(244, 67, 54, 0.2)', border: '1px solid #F44336', color: '#F44336', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: '600'}}>
                  ❌ {authError}
                </div>
              )}

              <button type="submit" className="btn-login">
                {registerMode ? '📝 Registrarse' : '🔐 Iniciar Sesión'}
              </button>

              <button 
                type="button" 
                onClick={() => {setRegisterMode(!registerMode); setAuthError(''); setNombre(''); setEmail(''); setPassword('');}}
                style={{width: '100%', marginTop: '1rem', padding: '0.8rem', background: 'transparent', border: '1px solid #FF8C00', color: '#FF8C00', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s'}}
              >
                {registerMode ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
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
        .analysis-result { background: #0A0E27; border: 1px solid #0D47A1; border-left: 4px solid #FF8C00; color: #A0AEC0; padding: 1.5rem; border-radius: 8px; font-size: 0.85rem; max-height: 500px; overflow-y: auto; overflow-x: auto; white-space: pre-wrap; font-family: 'Courier New', monospace; margin-top: 1rem; line-height: 1.6; letter-spacing: 0.2px; word-break: break-word; }
        @media (max-width: 768px) {
          .analysis-result { font-size: 0.8rem; padding: 1rem; max-height: 600px; line-height: 1.5; }
        }
        @media (max-width: 480px) {
          .analysis-result { font-size: 0.75rem; padding: 0.8rem; max-height: 70vh; overflow-x: auto; }
        }
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
        .chat-messages { flex: 1; overflow-y: auto; padding: 2rem 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; background: linear-gradient(135deg, rgba(15, 45, 90, 0.3) 0%, rgba(21, 101, 192, 0.1) 100%); }
        .chat-welcome { text-align: center; padding: 3rem 1.5rem 2rem; }
        .chat-welcome-icon { font-size: 3.5rem; margin-bottom: 1.5rem; }
        .chat-welcome h3 { color: #FF8C00; margin-bottom: 0.8rem; font-size: 1.3rem; font-weight: 700; }
        .chat-welcome p { color: #A0AEC0; margin-bottom: 1.2rem; font-size: 0.95rem; line-height: 1.6; }
        .chat-welcome ul { list-style: none; text-align: left; display: inline-block; color: #A0AEC0; font-size: 0.9rem; }
        .chat-welcome li { margin: 0.7rem 0; padding-left: 1.5rem; position: relative; }
        .chat-welcome li:before { content: '✓'; position: absolute; left: 0; color: #FF8C00; font-weight: bold; }
        
        .chat-message { display: flex; margin-bottom: 0.5rem; align-items: flex-end; }
        .chat-message.user { justify-content: flex-end; }
        .chat-message.assistant { justify-content: flex-start; }
        .chat-text { max-width: 75%; padding: 1rem 1.2rem; border-radius: 14px; word-wrap: break-word; line-height: 1.6; font-size: 0.95rem; }
        .chat-message.user .chat-text { background: linear-gradient(135deg, #0D47A1, #FF8C00); color: #FFFFFF; border-radius: 14px 4px 14px 14px; box-shadow: 0 4px 12px rgba(255, 140, 0, 0.25); }
        .chat-message.assistant .chat-text { background: rgba(13, 71, 161, 0.25); color: #E0E8FF; border: 1.5px solid rgba(21, 101, 192, 0.5); border-radius: 4px 14px 14px 14px; box-shadow: 0 2px 8px rgba(21, 101, 192, 0.15); }
        
        .chat-typing { display: flex; gap: 5px; padding: 1rem 1.2rem; background: rgba(13, 71, 161, 0.2); border-radius: 14px; width: fit-content; }
        .chat-typing span { width: 8px; height: 8px; border-radius: 50%; background: #FF8C00; animation: typing 1.4s infinite; }
        .chat-typing span:nth-child(2) { animation-delay: 0.2s; }
        .chat-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing { 0%, 60%, 100% { opacity: 0.3; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-8px); } }
        
        .chat-input-container { display: flex; gap: 0.8rem; padding: 1.2rem; background: linear-gradient(135deg, #1F2A47 0%, #141B33 100%); border-top: 2px solid rgba(255, 140, 0, 0.2); }
        .chat-input { flex: 1; padding: 0.9rem 1rem; background: #0A0E27; border: 1.5px solid #2D3A52; color: #FFFFFF; border-radius: 8px; font-size: 0.95rem; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
        .chat-input:focus { outline: none; border-color: #FF8C00; box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.15); }
        .chat-input:disabled { opacity: 0.5; cursor: not-allowed; }
        .chat-send-btn { padding: 0.9rem 1.4rem; background: linear-gradient(135deg, #0D47A1, #FF8C00); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1.1rem; font-weight: 700; transition: all 0.3s; box-shadow: 0 4px 12px rgba(255, 140, 0, 0.3); }
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
        .danger-section { background: linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%); border: 1px solid #F44336; }
        .btn-danger { width: 100%; padding: 0.9rem; background: linear-gradient(135deg, #F44336, #d32f2f); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
        .btn-danger:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(244, 67, 54, 0.3); }
        
        /* FOOTER BUTTONS */
        .footer-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-top: 1rem; }
        .footer-btn { padding: 0.8rem; background: rgba(255, 140, 0, 0.15); color: #FF8C00; border: 1px solid #FF8C00; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.85rem; transition: all 0.3s; }
        .footer-btn:hover { background: rgba(255, 140, 0, 0.25); }
        
        /* CONTACT & RATING */
        .contact-textarea { width: 100%; padding: 0.8rem; background: #1F2A47; border: 1px solid #2D3A52; color: #FFFFFF; border-radius: 8px; font-size: 0.9rem; font-family: inherit; resize: vertical; transition: all 0.3s; }
        .contact-textarea:focus { outline: none; border-color: #FF8C00; box-shadow: 0 0 0 2px rgba(255, 140, 0, 0.2); }
        .contact-textarea::placeholder { color: #666; }
        
        .rating-section { text-align: center; margin-bottom: 1.5rem; }
        .stars-container { display: flex; justify-content: center; gap: 0.8rem; margin: 1rem 0; }
        .star-btn { background: none; border: none; font-size: 2.5rem; cursor: pointer; opacity: 0.3; transition: all 0.3s; }
        .star-btn:hover { opacity: 0.7; transform: scale(1.1); }
        .star-btn.active { opacity: 1; transform: scale(1.2); }
        
        .rating-input { margin-bottom: 1rem; }
        .rating-input label { display: block; color: #A0AEC0; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; }
        
        .message-box { padding: 1rem; border-radius: 8px; font-weight: 600; margin-bottom: 1rem; text-align: center; }
        .message-box.success { background: rgba(76, 175, 80, 0.2); border: 1px solid #4CAF50; color: #4CAF50; }
        .message-box.error { background: rgba(244, 67, 54, 0.2); border: 1px solid #F44336; color: #F44336; }
        
        /* PURCHASE SUCCESS STYLES */
        .purchase-success { text-align: center; padding: 1rem; }
        .success-icon { font-size: 3rem; margin-bottom: 1rem; }
        .purchase-success h3 { color: #4CAF50; font-size: 1.3rem; margin-bottom: 1.5rem; }
        .credentials-box { background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(13, 71, 161, 0.1) 100%); border: 2px solid #4CAF50; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; text-align: left; }
        .cred-label { color: #A0AEC0; font-size: 0.85rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; }
        .cred-label:first-child { margin-top: 0; }
        .cred-value { background: #0A0E27; border: 1px solid #2D3A52; padding: 0.8rem; border-radius: 8px; color: #FF8C00; font-weight: 700; font-family: 'Courier New', monospace; font-size: 0.9rem; word-break: break-all; }
        .cred-password { color: #4CAF50; }
        .cred-hint { color: #F44336; font-size: 0.85rem; margin-top: 1rem; font-weight: 600; }
        
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
                <div className="user-name">{nombre}</div>
                <div className="user-email">Usuario activo</div>
                <div className="plan-badge">Plan {plan === 'premium' ? 'Premium' : 'Básico'}</div>
              </div>
              <button className="logout-btn" onClick={() => {setIsLoggedIn(false); setNombre(''); setEmail(''); setPassword(''); setPlan('basico');}}>
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

              <div className="menu-card" onClick={() => setSettingsModalOpen(true)} style={{cursor: 'pointer'}}>
                <span className="menu-icon">⚙️</span>
                <div className="menu-title">Configuración</div>
                <p className="menu-desc">Tu perfil y preferencias</p>
              </div>
            </div>

            <button className="premium-button" disabled style={{opacity: 0.5, cursor: 'not-allowed'}}>
              <i className="fas fa-crown"></i> Beneficios Plan Premium - Proximamente
            </button>

            <div className="footer-buttons">
              <button className="footer-btn" onClick={() => setContactModalOpen(true)}>
                📧 Reportar Error
              </button>
              <button className="footer-btn" onClick={() => setRatingModalOpen(true)}>
                ⭐ Calificar App
              </button>
            </div>
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
            <div className="coming-soon-icon">💎</div>
            <h3>Plan Premium - Proximamente</h3>
            <p>Acceso ilimitado a todas las funciones premium</p>
            
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

            <button 
              type="button"
              className="btn-primary" 
              disabled
              style={{
                marginTop: '1.5rem', 
                background: 'linear-gradient(135deg, #0D47A1, #FF8C00)',
                width: '100%',
                opacity: 0.5,
                cursor: 'not-allowed'
              }}
            >
              🔜 Proximamente
            </button>
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
                {typeof analysis === 'object' ? (
                  <AnalysisRenderer data={analysis} />
                ) : (
                  <>{analysis}</>
                )}
              </div>
              
              {(typeof analysis === 'string' && !analysis.includes('❌') && !analysis.includes('⚠️') && !analysis.includes('📐')) && (
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

          {analysis && (typeof analysis === 'object' || (typeof analysis === 'string' && !analysis.includes('❌') && !analysis.includes('⚠️') && !analysis.includes('📐'))) && (
            <button className="btn-primary" onClick={downloadPDF} style={{marginBottom: '0.8rem', background: 'linear-gradient(135deg, #FF6B6B, #FF5252)'}}>
              📄 Descargar PDF
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
                🔨
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
                    setUserId(null);
                    setEmail('');
                    setPassword('');
                    setProjects([]);
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

      {/* MODAL CONTACTO/REPORTAR ERROR */}
      <div className={`modal-overlay ${contactModalOpen ? 'active' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>📧 Reportar Error</h2>
            <button className="close-btn" onClick={() => {setContactModalOpen(false); setContactError(''); setContactMessage('');}}>×</button>
          </div>

          <div className="modal-body">
            <p style={{color: '#A0AEC0', marginBottom: '1rem'}}>Cuéntanos qué problema encontraste para que podamos mejorar</p>
            
            <textarea
              className="contact-textarea"
              placeholder="Describe el error o problema que encontraste..."
              value={contactError}
              onChange={(e) => setContactError(e.target.value)}
              rows="6"
            />

            {contactMessage && (
              <div className={`message-box ${contactMessage.includes('✓') ? 'success' : 'error'}`}>
                {contactMessage}
              </div>
            )}
          </div>

          <button className="btn-primary" onClick={handleSendContact}>
            ✉️ Enviar Reporte
          </button>
        </div>
      </div>

      {/* MODAL CALIFICAR APP */}
      <div className={`modal-overlay ${ratingModalOpen ? 'active' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>⭐ Calificar CarpinteriAPP</h2>
            <button className="close-btn" onClick={() => {setRatingModalOpen(false); setStars(0); setRatingComment(''); setRatingImprovement(''); setRatingMessage('');}}>×</button>
          </div>

          <div className="modal-body">
            <div className="rating-section">
              <p style={{color: '#A0AEC0', marginBottom: '1rem'}}>¿Qué te pareció la app?</p>
              
              <div className="stars-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`star-btn ${stars >= star ? 'active' : ''}`}
                    onClick={() => setStars(star)}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div className="rating-input">
              <label>¿Qué te pareció? (opcional)</label>
              <textarea
                placeholder="Cuéntanos tu opinión..."
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                rows="3"
                className="contact-textarea"
              />
            </div>

            <div className="rating-input">
              <label>¿Qué mejorarías? (opcional)</label>
              <textarea
                placeholder="Sugerencias para mejorar..."
                value={ratingImprovement}
                onChange={(e) => setRatingImprovement(e.target.value)}
                rows="3"
                className="contact-textarea"
              />
            </div>

            {ratingMessage && (
              <div className={`message-box ${ratingMessage.includes('✓') ? 'success' : 'error'}`}>
                {ratingMessage}
              </div>
            )}
          </div>

          <button className="btn-primary" onClick={handleSubmitRating}>
            ✓ Enviar Calificación
          </button>
        </div>
      </div>

      {/* MODAL COMPRA EXITOSA - CREDENCIALES */}
      <div className={`modal-overlay ${purchaseModalOpen ? 'active' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>🎉 ¡Compra Exitosa!</h2>
            <button className="close-btn" onClick={() => {setPurchaseModalOpen(false); setPurchaseCredentials(null);}}>×</button>
          </div>

          <div className="modal-body">
            {purchaseCredentials && (
              <div className="purchase-success">
                <div className="success-icon">✅</div>
                <h3>¡Bienvenido al Plan Premium!</h3>
                
                <div className="credentials-box">
                  <p className="cred-label">📧 Email de acceso:</p>
                  <div className="cred-value">{purchaseCredentials.email}</div>
                  
                  <p className="cred-label">🔐 Contraseña temporal:</p>
                  <div className="cred-value cred-password">{purchaseCredentials.password}</div>
                  
                  <p className="cred-hint">
                    ⚠️ Guarda estas credenciales. Puedes cambiar la contraseña en Configuración después de iniciar sesión.
                  </p>
                </div>

                <button 
                  className="btn-primary"
                  onClick={() => {
                    setPurchaseModalOpen(false);
                    setPurchaseCredentials(null);
                    // Mostrar login con el email pre-llenado
                    setIsLoggedIn(false);
                    setEmail(purchaseCredentials.email);
                  }}
                  style={{marginTop: '1rem'}}
                >
                  🔐 Iniciar Sesión Ahora
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
