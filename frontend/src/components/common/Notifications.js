import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import './Notifications.css';

const Notifications = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="notifications-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
          onClick={() => removeNotification(notification.id)}
        >
          <span className="notification-icon">
            {notification.type === 'success' && '✅'}
            {notification.type === 'error' && '❌'}
            {notification.type === 'warning' && '⚠️'}
            {notification.type === 'info' && 'ℹ️'}
          </span>
          <span className="notification-message">{notification.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Notifications;