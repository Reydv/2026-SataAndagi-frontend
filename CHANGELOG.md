# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-17
### Added
- **Authentication**: Implemented Login page with JWT token handling and role-based redirection.
- **Dashboard**: Created main user dashboard with sticky header and "My Active Requests" history list.
- **Room Search**: Implemented search functionality with filters for Time, Duration, Sector, and Capacity.
- **Booking**: Added `BookingModal` for submitting new reservation requests.
- **Admin Panel**: Added dedicated Admin Dashboard with Inbox and Room Inventory management.
- **Room Management**: Implemented CRUD operations for Rooms (Add, Edit, Soft Delete).
- **Reservation Review**: Added `ReviewModal` for Admins to Approve/Reject requests with conflict detection.
- **Profile View**: Integrated User Profile display (NRP/NIP) within reservation details.

### Changed
- Updated UI components to use Tailwind CSS for consistent styling.
- Refactored `AdminInbox` to support status filtering (Pending, Approved, Rejected).

### Security
- Implemented Protected Routes to prevent unauthorized access to Dashboard and Admin pages.