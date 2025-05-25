import React from 'react';
import { Box, Container, Skeleton, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { motion } from 'framer-motion';

// 动画关键帧
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
`;

// 增强的骨架屏样式
const EnhancedSkeleton = styled(Skeleton)(({ theme }) => ({
  borderRadius: 16,
  background: `
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0.1) 100%
    )
  `,
  backgroundSize: '200px 100%',
  animation: `${shimmer} 1.5s ease-in-out infinite`,
  '&::after': {
    background: 'transparent',
  },
}));

// 浮动加载容器
const FloatingContainer = styled(Box)(({ theme }) => ({
  animation: `${float} 3s ease-in-out infinite`,
}));

// 脉冲文本
const PulseText = styled(Typography)(({ theme }) => ({
  animation: `${pulse} 2s ease-in-out infinite`,
  background: 'linear-gradient(45deg, #667eea, #764ba2)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 600,
}));

// 加载点动画
const LoadingDots = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  '& .dot': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'linear-gradient(45deg, #667eea, #764ba2)',
    animation: `${pulse} 1.4s ease-in-out infinite both`,
    '&:nth-of-type(1)': { animationDelay: '-0.32s' },
    '&:nth-of-type(2)': { animationDelay: '-0.16s' },
    '&:nth-of-type(3)': { animationDelay: '0s' },
  },
}));

const LoadingSkeleton: React.FC = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      py: { xs: 2, sm: 3, md: 4 },
      px: { xs: 1, sm: 2 },
      pb: { xs: 10, sm: 12 }
    }}>
      <Container maxWidth="lg">
        {/* 标题加载动画 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FloatingContainer>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              mb: { xs: 3, sm: 4, md: 5 },
              px: { xs: 1, sm: 0 }
            }}>
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <EnhancedSkeleton 
                  variant="circular" 
                  width={80} 
                  height={80}
                  sx={{ mb: 2 }}
                />
              </motion.div>
              
              <PulseText variant="h4" sx={{ mb: 1 }}>
                加载中
              </PulseText>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  正在准备您的数据
                </Typography>
                <LoadingDots>
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                </LoadingDots>
              </Box>
            </Box>
          </FloatingContainer>
        </motion.div>

        {/* 卡片加载动画 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[1, 2, 3].map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2,
                ease: "easeOut"
              }}
            >
              <Box sx={{
                p: 4,
                borderRadius: 5,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: `
                  0 8px 32px rgba(0, 0, 0, 0.08),
                  0 2px 16px rgba(0, 0, 0, 0.04)
                `,
              }}>
                {/* 标题骨架 */}
                <EnhancedSkeleton 
                  variant="text" 
                  width="40%" 
                  height={32}
                  sx={{ mb: 3 }}
                />
                
                {/* 进度条骨架 */}
                <EnhancedSkeleton 
                  variant="rectangular" 
                  width="100%" 
                  height={12}
                  sx={{ mb: 3, borderRadius: 2 }}
                />
                
                {/* 列表项骨架 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[1, 2, 3, 4].map((itemIndex) => (
                    <motion.div
                      key={itemIndex}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: (index * 0.2) + (itemIndex * 0.1),
                        ease: "easeOut"
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        p: 2,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.5)',
                      }}>
                        <EnhancedSkeleton 
                          variant="circular" 
                          width={24} 
                          height={24}
                        />
                        <EnhancedSkeleton 
                          variant="text" 
                          width={`${60 + Math.random() * 30}%`} 
                          height={20}
                        />
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* 底部加载提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Box sx={{ 
            textAlign: 'center', 
            mt: 4,
            p: 3,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(12px)',
          }}>
            <Typography variant="body2" color="text.secondary">
              🌟 正在为您准备最佳的打卡体验
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LoadingSkeleton; 