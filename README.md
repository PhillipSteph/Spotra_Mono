# Spotra — SportTracker System

Spotra ist eine Full-Stack-Anwendung zur Verwaltung von Sportgeräten, Protokollierung von Trainingseinheiten und Sätzen sowie zur Visualisierung des Trainingserfolgs. 

Dieses Monorepo enthält sowohl das React-Frontend als auch das Spring Boot-Backend.

---

## Projektstruktur

Das Projekt ist in zwei Hauptverzeichnisse aufgeteilt, die strikt voneinander getrennt sind (Client-Server-Architektur):

*   **[`Spotra_FE/`](./Spotra_FE)**: Das Frontend (React.js). Zuständig für die Benutzeroberfläche und die Kommunikation mit der REST-API.
*   **`Spotra_BE/`**: Das Backend (Spring Boot). Zuständig für die Geschäftslogik, Datenhaltung und Bereitstellung der REST-API.

## Tech-Stack

**Frontend (`Spotra_FE`)**
*   React (UI Framework)
*   Fetch API (Datenübertragung)
*   CSS3 (Custom Styling & Flexbox)
*   Services Pattern (Trennung von UI und API-Logik)

**Backend (`Spotra_BE`)**
*   Java 17
*   Spring Boot (REST-API & Application Container)
*   Spring Data JPA & Hibernate (ORM)
*   H2 In-Memory-Datenbank (Speicherung der Trainingsdaten)
*   Gradle (Build-Tool)

---

## Lokales Setup & Starten der Anwendung

### Setup via Docker Compose

Sofern Docker auf dem System installiert ist, kann das Projekt mit folgendem Befehl erstellt und gestartet werden:

```bash
docker compose up --build
```
*(Die Ports und Umgebungsvariablen werden dabei automatisch aus der beiliegenden `docker-compose.yml` bezogen.)*

---

### Manuelles Setup

Um das vollständige System stattdessen manuell lokal auszuführen, müssen Backend und Frontend parallel in zwei separaten Terminals gestartet werden.

#### 1. Voraussetzungen
*   **Java 17** (OpenJDK / Temurin)
*   **Node.js** (inklusive `npm`)

#### 2. Backend starten
Das Backend läuft standardmäßig auf **Port 8080** und nutzt eine In-Memory-Datenbank (Daten werden beim Neustart zurückgesetzt).

Öffne ein Terminal und führe folgende Befehle aus:
```bash
cd Spotra_BE
./gradlew clean bootRun
```
*Die API ist nun unter `http://localhost:8080/api` erreichbar. Die Datenbank-Konsole findest du unter `http://localhost:8080/h2-console/`.*

### 3. Frontend starten
Das Frontend erwartet das Backend unter der oben genannten URL und läuft selbst standardmäßig auf **Port 3000**.

Öffne ein *zweites*, neues Terminal und führe folgende Befehle aus:
```bash
cd Spotra_FE
npm install
npm start
```
*Die Anwendung öffnet sich automatisch in deinem Browser unter `http://localhost:3000`.*

---
Für detaillierte Informationen, Endpunkte oder erweiterte Konfigurationen der jeweiligen Systeme (z.B. dauerhafte Datenbank-Verbindung via PostgreSQL) schau bitte in die jeweiligen README-Dateien der Sub-Projekte:
*   Backend README
*   Frontend README

---

## Features

*   **Geräteverwaltung:** Neue Sportgeräte anlegen, bearbeiten oder löschen.
*   **Training & Einheiten:** Ein Gerät auswählen, eine neue Trainingseinheit starten und durchgeführte Sätze protokollieren.
*   **Statistiken (Stats):** Detaillierte Visualisierung deines Gesamtvolumens und spezifische Auswertungen pro Sportgerät.
