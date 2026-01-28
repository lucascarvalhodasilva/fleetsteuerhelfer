# Fleet-Steuer 🚗💼

**Steuerabzugs-Tracker für Fahrzeugkuriere**

Eine umfassende plattformübergreifende mobile Anwendung, entwickelt mit Next.js und Capacitor, zur Verfolgung von steuerlich absetzbaren Ausgaben, Kilometern und Abschreibungen von Arbeitsmitteln - speziell konzipiert für deutsche Kurier-Fahrer.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20iOS%20%7C%20Android-green.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

---

## 📋 Inhaltsverzeichnis

- [Übersicht](#-übersicht)
- [Funktionen](#-funktionen)
- [Tech Stack](#-tech-stack)
- [Erste Schritte](#-erste-schritte)
- [Projektstruktur](#-projektstruktur)
- [Kernmodule](#-kernmodule)
- [Dokumentation](#-dokumentation)
- [Entwicklung](#-entwicklung)
- [Deployment](#-deployment)
- [Mitwirken](#-mitwirken)

---

## 🎯 Übersicht

Fleet-Steuer ist eine spezialisierte Steuerverwaltungsanwendung für selbstständige Fahrzeugkuriere in Deutschland. Sie hilft bei der Verfolgung und Berechnung von steuerlich absetzbaren Ausgaben gemäß deutschem Steuerrecht, einschließlich:

- **Verpflegungspauschalen** (€14/€28 pro Tag)
- **Kilometererfassung** mit automatischer Kostenberechnung (€0,30/km)
- **Abschreibung von Arbeitsmitteln** mit GWG-Grenze (€952)
- **Belegverwaltung** mit PDF/Bild-Unterstützung
- **Echtzeit-Steuerabzugsübersichten**

### Warum Fleet-Steuer?

- ✅ **Deutsches Steuerrecht konform** - Folgt aktuellen Steuervorschriften
- ✅ **Offline-first** - Funktioniert ohne Internetverbindung
- ✅ **Mobiloptimiert** - Touch-freundliche Wischgesten
- ✅ **Professionell** - Produktionsreif mit A+ Modulnoten
- ✅ **Plattformübergreifend** - Web, iOS und Android Unterstützung

---

## ✨ Funktionen

### 📊 Dashboard
- Echtzeit-KPI-Karten mit Steuerabzugsübersichten
- Monatliche Ausgabentrends mit Balkendiagramm
- Schnellübersicht über den gesamten absetzbaren Betrag
- Note: **A (92/100)**

### 🚗 Fahrten-Verwaltung
- Kilometererfassung mit automatischen Berechnungen
- Datums- und Entfernungsprotokollierung
- Beleg-Upload-Unterstützung (PDF/Bilder)
- Wischgesten für schnelle Aktionen (bearbeiten/löschen/Beleg-Vorschau)
- Note: **A+ (98/100)**

### 💰 Spesen-Tracking
- Tägliche Spesenerfassung mit Verpflegungspauschalen (€14/€28)
- Belegverwaltung
- Datums- und Kategorieverfolgung
- Bidirektionale Wischaktionen
- Note: **A (94/100)**

### 🛠️ Arbeitsmittel
- Berechnung des Abschreibungsplans
- GWG-Grenze (Geringwertige Wirtschaftsgüter): €952
- Mehrjährige Abschreibungsverfolgung (max. 3 Jahre)
- Floating Schedule Card mit Wisch-zum-Schließen
- Belegverwaltung
- Note: **A+ (96/100)**

### ⚙️ Einstellungen
- Steuerjahr-Konfiguration
- Autokosten-Einstellungen (Standard: €0,30/km)
- Verpflegungspauschalen-Einstellungen (€14/€28)
- GWG-Grenzenverwaltung (€952)
- Note: **A+ (98/100)**

### 🎨 UX-Funktionen
- **Bidirektionale Wischgesten** - Links für Aktionen, rechts für Belege
- **Android Zurück-Taste Integration** - Intelligente Navigationshierarchie
- **Floating Schedule Cards** - Details zur Abschreibung von Arbeitsmitteln
- **PDF/Bild-Beleg-Vorschau** - Vollbild-Viewer mit Zoom
- **Responsive Design** - Funktioniert auf allen Bildschirmgrößen
- **Dark Mode bereit** - Material-UI Theming

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React Framework mit App Router
- **React 18** - UI-Bibliothek
- **Material-UI (MUI) v6** - Komponenten-Bibliothek
- **MUI X Charts** - Datenvisualisierung
- **Capacitor 6** - Plattformübergreifende native Laufzeitumgebung

### Mobile
- **Capacitor Filesystem** - Lokale Dateispeicherung
- **Capacitor App** - Native App-Funktionen (Zurück-Taste, etc.)
- **iOS & Android** - Native Builds

### Speicher
- **Local Storage** - Browser-Speicher für Web
- **Capacitor Filesystem** - Mobiles Dateisystem
- **Belegspeicherung** - Dokumentenverzeichnis

### Entwicklung
- **ESLint** - Code-Linting
- **Git** - Versionskontrolle
- **GitHub** - Repository-Hosting

---

## 🚀 Erste Schritte

### Voraussetzungen

```bash
Node.js >= 18.x
npm >= 9.x
```

### Installation

1. **Repository klonen**
   ```bash
   git clone https://github.com/lucascarvalhodasilva/ye.git
   cd ye
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

4. **Im Browser öffnen**
   ```
   http://localhost:3000
   ```

### Build für Produktion

**Web:**
```bash
npm run build
npm run export
```

**iOS:**
```bash
npm run build
npx cap sync ios
npx cap open ios
```

**Android:**
```bash
npm run build
npx cap sync android
npx cap open android
```

---

## 📁 Projektstruktur

```
fleet-steuer/
├── src/
│   ├── app/                      # Next.js App Router Seiten
│   │   ├── dashboard/            # Dashboard-Modul
│   │   ├── trips/                # Fahrten-Tracking
│   │   ├── expenses/             # Spesen-Tracking
│   │   ├── equipment/            # Arbeitsmittel-Verwaltung
│   │   ├── settings/             # Einstellungs-Modul
│   │   └── layout.js             # Root-Layout
│   ├── components/               # Geteilte Komponenten
│   │   ├── shared/               # Gemeinsame UI-Komponenten
│   │   ├── Sidebar.js            # Navigations-Sidebar
│   │   └── ...
│   ├── contexts/                 # React Contexts
│   ├── hooks/                    # Custom React Hooks
│   └── utils/                    # Hilfsfunktionen
├── docs/                         # Dokumentation
│   ├── diagrams/                 # Flussdiagramme & visuelle Anleitungen
│   ├── implementations/          # Feature-Implementierungsdocs
│   ├── reviews/                  # Modulbewertungen
│   └── summaries/                # Schnellreferenzen
├── android/                      # Android natives Projekt
├── ios/                          # iOS natives Projekt
├── public/                       # Statische Assets
└── capacitor.config.json         # Capacitor-Konfiguration
```

---

## 📚 Kernmodule

### Modulqualitätsnoten

| Modul | Note | Punktzahl | Status |
|--------|-------|-------|--------|
| Einstellungen | A+ | 98/100 | Produktionsreif ✅ |
| Fahrten | A+ | 98/100 | Produktionsreif ✅ |
| Arbeitsmittel | A+ | 96/100 | Produktionsreif ✅ |
| Spesen | A | 94/100 | Produktionsreif ✅ |
| Dashboard | A | 92/100 | Produktionsreif ✅ |
| **Durchschnitt** | **A+** | **95,2/100** | **Exzellent** |

### Moduldokumentation

Umfassende Bewertungen verfügbar in [`docs/reviews/`](docs/reviews/):
- [Dashboard-Bewertung](docs/reviews/dashboard-module-review.md)
- [Fahrten-Bewertung](docs/reviews/trips-module-review.md)
- [Spesen-Bewertung](docs/reviews/expenses-module-review.md)
- [Arbeitsmittel-Bewertung](docs/reviews/equipment-module-review.md)
- [Einstellungen-Bewertung](docs/reviews/settings-module-review.md)

---

## 📖 Dokumentation

Umfassende Dokumentation verfügbar im [`docs/`](docs/) Verzeichnis:

### Visuelle Anleitungen
- [Wischgesten-Anleitung](docs/diagrams/SWIPE_GESTURES_VISUAL_GUIDE.md)
- [Android Zurück-Taste Flussdiagramm](docs/diagrams/ANDROID_BACK_BUTTON_FLOW_DIAGRAM.md)

### Implementierungsdetails
- [Android Zurück-Taste Handler](docs/implementations/IMPLEMENTATION_SUMMARY_BACK_BUTTON.md)
- [Bidirektionale Wischgesten](docs/implementations/SWIPE_GESTURES_IMPLEMENTATION.md)
- [Monatliches Spesen-Tracking](docs/implementations/SPESEN_IMPLEMENTATION_SUMMARY.md)

### Schnellreferenzen
- [Arbeitsmittel-Zusammenfassung](docs/summaries/EQUIPMENT_REVIEW_SUMMARY.md)
- [Spesen-Zusammenfassung](docs/summaries/EXPENSES_REVIEW_SUMMARY.md)
- [Dateivalidierungs-Zusammenfassung](docs/summaries/FILE_SIZE_VALIDATION_SUMMARY.md)

**Vollständiger Dokumentationsindex:** [docs/README.md](docs/README.md)

---

## 💻 Entwicklung

### Verfügbare Skripte

```bash
# Entwicklung
npm run dev              # Dev-Server starten
npm run build            # Build für Produktion
npm run export           # Statische Site exportieren
npm run lint             # ESLint ausführen

# Mobile
npx cap sync             # Web zu nativ synchronisieren
npx cap open ios         # iOS in Xcode öffnen
npx cap open android     # Android in Android Studio öffnen
```

### Coding-Standards

- **ESLint** Konfiguration für Code-Qualität
- **Komponenten-Organisation** nach Feature-Modulen
- **Deutsches Steuerrecht** Konformität in Berechnungen
- **Mobile-first** Responsive Design
- **Barrierefreiheit** Überlegungen (ARIA-Labels, Tastaturnavigation)

### Schlüsseltechnologien

- **App Router** - Next.js 14 Routing-System
- **Server Components** - Optimiertes Rendering
- **Material-UI** - Komponenten-Theming und -Anpassung
- **Capacitor Plugins** - Native Gerätefunktionen
- **Local Storage** - Offline-first Datenpersistenz

---

## 🚢 Deployment

### Web-Deployment

**Vercel (Empfohlen):**
```bash
npm run build
# Zu Vercel deployen
```

**Statischer Export:**
```bash
npm run export
# /out Verzeichnis zu beliebigem Static-Host deployen
```

### Mobile-Deployment

**iOS App Store:**
1. In Xcode builden: `npx cap open ios`
2. Signing & Capabilities konfigurieren
3. Archivieren und zu App Store Connect hochladen

**Android Play Store:**
1. In Android Studio builden: `npx cap open android`
2. Signiertes APK/AAB generieren
3. Zu Google Play Console hochladen

---

## 🤝 Mitwirken

Beiträge sind willkommen! Bitte folgen Sie diesen Richtlinien:

1. Repository forken
2. Feature-Branch erstellen (`git checkout -b feature/tolle-funktion`)
3. Änderungen committen (`git commit -m 'Füge tolle Funktion hinzu'`)
4. Branch pushen (`git push origin feature/tolle-funktion`)
5. Pull Request öffnen

### Entwicklungsrichtlinien

- Bestehenden Code-Stil und Muster folgen
- Aussagekräftige Commit-Nachrichten schreiben
- Dokumentation für neue Funktionen aktualisieren
- Auf mehreren Geräten testen (iOS, Android, Web)
- Deutsche Steuerrechtskonformität sicherstellen

---

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.

---

## 👨‍💻 Autor

**Lucas Carvalho da Silva**
- E-Mail: lucas@carvalhodasilva.de
- GitHub: [@lucascarvalhodasilva](https://github.com/lucascarvalhodasilva)

---

## 🙏 Danksagungen

- Deutsche Steuervorschriften (Einkommensteuergesetz)
- Material-UI für exzellente Komponenten-Bibliothek
- Next.js Team für fantastisches Framework
- Capacitor für nahtlose plattformübergreifende Entwicklung

---

**Gebaut mit ❤️ für deutsche Kuriere**

*Zuletzt aktualisiert: 28. Januar 2026*
