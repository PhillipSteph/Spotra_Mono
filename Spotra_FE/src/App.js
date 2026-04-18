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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
  ),
  Pause: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
  ),
  Play: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
  ),
  ChevronLeft: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
  ),
  ChevronRight: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
  ),
  Trash: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
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

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
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

  const handleDeleteGeraet = async (id) => {
    if (window.confirm("Dieses Gerät wirklich löschen?")) {
      try {
        await sportgeraeteService.delete(id);
        refreshData();
      } catch (err) {
        setError("Fehler beim Löschen");
      }
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
    const sorted = [...einheiten].sort((a,b) => new Date(b.datum) - new Date(a.datum));
    const last = sorted[0];
    let vol = 0;
    last.saetze?.forEach(s => vol += (s.gewicht * s.wiederholungen));
    return { id: last.id, name: last.sportgeraet?.name || last.geraet?.name, vol, saetze: last.saetze?.length || 0 };
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const monthName = viewDate.toLocaleString('default', { month: 'long' });
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) days.push({ day: prevMonthLastDay - i, current: false });
    for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, current: true });
    while (days.length < 42) days.push({ day: days.length - (daysInMonth + firstDay) + 1, current: false });

    return (
      <div className="calendar-card" onClick={e => e.stopPropagation()}>
        <div className="calendar-top-nav">
          <button className="calendar-nav-btn" onClick={() => setViewDate(new Date(year, month - 1, 1))}><Icons.ChevronLeft /></button>
          <div className="calendar-month-year"><h3>{monthName}</h3><span>{year}</span></div>
          <button className="calendar-nav-btn" onClick={() => setViewDate(new Date(year, month + 1, 1))}><Icons.ChevronRight /></button>
        </div>
        <div className="calendar-weekdays">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d} className="calendar-weekday">{d}</div>)}
        </div>
        <div className="calendar-grid">
          {days.map((d, i) => {
            const isSelected = d.current && selectedDate.getDate() === d.day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
            return (
              <div key={i} className={`calendar-day ${!d.current ? 'other-month' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => { if (d.current) { setSelectedDate(new Date(year, month, d.day)); setShowDatePicker(false); } }}>
                {d.day}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStats = () => {
    const totalVolume = einheiten.reduce((acc, e) => {
      const vol = e.saetze?.reduce((sum, s) => sum + (s.gewicht * s.wiederholungen), 0) || 0;
      return acc + vol;
    }, 0);
    const totalSaetze = einheiten.reduce((acc, e) => acc + (e.saetze?.length || 0), 0);

    return (
      <section>
        <h1>Statistiken</h1>
        <div className="stats-hero">
           <div className="stats-hero-item"><span className="hero-val">{totalVolume.toLocaleString()}</span><span className="hero-lbl">Gesamt Kilo</span></div>
           <div className="stats-hero-item"><span className="hero-val">{totalSaetze}</span><span className="hero-lbl">Sätze Gesamt</span></div>
        </div>
        <h2 style={{ marginTop: '30px' }}>Verlauf (letzte Einheiten)</h2>
        <div className="stats-list">
          {[...einheiten].sort((a,b) => new Date(b.datum) - new Date(a.datum)).slice(0, 5).map(e => {
            const vol = e.saetze?.reduce((sum, s) => sum + (s.gewicht * s.wiederholungen), 0) || 0;
            return (
              <div key={e.id} className="stats-list-item">
                <div className="stats-item-info"><b>{e.sportgeraet?.name || e.geraet?.name}</b><span>{new Date(e.datum).toLocaleDateString()}</span></div>
                <div className="stats-item-val">{vol} kg</div>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const renderHome = () => {
    const active = getActiveSummary();
    const dateStr = selectedDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return (
      <>
        <header className="header-layout">
          <div className="header-left"><h1>Dashboard</h1><p className="header-date-text">Willkommen zurück</p></div>
          <div className="header-right"><div className="header-date-display" onClick={() => { setViewDate(new Date(selectedDate)); setShowDatePicker(true); }}><span>{dateStr}</span><Icons.Calendar /></div></div>
        </header>
        <section>
          {active && (
            <div className="active-training-card" onClick={() => { setActiveEinheitId(active.id); setActiveGeraetName(active.name); setShowModal(true); }}>
              <div className="active-info"><h3>Aktives Training</h3></div>
              <div className="active-stats">{active.vol}<span>Kilo</span>{active.saetze}<span>Sätze</span></div>
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
                  {g.image ? <div className="device-image-thumb" onClick={() => setFullscreenImage(g.image)}><img src={g.image} alt={g.name} /></div> : <div className="device-id-badge">{g.geraetId || g.id}</div>}
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}><h3 style={{ marginBottom: '2px' }}>{g.name}</h3><p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>ID: {g.geraetId || g.id}</p></div>
                  <button className="btn-icon-delete" onClick={() => handleDeleteGeraet(g.id)}><Icons.Trash /></button>
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
              await sportgeraeteService.create({ name: newGeraetName, beschreibung: newGeraetDesc, geraetId: newGeraetId, image: newGeraetImage });
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
                {newGeraetImage && <div className="image-preview"><img src={newGeraetImage} alt="Preview" /></div>}
              </div>
              <button type="submit" className="btn-save-main">Speichern</button>
            </form>
          </div>
        </section>
      )}
      {activeTab === 'stats' && renderStats()}
      {showDatePicker && <div className="modal-overlay" onClick={() => setShowDatePicker(false)}><div style={{ width: '90%', maxWidth: '380px' }}>{renderCalendar()}</div></div>}
      {fullscreenImage && <div className="image-fullscreen-overlay" onClick={() => setFullscreenImage(null)}><img src={fullscreenImage} alt="Fullscreen" /></div>}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ margin: 0 }}>{activeGeraetName}</h2>
              <div className="timer-container"><span className="timer-badge">{formatTime(seconds)}</span><button className="btn-pause" onClick={() => setIsPaused(!isPaused)}>{isPaused ? <Icons.Play /> : <Icons.Pause />}</button></div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}><label className="input-label" style={{ marginLeft: 0 }}>Gewicht (kg)</label><input type="number" step="0.5" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="0" /></div>
              <div style={{ flex: 1 }}><label className="input-label" style={{ marginLeft: 0 }}>Wdh.</label><input type="number" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="0" /></div>
            </div>
            <button className="modal-save-btn" onClick={handleSaveSatz}>Satz speichern</button>
            <div style={{ marginTop: '20px', maxHeight: '150px', overflowY: 'auto' }}>
              {einheiten.find(e => e.id === activeEinheitId)?.saetze?.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #2c2c2e' }}>
                  <span style={{ color: '#8e8e93' }}>Satz {i + 1}</span><b>{s.gewicht}kg x {s.wiederholungen}</b>
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
