import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';

// 检测是否在移动设备上运行
export const isNativePlatform = () => {
  return Capacitor.isNativePlatform();
};

// 获取平台信息
export const getPlatform = () => {
  return Capacitor.getPlatform();
};

// 状态栏管理
export const updateStatusBar = async (isDark: boolean) => {
  if (isNativePlatform()) {
    try {
      await StatusBar.setStyle({
        style: isDark ? Style.Dark : Style.Light
      });
    } catch (error) {
      console.warn('StatusBar not available:', error);
    }
  }
};

// 启动画面管理
export const hideSplashScreen = async () => {
  if (isNativePlatform()) {
    try {
      await SplashScreen.hide();
    } catch (error) {
      console.warn('SplashScreen not available:', error);
    }
  }
};

// 键盘管理
export const setupKeyboard = () => {
  if (isNativePlatform()) {
    try {
      // 键盘显示时的处理
      Keyboard.addListener('keyboardWillShow', info => {
        document.body.style.paddingBottom = `${info.keyboardHeight}px`;
      });

      // 键盘隐藏时的处理
      Keyboard.addListener('keyboardWillHide', () => {
        document.body.style.paddingBottom = '0px';
      });
    } catch (error) {
      console.warn('Keyboard not available:', error);
    }
  }
};

// 获取API基础URL
export const getApiBaseUrl = () => {
  if (isNativePlatform()) {
    // 移动端首先尝试本地网络地址，如果失败则使用离线模式
    // 您可以将这里替换为您的实际服务器地址
    return 'http://10.153.218.239:3001/api'; // 您的电脑IP地址
  }
  // 开发环境使用localhost
  return 'http://localhost:3001/api';
};

// 检查网络连接
export const checkNetworkConnection = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(getApiBaseUrl() + '/health', {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn('Network check failed:', error);
    return false;
  }
};

// 移动端初始化
export const initializeMobileApp = async () => {
  if (isNativePlatform()) {
    console.log('Initializing mobile app with embedded backend...');
    
    // 设置键盘
    setupKeyboard();
    
    // 初始化本地API（嵌入式后端）
    try {
      const { apiAdapter } = await import('./apiAdapter');
      await apiAdapter.initialize();
      console.log('Embedded backend initialized successfully');
    } catch (error) {
      console.error('Failed to initialize embedded backend:', error);
    }
    
    // 初始化离线数据（备用）
    try {
      const { initializeOfflineData } = await import('./offlineData');
      await initializeOfflineData();
    } catch (error) {
      console.error('Failed to initialize offline data:', error);
    }
    
    // 延迟隐藏启动画面
    setTimeout(async () => {
      await hideSplashScreen();
    }, 2500); // 增加到2.5秒，给嵌入式后端更多初始化时间
  }
}; 