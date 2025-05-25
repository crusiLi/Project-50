import React, { useEffect, useState } from 'react';
import { Box, Typography, Fade, Zoom } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled, keyframes } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import confetti from 'canvas-confetti';

// 动画关键帧
const sparkle = keyframes`
  0%, 100% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(76, 175, 80, 0.6);
  }
`;

// 样式化组件
const SuccessContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(8px)',
  zIndex: 9999,
}));

const SuccessCard = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
  borderRadius: 24,
  padding: theme.spacing(4),
  color: 'white',
  textAlign: 'center',
  boxShadow: `
    0 20px 60px rgba(76, 175, 80, 0.4),
    0 8px 32px rgba(76, 175, 80, 0.3)
  `,
  animation: `${glow} 2s ease-in-out infinite`,
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

const SparkleIcon = styled(StarIcon)(({ theme }) => ({
  position: 'absolute',
  color: '#ffd700',
  animation: `${sparkle} 2s ease-in-out infinite`,
  '&:nth-of-type(1)': {
    top: '10%',
    left: '10%',
    animationDelay: '0s',
  },
  '&:nth-of-type(2)': {
    top: '20%',
    right: '15%',
    animationDelay: '0.5s',
  },
  '&:nth-of-type(3)': {
    bottom: '20%',
    left: '20%',
    animationDelay: '1s',
  },
  '&:nth-of-type(4)': {
    bottom: '15%',
    right: '10%',
    animationDelay: '1.5s',
  },
}));

const BounceIcon = styled(CheckCircleIcon)(({ theme }) => ({
  fontSize: '4rem',
  animation: `${bounce} 2s ease-in-out`,
  marginBottom: theme.spacing(2),
}));

interface SuccessFeedbackProps {
  show: boolean;
  onClose: () => void;
  message?: string;
  subMessage?: string;
}

const SuccessFeedback: React.FC<SuccessFeedbackProps> = ({
  show,
  onClose,
  message = "恭喜完成！",
  subMessage = "今日所有目标已达成"
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (show) {
      setShowContent(true);
      
      // 触发彩带动画
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // 从多个方向发射彩带
        confetti(Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        }));
        
        confetti(Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }));
      }, 250);

      // 3秒后自动关闭
      const timer = setTimeout(() => {
        setShowContent(false);
        setTimeout(onClose, 300);
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {showContent && (
        <SuccessContainer>
          <Fade in={showContent} timeout={300}>
            <div>
              <Zoom in={showContent} timeout={500}>
                <SuccessCard>
                  {/* 闪烁星星 */}
                  <SparkleIcon />
                  <SparkleIcon />
                  <SparkleIcon />
                  <SparkleIcon />
                  
                  {/* 主要内容 */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 10,
                      delay: 0.2 
                    }}
                  >
                    <BounceIcon />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 1,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}
                    >
                      {message}
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        opacity: 0.9,
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                      }}
                    >
                      {subMessage}
                    </Typography>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mt: 2, 
                        opacity: 0.8,
                        fontSize: '0.875rem'
                      }}
                    >
                      🎉 继续保持，你正在创造奇迹！
                    </Typography>
                  </motion.div>
                </SuccessCard>
              </Zoom>
            </div>
          </Fade>
        </SuccessContainer>
      )}
    </AnimatePresence>
  );
};

export default SuccessFeedback; 