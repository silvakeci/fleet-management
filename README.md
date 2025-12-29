# Fleet Management System

## 1. Project Overview
- Web-based application for managing vehicles, drivers, maintenance records, and assignments within a fleet.
- Provides a centralized dashboard for administrators and fleet managers.
- Enables monitoring of fleet status, vehicle assignments, and maintenance activities.
- Designed with clean architecture, realistic data relationships, and scalable state management to reflect real-world fleet operations.

## 2. Key Features
- Vehicle management with full Create, Read, Update, and Delete functionality.
- Driver management with enforced assignment rules.
- One-to-one vehicle–driver assignment logic.
- Assignment and maintenance history tracking.
- Fleet dashboard with analytics and overdue maintenance alerts.
- Role-based access control for Admin and Fleet Manager roles.
- Realistic relationships between vehicles, drivers, and maintenance records.

## 3. Setup Instructions
- Ensure Node.js v18 or later and npm or yarn are installed.
- Clone the project repository to your local machine.
- Install project dependencies using `npm install`.
- Start the development server using `npm run dev`.
- Access the application at `http://localhost:5173`.

## 4. Project Structure
- Feature-based architecture for scalability and maintainability.
- `app` directory for Redux store configuration and custom hooks.
- `components` directory for reusable UI components.
- `features` directory containing vehicles, drivers, maintenance, and dashboard logic.
- `pages` directory for route-level application pages.
- `types` directory for shared TypeScript type definitions.
- `utils` directory for helper and utility functions.
- `main.tsx` as the main application entry point.

## 5. Architecture & Design Decisions
- Redux Toolkit used for predictable global state management.
- Asynchronous operations handled using `createAsyncThunk`.
- Clear separation of concerns through feature-based slices.
- One active driver per vehicle and one active vehicle per driver enforced.
- Automatic conflict resolution during vehicle assignments.
- Assignment history preserved for tracking and auditing.
- Optimistic UI updates for responsive user experience.
- Centralized validation logic and reusable UI components.
- Trade-offs include mock APIs, simulated authentication, and non-persistent in-memory data.

## 6. Features Implemented
- Dashboard with fleet summary cards, key statistics, recent activity, and maintenance alerts.
- Vehicle module supporting list views, filtering, create, edit, delete (Admin only), and detailed views with history.
- Driver module supporting filtered lists, detailed profiles, enforced single vehicle assignment, and assignment history.
- Assignment functionality for assigning and unassigning vehicles with conflict prevention and driver preselection.
- Maintenance module supporting validated maintenance record creation, automatic vehicle service updates, and maintenance history per vehicle.

## 7. Known Limitations & Future Improvements
- Mock APIs used instead of a real backend.
- No persistent storage; data resets on page refresh.
- Authentication and authorization are simulated.
- Basic analytics and charts.
- Planned improvements include real backend integration (REST or GraphQL), authentication and authorization, database persistence, maintenance scheduling calendar, report exports (PDF/CSV), performance optimizations, server-side pagination, toast notifications, dark mode, and improved mobile responsiveness.

## 8. Technologies Used
- React
- TypeScript
- Redux Toolkit
- React Router
- Tailwind CSS
- AG Grid
- Vite
