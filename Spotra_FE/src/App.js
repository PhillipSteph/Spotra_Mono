import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { sportgeraeteService } from './services/sportgeraeteService';
import { trainingseinheitenService } from './services/trainingseinheitenService';
import { saetzeService } from './services/saetzeService';

const Icons = {
  Home: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
  ),
  Training: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
  ),
  Stats: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
  ),
  Calendar: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
  ),
  Pause: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
  ),
  Play: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
  )
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [geraete, setGeraete] = useState([]);
  const [einheiten, setEinheiten] = useState([]);
  const [newGeraetName, setNewGeraetName] = useState('');
  const [newGeraetDesc, setNewGeraetDesc] = useState('');
  const [newGeraetId, setNewGeraetId] = useState('');
  const [newGeraetImage, setNewGeraetImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState(null);

  // UI States
  const [showModal, setShowModal] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [activeEinheitId, setActiveEinheitId] = useState(null);
  const [activeGeraetName, setActiveGeraetName] = useState('');
  const [isPaused, setIsPaused] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (showModal && !isPaused) {
      timerRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [showModal, isPaused]);

  const refreshData = async () => {
    try {
      const g = await sportgeraeteService.getAll();
      const e = await trainingseinheitenService.getAll();
      setGeraete(g || []);
      setEinheiten(e || []);
    } catch (err) {
      setError("Verbindung zum Backend fehlgeschlagen");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewGeraetImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartEinheit = async (geraetId, name) => {
    try {
      const newE = await trainingseinheitenService.create(geraetId);
      setActiveEinheitId(newE.id);
      setActiveGeraetName(name);
      setSeconds(0);
      setIsPaused(true);
      setShowModal(true);
      refreshData();
    } catch (err) {
      setError("Fehler beim Starten");
    }
  };

  const handleSaveSatz = async () => {
    if (!weight || !reps) return;
    try {
      await saetzeService.create(activeEinheitId, {
        gewicht: parseFloat(weight.replace(',', '.')),
        wiederholungen: parseInt(reps)
      });
      setWeight(''); setReps('');
      refreshData();
    } catch (err) {
      setError("Fehler beim Speichern");
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m.toString().padStart(2, '0')}:${rs.toString().padStart(2, '0')}`;
  };

  const calculateDeviceStats = (id) => {
    const devE = einheiten.filter(e => (e.sportgeraet?.id === id || e.geraet?.id === id));
    const totalT = devE.length;
    let totalS = 0;
    devE.forEach(e => totalS += (e.saetze?.length || 0));
    return { totalT, totalS, avgS: totalT > 0 ? (totalS / totalT).toFixed(1) : 0 };
  };

  const getActiveSummary = () => {
    if (einheiten.length === 0) return null;
    const last = [...einheiten].sort((a,b) => new Date(b.datum) - new Date(a.datum))[0];
    let vol = 0;
    last.saetze?.forEach(s => vol += (s.gewicht * s.wiederholungen));
    return { id: last.id, name: last.sportgeraet?.name || last.geraet?.name, vol, saetze: last.saetze?.length || 0 };
  };

  const renderHome = () => {
    const active = getActiveSummary();
    const dateFormatted = new Date(selectedDate).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
      <>
        <header className="header-layout">
          <div className="header-left">
            <h1>Dashboard</h1>
            <p className="header-date-text">Willkommen zurück</p>
          </div>
          <div className="header-right">
            <div className="header-date-box" onClick={() => setShowDatePicker(true)}>
              <div className="date-box-top">
                <Icons.Calendar />
                <span className="date-box-label">DATE</span>
              </div>
              <div className="date-box-value">{dateFormatted}</div>
            </div>
          </div>
        </header>

        <section>
          {active && (
            <div className="active-training-card" onClick={() => { setActiveEinheitId(active.id); setActiveGeraetName(active.name); setShowModal(true); }}>
              <div className="active-info"><h3>Aktives Training</h3></div>
              <div className="active-stats">
                {active.vol}<span>Kilo</span>
                {active.saetze}<span>Sätze</span>
              </div>
            </div>
          )}
        </section>

        <section>
          <h2>Deine Geräte</h2>
          {geraete.map(g => {
            const s = calculateDeviceStats(g.id);
            return (
              <div key={g.id} className="device-card">
                <div className="device-card-header">
                  {g.image ? (
                    <div className="device-image-thumb" onClick={() => setFullscreenImage(g.image)}>
                      <img src={g.image} alt={g.name} />
                    </div>
                  ) : (
                    <div className="device-id-badge">{g.geraetId || g.id}</div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '2px' }}>{g.name}</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>ID: {g.geraetId || g.id}</p>
                  </div>
                </div>
                <div className="device-stats-grid">
                  <div><span className="stat-val">{s.totalT}</span><span className="stat-lbl">Trainings</span></div>
                  <div><span className="stat-val">{s.totalS}</span><span className="stat-lbl">Sätze</span></div>
                  <div><span className="stat-val">{s.avgS}</span><span className="stat-lbl">ø/Training</span></div>
                </div>
                <div className="device-card-actions">
                  <button className="btn-start" onClick={() => handleStartEinheit(g.id, g.name)}>Training starten</button>
                  <button className="btn-desc" onClick={() => alert(g.beschreibung || 'Keine Beschreibung')}>Beschreibung</button>
                </div>
              </div>
            );
          })}
        </section>
      </>
    );
  };

  return (
    <div className="App">
      {error && <div className="error-toast" onClick={() => setError(null)}>{error}</div>}

      {activeTab === 'home' && renderHome()}
      {activeTab === 'geraete' && (
        <section>
          <h1>Neues Gerät</h1>
          <div className="card" style={{ padding: '25px' }}>
            <form onSubmit={async (e) => {
              e.preventDefault();
              await sportgeraeteService.create({
                name: newGeraetName,
                beschreibung: newGeraetDesc,
                geraetId: newGeraetId,
                image: newGeraetImage
              });
              setNewGeraetName(''); setNewGeraetDesc(''); setNewGeraetId(''); setNewGeraetImage(null); refreshData(); setActiveTab('home');
            }}>
              <label className="input-label">Name des Geräts</label>
              <input type="text" value={newGeraetName} onChange={(e) => setNewGeraetName(e.target.value)} placeholder="z.B. Hantelbank" required />

              <label className="input-label">Beschreibung</label>
              <textarea value={newGeraetDesc} onChange={(e) => setNewGeraetDesc(e.target.value)} placeholder="Details zum Gerät..." rows="4" />

              <label className="input-label">Sportgerät-ID</label>
              <input type="text" value={newGeraetId} onChange={(e) => setNewGeraetId(e.target.value)} placeholder="z.B. 1" required />

              <label className="input-label">Foto hinzufügen (Optional)</label>
              <div className="file-input-wrapper">
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {newGeraetImage && (
                  <div className="image-preview">
                    <img src={newGeraetImage} alt="Preview" />
                  </div>
                )}
              </div>

              <button type="submit" className="btn-save-main">Speichern</button>
            </form>
          </div>
        </section>
      )}

      {activeTab === 'stats' && (
        <section>
          <h1>Statistiken</h1>
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Hier folgen bald detaillierte Auswertungen.</p>
          </div>
        </section>
      )}

      {/* DATE PICKER POPUP */}
      {showDatePicker && (
        <div className="modal-overlay" onClick={() => setShowDatePicker(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <div className="modal-header">
              <h2>Datum wählen</h2>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setShowDatePicker(false); }}
              style={{ marginBottom: '20px' }}
            />
            <button className="btn-save-main" onClick={() => setShowDatePicker(false)}>Schließen</button>
          </div>
        </div>
      )}

      {fullscreenImage && (
        <div className="image-fullscreen-overlay" onClick={() => setFullscreenImage(null)}>
          <img src={fullscreenImage} alt="Fullscreen" />
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ margin: 0 }}>{activeGeraetName}</h2>
              <div className="timer-container">
                <span className="timer-badge">{formatTime(seconds)}</span>
                <button className="btn-pause" onClick={() => setIsPaused(!isPaused)}>
                  {isPaused ? <Icons.Play /> : <Icons.Pause />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label className="input-label" style={{ marginLeft: 0 }}>Gewicht (kg)</label>
                <input type="number" step="0.5" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="0" />
              </div>
              <div style={{ flex: 1 }}>
                <label className="input-label" style={{ marginLeft: 0 }}>Wdh.</label>
                <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="0" />
              </div>
            </div>

            <button className="modal-save-btn" onClick={handleSaveSatz}>Satz speichern</button>

            <div style={{ marginTop: '20px', maxHeight: '150px', overflowY: 'auto' }}>
              {einheiten.find(e => e.id === activeEinheitId)?.saetze?.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #2c2c2e' }}>
                  <span style={{ color: '#8e8e93' }}>Satz {i + 1}</span>
                  <b>{s.gewicht}kg x {s.wiederholungen}</b>
                </div>
              ))}
            </div>

            <button className="modal-close-link" onClick={() => setShowModal(false)}>Training beenden</button>
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}><Icons.Home /><span className="nav-label">Dashboard</span></div>
        <div className={`nav-item ${activeTab === 'geraete' ? 'active' : ''}`} onClick={() => setActiveTab('geraete')}><Icons.Training /><span className="nav-label">Gerät +</span></div>
        <div className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}><Icons.Stats /><span className="nav-label">Stats</span></div>
      </nav>
    </div>
  );
}

export default App;
