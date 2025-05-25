import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import ProjectLogo from './ProjectLogo';

const ShowcaseContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(2),
  borderRadius: 16,
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
}));

const LogoDemo = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(1),
  borderRadius: 12,
  background: 'white',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2)
}));

const DarkDemo = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(1),
  borderRadius: 12,
  background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2)
}));

const LogoShowcase: React.FC = () => {
  return (
    <ShowcaseContainer>
      <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center" sx={{ color: '#2c3e50', mb: 4 }}>
        Project-50 Logo 展示
      </Typography>
      
      <Grid container spacing={3}>
        {/* 不同尺寸展示 */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50' }}>
            不同尺寸
          </Typography>
          
          <LogoDemo>
            <Typography variant="subtitle2" color="textSecondary">小尺寸</Typography>
            <ProjectLogo size="small" showText={true} />
          </LogoDemo>
          
          <LogoDemo>
            <Typography variant="subtitle2" color="textSecondary">中等尺寸</Typography>
            <ProjectLogo size="medium" showText={true} />
          </LogoDemo>
          
          <LogoDemo>
            <Typography variant="subtitle2" color="textSecondary">大尺寸</Typography>
            <ProjectLogo size="large" showText={true} />
          </LogoDemo>
        </Grid>

        {/* 不同样式展示 */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50' }}>
            不同样式
          </Typography>
          
          <LogoDemo>
            <Typography variant="subtitle2" color="textSecondary">仅图标</Typography>
            <ProjectLogo size="medium" showText={false} />
          </LogoDemo>
          
          <LogoDemo>
            <Typography variant="subtitle2" color="textSecondary">完整logo</Typography>
            <ProjectLogo size="medium" showText={true} />
          </LogoDemo>
          
          <DarkDemo>
            <Typography variant="subtitle2" sx={{ color: 'white' }}>深色背景</Typography>
            <ProjectLogo size="medium" showText={true} />
          </DarkDemo>
        </Grid>
      </Grid>

      {/* 设计说明 */}
      <Box mt={4} p={3} sx={{ 
        background: 'rgba(255,255,255,0.8)', 
        borderRadius: 2,
        backdropFilter: 'blur(10px)'
      }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50' }}>
          设计理念
        </Typography>
        <Typography variant="body2" sx={{ color: '#34495e', lineHeight: 1.6 }}>
          • <strong>圆环设计</strong>：象征50天的循环挑战和持续进步<br/>
          • <strong>渐变色彩</strong>：体现应用的现代感和典雅风格<br/>
          • <strong>数字50</strong>：突出应用的核心概念<br/>
          • <strong>星星装饰</strong>：代表目标达成和成就感<br/>
          • <strong>动画效果</strong>：增加交互性和活力<br/>
          • <strong>响应式设计</strong>：适配不同尺寸和使用场景
        </Typography>
      </Box>

      {/* 使用场景 */}
      <Box mt={3} p={3} sx={{ 
        background: 'rgba(255,255,255,0.8)', 
        borderRadius: 2,
        backdropFilter: 'blur(10px)'
      }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50' }}>
          使用场景
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ color: '#34495e' }}>
              <strong>应用内使用：</strong><br/>
              • 登录页面左上角<br/>
              • AI分析页面标题<br/>
              • 加载页面<br/>
              • 关于页面
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ color: '#34495e' }}>
              <strong>外部使用：</strong><br/>
              • 浏览器标签页图标<br/>
              • 桌面快捷方式<br/>
              • 应用商店图标<br/>
              • 宣传材料
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </ShowcaseContainer>
  );
};

export default LogoShowcase; 