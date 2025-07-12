import React from 'react';
import './BreathingGuide.css';

interface BreathingGuideProps {
  phase: 'inhale' | 'hold' | 'exhale';
  timer: number;
  timeRemaining: number;
  selectedDuration: number;
}

const BreathingGuide: React.FC<BreathingGuideProps> = ({ 
  phase, 
  timer, 
  timeRemaining, 
  selectedDuration 
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseInstruction = (phase: string) => {
    switch (phase) {
      case 'inhale': return '心を清めて';
      case 'hold': return '感謝を込めて';
      case 'exhale': return '祈りを捧げて';
      default: return '';
    }
  };



  return (
    <div className="prayer-circle">
      <div className={`breathing-guide ${phase}`}>
        <div className="timer-display">
          {formatTime(timeRemaining)}
        </div>
        <div className="prayer-instruction">
          {getPhaseInstruction(phase)}
        </div>
        <div className="breathing-count">{timer}</div>
      </div>
      <div className="session-info">
        <div className="current-session">
          <span>⏱️ {formatTime(selectedDuration - timeRemaining)} / {formatTime(selectedDuration)}</span>
        </div>
      </div>
    </div>
  );
};

export default BreathingGuide;