# 8000000 Architecture

## Overview

This project implements a clean, scalable architecture for the 8000000 shrine visit tracking application.

## Architecture Principles

### 1. **Monorepo Structure**
- `apps/` - Application implementations
- `packages/` - Shared libraries and contracts
- Clear separation of concerns

### 2. **Feature-Driven Development**
- Domain-based organization
- Independent feature modules
- Minimal inter-dependencies

### 3. **Technology Stack**

#### Frontend (`apps/web/`)
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **PWA**: Service Workers + Manifest
- **State**: React Context API
- **Routing**: React Router

#### Mobile (`apps/mobile/`)
- **Framework**: Capacitor
- **Platforms**: iOS + Android
- **Native APIs**: Geolocation, Camera, Notifications

#### Smart Contracts (`packages/contracts/`)
- **Blockchain**: Starknet
- **Language**: Cairo
- **Features**: NFT minting, visit tracking, cultural capital

#### Shared (`packages/`)
- **Types**: TypeScript definitions
- **Utils**: Common utilities
- **Config**: Environment management

## Directory Structure

```
8000000/
├── apps/
│   ├── web/          # React PWA
│   └── mobile/       # Capacitor config
├── packages/
│   ├── contracts/    # Cairo smart contracts
│   ├── shared/       # Shared utilities
│   └── types/        # TypeScript types
├── docs/             # Documentation
└── scripts/          # Build/deploy scripts
```

## Design Patterns

### 1. **Clean Architecture**
- **Presentation**: React components
- **Application**: Hooks and context
- **Domain**: Business logic
- **Infrastructure**: Services and APIs

### 2. **Feature Modules**
- **Shrine**: Temple/shrine management
- **Visit**: Visit tracking and verification
- **Reward**: Goshuin NFTs and rewards
- **Community**: Village and social features
- **Profile**: User profiles and rankings

### 3. **State Management**
- React Context for global state
- Custom hooks for business logic
- Local state for UI components

## Development Workflow

1. **Local Development**: `npm run dev`
2. **Type Checking**: `npm run type-check`
3. **Testing**: `npm run test`
4. **Building**: `npm run build`
5. **Deployment**: Automated via GitHub Actions

## Security Considerations

- Environment variable validation
- Wallet connection security
- Location data privacy
- Smart contract auditing

## Performance Optimizations

- Code splitting by features
- PWA caching strategies
- Image optimization
- Bundle size monitoring