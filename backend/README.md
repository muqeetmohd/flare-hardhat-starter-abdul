# FlareHelp Backend

Node.js/Express backend API for the FlareHelp cross-chain emergency healthcare funding platform.

## 🏗️ Architecture

- **Express.js**: Web framework
- **MongoDB**: Database with Mongoose ODM
- **JWT**: Authentication and authorization
- **Socket.io**: Real-time communication
- **Ethers.js**: Blockchain integration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 4.4+
- Git

### Installation
```bash
cd backend
npm install
```

### Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Database Setup
```bash
# Start MongoDB
mongod --dbpath /tmp/mongodb

# Setup database
node setup.js
```

### Development
```bash
npm run dev
# Server runs on http://localhost:5001
```

### Production
```bash
npm start
```

## 📁 Project Structure

```
backend/
├── models/
│   ├── User.js           # User model
│   ├── Donation.js       # Donation model
│   ├── Request.js        # Emergency request model
│   └── Badge.js          # Badge model
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── donations.js      # Donation routes
│   ├── requests.js       # Request routes
│   └── users.js          # User routes
├── middleware/
│   ├── auth.js           # JWT authentication
│   ├── validation.js     # Input validation
│   └── rateLimiter.js    # Rate limiting
├── services/
│   ├── blockchain.js     # Blockchain integration
│   ├── email.js          # Email service
│   └── storage.js        # File storage
├── utils/
│   ├── helpers.js        # Utility functions
│   └── constants.js      # App constants
├── config/
│   └── database.js       # Database configuration
└── server.js             # Main server file
```

## 🔧 Configuration

### Environment Variables
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/flarehelp
JWT_SECRET=your-super-secret-jwt-key
PRIVATE_KEY=your-ethereum-private-key
FLARE_RPC_URL=https://coston2-api.flare.network/ext/bc/C/rpc
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 📊 API Endpoints

### Authentication
```
POST /api/auth/register     # Register new user
POST /api/auth/login        # Login user
POST /api/auth/logout       # Logout user
GET  /api/auth/me          # Get current user
```

### Donations
```
GET    /api/donations           # Get all donations
POST   /api/donations           # Create new donation
GET    /api/donations/:id       # Get donation by ID
GET    /api/donations/user/:id  # Get user donations
```

### Emergency Requests
```
GET    /api/requests            # Get all requests
POST   /api/requests            # Create new request
GET    /api/requests/:id        # Get request by ID
PUT    /api/requests/:id        # Update request
DELETE /api/requests/:id        # Delete request
```

### Users
```
GET    /api/users               # Get all users
GET    /api/users/:id           # Get user by ID
PUT    /api/users/:id           # Update user
DELETE /api/users/:id           # Delete user
```

## 🗄️ Database Models

### User Model
```javascript
{
  address: String,           // Wallet address
  email: String,             // Email address
  role: String,              // donor, hospital, admin
  totalDonated: Number,      // Total amount donated
  livesHelped: Number,       // Total lives helped
  badges: [String],          // Earned badges
  createdAt: Date,
  updatedAt: Date
}
```

### Donation Model
```javascript
{
  donor: ObjectId,           // Reference to User
  amount: Number,            // Donation amount
  currency: String,          // FLR, USDC, XRPL, etc.
  method: String,            // wallet, card, xrpl
  transactionHash: String,   // Blockchain transaction
  livesHelped: Number,       // Lives helped by this donation
  createdAt: Date
}
```

### Request Model
```javascript
{
  hospital: ObjectId,        // Reference to User
  invoiceId: String,         // Hospital invoice ID
  amount: Number,            // Requested amount
  description: String,       // Request description
  documents: [String],       // Document URLs
  status: String,            // open, funded, completed
  fundedAmount: Number,      // Amount funded
  peopleHelped: Number,      // People this request helps
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication

### JWT Token Structure
```javascript
{
  userId: ObjectId,
  address: String,
  role: String,
  iat: Number,
  exp: Number
}
```

### Protected Routes
```javascript
// Apply to routes that require authentication
router.use(authMiddleware);

// Apply to admin-only routes
router.use(authMiddleware, adminMiddleware);
```

## 🌐 Real-time Features

### Socket.io Events
```javascript
// Server events
io.emit('donation_received', donationData);
io.emit('request_created', requestData);
io.emit('request_funded', requestData);

// Client events
socket.on('donation_received', (data) => {
  // Update UI with new donation
});
```

## 🔗 Blockchain Integration

### Contract Interaction
```javascript
import { ethers } from 'ethers';

// Initialize provider
const provider = new ethers.JsonRpcProvider(FLARE_RPC_URL);

// Get contract instance
const contract = new ethers.Contract(address, abi, provider);

// Make transaction
const tx = await contract.donate({ value: amount });
```

### Event Listening
```javascript
// Listen to donation events
contract.on('DonationMade', (donor, amount, time) => {
  // Process donation in database
});
```

## 📧 Email Service

### Email Templates
- Welcome email
- Donation confirmation
- Request status updates
- Badge notifications

### Usage
```javascript
import { sendEmail } from './services/email';

await sendEmail({
  to: 'user@example.com',
  subject: 'Donation Confirmed',
  template: 'donation-confirmation',
  data: { amount: 50, livesHelped: 2 }
});
```

## 🛡️ Security

### Rate Limiting
```javascript
// Apply rate limiting to routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

### Input Validation
```javascript
import { body, validationResult } from 'express-validator';

// Validate donation amount
const validateDonation = [
  body('amount').isNumeric().isFloat({ min: 0.01 }),
  body('currency').isIn(['FLR', 'USDC', 'USDT', 'XRPL'])
];
```

### CORS Configuration
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### Test Coverage
```bash
npm run test:coverage
```

## 📊 Monitoring

### Health Check
```
GET /api/health
```

### Metrics
- Request count
- Response times
- Error rates
- Database connections

## 🚀 Deployment

### Environment Setup
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Set up Cloudinary for file storage
4. Configure email service

### Docker Deployment
```bash
# Build image
docker build -t flarehelp-backend .

# Run container
docker run -p 5001:5001 flarehelp-backend
```

### PM2 Process Manager
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name flarehelp-backend

# Monitor
pm2 monit
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
- Check MongoDB is running
- Verify connection string
- Check network connectivity

**JWT Token Invalid**
- Verify JWT_SECRET is set
- Check token expiration
- Ensure proper token format

**Blockchain Connection Failed**
- Verify RPC URL
- Check network status
- Ensure sufficient gas

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose ODM](https://mongoosejs.com/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Ethers.js Documentation](https://docs.ethers.org/)

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.