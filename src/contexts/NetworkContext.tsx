import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkNetworkConnection, isNativePlatform } from '../utils/capacitor';
import { offlineAPI } from '../utils/offlineData';

interface NetworkContextType {
  isOnline: boolean;
  isLoading: boolean;
  checkConnection: () => Promise<void>;
  api: any; // 根据网络状态返回在线或离线API
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const checkConnection = async () => {
    if (isNativePlatform()) {
      setIsLoading(true);
      try {
        const online = await checkNetworkConnection();
        setIsOnline(online);
        console.log('Network check result:', online ? 'Online' : 'Offline');
      } catch (error) {
        console.error('Network check failed:', error);
        setIsOnline(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Web环境默认在线
      setIsOnline(navigator.onLine);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 初始检查
    checkConnection();

    // 监听网络状态变化（Web环境）
    if (!isNativePlatform()) {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    // 移动端定期检查网络状态
    if (isNativePlatform()) {
      const interval = setInterval(checkConnection, 30000); // 每30秒检查一次
      return () => clearInterval(interval);
    }
  }, []);

  // 根据网络状态返回相应的API
  const api = isOnline ? null : offlineAPI; // 在线时返回null，让组件使用正常的API调用

  const value = {
    isOnline,
    isLoading,
    checkConnection,
    api
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
}; 