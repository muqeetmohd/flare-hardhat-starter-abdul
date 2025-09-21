# FlareHelp Backend API

Complete Node.js/Express backend with MongoDB for the FlareHelp cross-chain donation platform.

## 🚀 Features

- **User Authentication** - JWT-based auth with wallet integration
- **Role Management** - Donor, Hospital, Admin, Verifier roles
- **Emergency Requests** - Hospital request creation and management
- **Donation Processing** - Cross-chain donation tracking
- **Badge System** - NFT badge rewards and progression
- **Real-time Updates** - Socket.IO for live notifications
- **Blockchain Integration** - Direct smart contract interaction

## 📋 Prerequisites

- Node.js 16+
- MongoDB 4.4+
- Flare network access

## 🛠 Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Set up environment:**
```bash
cp config.env .env
# Edit .env with your configuration
```

3. **Configure MongoDB:**
```bash
# Start MongoDB locally
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

4. **Initialize database:**
```bash
node setup.js
```

5. **Start the server:**
```bash
# Development
npm run dev

# Production
npm start
```

## 🔧 Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/flarehelp

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# Blockchain
FLARE_RPC_URL=https://coston2-api.flare.network/ext/C/rpc
PRIVATE_KEY=your-private-key
DONATION_POOL_ADDRESS=0x7845fF302E85389E88c12F24D9cF479A56e3Dab0
BADGE_NFT_ADDRESS=0x3C58E50b6A5C74A816B47BA739C914D743E6A78a
RECURRING_MANAGER_ADDRESS=0x09Af2320c08537D44efCBFe55ad67C280F63F36E

# XRPL
XRPL_RECEIVER_ADDRESS=rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH
XRPL_DESTINATION_TAG=123456
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/wallet-login` - Login with wallet signature
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Emergency Requests
- `GET /api/requests` - Get all requests
- `GET /api/requests/active` - Get active requests
- `POST /api/requests` - Create new request (Hospital)
- `PUT /api/requests/:id/verify` - Verify request (Verifier)
- `PUT /api/requests/:id/status` - Update status

### Donations
- `POST /api/donations/process` - Process donation
- `GET /api/donations/history/:userId` - Get donation history

### Users & Impact
- `GET /api/users/profile/:userId` - Get user profile
- `GET /api/users/impact/:userId` - Get impact data
- `GET /api/users/leaderboard` - Get donor leaderboard

### Badges
- `GET /api/badges` - Get all badges
- `GET /api/badges/user/:userId` - Get user's badges
- `POST /api/badges/check-eligibility` - Check new badge eligibility

### Blockchain
- `GET /api/blockchain/pool-stats` - Get pool statistics
- `GET /api/blockchain/xrpl-details` - Get XRPL payment info
- `POST /api/blockchain/donate` - Process Flare donation
- `POST /api/blockchain/create-request` - Create blockchain request

## 🗄 Database Models

### User
- Basic profile info
- Role-based permissions
- Donation statistics
- Badge tracking
- Subscription management

### EmergencyRequest
- Request details
- Hospital information
- Funding tracking
- Verification status
- Timeline events

### Badge
- Badge definitions
- Requirements
- Rarity levels
- Blockchain integration

## 🔐 Authentication Flow

1. **Registration/Login** - User creates account or logs in
2. **JWT Token** - Server issues JWT token
3. **Role Assignment** - User gets assigned role (donor/hospital/admin)
4. **Permission Checks** - Middleware validates permissions
5. **Wallet Integration** - Optional Web3 wallet connection

## 🌐 Real-time Features

- **Socket.IO** for live updates
- **New request notifications**
- **Donation confirmations**
- **Status updates**
- **Badge awards**

## 🚀 Deployment

1. **Set up MongoDB Atlas** (recommended for production)
2. **Configure environment variables**
3. **Deploy to your preferred platform** (Heroku, AWS, etc.)
4. **Set up SSL certificate**
5. **Configure CORS for frontend**

## 📊 Sample Data

The setup script creates sample users:
- **Admin**: admin@flarehelp.com / admin123456
- **Hospital**: hospital@flarehelp.com / hospital123  
- **Donor**: donor@flarehelp.com / donor123

## 🔧 Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Setup database
node setup.js
```

## 📝 API Documentation

The API follows RESTful conventions with JSON responses:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## 🔗 Integration

This backend integrates with:
- **Flare Smart Contracts** - Direct blockchain interaction
- **XRPL Network** - Cross-chain payment processing
- **MongoDB** - Data persistence
- **Socket.IO** - Real-time communication
- **JWT** - Authentication

Ready to power your FlareHelp frontend! 🚀
