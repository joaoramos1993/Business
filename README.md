# Vacation Scheduler

A modern web application for managing employee vacation requests and scheduling. This project provides separate interfaces for employees to request time off and for owners/managers to review and approve vacation requests.

## Features

### Employee Features
- **Request Vacations**: Submit vacation requests with start date, end date, type (vacation/sick/personal), and notes
- **Track Vacation Days**: View available, used, and remaining vacation days
- **View Company Calendar**: See the company calendar with approved vacations highlighted
- **Request History**: Track all personal vacation requests with their status (pending/approved/rejected)
- **Automatic Day Calculation**: System automatically calculates the number of days between start and end dates

### Owner/Admin Features
- **Dashboard Statistics**: Real-time overview of total requests, pending approvals, approved count, and employees out today
- **Team Calendar**: View the company calendar with all approved vacations
- **Pending Approvals**: Quick access to pending requests with approve/reject buttons
- **Request History**: Complete history of all employee requests with filtering by status
- **Easy Approval Workflow**: One-click approval or rejection of vacation requests

## How to Use

### For Employees:
1. Open `index.html` in your web browser
2. Stay in **Employee View** (default)
3. Fill in your name, select vacation dates
4. Choose the type of leave (Vacation, Sick Leave, or Personal Day)
5. Optionally add notes
6. Click "Submit Request"
7. View your request status and company calendar

### For Owners/Managers:
1. Open `index.html` in your web browser
2. Click **Owner/Admin View** button
3. Check the dashboard for an overview of all requests
4. Review **Pending Approvals** section
5. Click **Approve** or **Reject** for each request
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
