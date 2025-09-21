# FlareHelp Frontend

Neo-brutalist React frontend for the FlareHelp cross-chain emergency healthcare funding platform.

## 🎨 Design System

**Neo-Brutalist Aesthetic:**
- Raw geometry with high contrast
- Large scale typography (Anton + Inter)
- Concrete grid system (8px base)
- Flat slab shadows and visible joins
- Urgent, confident, human emotional tone

## 🚀 Features

- **Cross-Chain Donations** - Flare native + XRPL integration
- **Real-time Updates** - Socket.IO for live notifications
- **Badge System** - NFT rewards with 3D animations
- **Impact Tracking** - See exactly who you've helped
- **Hospital Dashboard** - Create and manage emergency requests
- **Mobile Responsive** - Works on all devices

## 🛠 Tech Stack

- **React 18** - Modern React with hooks
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first styling with custom design tokens
- **Ethers.js** - Web3 wallet integration
- **React Query** - Server state management
- **Socket.IO** - Real-time communication

## 📦 Installation

```bash
cd frontend
npm install
```

## 🔧 Environment Setup

Create `.env.local`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_FLARE_RPC_URL=https://coston2-api.flare.network/ext/C/rpc
REACT_APP_DONATION_POOL_ADDRESS=0x7845fF302E85389E88c12F24D9cF479A56e3Dab0
REACT_APP_BADGE_NFT_ADDRESS=0x3C58E50b6A5C74A816B47BA739C914D743E6A78a
REACT_APP_RECURRING_MANAGER_ADDRESS=0x09Af2320c08537D44efCBFe55ad67C280F63F36E
```

## 🚀 Development

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🎨 Design Tokens

### Colors
```css
--bg: #F6F7F8        /* Very light concrete */
--panel: #E6E8EA      /* Card panels */
--ink: #0B0D0F        /* Near black text */
--muted: #7B7F84      /* Secondary text */
--accent: #FF4B3E     /* Emergency/primary CTA */
--accent-2: #00B37E   /* Success/impact */
--accent-3: #1E90FF   /* Info/links */
--slab: #2B2F33       /* Deep slab color */
```

### Typography
- **Display**: Anton (headings, CTAs)
- **UI**: Inter (body text, interface)

### Spacing
- Base grid: 8px
- Container max-widths: 980px (tablet), 1320px (desktop)

## 🧩 Component System

### Core Components
- **SlabButton** - Primary CTA with hover animations
- **EmergencyRequestCard** - Request display with progress
- **BadgeComponent** - 3D badge with confetti animations
- **Navbar** - Global navigation with wallet integration
- **Toast** - Notification system

### Page Components
- **HomePage** - Hero, live feed, how it works
- **HospitalDashboard** - Request management
- **RequestsPage** - Browse and filter requests
- **ImpactPage** - Personal impact tracking
- **ProfilePage** - User settings

## 🎭 Animations

### Motion Principles
- Mechanical & crisp (not soft/organic)
- Fast: 120-180ms, Medium: 220-320ms, Slow: 420-600ms
- Easing: `cubic-bezier(0.2,0.9,0.25,1)`

### Key Animations
- **Button hover**: `translateY(-2px)` + brightness
- **Card focus**: Scale pulse for urgent requests
- **Progress fill**: Width animation with overshoot
- **Badge mint**: 3D pop with confetti
- **Page transitions**: Slide with opacity

## 🔗 API Integration

### Authentication
- Wallet connection via MetaMask
- JWT token management
- Role-based access control

### Real-time Features
- Live donation updates
- New request notifications
- Pool statistics ticker
- Badge award animations

## 📱 Responsive Design

- **Mobile**: 100% width, 16px padding
- **Tablet**: Max 980px, 24px gutter
- **Desktop**: Max 1320px, 12-column grid

## ♿ Accessibility

- WCAG AA compliance
- Keyboard navigation
- Screen reader support
- High contrast ratios
- Reduced motion support

## 🚀 Deployment

```bash
# Build for production
npm run build

# Deploy to your preferred platform
# (Vercel, Netlify, AWS, etc.)
```

## 🎯 Key Features

### For Donors
- One-click $5 donations
- Recurring subscription setup
- Real-time impact tracking
- Badge progression system
- Cross-chain payment options

### For Hospitals
- Emergency request creation
- Document upload and verification
- Funding status tracking
- Donor impact visibility
- Automated disbursement

### For Everyone
- Transparent funding process
- Real-time updates
- Mobile-first design
- Global accessibility
- Emergency response focus

## 🔧 Customization

The design system is fully customizable through CSS variables and Tailwind config. Modify colors, typography, spacing, and animations to match your brand while maintaining the neo-brutalist aesthetic.

---

**Built with ❤️ for emergency healthcare funding**
