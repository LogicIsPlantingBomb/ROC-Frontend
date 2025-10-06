# ROC Frontend (MERN + Microservices)

## Overview

ROC is a vehicle booking app, similar to Uber, but with unique features tailored for spontaneous rentals in new locations. Users can request bikes or cars, and the app sends notifications to nearby owners in a 1 km radius. Confirmed rentals connect users with available vehicles. Additionally, ROC integrates an AI chatbot to suggest destinations, check weather, and validate travel feasibility.

This frontend is built using React and connects to a microservices-based backend. Real-time communication is handled via WebSockets.

---

## Features

### User Side

* Browse and rent bikes or cars.
* Get notified when nearby owners confirm availability.
* View personalized AI suggestions for travel, weather, and routing.
* Profile management and authentication.

### Captain/Owner Side

* Receive rental requests from nearby users.
* Confirm or decline requests.
* Manage vehicle profile.
* Authentication for captains.

### AI Chatbot

* Suggests travel destinations.
* Provides real-time weather updates.
* Offers guidance on travel feasibility based on user preferences.

### Real-time Features

* WebSocket-based notifications for users and captains.
* Instant booking confirmation and updates.

---

## Tech Stack

* **Frontend:** React, JSX, CSS
* **State Management:** React Context API
* **Routing:** React Router DOM
* **WebSockets:** Socket.io client
* **API Calls:** Axios

---

## Project Structure

```
src/
├── App.jsx                 # Main app component
├── components/            # Reusable components
│   ├── Chatbot.jsx
│   ├── Layout.jsx
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── contexts/              # React context providers
│   ├── CaptainContext.jsx
│   └── UserContext.jsx
├── hooks/                 # Custom hooks for authentication
│   ├── useAuthCaptain.js
│   └── useAuthUser.js
├── index.css               # Global styles
├── main.jsx                # React app entry point
├── pages/                  # All page-level components
│   ├── BikeRental/BikeRental.jsx
│   ├── Captain/CaptainHome.jsx
│   ├── Captain/CaptainLogin.jsx
│   ├── Captain/CaptainProfile.jsx
│   ├── Captain/CaptainSignup.jsx
│   ├── Home.jsx
│   ├── User/UserHome.jsx
│   ├── User/UserLogin.jsx
│   ├── User/UserProfile.jsx
│   └── User/UserSignup.jsx
├── services/socket.js      # WebSocket client
└── utils/api.js            # Axios API calls
```

---

## Installation

1. Clone the repo:

```bash
git clone <repo-url>
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The app should now be running on `http://localhost:5173`.

---

## WebSocket Usage

The app uses WebSockets to handle real-time notifications between users and captains.

### services/socket.js

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // replace with backend URL

export default socket;
```

### Example Usage in Components

```javascript
import { useEffect } from 'react';
import socket from '../services/socket';

const BikeRental = () => {
    useEffect(() => {
        socket.on('rentalRequest', (data) => {
            console.log('New rental request:', data);
        });

        return () => {
            socket.off('rentalRequest');
        };
    }, []);

    return <div>Bike Rental Page</div>;
};
```

---

## Contributing

* Ensure code readability and consistency.
* Write clean, maintainable React components.
* Follow REST API and WebSocket protocols as defined in the backend.

---

MIT License
