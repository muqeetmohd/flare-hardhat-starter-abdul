# FlareHelp API Documentation

RESTful API for the FlareHelp cross-chain emergency healthcare funding platform.

## 🌐 Base URL

```
Development: http://localhost:5001/api
Production: https://api.flarehelp.org/api
```

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## 📊 Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Success message",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🔑 Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "email": "user@example.com",
  "role": "donor"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
      "email": "user@example.com",
      "role": "donor",
      "totalDonated": 0,
      "livesHelped": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "signature": "0x1234567890abcdef..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User
```http
GET /auth/me
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    "email": "user@example.com",
    "role": "donor",
    "totalDonated": 150.50,
    "livesHelped": 3,
    "badges": ["first_donation", "life_saver"]
  }
}
```

## 💰 Donation Endpoints

### Get All Donations
```http
GET /donations
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `donor` (optional): Filter by donor address

**Response:**
```json
{
  "success": true,
  "data": {
    "donations": [
      {
        "id": "507f1f77bcf86cd799439011",
        "donor": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
        "amount": 50.00,
        "currency": "FLR",
        "method": "wallet",
        "transactionHash": "0x1234567890abcdef...",
        "livesHelped": 2,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

### Create Donation
```http
POST /donations
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "amount": 50.00,
  "currency": "FLR",
  "method": "wallet",
  "transactionHash": "0x1234567890abcdef..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "amount": 50.00,
    "currency": "FLR",
    "livesHelped": 2,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get User Donations
```http
GET /donations/user/:userId
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "donations": [...],
    "totalDonated": 150.50,
    "totalLivesHelped": 3
  }
}
```

## 🚨 Emergency Request Endpoints

### Get All Requests
```http
GET /requests
```

**Query Parameters:**
- `status` (optional): Filter by status (open, funded, completed)
- `hospital` (optional): Filter by hospital ID
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "507f1f77bcf86cd799439011",
        "hospital": "507f1f77bcf86cd799439012",
        "invoiceId": "INV-001",
        "amount": 500.00,
        "description": "Emergency surgery for patient",
        "status": "open",
        "fundedAmount": 0,
        "peopleHelped": 10,
        "documents": ["https://cloudinary.com/image1.jpg"],
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

### Create Request
```http
POST /requests
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "invoiceId": "INV-001",
  "amount": 500.00,
  "description": "Emergency surgery for patient",
  "documents": ["https://cloudinary.com/image1.jpg"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "invoiceId": "INV-001",
    "amount": 500.00,
    "status": "open",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Request by ID
```http
GET /requests/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "hospital": {
      "id": "507f1f77bcf86cd799439012",
      "name": "City General Hospital",
      "address": "0x1234567890abcdef..."
    },
    "invoiceId": "INV-001",
    "amount": 500.00,
    "description": "Emergency surgery for patient",
    "status": "open",
    "fundedAmount": 0,
    "peopleHelped": 10,
    "documents": ["https://cloudinary.com/image1.jpg"],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Update Request
```http
PUT /requests/:id
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "status": "funded",
  "fundedAmount": 500.00
}
```

## 👥 User Endpoints

### Get All Users
```http
GET /users
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `role` (optional): Filter by role (donor, hospital, admin)
- `page` (optional): Page number
- `limit` (optional): Items per page

### Get User by ID
```http
GET /users/:id
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### Update User
```http
PUT /users/:id
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "totalDonated": 200.00
}
```

## 📊 Analytics Endpoints

### Get Platform Statistics
```http
GET /analytics/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDonations": 50000.00,
    "totalLivesHelped": 1000,
    "activeRequests": 15,
    "totalUsers": 250,
    "monthlyVolume": 10000.00
  }
}
```

### Get Donor Impact
```http
GET /analytics/impact/:userId
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDonated": 150.50,
    "totalLivesHelped": 3,
    "donationCount": 5,
    "averagePerDonation": 30.10,
    "badges": ["first_donation", "life_saver"]
  }
}
```

## 🔔 Notification Endpoints

### Get User Notifications
```http
GET /notifications
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "507f1f77bcf86cd799439011",
        "type": "donation_received",
        "title": "Donation Confirmed",
        "message": "Your $50 donation helped 2 people",
        "read": false,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### Mark Notification as Read
```http
PUT /notifications/:id/read
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

## 🌐 WebSocket Events

### Connection
```javascript
const socket = io('http://localhost:5001');

socket.on('connect', () => {
  console.log('Connected to server');
});
```

### Events

#### Donation Received
```javascript
socket.on('donation_received', (data) => {
  console.log('New donation:', data);
  // Update UI with new donation
});
```

#### Request Created
```javascript
socket.on('request_created', (data) => {
  console.log('New request:', data);
  // Update UI with new request
});
```

#### Request Funded
```javascript
socket.on('request_funded', (data) => {
  console.log('Request funded:', data);
  // Update UI with funded request
});
```

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Invalid input data |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `BLOCKCHAIN_ERROR` | Blockchain transaction failed |
| `INSUFFICIENT_FUNDS` | Not enough funds for transaction |

## 📝 Rate Limiting

- **General endpoints**: 100 requests per 15 minutes
- **Authentication endpoints**: 10 requests per 15 minutes
- **Donation endpoints**: 20 requests per 15 minutes

## 🔒 Security

- All endpoints use HTTPS in production
- JWT tokens expire after 24 hours
- Input validation on all endpoints
- Rate limiting to prevent abuse
- CORS configured for frontend domain

## 📚 SDK Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Get donations
const donations = await api.get('/donations');

// Create donation
const donation = await api.post('/donations', {
  amount: 50.00,
  currency: 'FLR',
  method: 'wallet',
  transactionHash: '0x123...'
});
```

### Python
```python
import requests

headers = {'Authorization': f'Bearer {token}'}
base_url = 'http://localhost:5001/api'

# Get donations
response = requests.get(f'{base_url}/donations', headers=headers)
donations = response.json()

# Create donation
donation_data = {
    'amount': 50.00,
    'currency': 'FLR',
    'method': 'wallet',
    'transactionHash': '0x123...'
}
response = requests.post(f'{base_url}/donations', json=donation_data, headers=headers)
```

## 🧪 Testing

### Postman Collection
Import the FlareHelp API collection for easy testing.

### cURL Examples
```bash
# Get donations
curl -H "Authorization: Bearer <token>" \
     http://localhost:5001/api/donations

# Create donation
curl -X POST \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"amount":50.00,"currency":"FLR","method":"wallet"}' \
     http://localhost:5001/api/donations
```

## 📞 Support

For API support:
- **Email**: api-support@flarehelp.org
- **Discord**: #api-support channel
- **GitHub Issues**: [API Issues](https://github.com/your-username/flarehelp/issues)
