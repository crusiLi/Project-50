import { styled, keyframes } from '@mui/material/styles';
import { Box, Paper, LinearProgress, Button } from '@mui/material';

// 动画关键帧
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
`;

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

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

// 增强的毛玻璃纸张容器
export const ElegantPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 20,
  boxShadow: `
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.6)
  `,
  backdropFilter: 'blur(24px) saturate(180%)',
  background: 'rgba(255, 255, 255, 0.85)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `
      0 16px 48px rgba(0, 0, 0, 0.15),
      0 4px 24px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.7)
    `,
  },
}));

// 增强的打卡项目样式
export const StyledPunchItem = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2.5),
  borderRadius: 16,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  boxShadow: `
    0 4px 16px rgba(0, 0, 0, 0.06),
    0 1px 4px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8)
  `,
  backdropFilter: 'blur(12px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  textTransform: 'none',
  justifyContent: 'flex-start',
  color: theme.palette.text.primary,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-200px',
    width: '200px',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
    transition: 'left 0.6s',
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    boxShadow: `
      0 8px 24px rgba(0, 0, 0, 0.1),
      0 2px 8px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.9)
    `,
    transform: 'translateY(-3px) scale(1.02)',
    borderColor: theme.palette.primary.main,
    '&::before': {
      left: 'calc(100% + 200px)',
    },
  },
  '&:active': {
    transform: 'translateY(-1px) scale(1.01)',
    transition: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  // 响应式样式
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    borderRadius: 14,
    fontSize: '0.875rem',
  },
}));

// 增强的进度条样式
export const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 12,
  borderRadius: 8,
  backgroundColor: 'rgba(0, 0, 0, 0.06)',
  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'rgba(255, 255, 255, 0.6)',
  },
  '& .MuiLinearProgress-bar': {
    borderRadius: 8,
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '50%',
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%)',
      borderRadius: '8px 8px 0 0',
    },
  },
  // 响应式样式
  [theme.breakpoints.down('sm')]: {
    height: 10,
    borderRadius: 6,
    '& .MuiLinearProgress-bar': {
      borderRadius: 6,
      '&::after': {
        borderRadius: '6px 6px 0 0',
      },
    },
  },
}));

// 动画进度条
export const AnimatedProgress = styled(StyledLinearProgress)(({ theme }) => ({
  '& .MuiLinearProgress-bar': {
    transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      background: `
        linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.6),
          transparent
        )
      `,
      animation: `${shimmer} 2s infinite`,
    },
  },
}));

// 响应式容器
export const ResponsiveContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '100%',
  padding: theme.spacing(0, 3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 2),
  },
}));

// 增强的响应式卡片
export const ResponsiveCard = styled(Paper)(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(4),
  boxShadow: `
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 16px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.6)
  `,
  backdropFilter: 'blur(16px)',
  background: 'rgba(255, 255, 255, 0.9)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
  },
  '&:hover': {
    transform: 'translateY(-6px) scale(1.02)',
    boxShadow: `
      0 16px 48px rgba(0, 0, 0, 0.12),
      0 4px 24px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.7)
    `,
  },
  [theme.breakpoints.down('sm')]: {
    borderRadius: 16,
    padding: theme.spacing(3),
    '&:hover': {
      transform: 'translateY(-4px) scale(1.01)',
    },
  },
}));

// 浮动动画卡片
export const FloatingCard = styled(ResponsiveCard)(({ theme }) => ({
  animation: `${float} 6s ease-in-out infinite`,
  '&:nth-of-type(2n)': {
    animationDelay: '2s',
  },
  '&:nth-of-type(3n)': {
    animationDelay: '4s',
  },
}));

// 成功反馈卡片
export const SuccessCard = styled(Paper)(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
  color: 'white',
  boxShadow: `
    0 8px 32px rgba(76, 175, 80, 0.3),
    0 2px 16px rgba(76, 175, 80, 0.2)
  `,
  animation: `${slideInUp} 0.6s cubic-bezier(0.4, 0, 0.2, 1)`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'rgba(255, 255, 255, 0.4)',
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

// 脉冲动画容器
export const PulseContainer = styled(Box)(({ theme }) => ({
  animation: `${pulse} 2s ease-in-out infinite`,
}));

// 统一的圆角大小
export const BORDER_RADIUS = {
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
};

// 统一的间距
export const SPACING = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

// 响应式网格间距
export const getResponsiveSpacing = (theme: any) => ({
  xs: theme.spacing(2),
  sm: theme.spacing(3),
  md: theme.spacing(4),
  lg: theme.spacing(5),
});

// 响应式字体大小
export const getResponsiveFontSize = (base: number) => ({
  xs: `${base * 0.875}rem`,
  sm: `${base}rem`,
  md: `${base * 1.125}rem`,
});

// 响应式边距
export const getResponsiveMargin = (theme: any) => ({
  xs: theme.spacing(2),
  sm: theme.spacing(3),
  md: theme.spacing(4),
});

// 响应式内边距
export const getResponsivePadding = (theme: any) => ({
  xs: theme.spacing(2),
  sm: theme.spacing(3),
  md: theme.spacing(4),
}); 