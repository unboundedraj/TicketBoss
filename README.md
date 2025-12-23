# TicketBoss – Event Ticketing API

TicketBoss is a small, concurrency-safe event ticketing API built using Node.js and MongoDB.  
It supports real-time seat reservations with instant accept/deny responses and prevents
over-booking using atomic database operations.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Swagger UI (OpenAPI)
- Uuid
---

## Project Structure

```
ticketboss/
├── src/
│   ├── models/
│   │   ├── Event.js
│   │   └── Reservation.js
│   ├── routes/
│   │   ├── reservations.js
│   │   └── event.js
│   ├── swagger/
│   │   └── openapi.yaml
│   ├── app.js
│   └── server.js
├── package.json
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js (v18 or above)
- MongoDB running locally

### Installation

```bash
git clone <your-repo-url>
cd ticketboss
npm install
```

### Run the Application

```bash
npm run dev
```

The server will start on:

```
http://localhost:3000
```

Swagger API documentation is available at:

```
http://localhost:3000/docs
```

---

## Database Seeding

On first startup, the application seeds the database with a single event:

```json
{
  "eventId": "node-meetup-2025",
  "name": "Node.js Meet-up",
  "totalSeats": 500,
  "availableSeats": 500,
  "version": 0
}
```

---

## API Documentation

### 1. Reserve Seats

**Endpoint**

```
POST /reservations
```

**Request Body**

```json
{
  "partnerId": "abc-corp",
  "seats": 3
}
```

**Responses**

**201 Created**

```json
{
  "reservationId": "uuid",
  "seats": 3,
  "status": "confirmed"
}
```

**400 Bad Request**
Returned when `seats ≤ 0` or `seats > 10`

```json
{
  "error": "Seats must be between 1 and 10"
}
```

**409 Conflict**
Returned when there are not enough seats available

```json
{
  "error": "Not enough seats left"
}
```

---

### 2. Cancel Reservation

**Endpoint**

```
DELETE /reservations/:reservationId
```

**Responses**

**204 No Content**
Reservation cancelled successfully and seats restored.

**404 Not Found**
Returned if the reservation does not exist or is already cancelled.

---

### 3. List Reservations

**Endpoint**

```
GET /reservations
```

**Response – 200 OK**

```json
[
  {
    "reservationId": "uuid",
    "partnerId": "abc-corp",
    "seats": 3,
    "status": "confirmed"
  }
]
```

---

### 4. Event Summary

**Endpoint**

```
GET /event
```

**Response – 200 OK**

```json
{
  "eventId": "node-meetup-2025",
  "name": "Node.js Meet-up",
  "totalSeats": 500,
  "availableSeats": 42,
  "reservationCount": 458,
  "version": 14
}
```

---

## Technical Decisions

### Concurrency Handling

Seat reservations are handled using a single atomic database operation
(`findOneAndUpdate`) with conditional checks to prevent race conditions
and over-booking under concurrent requests. Requests are either accepted
or rejected immediately, as required.

### Storage

MongoDB is used as the storage layer with Mongoose as the ODM. Atomic
update operations ensure data consistency without using locks or queues.

### API Design

The API follows RESTful principles with clear HTTP status codes:

* `201 Created` for successful reservations
* `400 Bad Request` for invalid input
* `409 Conflict` for insufficient seat availability
* `404 Not Found` for missing resources

### Assumptions

* The system manages a single event as per the problem statement
* Authentication and authorization are out of scope
* Seat reservations are limited to a maximum of 10 seats per request
* Immediate accept/deny responses are required (no retries or queuing)

---

## Testing

All endpoints were tested using Postman and Swagger UI.

---
