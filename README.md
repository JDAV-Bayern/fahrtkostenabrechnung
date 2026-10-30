# Portal der JDAV Bayern

Das Projekt wurde in Q1/2024 von Simon Langebrake (stellv. Landesjugendleiter) und Joseph Hirsch (stellv. Landesjugendleiter) initiiert und aufgesetzt. Ursprünglich als reines Fahrtkostenformular gestartet, ist daraus das Portal der JDAV Bayern gewachsen, das mehrere digitale Formulare rund um die Kurse und Veranstaltungen bündelt. Die Anwendung ist unter [portal.jdav-bayern.de](https://portal.jdav-bayern.de) live.

## Funktionen

- **Fahrtkostenabrechnung für Kurse** (`/fahrtkosten`): Erfasst Reisedaten, Teilnehmende, Fahrt- und weitere Kosten (inkl. Verpflegung und Material) und ergänzt sie mit Belegen. Das Ergebnis kann als einheitliches PDF heruntergeladen werden.
- **Fahrtkostenabrechnung für Gremien** (`/fahrtkosten-gremium`): Das gleiche für Sitzungen und Treffen von Gremien.
- **Meine Kurse** (`/meine-kurse`): Nach der Anmeldung mit dem JDAV-Bayern-Konto (OpenID Connect) werden die besuchten Kurse angezeigt und die Formulare können damit vorausgefüllt werden.
- **Kursfeedback** (`/feedback`): Feedbackbögen zu Kursen auf Basis von [SurveyJS](https://surveyjs.io/), inkl. Ergebnisansicht (`/feedback/ergebnisse`).
- **Markenbestellung** (`/marken`): Formular zur Bestellung von Marken.
- **Mobilitätsstatistik** (`/mobilität`): Auswertung der Anreisen zu Kursen.
- **Infoseiten**: Erstattungssätze (`/erstattungssaetze`) und Datenschutzerklärung (`/datenschutz`).
- **Adminbereich** (`/admin`): Verwaltung der Feedback-Bögen (inkl. QR-Codes als PDF) und der Erstattungssätze.

## Fahrtkostenabrechnung

Mit dem Fahrtkostenformular können Fahrtkosten für die Kurse und Veranstaltungen der JDAV Bayern erfasst werden. Die Daten werden im letzten Schritt mit Belegen erweitert und können dann als einheitliches PDF heruntergeladen werden. Dieses PDF muss gesondert eingereicht werden. Die Daten werden nicht automatisch an die JDAV Bayern übermittelt. Die einheitliche PDF soll der Landesgeschäftsstelle der JDAV Bayern die Abrechnung vereinfachen, da die Daten idealerweise verständlich und einheitlich aufbereitet sind.

## Architektur

Das Portal ist eine reine Frontend-Anwendung (Single Page Application), die statisch ausgeliefert wird. Die Daten der Fahrtkostenformulare werden im Browser gespeichert und nicht zentral in einer Datenbank abgelegt; PDFs werden clientseitig erzeugt.

Für die Funktionen, die ein Konto benötigen (Meine Kurse, Feedback, Adminbereich), kommuniziert die App zusätzlich mit einem Backend (`backendUrl`, lokal über den Proxy unter `/api`) und authentifiziert sich per OAuth 2.0 / OpenID Connect (Authorization Code Flow mit PKCE) gegen den Identity Provider der JDAV Bayern. Das Backend ist derzeit nicht öffentlich, daher lassen sich diese Funktionen extern nicht lokal nachbauen oder testen. Die Konfiguration je Umgebung liegt in [src/environments/](src/environments/).

Verwendete Technologien: [Angular](https://angular.dev) mit Angular Material und [Tailwind CSS](https://tailwindcss.com/), [angular-auth-oidc-client](https://github.com/damienbod/angular-auth-oidc-client), [jsPDF](https://github.com/parallax/jsPDF) / [pdf-lib](https://pdf-lib.js.org/), [SurveyJS](https://surveyjs.io/) sowie `xlsx-js-style` und `jszip` für Exporte.

## Mitentwickeln

Gib gerne deinen Senf dazu! Wir freuen uns über jeden Beitrag. Um einen Fehler zu melden oder eine Verbesserung vorzuschlagen, kannst du entweder einen Issue eröffnen oder die Änderung direkt selbst programmieren und eine Pull Request stellen.

Das Projekt ist eine in TypeScript geschriebene Single Page Application basierend auf dem Framework [Angular](https://angular.dev). Wie du damit lokal Entwickeln kannst, ist weiter unten erklärt. Wenn du eine Pull Request eröffnest, werden automatisch einige automatisierte Tests durchgeführt. Auch dazu findest du weiter unten genauere Infos.

Das Projekt ist unter der [MIT-Lizenz](https://choosealicense.com/licenses/mit/) veröffentlicht. Bevor du Code zum Projekt beiträgst, solltest du dich kurz mit dieser vertraut machen.

## Lokale Entwicklung

Zur lokalen Entwicklung wird die [Angular CLI](https://angular.dev/tools/cli) genutzt. Detaillierte Informationen sind in der Dokumentation zu finden.

### Installation

Du benötigst eine Installation von [Node.js 24](https://nodejs.org/en/download/package-manager) sowie [pnpm](https://pnpm.io/installation) (die genaue Version ist in der `package.json` festgelegt und lässt sich über `corepack enable` bereitstellen). Damit werden alle weiteren Abhängigkeiten installiert:

```bash
pnpm install
```

Im Normalfall ist es außerdem ratsam, die Angular CLI als globales Paket zu installieren, um sie unabhängig vom Projektkontext nutzen zu können:

```bash
pnpm install -g @angular/cli
```

### Entwicklungsserver

Um einen Server für die lokale Entwicklung zu starten, verwende:

```bash
ng serve
```

Sobald der Server läuft, öffne `http://localhost:4200/` in deinem Browser. Die Seite wird automatisch neu geladen, wenn Änderungen vorgenommen werden.

Anfragen an `/api` werden laut [proxy.conf.json](proxy.conf.json) an ein lokal laufendes Backend (`http://localhost:8000`) weitergeleitet, Anfragen an `/auth-proxy` an den Identity Provider der JDAV Bayern. Da das Backend aktuell nicht öffentlich ist, stehen dir als externer Entwickler nur die Funktionen ohne Backend zur Verfügung, vor allem die Fahrtkostenformulare.

### Codegenerierung

Mithilfe der CLI kann das Codegerüst für neue Teile der App generiert werden, beispielsweise für neue Komponenten:

```bash
ng generate component <component-name>
```

## Codequalität

Um eine möglichst hohe Qualität des Projekts sicherzustellen, solltest du deinen Code regelmäßig mit den hier aufgelisteten Tools testen. Diese Tests (Linting, Formatprüfung, Unit Tests, Build und E2E-Tests) werden auch automatisiert per GitHub Actions durchgeführt, wenn du deine Pull Request eröffnest.

### Linting

Das Projekt nutzt [ESLint](https://eslint.org/), um Fehlern im Code vorzubeugen. Der Linter analysiert den Quellcode, um mögliche Bugs aufzudecken. Liste alle Fehler mit dem folgenden Befehl auf:

```bash
pnpm lint
```

### Formatierung

Für eine einheitliche Formatierung des Codes wird [Prettier](https://prettier.io/) genutzt. Du kannst alle Dateien des Projekts mit dem folgenden Befehl formatieren:

```bash
pnpm format
```

Ob alles korrekt formatiert ist, prüfst du mit `pnpm format:check`.

### Unit Tests ausführen

Unit Tests stellen sicher, dass einzelne Komponenten des Projekts die beabsichtigte Funktionsweise erfüllen. Du kannst sie mit folgendem Befehl ausführen:

```bash
pnpm test
```

Die Unit Tests laufen mit dem Angular-Test-Runner (Vitest). Aktuell sind nur wenige Unit Tests im Projekt enthalten, wir freuen uns aber, wenn diese für neu entwickelten Code erstellt werden.

### End-to-End-Tests

Die Ende-zu-Ende-Tests liegen in [tests/e2e/](tests/e2e/) und nutzen [Playwright](https://playwright.dev/). Bei der ersten Nutzung müssen die Browser installiert werden:

```bash
pnpm exec playwright install
pnpm test:e2e
```

Mit `pnpm test:e2e:ui` kannst du die Tests in der Playwright-Oberfläche ausführen. Weitere Infos stehen in [tests/e2e/README.md](tests/e2e/README.md).

### App bauen

Um eine optimierte Version der App zu erstellen, führe diesen Befehl aus:

```bash
pnpm build
```

Für das Staging-Environment gibt es zusätzlich `pnpm build:staging`.

## Deployment

Die App wird als [Docker](https://www.docker.com/)-Image (nginx, siehe [Dockerfile](Dockerfile) und [nginx.conf](nginx.conf)) ausgeliefert und auf der GitHub Container Registry veröffentlicht.

Wenn auf den `main`-Branch gepusht wird, z.B. weil deine Pull Request gemerged wird, wird ein Image mit dem Tag `dev` und der Staging-Konfiguration gebaut. Wenn ein Release-Tag (`v*.*.*`) gepusht wird, wird ein Image mit dem Tag `latest` und der Production-Konfiguration gebaut. Die Images werden mit cosign signiert. Anschließend wird das Deployment auf unserem Server bei [Hetzner](https://www.hetzner.com/) angestoßen, auf dem die App per Docker betrieben wird.

Um ein neues Release zu erstellen, einfach folgenden Befehl ausführen:

```bash
pnpm version <patch|minor|major>
```

Dadurch wird automatisch die Versionsnummer entsprechend des Arguments (patch, minor oder major) in der `package.json` erhöht und ein Commit sowie ein Tag erstellt. Nach dem Pushen des Tags wird automatisch eine neue Version des Containers gebaut und veröffentlicht.

```bash
git push --follow-tags
```
