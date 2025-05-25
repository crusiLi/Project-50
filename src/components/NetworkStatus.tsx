import React, { useState, useEffect } from 'react';
import { Alert, Box, Chip } from '@mui/material';
import { Wifi, WifiOff, Refresh, Storage } from '@mui/icons-material';
import { useNetwork } from '../contexts/NetworkContext';
import { isNativePlatform } from '../utils/capacitor';
import { authAdapter } from '../utils/authAdapter';

const NetworkStatus: React.FC = () => {
  const { isOnline, isLoading, checkConnection } = useNetwork();
  const [apiMode, setApiMode] = useState<string>('');

  useEffect(() => {
    // 获取API模式信息
    const updateApiMode = () => {
      try {
        const mode = authAdapter.getAPIMode();
        setApiMode(mode);
      } catch (error) {
        setApiMode('Unknown');
      }
    };

    updateApiMode();
    const interval = setInterval(updateApiMode, 5000); // 每5秒更新一次

    return () => clearInterval(interval);
  }, []);

  // 只在移动端显示网络状态
  if (!isNativePlatform()) {
    return null;
  }

  const isEmbedded = apiMode.includes('Embedded');

  return (
    <Box sx={{ position: 'fixed', top: 8, left: 8, zIndex: 1000 }}>
      {isLoading ? (
        <Chip
          icon={<Refresh sx={{ animation: 'spin 1s linear infinite' }} />}
          label="初始化中..."
          size="small"
          color="default"
          variant="outlined"
        />
      ) : (
        <Chip
          icon={isEmbedded ? <Storage /> : (isOnline ? <Wifi /> : <WifiOff />)}
          label={isEmbedded ? '嵌入式后端' : (isOnline ? '在线' : '离线模式')}
          size="small"
          color={isEmbedded ? 'primary' : (isOnline ? 'success' : 'warning')}
          variant={isEmbedded ? 'filled' : (isOnline ? 'outlined' : 'filled')}
          onClick={checkConnection}
          sx={{
            cursor: 'pointer',
            '& .MuiChip-icon': {
              color: isEmbedded ? 'primary.contrastText' : (isOnline ? 'success.main' : 'warning.contrastText')
            }
          }}
        />
      )}
      
      {isEmbedded && (
        <Alert 
          severity="success" 
          sx={{ 
            mt: 1, 
            fontSize: '0.75rem',
            '& .MuiAlert-message': {
              padding: '2px 0'
            }
          }}
        >
          使用嵌入式后端：完全离线运行
        </Alert>
      )}
      
      {!isOnline && !isEmbedded && (
        <Alert 
          severity="info" 
          sx={{ 
            mt: 1, 
            fontSize: '0.75rem',
            '& .MuiAlert-message': {
              padding: '2px 0'
            }
          }}
        >
          离线模式：数据仅保存在本地
        </Alert>
      )}
    </Box>
  );
};

export default NetworkStatus; 