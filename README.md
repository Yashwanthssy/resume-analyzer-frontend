# ResumeAI Frontend

The client-side application built with Angular 17. This was my first project using Angular's new standalone components API, and I'm really happy with how clean the code turned out.

## Why Angular 17?

I chose Angular 17 specifically to work with:
- **Standalone Components** - No more NgModules! Much simpler mental model
- **Signals** - Built-in reactive state management without RxJS complexity
- **Improved DX** - Better error messages and faster compilation

## Design Approach

I built the entire UI from scratch without any component libraries (no Material, no Bootstrap). This gave me:
- Complete control over styling and animations
- Smaller bundle size
- Better understanding of CSS and responsive design
- A unique look that stands out

The design is inspired by modern SaaS products like Linear and Vercel - clean, minimal, with subtle animations.

## Development Setup

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Build for production
npm run build
```

The app will be available at `http://localhost:4200`

## Architecture Decisions

### Standalone Components
Every component is standalone - no feature modules needed. This makes the code more portable and easier to understand.

### Signals for State
I used Angular signals instead of RxJS for local component state. Much simpler for this use case:
```typescript
selectedFile = signal<File | null>(null);
isLoading = signal(false);
```

### Service Layer
All API calls go through a single `ResumeService`. This makes it easy to:
- Mock for testing
- Add caching later
- Handle errors consistently

### Routing
Using lazy-loaded routes to keep initial bundle small:
```typescript
{
  path: 'analyzer',
  loadComponent: () => import('./pages/analyzer/...')
}
```

## Component Structure

```
app/
├── pages/              # Route-level components
│   ├── analyzer/       # Main upload & analysis page
│   ├── history/        # List of past analyses
│   └── history-detail/ # Individual analysis view
├── shared/
│   └── components/     # Reusable UI components
│       ├── navbar/     # Top navigation
│       └── score-ring/ # Animated score visualization
└── core/
    ├── models/         # TypeScript interfaces
    └── services/       # API communication
```

## Styling System

Built a custom design system using CSS variables:
- Consistent spacing and sizing
- Color palette with semantic names
- Reusable animation keyframes
- Mobile-first responsive breakpoints

All styles are scoped to components - no global CSS pollution.

## Key Features

### Drag & Drop Upload
Custom implementation with visual feedback:
- Hover state when dragging over
- File validation (PDF only, max 5MB)
- Preview with file info

### Animated Score Ring
SVG-based circular progress indicator:
- Smooth animation on load
- Color-coded by score (green/amber/red)
- Responsive sizing

### History Management
Full CRUD operations:
- Grid layout with cards
- Delete with confirmation
- Click to view details
- Empty state handling

## Performance Considerations

- Lazy-loaded routes
- OnPush change detection (where applicable)
- Minimal dependencies
- Optimized images and assets
- No unnecessary re-renders

## Browser Support

Tested on:
- Chrome 120+
- Firefox 120+
- Safari 17+
- Edge 120+

## Environment Configuration

Update `src/environments/environment.ts` to point to your backend:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

## What I Learned

- Angular's new APIs are a huge improvement
- Signals make state management intuitive
- Building custom UI is more work but worth it
- TypeScript strict mode catches so many bugs
- SCSS variables + CSS custom properties = powerful combo

## Future Improvements

Some things I'd like to add:
- [ ] Skeleton loaders for better perceived performance
- [ ] Optimistic UI updates
- [ ] Service worker for offline support
- [ ] More animations and transitions
- [ ] Dark mode toggle
