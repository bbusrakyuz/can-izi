# CAN-İZİ

CAN-İZİ is a disaster-response prototype designed to help transmit and organize emergency device signals in affected areas. The project explores a mobile-to-server workflow where users can send emergency information and responders can consume that data through a radar-oriented backend workflow.

> **Project status:** Prototype / work in progress. Bluetooth/Wi-Fi scanning and responder-side radar visualization are planned extensions and are not presented here as completed features.

## Project Goals

- Provide a simple emergency signal workflow for disaster scenarios
- Collect basic device and battery information from the mobile client
- Send emergency data to an API server
- Prepare a backend foundation for responder-side visualization and prioritization

## Current Prototype

The repository currently contains a React Native mobile prototype and a Node.js server component.

### Mobile application

- Emergency signal submission
- Basic device information collection
- Battery information retrieval
- API communication with Axios

### Server

- Receives emergency signal data from the mobile client
- Logs and exposes data for future responder-side integrations

## Tech Stack

- React Native
- Expo
- JavaScript
- Node.js
- Axios
- expo-battery
- expo-device

## Installation

### Mobile application

```bash
npm install
```

Run the project with the appropriate React Native / Expo development workflow for your environment.

### Server

```bash
cd server
npm install
npm start
```

The local server is configured to run on port `3000` in the current prototype.

## Repository Structure

```text
.
├── App.js
├── package.json
├── package-lock.json
├── server/
└── README.md
```

## Planned Improvements

- Bluetooth and Wi-Fi based nearby-device scanning
- Responder-side radar visualization
- Signal prioritization logic
- More robust device identification
- Improved error handling and offline behavior
- Clearer separation between mobile, API, and responder components

## Notes

This project is an early engineering prototype rather than a production-ready emergency system. Real-world disaster-response use would require extensive testing, security review, privacy safeguards, reliability engineering, and validation under field conditions.
