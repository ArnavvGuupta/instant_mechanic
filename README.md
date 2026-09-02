# Instant Mechanic - Vehicle Service Operations Dashboard
 
A comprehensive full-stack web application for managing vehicle service operations, bookings, mechanics, and customer relationships. Built as a modern, responsive dashboard for service providers.
 

 
## 📋 Overview
 
Instant Mechanic is an operations platform designed to streamline vehicle service management. It provides real-time visibility into bookings, mechanics availability, customer information, vehicle fleet, and comprehensive analytics for service businesses.
 
### Key Metrics Tracked
- **507 Total Bookings** across all service types
- **50 Registered Customers** in the system
- **20 Active Mechanics** managing services
- **50 Vehicle Fleet** registered
- **₹3,50,318** revenue from completed services
- **51.3%** overall completion rate
## ✨ Features
 
### 📊 Dashboard
- Real-time operations overview with key performance indicators
- Business metrics at a glance (customers, mechanics, vehicles, revenue)
- Booking activity visualization
- Booking status distribution
- Recent bookings activity feed
### 📅 Bookings Management
- Complete service appointment management
- Advanced filtering by status, date range
- Booking workflow tracking (Pending, In Progress, Completed, Cancelled)
- Customer and vehicle mapping per booking
- Mechanic assignment and scheduling
- Real-time status updates
### 👨‍🔧 Mechanics Management
- Field team monitoring and performance tracking
- Mechanic availability status (Available, Busy, On The Way, Offline)
- Workload overview (jobs completed, current assignments)
- Location tracking
- Contact information and performance metrics
### 👥 Customer Management
- Comprehensive customer database
- Contact information and location tracking
- Multi-city coverage (Delhi, Bangalore, Pune, Hyderabad, Mumbai, Gurgaon)
- Search and filter capabilities
- Customer visit history and preferences
### 🚗 Vehicle Management
- Complete vehicle fleet registry
- Vehicle details (make, model, registration, year, fuel type)
- Customer-vehicle mapping
- Service history per vehicle
- Maintenance tracking
### 🔧 Service Catalog
- 8+ Service offerings including:
  - Oil Change
  - Full Service
  - Brake Inspection
  - AC Service & Cooling
  - General Service
  - Battery Check
  - Tyre Replacement
  - Engine Diagnostics
- Pricing and duration information
- Service categorization
### 📈 Analytics & Reporting
- Platform-wide performance metrics
- Booking trends analysis
- Revenue tracking
- Completion rate analytics
- Operational performance snapshots
- Recent booking details
## 🛠️ Tech Stack
 
### Frontend
- **React** - UI library
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Chart.js / Recharts** - Data visualization
### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
### Tools & Deployment
- **Docker** - Containerization
- **Git** - Version control
- **REST API** - Backend communication
## 🚀 Getting Started
 
### Prerequisites
- Node.js (v14+)
- npm or yarn
- PostgreSQL (v12+)
- Git
### Installation
 
1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/instant-mechanic.git
   cd instant-mechanic
```
 
2. **Install dependencies**
```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
```
 
3. **Set up PostgreSQL Database**
```bash
   # Create database
   createdb instant_mechanic
   
   # Or using psql
   psql -U postgres -c "CREATE DATABASE instant_mechanic;"
   
   # Run migrations
   cd backend
   npm run migrate
```
 
4. **Environment Configuration**
   Create `.env` files for frontend and backend:
   
   **Backend `.env`:**
```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=instant_mechanic
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODE_ENV=development
```
 
   **Frontend `.env`:**
```
   REACT_APP_API_URL=http://localhost:5000/api
```
 
5. **Start the application**
   
   Backend:
```bash
   cd backend
   npm run dev
```
 
   Frontend (in new terminal):
```bash
   cd frontend
   npm start
```
 
6. **Access the dashboard**
   - Open http://localhost:3000 in your browser
   - Login with admin credentials
## 📁 Project Structure
 
```
instant-mechanic/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   ├── Bookings/
│   │   │   ├── Mechanics/
│   │   │   ├── Customers/
│   │   │   ├── Vehicles/
│   │   │   ├── Services/
│   │   │   └── Analytics/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.tsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Booking.js
│   │   │   ├── Customer.js
│   │   │   ├── Mechanic.js
│   │   │   ├── Vehicle.js
│   │   │   └── Service.js
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── server.js
│   └── package.json
└── README.md
```
 
## 🔐 Authentication
 
The application uses JWT-based authentication for secure access:
- Login required for all operations
- Role-based access control (Admin, Manager, Mechanic)
- Session management with token refresh
## 📡 API Endpoints
 
### Bookings
- `GET /api/bookings` - List all bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking
### Mechanics
- `GET /api/mechanics` - List all mechanics
- `GET /api/mechanics/:id` - Get mechanic details
- `POST /api/mechanics` - Add new mechanic
- `PUT /api/mechanics/:id` - Update mechanic info
### Customers
- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Add new customer
- `PUT /api/customers/:id` - Update customer
### Vehicles
- `GET /api/vehicles` - List all vehicles
- `POST /api/vehicles` - Register new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
### Services
- `GET /api/services` - List service catalog
- `POST /api/services` - Add service offering
## 🎯 Use Cases
 
- **Service Managers** - Monitor daily operations, track mechanic workload, manage bookings
- **Mechanics** - View assigned jobs, update status, track performance
- **Admin** - Manage customer database, vehicle fleet, service catalog, analytics
- **Business Owner** - Track KPIs, revenue, and operational efficiency
## 📊 Key Metrics & Analytics
 
The dashboard tracks:
- Real-time booking status distribution
- Revenue trends and forecasting
- Mechanic performance metrics
- Customer acquisition and retention
- Service completion rates
- Operational efficiency indicators
## 🤝 Contributing
 
We welcome contributions! Please follow these steps:
 
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
### Development Guidelines
- Write clean, readable code
- Add comments for complex logic
- Test your changes thoroughly
- Follow the existing code style
- Update documentation as needed
## 📝 License
 
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
 
## 🐛 Known Issues & Roadmap
 
### Current Version
- Real-time booking management ✅
- Mechanic workload tracking ✅
- Customer database ✅
- Analytics dashboard ✅
### Upcoming Features
- Mobile app for mechanics
- GPS tracking integration
- SMS/Email notifications
- Payment gateway integration
- Customer reviews & ratings
- Advanced reporting and exports
- Multi-branch support
## 💬 Support
 
For support, email support@instantmechanic.com or open an issue on GitHub.
 
## 👥 Team
 
- **Frontend Developer** - React/TypeScript
- **Backend Developer** - Node.js/Express
- **Full Stack Developer** - End-to-end implementation
---
 
**Last Updated:** September 2, 2026
 
Built with ❤️ for service excellence
 

