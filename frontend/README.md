# Decor Bake Frontend

Production-ready React frontend for Temu-style ecommerce platform.

## Features

- ✅ Beautiful pink & white theme
- ✅ Mobile-first responsive design
- ✅ Smooth animations and transitions
- ✅ Product browsing with offers
- ✅ Category navigation
- ✅ Product detail pages
- ✅ Toast notifications
- ✅ Loading states
- ✅ Authentication ready

## Tech Stack

- **React 19** - UI library
- **React Router DOM** - Routing
- **Tailwind CSS 4** - Styling
- **Axios** - HTTP client
- **Context API** - State management

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URL:
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

4. Start development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components (Button, Loading, Toast, etc.)
│   ├── layout/          # Layout components (Header, Footer, AnnouncementBar)
│   └── ui/              # UI components (ProductCard, Sliders, etc.)
├── context/             # React Context providers (Auth, Toast)
├── pages/               # Page components
├── services/            # API service functions
├── utils/               # Utility functions and constants
├── assets/              # Static assets
├── App.jsx              # Main app component
└── main.jsx             # Entry point
```

## Components

### Common Components
- **Button** - Reusable button with variants
- **Loading** - Loading spinners and skeletons
- **Toast** - Notification system
- **CountdownTimer** - Timer for offers

### Layout Components
- **Header** - Navigation and auth
- **Footer** - Site footer
- **AnnouncementBar** - Sticky announcement bar

### UI Components
- **ProductCard** - Product display card with hover effects
- **ProductSlider** - Horizontal product slider
- **CategorySlider** - Category navigation slider

## Pages

### Home Page
- Hero section
- Categories section
- Active offers with countdown
- Featured products
- Category product sliders

### Product Detail Page
- Image gallery
- Price with offers
- Countdown timer
- Add to cart
- Shipping info

## Styling

- **Theme**: Pink (#ec4899) and White
- **Design**: Clean, modern, sweet
- **Animations**: Smooth transitions, hover effects
- **Responsive**: Mobile-first approach

## API Integration

All API calls are handled through service files:
- `productService.js` - Product operations
- `categoryService.js` - Category operations
- `offerService.js` - Offer operations
- `settingsService.js` - Settings operations

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features to Add

- [ ] Cart functionality
- [ ] Checkout flow
- [ ] User authentication pages
- [ ] Search functionality
- [ ] Filter and sort
- [ ] User profile
- [ ] Order history

## Notes

- All components are mobile-first
- Pink theme is consistent throughout
- Smooth animations on interactions
- Toast notifications for user feedback
- Loading states for better UX
