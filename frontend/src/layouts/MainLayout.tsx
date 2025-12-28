import type { ReactNode } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Button,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  AccountCircle,
  Logout,
  People,
  BarChart,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearCurrentUser, getCurrentUser } from '../utils/session';

interface MainLayoutProps {
  children: ReactNode;
}

const studentMenuItems = [
  { text: '대시보드', icon: <DashboardIcon />, path: '/student/dashboard' },
  { text: '검사 목록', icon: <AssignmentIcon />, path: '/student/assessments' },
  { text: '나의 성적', icon: <AssessmentIcon />, path: '/student/results' },
  { text: '학습 이력', icon: <TrendingUpIcon />, path: '/student/progress' },
  { text: '피드백', icon: <AssessmentIcon />, path: '/student/feedback' },
];

const teacherMenuItems = [
  { text: '대시보드', icon: <DashboardIcon />, path: '/teacher/dashboard' },
  { text: '학생 관리', icon: <People />, path: '/teacher/students' },
  { text: '검사 배정', icon: <AssignmentIcon />, path: '/teacher/assessments' },
  { text: '반별 통계', icon: <BarChart />, path: '/teacher/statistics' },
];

const parentMenuItems = [
  { text: '대시보드', icon: <DashboardIcon />, path: '/parent/dashboard' },
  { text: '자녀 검사', icon: <AssignmentIcon />, path: '/parent/dashboard#assessments' },
  { text: '자녀 성적', icon: <AssessmentIcon />, path: '/parent/dashboard#results' },
  { text: '학습 이력', icon: <TrendingUpIcon />, path: '/parent/dashboard#progress' },
];

const adminMenuItems = [
  { text: '대시보드', icon: <AdminPanelSettings />, path: '/admin/dashboard' },
  { text: '사용자 현황', icon: <People />, path: '/admin/dashboard' },
  { text: '검사 현황', icon: <AssignmentIcon />, path: '/admin/dashboard' },
];

export default function MainLayout({ children }: MainLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const drawerWidth = isMobile ? 220 : 240;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 경로에 따라 메뉴 결정
  const isTeacher = location.pathname.startsWith('/teacher');
  const isParent = location.pathname.startsWith('/parent');
  const isAdmin = location.pathname.startsWith('/admin');

  const menuItems = isTeacher
    ? teacherMenuItems
    : isParent
    ? parentMenuItems
    : isAdmin
    ? adminMenuItems
    : studentMenuItems;

  const userRole = isTeacher ? '교사' : isParent ? '학부모' : isAdmin ? '관리자' : '학생';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // 로그아웃 로직
    handleProfileMenuClose();
    clearCurrentUser();
    navigate('/login');
  };

  const handleExit = () => {
    alert('이용해 주셔서 감사합니다. 랜딩 페이지로 이동합니다.');
    navigate('/');
  };

  const storedUser = getCurrentUser();
  const displayName = storedUser?.name || '사용자';

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          문해력 검사
        </Typography>
      </Toolbar>
      <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', color: 'text.secondary' }}>
        {userRole} 모드
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh', width: '100vw' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant={isMobile ? 'subtitle1' : 'h6'}
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}
          >
            {displayName}님, 환영합니다!
          </Typography>
          <Button
            variant="outlined"
            size={isMobile ? 'small' : 'medium'}
            onClick={handleExit}
            sx={{ mr: 2, px: isMobile ? 1.5 : 2.5 }}
          >
            종료하기
          </Button>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {displayName[0] || '?'}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={handleProfileMenuClose}>
              <AccountCircle sx={{ mr: 1 }} />
              내 정보
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              로그아웃
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, sm: 8 },
          bgcolor: '#f5f5f5',
          minHeight: '100dvh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
