# TBS RoamAgent - India-Wide TravelTech Platform Implementation Plan

## Phase 1: Foundation & Design System Enhancement (Week 1)

### 1.1 Enhanced Design Tokens
- [ ] Update color palette: Deep navy (#0B1426), Teal/Cyan accent (#00B4D8), Slate neutrals
- [ ] Add Indian context colors: Saffron accent (#FF9933), Green success (#00A86B)
- [ ] Enhance typography scale for marketing + data-dense views
- [ ] Add responsive spacing tokens
- [ ] Define motion tokens for premium feel (spring configs, durations)

### 1.2 Core UI Primitives
- [ ] Autocomplete/Combobox component (Radix + motion)
- [ ] Carousel/Slider component (touch + keyboard)
- [ ] Image component with blur placeholder, lazy loading, error fallback
- [ ] Toast system (sonner already installed)
- [ ] Language selector with flag/icons
- [ ] Avatar/Profile components
- [ ] Data table with sorting/filtering
- [ ] Tab navigation component

### 1.3 Layout Components
- [ ] Sticky header with mega-menu support
- [ ] Footer with multi-column links
- [ ] Container/Grid system
- [ ] Section wrapper with consistent spacing

---

## Phase 2: India-Wide Location Intelligence (Week 1-2)

### 2.1 Location Data Model
- [ ] Create `Location` type with: id, name, type (city/station/airport/landmark), state, coordinates, aliases
- [ ] Create `TransportCoverage` type: locationKnown, routeSupported, scheduleVerified, fareVerified, liveSeats, bookingIntegration
- [ ] Build location registry (JSON/DB) for major Indian cities, bus terminals, railway stations, airports

### 2.2 Geocoding Service
- [ ] Backend: `/api/locations/search` endpoint with debounced autocomplete
- [ ] Backend: `/api/locations/:id` for details
- [ ] Backend: `/api/coverage/check` for origin-destination pair
- [ ] Frontend: `useLocationSearch` hook with caching
- [ ] Frontend: `LocationAutocomplete` component

### 2.3 Data Sources
- [ ] Use OpenStreetMap Nominatim (free) or Mapbox/Google Places (if keys available)
- [ ] Curate static dataset for major terminals as fallback
- [ ] Add Indian state/UT metadata

---

## Phase 3: Homepage Redesign (Week 2)

### 3.1 Navigation
- [ ] Brand logo + "RoamAgent" wordmark
- [ ] Primary nav: Book, Explore India, My Trips, Corporate, Offers
- [ ] Language selector (8 languages)
- [ ] User menu (Sign in, Profile, Wallet, Settings)
- [ ] Mobile hamburger with slide-out drawer
- [ ] Active state indicators

### 3.2 Hero Section
- [ ] Full-width destination photography with dark overlay
- [ ] Headline: "Plan Every Leg of Your Journey Across India"
- [ ] Sub-headline: "From first-mile auto to intercity bus to last-mile metro — one intelligent plan"
- [ ] Trip search interface (origin, destination, date, passengers)
- [ ] Natural language input option
- [ ] Responsive imagery with `next/image` priority loading

### 3.3 Trip Search Interface
- [ ] Origin/Destination autocomplete with swap button
- [ ] Date picker with "tomorrow" quick select
- [ ] Arrival deadline vs departure preference toggle
- [ ] Passenger counter
- [ ] Budget input
- [ ] Preferences: Sleeper/Seater, AC/Non-AC, Accessibility, Luggage
- [ ] Primary CTA: "Plan My Journey"
- [ ] Recent searches chip row
- [ ] Popular routes quick-picks

### 3.4 Discovery Sections
- [ ] Popular Routes (carousel with route cards)
- [ ] Trending Destinations (image cards by region: North, South, East, West, NE)
- [ ] Travel Categories (Pilgrimage, Hill Stations, Beaches, Business Hubs)
- [ ] How RoamAgent Works (3-step: Describe → Validate → Book)
- [ ] Trust & Safety (deterministic engine, consent gate, sandbox)
- [ ] Corporate Travel CTA
- [ ] FAQ accordion
- [ ] Comprehensive footer

---

## Phase 4: Search Results & Journey Timeline (Week 2-3)

### 4.1 Results Page Layout
- [ ] Sticky filter sidebar (mobile: bottom sheet)
- [ ] Results header: "X journeys found for [Origin] → [Destination] on [Date]"
- [ ] Sort: Recommended, Price, Duration, Departure, Arrival
- [ ] Filters: Price range, Departure window, Duration, Seat type, Amenities, Accessibility, Operator

### 4.2 Enhanced Itinerary Card
- [ ] Origin → Destination with times
- [ ] Total duration + fare prominently
- [ ] Leg-by-leg timeline with mode icons
- [ ] Transfer locations + buffer times
- [ ] Seat type + amenities badges
- [ ] Accessibility indicator
- [ ] Data source badge (Simulated / Live / Partner)
- [ ] Delay risk with tooltip
- [ ] Expand/collapse for full leg details
- [ ] Compare checkbox + compare bar
- [ ] Save/book actions

### 4.3 Journey Detail View (on expand)
- [ ] First-mile: operator, pickup, departure, vehicle type
- [ ] Intercity: operator, bus type, boarding/dropping points, duration
- [ ] Last-mile: mode options, estimated time/cost
- [ ] Fare breakdown: per-person × pax + vehicle × vehicles
- [ ] Assumptions & data freshness

### 4.4 States
- [ ] Loading skeletons (shimmer)
- [ ] Empty state: "No journeys found" with suggestions
- [ ] Error state with retry
- [ ] Infeasible notice with quick fixes

---

## Phase 5: AI Trust & Explainability (Week 3)

### 5.1 "Why This Journey?" Panel
- [ ] Arrival deadline validation ✓/✗
- [ ] Budget validation ✓/✗
- [ ] Transfer buffer validation ✓/✗
- [ ] Seat type match ✓/✗
- [ ] Accessibility check ✓/✗
- [ ] Data freshness & source
- [ ] Rejection reasons for invalid candidates
- [ ] Delay risk explanation with formula

### 5.2 Visual Trust Indicators
- [ ] Green checkmarks for passed validations
- [ ] Red warnings for tight constraints
- [ ] "Validated by deterministic engine" badge
- [ ] Source attribution per leg

---

## Phase 6: Multilingual Support (Week 3-4)

### 6.1 i18n Architecture
- [ ] Create `lib/i18n/` with locale dictionaries
- [ ] Supported languages: en, hi, ta, te, kn, ml, mr, bn
- [ ] RTL support preparation (for future Urdu)
- [ ] Number/currency/date formatting per locale
- [ ] Font loading for Indic scripts (Noto Sans for each)

### 6.2 Translation Coverage
- [ ] Navigation, forms, buttons, labels
- [ ] Error messages, empty states, toasts
- [ ] Consent modal, disruption panel
- [ ] Help content, FAQ
- [ ] AI explanations (backend + frontend)

### 6.3 Language Selector
- [ ] Visible in header with native script names
- [ ] Persist in localStorage + URL param
- [ ] No mixed translations fallback to English

---

## Phase 7: Destination Imagery & Carousels (Week 4)

### 7.1 Image Infrastructure
- [ ] Configure `next/image` with domains (Unsplash, Pexels, custom CDN)
- [ ] Image optimization: WebP/AVIF, responsive sizes
- [ ] Blur placeholders (base64 data URI)
- [ ] Error fallback component
- [ ] Attribution component

### 7.2 Components
- [ ] `DestinationCard`: image, name, state, route count, trending badge
- [ ] `HeroImage`: full-width, dark overlay, caption, credit
- [ ] `Carousel`: touch swipe, keyboard, arrows, pagination, auto-advance pause on hover
- [ ] `ImageGallery`: lightbox on click

### 7.3 Content
- [ ] Curate 50+ destination images (major cities + tourist spots)
- [ ] Regional collections: North (Delhi, Jaipur, Manali...), South (Bangalore, Chennai, Kerala...), East (Kolkata, Bhubaneswar...), West (Mumbai, Pune, Goa...), NE (Guwahati, Shillong...)
- [ ] No fake live views disclaimer

---

## Phase 8: Corporate Travel & Advanced Features (Week 4-5)

### 8.1 Corporate Area (separate route `/corporate`)
- [ ] Org selector (if multi-org)
- [ ] Travel policy builder (budget, class, advance booking)
- [ ] Team member management
- [ ] Trip approval workflow UI
- [ ] Travel history with filters
- [ ] Disruption notifications for team
- [ ] Reports: spend, CO2, policy compliance
- [ ] Export CSV/PDF

### 8.2 Enhanced Disruption Experience
- [ ] Visual timeline: original vs disrupted
- [ ] Affected segment highlight
- [ ] Alternative comparison table
- [ ] Cost/arrival delta badges
- [ ] One-click rebook with consent
- [ ] Reset demo action

---

## Phase 9: Testing & Polish (Week 5)

### 9.1 Test Coverage
- [ ] Unit: location search, i18n, formatters
- [ ] Integration: autocomplete → plan → book flow
- [ ] E2E: critical paths (search, book, disrupt, rebook)
- [ ] Visual regression: key components
- [ ] Accessibility: axe-core, keyboard nav, screen reader

### 9.2 Performance
- [ ] Bundle analysis
- [ ] Image optimization verification
- [ ] Core Web Vitals targets
- [ ] Mobile performance on low-end devices

### 9.3 Build & Deploy
- [ ] Production build passes
- [ ] TypeScript strict mode clean
- [ ] Lint clean
- [ ] Environment variables documented

---

## Backend API Extensions Needed

### New Endpoints:
```
GET  /api/locations/search?q=...&limit=10
GET  /api/locations/:id
GET  /api/coverage?origin=...&destination=...
GET  /api/destinations/popular?region=...
GET  /api/destinations/trending
GET  /api/routes/popular
GET  /api/corporate/policy
POST /api/corporate/policy
GET  /api/corporate/team
POST /api/corporate/team
GET  /api/corporate/trips
GET  /api/corporate/reports
```

### Data Files:
- `backend/data/locations.json` - 500+ Indian locations
- `backend/data/coverage.json` - corridor coverage matrix
- `backend/data/destinations.json` - curated destinations with images

---

## New Dependencies

### Frontend:
```bash
npm install @radix-ui/react-combobox @radix-ui/react-tabs @radix-ui/react-avatar
npm install embla-carousel-react  # or use motion for carousel
npm install date-fns  # for date formatting across locales
npm install @formatjs/intl-localematcher  # locale negotiation
```

### Backend:
```bash
pip install python-dateutil  # already there
pip install geopy  # for geocoding if using OSM
# OR use external API (Mapbox, Google Places) with server-side keys
```

---

## File Structure Changes

### New Frontend Files:
```
frontend/
├── app/
│   ├── layout.tsx (enhanced)
│   ├── page.tsx (new homepage)
│   ├── search/
│   │   └── page.tsx (results page)
│   ├── journey/
│   │   └── [id]/page.tsx (detail view)
│   ├── corporate/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── policy/page.tsx
│   │   ├── team/page.tsx
│   │   ├── trips/page.tsx
│   │   └── reports/page.tsx
│   └── api/ (if using Next.js API routes for proxy)
├── components/
│   ├── ui/
│   │   ├── Autocomplete.tsx
│   │   ├── Carousel.tsx
│   │   ├── Image.tsx
│   │   ├── Avatar.tsx
│   │   ├── DataTable.tsx
│   │   ├── Tabs.tsx
│   │   └── Toast.tsx (sonner wrapper)
│   ├── layout/
│   │   ├── Header.tsx (enhanced)
│   │   ├── Footer.tsx
│   │   ├── MegaMenu.tsx
│   │   └── MobileDrawer.tsx
│   ├── homepage/
│   │   ├── Hero.tsx
│   │   ├── TripSearch.tsx
│   │   ├── PopularRoutes.tsx
│   │   ├── DestinationCarousel.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── TrustBadges.tsx
│   │   └── CorporateCTA.tsx
│   ├── search/
│   │   ├── ResultsHeader.tsx
│   │   ├── FilterSidebar.tsx
│   │   ├── ItineraryCard.tsx (enhanced)
│   │   ├── JourneyTimeline.tsx
│   │   ├── TrustPanel.tsx
│   │   └── CompareBar.tsx
│   └── corporate/
│       ├── OrgSelector.tsx
│       ├── PolicyBuilder.tsx
│       ├── TeamManager.tsx
│       ├── TripApprovals.tsx
│       └── Reports.tsx
├── lib/
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── locales/
│   │   │   ├── en.json
│   │   │   ├── hi.json
│   │   │   ├── ta.json
│   │   │   ├── te.json
│   │   │   ├── kn.json
│   │   │   ├── ml.json
│   │   │   ├── mr.json
│   │   │   └── bn.json
│   │   └── utils.ts
│   ├── locations/
│   │   ├── types.ts
│   │   ├── registry.ts
│   │   └── hooks.ts
│   └── utils/
│       ├── formatters.ts
│       └── constants.ts
```

### New Backend Files:
```
backend/
├── app/
│   ├── api/
│   │   ├── locations.py
│   │   ├── coverage.py
│   │   ├── destinations.py
│   │   └── corporate.py
│   ├── services/
│   │   ├── geocoding.py
│   │   └── coverage_registry.py
│   └── data/
│       ├── locations.json
│       ├── coverage.json
│       └── destinations.json
```

---

## Execution Order (This Session)

1. **Phase 1.1-1.3**: Enhanced design tokens + core primitives
2. **Phase 2.1-2.2**: Location types + geocoding service (frontend + backend)
3. **Phase 3.1-3.4**: Homepage redesign
4. **Phase 4.1-4.4**: Search results page
5. **Phase 5**: AI trust panel
6. **Phase 6**: Multilingual (8 languages)
7. **Phase 7**: Image components + destination data
8. **Phase 8**: Corporate area
9. **Phase 9**: Tests + build verification

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| No geocoding API key | Use OSM Nominatim (free, rate-limited) + static fallback dataset |
| Large image bandwidth | Use `next/image` optimization, WebP, blur placeholders, lazy loading |
| i18n maintenance burden | Organize translations in JSON, use CI to check completeness |
| Backend data scope | Be honest about coverage - show "Live schedules not available" for unsupported routes |
| Mobile performance | Test on low-end Android, reduce motion, optimize bundle |

---

## Success Criteria

- [ ] Production build passes with no TypeScript/ESLint errors
- [ ] Homepage loads < 2.5s LCP on 3G
- [ ] Search → Results → Book flow works end-to-end
- [ ] Disruption simulation works with real backend replanning
- [ ] 8 languages switch without mixed content
- [ ] Mobile layout stable (no CLS > 0.1)
- [ ] Accessibility score > 95 (axe-core)
- [ ] All existing tests pass + new tests added