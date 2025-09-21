# FlareHelp Frontend

Neo-brutalist React frontend for the FlareHelp cross-chain emergency healthcare funding platform.

## 🎨 Design System

### Neo-Brutalist Principles
- **High Contrast**: Bold, accessible color combinations
- **Geometric Shapes**: Clean, industrial design elements
- **Typography**: Inter for UI, Anton for display headings
- **Minimal Gradients**: Flat colors with subtle shadows
- **Bold Borders**: 2px solid borders for emphasis

### Color Palette
```css
--bg: #F6F7F8        /* Light concrete background */
--panel: #E6E8EA     /* Card panels */
--ink: #0B0D0F       /* Near black text */
--muted: #7B7F84     /* Secondary text */
--accent: #FF4B3E     /* Emergency red */
--accent-2: #00B37E   /* Success green */
--accent-3: #1E90FF   /* Info blue */
--slab: #2B2F33      /* Deep slab color */
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask or compatible wallet

### Installation
```bash
cd frontend
npm install
```

### Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Development
```bash
npm start
# Opens http://localhost:3000
```

### Build
```bash
npm run build
# Creates optimized build in build/
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── SlabButton.jsx  # Primary button component
│   │   ├── DonationModal.jsx # Donation interface
│   │   ├── ImpactTracker.jsx # Impact display
│   │   └── ...
│   └── layout/
│       └── Navbar.jsx      # Navigation component
├── pages/
│   ├── HomePage.jsx        # Main landing page
│   ├── ImpactPage.jsx      # Detailed impact view
│   ├── HospitalDashboard.jsx # Hospital interface
│   └── ...
├── services/
│   └── blockchainService.js # Web3 integration
├── hooks/
│   ├── useAuth.js          # Authentication hook
│   └── useWeb3.js          # Web3 connection hook
├── styles/
│   ├── globals.css         # Global styles
│   └── animations.css      # Custom animations
└── utils/
    └── helpers.js          # Utility functions
```

## 🎯 Key Features

### Impact Tracking
- Real-time donation impact display
- Equal distribution calculator
- Donor history and statistics
- Badge achievement system

### Multi-Currency Support
- Native FLR donations
- USDC/USDT ERC-20 tokens
- XRPL cross-chain donations
- Credit card integration

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions
- Accessible navigation

## 🧩 Components

### SlabButton
Primary button component with neo-brutalist styling.

```jsx
<SlabButton
  variant="primary"
  size="lg"
  icon={<HeartIcon />}
  label="Donate to Pool"
  onClick={handleDonate}
/>
```

### DonationModal
Comprehensive donation interface supporting multiple payment methods.

```jsx
<DonationModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onDonate={handleDonation}
/>
```

### ImpactTracker
Displays donor impact with real-time data from blockchain.

```jsx
<ImpactTracker
  user={user}
  donations={donations}
  emergencyRequests={requests}
/>
```

## 🎨 Styling

### Tailwind Configuration
Custom Tailwind config with neo-brutalist design tokens.

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: '#F6F7F8',
        panel: '#E6E8EA',
        ink: '#0B0D0F',
        accent: '#FF4B3E',
        // ... more colors
      },
      fontFamily: {
        display: ['Anton', 'system-ui', 'sans-serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  }
}
```

### Custom CSS Classes
```css
.slab-container {
  @apply bg-panel border-2 border-solid border-[rgba(11,13,15,0.06)] p-6 rounded-lg;
}

.btn-slab {
  @apply inline-flex items-center justify-center font-semibold uppercase tracking-tight;
  padding: 0.875rem 1.25rem;
  border-width: 2px;
  border-style: solid;
  border-color: rgba(11,13,15,0.12);
}
```

## 🔗 Blockchain Integration

### Web3 Connection
```javascript
import { useWeb3 } from './hooks/useWeb3';

const { connect, disconnect, account, provider } = useWeb3();
```

### Contract Interaction
```javascript
import blockchainService from './services/blockchainService';

// Initialize service
await blockchainService.initialize(provider, signer);

// Make donation
const result = await blockchainService.makeDonation(amount);
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ♿ Accessibility

- WCAG AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Focus indicators

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- --testNamePattern="DonationModal"
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
```env
REACT_APP_API_BASE_URL=https://api.flarehelp.org
REACT_APP_FLARE_RPC_URL=https://coston2-api.flare.network/ext/bc/C/rpc
REACT_APP_CONTRACT_ADDRESSES={"donationPool":"0x..."}
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

## 🐛 Troubleshooting

### Common Issues

**Wallet Connection Failed**
- Ensure MetaMask is installed
- Check network configuration
- Verify RPC URL

**Contract Interaction Errors**
- Check contract addresses
- Verify network connection
- Ensure sufficient gas

**Build Errors**
- Clear node_modules and reinstall
- Check Node.js version
- Verify environment variables

## 📚 Resources

- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Ethers.js](https://docs.ethers.org/)
- [Flare Network](https://flare.network/)

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.