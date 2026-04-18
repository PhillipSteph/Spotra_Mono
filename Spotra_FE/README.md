# SportTracker Frontend

Dies ist das React-Frontend für die SportTracker-Anwendung. Es ermöglicht das Verwalten von Sportgeräten, das Tracken von Trainingseinheiten und Sätzen sowie die Visualisierung deines Trainingserfolgs.

##  Starten der Anwendung

Um das Frontend lokal zu starten, befolge diese Schritte:

### 1. Voraussetzungen
Stelle sicher, dass **Node.js** (inklusive npm) auf deinem Rechner installiert ist.

### 2. Installation der Abhängigkeiten
Öffne ein Terminal im Projektverzeichnis (`spotra_fe`) und führe folgenden Befehl aus:

```bash
npm install
```

### 3. Backend-Verbindung prüfen
Das Frontend erwartet das Backend standardmäßig unter:
`http://localhost:8080/api`

Sollte dein Backend auf einem anderen Port laufen, kannst du die URL in der Datei `src/services/apiClient.js` anpassen.

### 4. Anwendung starten
Führe den folgenden Befehl aus, um den Entwicklungsserver zu starten:

```bash
npm start
```

Die App öffnet sich automatisch unter [http://localhost:3000](http://localhost:3000).

---

##  Features

*   **Home**: Übersicht über deine letzten Trainingseinheiten.
*   **Training**: Auswahl eines Sportgeräts und Starten einer neuen Einheit.
*   **Stats**: Visualisierung deines Gesamtvolumens und Statistiken pro Gerät.

##  Tech-Stack

*   **React** (Frontend Framework)
*   **Fetch API** (Datenübertragung)
*   **CSS3** (Custom Styling & Flexbox)
*   **Services Pattern** (Saubere Trennung von UI und API-Logik)

---

