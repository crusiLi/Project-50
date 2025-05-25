import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  cursor: 'pointer',
  userSelect: 'none'
}));

const IconContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 48,
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  letterSpacing: '-0.5px'
}));

const SubText = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: '#8e44ad',
  fontWeight: 500,
  marginLeft: theme.spacing(0.5),
  opacity: 0.8
}));

interface ProjectLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  onClick?: () => void;
}

const ProjectLogo: React.FC<ProjectLogoProps> = ({ 
  size = 'medium', 
  showText = true,
  onClick 
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { icon: 32, text: '1.2rem', sub: '0.65rem' };
      case 'large':
        return { icon: 64, text: '2rem', sub: '0.85rem' };
      default:
        return { icon: 48, text: '1.5rem', sub: '0.75rem' };
    }
  };

  const sizes = getSize();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <LogoContainer onClick={onClick}>
        <IconContainer sx={{ width: sizes.icon, height: sizes.icon }}>
          {/* SVG Logo */}
          <svg
            width={sizes.icon}
            height={sizes.icon}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 外圈渐变圆环 */}
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8e44ad" />
                <stop offset="100%" stopColor="#3498db" />
              </linearGradient>
              <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e74c3c" />
                <stop offset="50%" stopColor="#f39c12" />
                <stop offset="100%" stopColor="#2ecc71" />
              </linearGradient>
            </defs>
            
            {/* 外圈进度环 */}
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="url(#gradient1)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="125.6"
              strokeDashoffset="25"
              transform="rotate(-90 24 24)"
            />
            
            {/* 内圈装饰 */}
            <circle
              cx="24"
              cy="24"
              r="15"
              stroke="url(#gradient2)"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
              strokeDasharray="8 4"
            />
            
            {/* 中心数字50 */}
            <text
              x="24"
              y="28"
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fill="url(#gradient1)"
            >
              50
            </text>
            
            {/* 顶部小星星 */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: '24px 24px' }}
            >
              <path
                d="M24 6 L25.5 9 L29 9 L26.5 11.5 L27.5 15 L24 13 L20.5 15 L21.5 11.5 L19 9 L22.5 9 Z"
                fill="url(#gradient3)"
                opacity="0.8"
              />
            </motion.g>
            
            {/* 右侧小点装饰 */}
            <circle cx="38" cy="24" r="2" fill="url(#gradient2)" opacity="0.7" />
            <circle cx="35" cy="18" r="1.5" fill="url(#gradient2)" opacity="0.5" />
            <circle cx="35" cy="30" r="1.5" fill="url(#gradient2)" opacity="0.5" />
            
            {/* 左侧小点装饰 */}
            <circle cx="10" cy="24" r="2" fill="url(#gradient2)" opacity="0.7" />
            <circle cx="13" cy="18" r="1.5" fill="url(#gradient2)" opacity="0.5" />
            <circle cx="13" cy="30" r="1.5" fill="url(#gradient2)" opacity="0.5" />
          </svg>
        </IconContainer>
        
        {showText && (
          <Box>
            <LogoText sx={{ fontSize: sizes.text }}>
              Project-50
            </LogoText>
            <SubText sx={{ fontSize: sizes.sub }}>
              AI智能打卡
            </SubText>
          </Box>
        )}
      </LogoContainer>
    </motion.div>
  );
};

export default ProjectLogo; 