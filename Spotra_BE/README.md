# Spotra — Spring Boot Backend

Kurz: Ein kleines Spring Boot Backend mit JPA/Hibernate und H2 (In-Memory) für Trainingsdaten (Sportgerät, Trainingseinheit, Satz).

## Voraussetzungen
- Java 17 (OpenJDK / Temurin)
- Gradle (Wrapper ist im Projekt enthalten)
- Optional: Docker (nur wenn docker-compose verwendet werden soll)

## Lokales Entwickeln
1. Java 17 sicherstellen:
   ```bash
   brew install --cask temurin17
   echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
   source ~/.zshrc
   java -version
   ```

2. Build & Run (Foreground):
   ```bash
   ./gradlew clean bootRun
   ```

3. Build als Jar & Background-Run:
   ```bash
   ./gradlew bootJar
   nohup java -jar build/libs/*.jar > app.log 2>&1 &
   tail -f app.log
   ```

> Wichtig: Nicht mit `sudo` bauen oder starten — kann Dateiberechtigungen im Projekt brechen.

## H2-Datenbank (In-Memory)
- H2 Console: http://localhost:8080/h2-console/
- JDBC URL: `jdbc:h2:mem:spotra`
- User: `sa` (kein Passwort)

Hinweis: In-Memory H2 ist nur in derselben JVM verfügbar. Bei Neustart sind Daten verloren.

### Dauerhafte / externe Verbindung
Für externe Tools (DBeaver) oder Persistenz ändere `src/main/resources/application.properties` z.B. auf file-mode:
```
spring.datasource.url=jdbc:h2:file:./data/spotra;DB_CLOSE_ON_EXIT=FALSE;AUTO_SERVER=TRUE
```
Oder benutze H2 TCP-Server / PostgreSQL (docker-compose).

## API Endpoints
- GET  /api/geraete                → Liste Geräte
- POST /api/geraete                → Gerät anlegen
- DELETE /api/geraete/{id}         → Gerät löschen

- GET  /api/einheiten              → Alle Trainingseinheiten
- POST /api/einheiten              → Einheit anlegen (body enthält `geraet.id`)
- GET  /api/geraete/{id}/einheiten → Einheiten zu Gerät

- POST /api/saetze                 → Satz anlegen (body enthält `einheit.id`)
- PUT  /api/saetze/{id}            → Satz aktualisieren
- DELETE /api/saetze/{id}          → Satz löschen

Beispiel:
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"Kettlebell","beschreibung":"20kg"}' \
  http://localhost:8080/api/geraete
```

## Troubleshooting
- Fehler "Docker is not running" beim `bootRun`: entweder Docker Desktop starten oder die dev-Abhängigkeit `spring-boot-docker-compose` aus `build.gradle` entfernen.
- Fehler wegen falschem JDK: stelle sicher, dass `java -version` Java 17 zeigt. Alternativ: `./gradlew build -Dorg.gradle.java.home=/path/to/jdk17`.
- Berechtigungsprobleme nach Verwendung von `sudo`: `sudo chown -R $(whoami) .gradle build` im Projekt-Root.

## Weiteres
Möchtest du PostgreSQL via docker-compose, DTOs/Service-Layer, Validierung oder Tests? Öffne ein Issue oder sag kurz, was als Nächstes kommen soll.
