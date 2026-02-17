# 2026-SataAndagi-frontend

## Description
The Frontend service for the **Sata Andagi** facility management system. This application provides a modern, responsive web interface for Students and Professors to search for rooms and manage bookings, while offering Administrators a comprehensive dashboard for approvals and inventory management. It connects to the ASP.NET Core Backend via RESTful APIs.

## Features
* **Authentication & Security**:
    * Secure Login page with JWT token handling.
    * **Protected Routes**: Automatically redirects unauthenticated users or those without correct permissions.
* **User Dashboard**:
    * **Active Request Tracking**: View current booking status (Pending, Approved, Rejected).
    * **Sticky Header**: Persistent navigation for search and profile tools.
    * **Profile Integration**: Displays user details (NRP/NIP).
* **Smart Room Search**:
    * Filter rooms by **Time**, **Duration**, **Sector**, and **Capacity**.
    * Real-time availability visualization.
* **Booking Management**:
    * **BookingModal**: Submit reservation requests without leaving the search page.
* **Admin Panel**:
    * **Admin Inbox**: Review incoming requests with status filtering.
    * **ReviewModal**: Approve/Reject requests with conflict warnings.
    * **Room Inventory**: UI for Adding, Editing, and Soft-Deleting rooms.

## Tech Stack
* **Framework**: React 19
* **Build Tool**: Vite
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Routing**: React Router DOM
* **State/Fetching**: Axios, React Hooks

## Prerequisites
* [Node.js (LTS Version)](https://nodejs.org/en)
* [NPM](https://www.npmjs.com/)
* Git

## Installation

1.  **Clone the Repository**

    git clone https://github.com/pens-pbl/2026-SataAndagi-frontend.git
    cd 2026-SataAndagi-frontend

2.  **Install Dependencies**

    npm install

3.  **Configure Environment**
    Create a `.env` file based on `.env.example`.
    *(See Environment Variables section below)*.

4.  **Run Development Server**

    npm run dev

## Usage

### Starting the Client

    npm run dev

The application will be available at http://localhost:5173

### Build for Production

    npm run build

The output will be generated in the `dist/` folder.

## Environment Variables
Ensure your `.env` file is configured to point to your running Backend service:

    # Base URL for the ASP.NET Core Backend API
    VITE_API_BASE_URL=http://localhost:5000/api

## Contributing

1.  **Branching Strategy**
    * `main`: Production-ready code.
    * `develop`: Integration branch.
    * `feature/<name>`: New UI features.
    * `fix/<name>`: Bug fixes.

2.  **Commit Messages**
    * `feat: add booking modal component`
    * `style: apply tailwind classes to navbar`
    * `fix: resolve cors error in api service`

3.  **Workflow**
    1.  Pick an Issue from the GitHub Project Board.
    2.  Create a branch from `develop`.
    3.  Develop and test components.
    4.  Commit changes.
    5.  Push to origin and Open a Pull Request to `develop`.

## License
Distributed under the MIT License.

## Authors
* **PBL Team 2026** - *Initial Work*