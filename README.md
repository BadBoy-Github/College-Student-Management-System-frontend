# Frontend - College Student Management System

React.js frontend with Vite, featuring dark theme with orange accent colors and role-based UI.

## Tech Stack
- React 18 + Vite
- React Router v6 for navigation
- Axios for API calls
- Recharts for dashboard charts
- Custom CSS with dark theme

## Prerequisites
1. Node.js (v16 or higher)
2. Backend server running on `http://localhost:5000`

## Installation

```bash
cd frontend
npm install
```

## Configuration

The frontend is pre-configured to connect to backend at `http://localhost:5000`. If your backend runs on a different port, update the API base URL in:
- `src/context/AuthContext.jsx`
- All page components (Dashboard, Students, Users, etc.)

## Running the Application

Development mode:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

Production build:
```bash
npm run build
```

## Features

### Dark Orange Theme
- Primary color: `#f97316` (Orange)
- Dark background: `#0f172a`
- Cards: `#1e293b`
- Inputs: `#334155`

### Pages & Modules

#### 1. Login Page
- Email/password authentication
- Default admin credentials provided
- JWT token stored in localStorage

#### 2. Dashboard
- Statistics cards (Total Students, Fees Collected, Fees Pending, Documents)
- Bar chart showing average marks by department
- Recent activities feed

#### 3. User Management (Admin Only)
- List all users (Admin/Teacher)
- Add new users with role selection
- Delete users

#### 4. Student Management
- Search and filter students
- Add/Edit/Delete students (Admin only)
- Teacher: Read-only access

#### 5. Document Generation
- Generate Bonafide Certificate
- Generate Transfer Certificate
- Generate Marksheet
- Print functionality

#### 6. Marks Management
- Add marks for students
- View all marks entries
- Delete marks (Admin only)

#### 7. Fee Management
- Add fee records (Admin only)
- Record payments
- Payment status indicators (Paid/Partial/Due)

## Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   └── Layout.jsx       # Sidebar navigation layout
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication context
│   ├── pages/
│   │   ├── Login.jsx        # Login page
│   │   ├── Dashboard.jsx    # Dashboard with charts
│   │   ├── Users.jsx        # User management
│   │   ├── Students.jsx     # Student management
│   │   ├── Documents.jsx    # Document generation
│   │   ├── Marks.jsx        # Marks management
│   │   └── Fees.jsx         # Fee management
│   ├── App.jsx              # Main app with routes
│   ├── index.css            # Global styles & theme
│   └── main.jsx             # Entry point
└── index.html
```

## Role-Based UI
- **Admin**: Sees all menu items + full CRUD operations
- **Teacher**: Limited menu items, no delete buttons, read-only for sensitive operations

## Authentication Flow
1. User logs in with email/password
2. Backend returns JWT token
3. Token stored in localStorage and added to all API requests
4. Protected routes redirect to login if not authenticated
