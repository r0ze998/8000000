import React, { useState, useEffect } from 'react';
import { NotificationProvider } from './contexts/NotificationContext';
import Notifications from './components/common/Notifications';

// Core Components
import BottomNavigation from './components/BottomNavigation';
import { SakuraParticles, LightParticles } from './components/ParticleEffects';
import SeasonalEffects from './components/SeasonalEffects';
import SimpleAudioToggle from './components/SimpleAudioToggle';
import WalletConnection from './components/WalletConnection';
import AccountStatus from './components/AccountStatus';
import PlayerStatus from './components/PlayerStatus';
import CulturalBelt from './components/CulturalBelt';

// Tab Components
import HomeTab from './components/HomeTab';
import VisitTab from './components/VisitTab';
import ExploreTab from './components/ExploreTab';
import LearnTab from './components/LearnTab';
import ProfileTab from './components/ProfileTab';

// Shrine Components
import ShrineSelector from './components/ShrineSelector';
import VisitVerification from './components/VisitVerification';
import ShrineSetup from './components/ShrineSetup';

// Modal Components  
import ActivityModal from './components/ActivityModal';

// Hooks
import { useShrine } from './hooks/useShrine';

// Styles
import './App.css';
import './ShrineVillage.css';

function ShrineVillageApp() {
  // Core State
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Shrine State
  const {
    shrine: myShrine,
    showShrineSetup,
    selectedShrine,
    setSelectedShrine,
    handleShrineCreated,
    updateShrine
  } = useShrine();
  
  // Modal States
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showShrineSelector, setShowShrineSelector] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [visitProof, setVisitProof] = useState(null);
  
  // User State
  const [userProfile, setUserProfile] = useState({
    name: '巡礼者',
    level: 1,
    culturalCapital: 0,
    belt: 'white',
    stats: {
      totalVisits: 0,
      uniqueShrines: 0,
      culturalActivities: 0,
      daysActive: 0
    }
  });
  
  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null,
    error: null
  });
  
  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null
          });
        },
        (error) => {
          setUserLocation(prev => ({ ...prev, error: error.message }));
        }
      );
    }
  }, []);

  // Handlers
  const handleActivityComplete = (activity, proof) => {
    setSelectedActivity(null);
    setShowActivityModal(false);
    
    // Update user profile
    setUserProfile(prev => ({
      ...prev,
      culturalCapital: prev.culturalCapital + (activity.culturalCapital || 0),
      stats: {
        ...prev.stats,
        culturalActivities: prev.stats.culturalActivities + 1
      }
    }));
    
    // Update shrine if applicable
    if (myShrine) {
      updateShrine({
        ...myShrine,
        level: myShrine.level + (activity.experienceGain || 0)
      });
    }
  };
  
  const handleShrineSelect = (shrine) => {
    setSelectedShrine(shrine);
    setShowShrineSelector(false);
  };
  
  const handleActivityStart = (activity) => {
    setSelectedActivity(activity);
    setShowActivityModal(true);
  };
  
  const handleEventJoin = (event) => {
    // Handle event participation
    console.log('Joining event:', event);
  };

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeTab
            userProfile={userProfile}
            userLocation={userLocation}
            onShrineSelect={handleShrineSelect}
            onActivityStart={handleActivityStart}
            onEventJoin={handleEventJoin}
          />
        );
        
      case 'visit':
        return (
          <VisitTab
            userLocation={userLocation}
            userProfile={userProfile}
            onShrineSelect={() => setShowShrineSelector(true)}
            selectedShrine={selectedShrine}
            setSelectedShrine={setSelectedShrine}
            isVerifying={isVerifying}
            setIsVerifying={setIsVerifying}
            visitProof={visitProof}
            setVisitProof={setVisitProof}
          />
        );
        
      case 'explore':
        return (
          <ExploreTab
            userLocation={userLocation}
            userProfile={userProfile}
          />
        );
        
      case 'learn':
        return (
          <LearnTab
            userProfile={userProfile}
            onLearningComplete={(capital) => {
              setUserProfile(prev => ({
                ...prev,
                culturalCapital: prev.culturalCapital + capital
              }));
            }}
          />
        );
        
      case 'profile':
        return (
          <ProfileTab
            userProfile={userProfile}
            userStats={{
              totalVisits: userProfile.stats.totalVisits,
              uniqueShrines: userProfile.stats.uniqueShrines,
              culturalActivities: userProfile.stats.culturalActivities,
              achievements: []
            }}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <NotificationProvider>
      <div className="shrine-village-app">
        {/* Background Effects */}
        <div className="background-effects">
          <SeasonalEffects />
          <SakuraParticles />
          <LightParticles color="#FFD700" count={30} />
        </div>

        {/* Header */}
        <header className="app-header">
          <div className="header-content">
            <div className="header-left">
              <SimpleAudioToggle />
            </div>
            <div className="header-center">
              <h1 className="app-title">8000000</h1>
              <CulturalBelt belt={userProfile.belt} size="small" />
            </div>
            <div className="header-right">
              <AccountStatus isConnected={isAuthenticated} />
              <WalletConnection 
                onConnect={() => setIsAuthenticated(true)}
                onDisconnect={() => setIsAuthenticated(false)}
              />
            </div>
          </div>
          <PlayerStatus
            level={userProfile.level}
            culturalCapital={userProfile.culturalCapital}
            belt={userProfile.belt}
          />
        </header>

        {/* Main Content */}
        <main className="app-main">
          {renderTabContent()}
        </main>

        {/* Bottom Navigation */}
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Modals */}
        {showShrineSetup && (
          <ShrineSetup
            onShrineCreated={handleShrineCreated}
            onClose={() => {}}
          />
        )}

        {showShrineSelector && (
          <ShrineSelector
            onSelectShrine={handleShrineSelect}
            onClose={() => setShowShrineSelector(false)}
            userLocation={userLocation}
          />
        )}

        {selectedShrine && isVerifying && (
          <VisitVerification
            shrine={selectedShrine}
            onVerificationComplete={(proof) => {
              setVisitProof(proof);
              setIsVerifying(false);
              
              // Update user stats
              setUserProfile(prev => ({
                ...prev,
                stats: {
                  ...prev.stats,
                  totalVisits: prev.stats.totalVisits + 1,
                  uniqueShrines: prev.stats.uniqueShrines + 1
                }
              }));
            }}
            onClose={() => {
              setIsVerifying(false);
              setSelectedShrine(null);
            }}
            userLocation={userLocation}
          />
        )}

        {showActivityModal && selectedActivity && (
          <ActivityModal
            activity={selectedActivity}
            onComplete={handleActivityComplete}
            onClose={() => {
              setShowActivityModal(false);
              setSelectedActivity(null);
            }}
          />
        )}

        {/* Notifications */}
        <Notifications />
      </div>
    </NotificationProvider>
  );
}

export default ShrineVillageApp;