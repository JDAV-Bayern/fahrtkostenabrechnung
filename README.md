# Fahrtkostenformular für die Kurse und Veranstaltungen der JDAV Bayern

Das Projekt wurde in Q1/2024 von Simon Langebrake (stellv. Landesjugendleiter) und Joseph Hirsch (stellv. Landesjugendleiter) initiiert und aufgesetzt. Es soll die Abrechnung von Fahrtkosten für die Kurse und Veranstaltungen der JDAV Bayern vereinfachen. Die Sofware ist noch nicht live, da sie noch nicht vollständig getestet ist.

## Anwendung

Mit dem Fahrtkostenformular können Fahrtkosten für die Kurse und Veranstaltungen der JDAV Bayern erfasst werden. Die Daten werden im letzten Schritt mit Belegen erweitert und können dann als einheitliches PDF heruntergeladen werden. Dieses PDF muss gesondert eingereicht werden. Die Daten werden nicht automatisch an die JDAV Bayern übermittelt. Die einheitliche PDF soll der Landesgeschäftsstelle der JDAV Bayern die Abrechnung vereinfachen, da die Daten idealerweise verständlich und einheitlich aufbereitet sind.

## Client-Only Static Web App

Das Fahrtkostenformular ist als reine Frontend-Anwendung konzipiert. Alle Daten werden im Browser gespeichert und nicht zentral in einer Datenbank abgelegt. Das hat den Vorteil, dass kein Backend benötigt wird und die Anwendung sehr einfach und flexibel gehostet werden kann.

## Mitentwickeln

Gib gerne deinen Senf dazu! Wir freuen über jeden Beitrag. Um einen Fehler zu melden oder eine
Verbesserung vorzuschlagen, kannst du entweder einen Issue eröffnen oder die Änderung direkt
selbst programmieren und eine Pull Request stellen.

Das Projekt ist eine in TypeScript geschriebene Single Page Application basierend auf dem Framework
[Angular](https://angular.dev). Wie du damit lokal Entwickeln kannst, ist weiter unten erklärt.
Wenn du eine Pull Request eröffnest, werden automatisch einige automatisierte Tests durchgeführt.
Auch dazu findest du weiter unten genauere Infos.

Das Projekt ist unter der [MIT-Lizenz](https://choosealicense.com/licenses/mit/) veröffentlicht.
Bevor du Code zum Projekt beiträgst, solltest du dich kurz mit dieser vertraut machen.

## Lokale Entwicklung

Zur lokalen Entwicklung wird die [Angular CLI](https://angular.dev/tools/cli) genutzt.
Detaillierte Informationen sind in der Dokumentation zu finden.

### Installation

Du benötigst eine Installation von [Node.js 22](https://nodejs.org/en/download/package-manager).
Über den mitgelieferten Package Manager NPM werden alle weiteren Abhängigkeiten installiert:

```bash
npm install
```

Im Normalfall ist es außerdem ratsam, die Angular CLI als globales Paket zu installieren, um sie
unabhängig vom Projektkontext nutzen zu können:

```bash
npm install -g @angular/cli
```

### Entwicklungsserver

Um einen Server für die lokale Entwicklung zu starten, verwende:

```bash
ng serve
```

Sobald der Server läuft, öffne `http://localhost:4200/` in deinem Browser. Die Seite wird
automatisch neu geladen, wenn Änderungen vorgenommen werden.

### Codegenerierung

Mithilfe der CLI kann das Codegerüst für neue Teile der App generiert werden, beispielsweise für
neue Komponenten:

```bash
ng generate component <compoent-name>
```

## Codequalität

Um eine möglichst hohe Qualität des Projekts sicherzustellen, solltest du deinen Code regelmäßig
mit den hier aufgelisteten Tools testen. Diese Tests werden auch automatisiert durchgeführt, wenn
du deine Pull Request eröffnest.

### Linting

Das Projekt nutzt [ESlint](https://eslint.org/), um Fehlern im Code vorzubeugen. Der Linter
analysiert den Quellcode, um mögliche Bugs aufzudecken. Liste alle fehler mit dem folgenden Befehl
auf:

```bash
ng lint
```

### Formatierung

Für eine einheitliche Formatierung des Codes wird [Prettier](https://prettier.io/) genutzt. Du
kannst alle Dateien des Projekt mit dem folgenden Befehl formatieren:

```bash
npm run format
```

### Unit Tests ausführen

Unit Tests stellen sicher, dass einzelne Komponenten des Projekts die beabsichtigte Funktionsweise
erfüllen. Du kannst sie mit folgendem Befehl ausführen:

```bash
ng test
```

Akutell sind kaum Unit Tests im Projekt enthalten, wir freuen uns aber, wenn diese für neu
entwickelten Code erstellt werden.

### App bauen

Um eine optimierte Version der App zu erstellen, führe diesen Befehl aus:

```bash
ng build
```

## Deployment

Wenn auf den `main`-Branch gepusht wird, z.B. weil deine Pull Request gemerged wird, wird die App
automatisch gebaut und zunächst in unserem Staging-Environment auf
[Github Pages](https://pages.github.com/) deployed.

Wenn das nächste Release-Tag erstellt wird, wird ein [Docker](https://www.docker.com/)-Image der
App gebaut und auf der Github Container Registry veröffentlicht. Dieses Image deployen wir auch in
unserem Production-Environment.

Um ein neues Release zu erstellen einfach folgenden Befehl ausführen:

```bash
npm version <patch|minor|major>
```

Dadurch wird automatisch die Versionsnummer entprechend des Arguments (patch, minor oder major) in
der `package.json` erhöht und ein Commit sowie ein Tag erstellt. Nach dem pushen des Tags wird
automatisch eine neue Version des Containers gebaut und veröffentlicht.

```bash
git push --follow-tags
```
