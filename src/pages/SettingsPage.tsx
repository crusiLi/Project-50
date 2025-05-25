import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  DarkMode,
  LightMode,
  Logout,
  Person,
  Info,
  ArrowBack
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import { logout, getCurrentUser } from '../utils/auth';
import ProjectLogo from '../components/ProjectLogo';

// 样式组件
const SettingsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 1),
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3, 2),
    paddingBottom: theme.spacing(12),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(12),
  },
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
    : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  minHeight: '100vh'
}));

const SettingsCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0,0,0,0.3)'
    : '0 8px 32px rgba(0,0,0,0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: theme.palette.mode === 'dark'
    ? 'rgba(30, 30, 30, 0.95)'
    : 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 255, 255, 0.2)'}`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 48px rgba(0,0,0,0.4)'
      : '0 12px 48px rgba(0,0,0,0.15)',
  },
}));

const HeaderCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: 16,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0,0,0,0.3)'
    : '0 8px 32px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
    `,
    pointerEvents: 'none',
  },
}));

const StyledSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: `${theme.palette.primary.main}14`,
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: theme.palette.primary.main,
  },
}));

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <SettingsContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 头部 */}
        <HeaderCard>
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Button
                onClick={handleBack}
                sx={{ 
                  color: 'white', 
                  minWidth: 'auto', 
                  p: 1, 
                  mr: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <ArrowBack />
              </Button>
              <ProjectLogo size="small" showText={false} />
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                sx={{ 
                  ml: 2,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                }}
              >
                <Settings sx={{ mr: 1, verticalAlign: 'middle' }} />
                设置
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" mt={3}>
              <Avatar 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  mr: 2,
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 }
                }}
              >
                <Person sx={{ fontSize: { xs: 24, sm: 28 } }} />
              </Avatar>
              <Box>
                <Typography 
                  variant="h6" 
                  fontWeight={600}
                  sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                  {currentUser}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.9,
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  50天挑战参与者
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </HeaderCard>

        {/* 外观设置 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <SettingsCard sx={{ mb: 3 }}>
            <CardContent>
              <Typography 
                variant="h6" 
                gutterBottom 
                fontWeight={600}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                {isDarkMode ? <DarkMode sx={{ mr: 1 }} /> : <LightMode sx={{ mr: 1 }} />}
                外观设置
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    {isDarkMode ? <DarkMode /> : <LightMode />}
                  </ListItemIcon>
                  <ListItemText 
                    primary="深色模式" 
                    secondary={isDarkMode ? "当前使用深色主题" : "当前使用浅色主题"}
                    primaryTypographyProps={{
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                    secondaryTypographyProps={{
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  />
                  <ListItemSecondaryAction>
                    <FormControlLabel
                      control={
                        <StyledSwitch
                          checked={isDarkMode}
                          onChange={toggleTheme}
                        />
                      }
                      label=""
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              
              <Alert 
                severity="info" 
                sx={{ 
                  mt: 2, 
                  borderRadius: 2,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                主题设置会自动保存，下次打开应用时会记住您的选择
              </Alert>
            </CardContent>
          </SettingsCard>
        </motion.div>

        {/* 账户设置 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SettingsCard sx={{ mb: 3 }}>
            <CardContent>
              <Typography 
                variant="h6" 
                gutterBottom 
                fontWeight={600}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                <Person sx={{ mr: 1 }} />
                账户设置
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText 
                    primary="当前用户" 
                    secondary={currentUser}
                    primaryTypographyProps={{
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                    secondaryTypographyProps={{
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  />
                </ListItem>
                
                <Divider sx={{ my: 1 }} />
                
                <ListItem>
                  <ListItemIcon>
                    <Logout color="error" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="退出登录" 
                    secondary="退出当前账户"
                    primaryTypographyProps={{
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                    secondaryTypographyProps={{
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleLogout}
                      size="small"
                      sx={{ 
                        borderRadius: 2,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        px: { xs: 2, sm: 3 }
                      }}
                    >
                      退出
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </SettingsCard>
        </motion.div>

        {/* 关于信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <SettingsCard>
            <CardContent>
              <Typography 
                variant="h6" 
                gutterBottom 
                fontWeight={600}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                <Info sx={{ mr: 1 }} />
                关于应用
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Project-50" 
                    secondary="50天习惯养成挑战应用"
                    primaryTypographyProps={{
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                    secondaryTypographyProps={{
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="版本" 
                    secondary="v2.0.0"
                    primaryTypographyProps={{
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                    secondaryTypographyProps={{
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="开发团队" 
                    secondary="Project-50 AI Team"
                    primaryTypographyProps={{
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                    secondaryTypographyProps={{
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </SettingsCard>
        </motion.div>
      </motion.div>
    </SettingsContainer>
  );
};

export default SettingsPage; 