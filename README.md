# Vacation Scheduler Web Application

A modern web application for managing employee vacation requests with an admin dashboard featuring interactive map visualization.

## Build System Setup ✅

This project now includes a complete **Vite-based build system** with:
- ⚡ Lightning-fast development server with HMR
- 📦 Optimized production builds
- 🗺️ Leaflet.js interactive maps
- 🌐 Modular code structure

## Features

### Employee Features
- **Request Vacations**: Submit vacation requests with start date, end date, type (vacation/sick/personal), and notes
- **Track Vacation Days**: View available, used, and remaining vacation days
- **View Company Calendar**: See the company calendar with approved vacations highlighted
- **Request History**: Track all personal vacation requests with their status (pending/approved/rejected)
- **Automatic Day Calculation**: System automatically calculates the number of days between start and end dates
- **Bilingual Support**: Toggle between English and Portuguese

### Owner/Admin Features
- **Dashboard Statistics**: Real-time overview of total requests, pending approvals, approved count, and employees out today
- **🗺️ Interactive Map**: Visual map showing employees currently on vacation with detailed popups
- **Team Calendar**: View the company calendar with all approved vacations
- **Pending Approvals**: Quick access to pending requests with approve/reject buttons
- **Request History**: Complete history of all employee requests with filtering by status
- **Easy Approval Workflow**: One-click approval or rejection of vacation requests

## Project Structure

```
Business/
├── src/
│   ├── index.html       # Main HTML file
│   ├── css/
│   │   └── styles.css   # Application styles
│   └── js/
│       └── app.js       # Application logic with map integration
├── public/              # Static assets
├── dist/                # Production build output (generated)
├── package.json         # Dependencies and build scripts
├── vite.config.js       # Vite build configuration
├── .gitignore          # Git ignore rules
├── index.html.backup   # Your original file (backed up)
└── README.md           # This file
```

## Getting Started

### Option 1: Docker (Recommended) 🐳

#### Prerequisites
- Docker and Docker Compose installed (run `./get-docker.sh` on Linux to install)

#### Production Mode

1. **Build and run with Docker Compose:**
```bash
docker compose up -d
```

2. **Access the application:**
   - Web app: http://localhost:3000

3. **Stop the containers:**
```bash
docker compose down
```

#### Development Mode (with hot-reload)

```bash
docker compose --profile dev up
```
Access at http://localhost:3001

### Option 2: Local Development

#### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

#### Installation

1. **Install dependencies:**
```bash
npm install
```

#### Development

Start the development server with hot reload:
```bash
npm run dev
```

The application will open automatically at `http://localhost:3000`

#### Building for Production

Create an optimized production build:
```bash
npm run build
```

The built files will be in the `dist/` directory.

#### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Create optimized production build |
| `npm run preview` | Preview production build locally |
| `npm run serve` | Serve production build on port 3000 |

## Docker Commands

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start production containers in background |
| `docker compose --profile dev up` | Start development mode with hot-reload |
| `docker compose down` | Stop all containers |
| `docker compose logs -f` | View container logs |
| `docker compose ps` | List running containers |

## How to Use

### For Employees:
1. Navigate to the application (http://localhost:3000 for Docker or development server)
2. Stay in **Employee View** (default)
3. Fill in your name, select vacation dates
4. Choose the type of leave (Vacation, Sick Leave, or Personal Day)
5. Optionally add notes
6. Click "Submit Request"
7. View your request status and company calendar

### For Owners/Managers:
1. Navigate to the application (http://localhost:3000)
2. Click **Owner/Admin View** button
3. Check the dashboard for an overview of all requests
4. View the **interactive map** showing employees on vacation
5. Review **Pending Approvals** section
6. Click **Approve** or **Reject** for each request
6. View all requests in **All Requests** section
7. Monitor the **Team Calendar** for approved vacations

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients, flexbox, and grid layouts
- **JavaScript (Vanilla)**: No dependencies required
- **LocalStorage**: Data persistence in the browser

### Data Structure
Each vacation request contains:
- Employee name
- Start and end dates
- Type of leave
- Number of days
- Notes/comments
- Request status (pending/approved/rejected)
- Submission timestamp

### Features
- ✅ Role-based access (Employee vs Owner)
- ✅ Real-time calendar generation
- ✅ Persistent data storage
- ✅ Responsive design
- ✅ Professional UI with color-coded statuses
- ✅ Quick statistics and insights

## Installation

No installation required! Simply:
1. Download or clone this repository
2. Open `index.html` in any modern web browser
3. Start managing vacations!

## Browser Compatibility
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Data Storage

All data is stored locally in your browser's localStorage. This means:
- ✅ No server required
- ✅ Data persists across browser sessions
- ✅ Privacy-friendly (data stays on your device)
- ⚠️ Clearing browser data will delete all stored requests

## Future Enhancements

Potential improvements:
- Backend database integration for cloud storage
- Email notifications for request updates
- Multi-month vacation planning
- Team-level statistics and reports
- Vacation balance tracking per employee
- Integration with calendar applications (Google Calendar, Outlook)
- Export functionality (CSV, PDF)
- User authentication
- Department-based management
- Recurring vacation patterns

## Project Structure

```
vacation-scheduler/
├── index.html       # Complete application (HTML + CSS + JavaScript)
└── README.md        # This file
```

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please create an issue in the repository.

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Author**: João Ramos
