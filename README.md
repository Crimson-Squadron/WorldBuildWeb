# ARCHIVE // C2 — World Event Chronicle Database

A full-stack, futuristic, military-spec chronicle and intelligence database system designed to record, structure, search, and filter the pivotal historical events of your world.

---

## 🏛️ System Architecture & Design Language

- **Design Aesthetic**: Futuristic, minimalist military command center (C2) / telemetry HUD. High-contrast OLED dark theme with tactical crimson and emerald telemetry indicators, monospace labels, and utilitarian segmented control tabs.
- **Date Format**: Formatted to `"dd MMMM yyyy"` (e.g. `18 June 1452`, `05 October 1388`).
- **Backend**: Java 21 (LTS) & Spring Boot 3.3.5 (Spring Data JPA, Bean Validation, HikariCP, Flyway, Lombok).
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React icons, Framer Motion animations.
- **Database**: Native Local MySQL 8.4 running on Windows port 3306 (No Docker required).

---

## 🚀 Quick Start (Running Locally)

Three PowerShell scripts are provided in the root directory for one-click startup:

### 1. Start MySQL Server (Port 3306)
```powershell
.\start-mysql.ps1
```
*(Runs the native MySQL server using the initialized data directory at `C:\ProgramData\MySQL\Data`).*

### 2. Start Spring Boot Backend (Port 8080)
```powershell
.\run-backend.ps1
```
* Or manually:
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
The backend automatically executes Flyway schema migrations and seeds initial lore upon boot.

### 3. Start Next.js Frontend (Port 3000)
```powershell
.\run-frontend.ps1
```
* Or manually:
```powershell
cd frontend
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## ✨ Features Implemented

### 1. Historical Event Chronicle (`/`)
- **Revamped Chronicle Cards**:
  - **Banner / Thumbnail Visual**: Displays a cinematic header image with gradient overlay if assigned.
  - **Prominent Event Synopsis**: Brief explanation summarizing the historical significance and premise of each event.
  - **Chapters Index Dropdown**: Replaced the full-text accordion with a clean chapter index dropdown displaying all chapter segment titles and context thumbnails, with direct links into the full reading view.
  - **Full Record & Chapters Link**: Expands into the dedicated reader mode.
- **Animated Layout**: Powered by `framer-motion`. Search queries and filter changes animate seamlessly, with exiting cards smoothly fading and remaining cards gliding into their new sorted positions.
- **Search Bar**: Debounced live searching against event titles with animated transitions.
- **Sorting**: Chronological, Reverse Chronological, Alphabetical (A–Z / Z–A), and Date Created.
- **Facet Filters**: Filter by Location / Region and multi-select by Affiliated Factions.
- **Modify & Delete Controls**: Direct links to edit or delete any event from the card or detail page.

### 2. Multi-Chapter Narrative Event Editor (`/events/new` & `/events/[id]/edit`)
- **Event Synopsis**: Dedicated field for summarizing the event narrative.
- **Banner / Thumbnail Selector**:
  - Upload local images from your device.
  - Quick-select from preset BlueStacks placeholder images (`/placeholders/...`).
  - Or specify any remote image URL.
- **Chapter Context Images**:
  - Each individual chapter segment can now feature its own context visual or map illustration.
- **Comprehensive Markdown Toolbar**:
  - One-click shortcuts for **Bold**, *Italics*, Section Headings (`##`, `###`), In-Universe Blockquotes (`>`), Bullet & Numbered lists, Dividers (`---`), and Inscription Code (`` `rune` ``).
  - Live **"Write" vs. "Markdown Preview"** tab toggle on every chapter segment.
- **Animated Dynamic Chapter Reordering**:
  - Add as many narrative segments as needed (`[+ Add Chapter Segment]`).
  - Smooth spring-animated reordering when moving segments **Up** or **Down**.
- **Quick-Add Modals**: Add new locations and factions on-the-fly without leaving your draft.

### 3. Locations Directory (`/locations`)
- First-class `Location` entity.
- Includes `map_x` and `map_y` coordinates, future-proofing for the upcoming interactive world map feature.

### 4. Factions & Orders Directory (`/factions`)
- Register guilds, dynasties, and orders with custom banner accent colors and creeds.

---

## 🗄️ Database & Production Deployment Readiness

- **Current Environment**: Native MySQL 8.4 running locally with Flyway migrations.
- **Production Server Switch**: To deploy on a remote cloud server (e.g., AWS RDS, DigitalOcean Managed MySQL, PlanetScale, Supabase):
  1. Set production environment variables:
     - `SPRING_DATASOURCE_URL=jdbc:mysql://your-server:3306/worldbuild_db`
     - `SPRING_DATASOURCE_USERNAME=your_user`
     - `SPRING_DATASOURCE_PASSWORD=your_password`
  2. Spring Boot and Flyway will automatically validate and maintain database integrity without modifying code.
