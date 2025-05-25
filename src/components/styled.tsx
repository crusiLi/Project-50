import { styled } from '@mui/material/styles';
import { Box, Paper, LinearProgress, Button } from '@mui/material';

// 渐变背景容器
export const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
    `,
    zIndex: 0,
  },
}));

// 优雅的纸张容器
export const ElegantPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 24,
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(20px)',
  background: 'rgba(255, 255, 255, 0.95)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
  },
}));

// 样式化的打卡项目
export const StyledPunchItem = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  borderRadius: 16,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  textTransform: 'none',
  justifyContent: 'flex-start',
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    transform: 'translateY(-2px)',
    borderColor: theme.palette.primary.main,
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  // 响应式样式
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    borderRadius: 12,
    fontSize: '0.875rem',
  },
}));

// 样式化的进度条
export const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: 'rgba(0, 0, 0, 0.08)',
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
  },
  // 响应式样式
  [theme.breakpoints.down('sm')]: {
    height: 8,
    borderRadius: 4,
    '& .MuiLinearProgress-bar': {
      borderRadius: 4,
    },
  },
}));

// 响应式容器
export const ResponsiveContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '100%',
  padding: theme.spacing(0, 2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 1),
  },
}));

// 响应式卡片
export const ResponsiveCard = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(3),
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  },
  [theme.breakpoints.down('sm')]: {
    borderRadius: 12,
    padding: theme.spacing(2),
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
}));

// 响应式文本
export const ResponsiveTypography = styled('div')(({ theme }) => ({
  '& .title': {
    fontSize: '2.5rem',
    fontWeight: 300,
    [theme.breakpoints.down('md')]: {
      fontSize: '2rem',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.75rem',
    },
  },
  '& .subtitle': {
    fontSize: '1.25rem',
    fontWeight: 400,
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.1rem',
    },
  },
  '& .body': {
    fontSize: '1rem',
    lineHeight: 1.6,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  '& .caption': {
    fontSize: '0.875rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.75rem',
    },
  },
}));

// 响应式网格间距
export const getResponsiveSpacing = (theme: any) => ({
  xs: theme.spacing(1),
  sm: theme.spacing(2),
  md: theme.spacing(3),
  lg: theme.spacing(4),
});

// 响应式字体大小
export const getResponsiveFontSize = (base: number) => ({
  xs: `${base * 0.875}rem`,
  sm: `${base}rem`,
  md: `${base * 1.125}rem`,
});

// 响应式边距
export const getResponsiveMargin = (theme: any) => ({
  xs: theme.spacing(1),
  sm: theme.spacing(2),
  md: theme.spacing(3),
});

// 响应式内边距
export const getResponsivePadding = (theme: any) => ({
  xs: theme.spacing(1),
  sm: theme.spacing(2),
  md: theme.spacing(3),
}); 