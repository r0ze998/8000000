# Refactoring Plan for 8000000 App

## 1. Unused Components to Remove
Based on analysis, the following components are not used in the main app:

### Completely Unused:
- `ActivityIcons.js` - Icons are used inline
- `AudioControls.js` - Replaced by SimpleAudioToggle
- `AudioSetupGuide.js` - No longer needed
- `BuildingPalette.js` - Not used in current implementation
- `ResourcePanel.js` - Resources shown differently
- `ShrineGraphics.js` - Graphics handled inline
- `SpecialEvents.js` - Events handled in tabs

### Unused Game Components:
- `GameCanvas.js` - Game features not implemented
- `ShrineView.js` - View handled in tabs
- `VillageBuilder.js` - Village building not active
- `CollectionSystem.js` - Collections in ProfileTab
- `GoshuinchoCollection.js` - Integrated into ProfileTab
- `VillageMembersSection.js` - Community features removed
- `NFTCollection.js` - NFT display in ProfileTab

### Unused CSS Files:
- `MyShrineTab.css` - Tab doesn't exist
- `CommunityTab.css` - Tab doesn't exist  
- `EventsTab.css` - Tab doesn't exist

## 2. Components to Reorganize

### Move to /auth:
- `WalletConnection.js`
- `AccountStatus.js`

### Move to /shrine:
- `ShrineSelector.js`
- `ShrineSetup.js`
- `VisitVerification.js`

### Move to /tabs:
- `HomeTab.js`
- `VisitTab.js`
- `ExploreTab.js`
- `LearnTab.js`
- `ProfileTab.js`

### Move to /effects:
- `ParticleEffects.js`
- `SeasonalEffects.js`

### Move to /audio:
- `SimpleAudioToggle.js`

### Move to /modals:
- `ActivityModal.js`

## 3. Services to Consolidate

### Create single audio service:
- Merge multiple audio implementations
- Create `useAudio` hook

### Create notification service:
- Replace duplicate notification code
- Use NotificationContext everywhere

## 4. Large Components to Split

### IncentiveEngine.js (792 lines):
- `ValueCalculator.js` - Calculation logic
- `StakeholderBalance.js` - Balance management
- `IncentiveUI.js` - UI components

### TourismIntegration.js (694 lines):
- `TourismRoutes.js` - Route planning
- `LocalSpots.js` - Spot management
- `TourismStats.js` - Analytics

### CulturalCapitalSystem.js (633 lines):
- `CulturalProfile.js` - User profile
- `KnowledgeBase.js` - Learning content
- `CulturalStats.js` - Statistics

## 5. Code Quality Improvements

### Consistent patterns:
- Use arrow functions consistently
- Standardize prop destructuring
- Use TypeScript for better type safety

### Performance optimizations:
- Add React.memo to pure components
- Use useMemo for expensive calculations
- Lazy load heavy components

### State management:
- Consider Redux or Zustand for global state
- Extract complex state logic to custom hooks
- Reduce prop drilling with Context

## 6. File Structure After Refactoring

```
/src
  /components
    /common
      - Button.js
      - Card.js
      - Modal.js
      - Notifications.js
      - Loading.js
    /auth
      - WalletConnection.js
      - AccountStatus.js
    /shrine
      - ShrineSelector.js
      - ShrineSetup.js
      - VisitVerification.js
    /tabs
      - HomeTab.js
      - VisitTab.js
      - ExploreTab.js
      - LearnTab.js
      - ProfileTab.js
    /effects
      - ParticleEffects.js
      - SeasonalEffects.js
    /audio
      - SimpleAudioToggle.js
    /modals
      - ActivityModal.js
    /features
      - CulturalBelt.js
      - PlayerStatus.js
      - BottomNavigation.js
      - OmikujiSystem.js
  /contexts
    - NotificationContext.js
    - AudioContext.js
    - UserContext.js
  /hooks
    - useShrine.js
    - useNotification.js
    - useAudio.js
    - useUser.js
  /services
    - audioService.js
    - nftMinting.js
    - verificationService.js
  /utils
    - constants.js
    - helpers.js
  /styles
    - variables.css
    - mixins.css
```

## 7. Implementation Steps

1. **Phase 1**: Remove unused files
2. **Phase 2**: Create common components
3. **Phase 3**: Reorganize file structure
4. **Phase 4**: Split large components
5. **Phase 5**: Update imports
6. **Phase 6**: Test everything works
7. **Phase 7**: Optimize performance