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
  Divider,
  Chip,
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
  School,
  Class,
  Print,
  Quiz,
  LibraryBooks,
  Settings,
  Storage,
  FamilyRestroom,
  EventNote,
  Info,
  Face,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearCurrentUser, getCurrentUser } from '../utils/session';
import type { StoredUserType } from '../utils/session';
import { UserTypeLabels } from '../types';

interface MainLayoutProps {
  children: ReactNode;
}

// 학생 회원 메뉴
const studentMenuItems = [
  { text: '대시보드', icon: <DashboardIcon />, path: '/student/dashboard' },
  { text: '검사 목록', icon: <AssignmentIcon />, path: '/student/assessments' },
  { text: '나의 성적', icon: <AssessmentIcon />, path: '/student/results' },
  { text: '학습 이력', icon: <TrendingUpIcon />, path: '/student/progress' },
  { text: '피드백', icon: <AssessmentIcon />, path: '/student/feedback' },
];

// 학부모 메뉴
const parentMenuItems = [
  { text: '대시보드', icon: <DashboardIcon />, path: '/parent/dashboard' },
  { text: '자녀 성적 리포트', icon: <AssessmentIcon />, path: '/parent/dashboard' },
  { text: '상담 신청', icon: <EventNote />, path: '/parent/dashboard' },
  { text: 'Reading PRO 안내', icon: <Info />, path: '/parent/info' },
];

// 학교 관리자 메뉴
const schoolAdminMenuItems = [
  { text: '대시보드', icon: <DashboardIcon />, path: '/school-admin/dashboard' },
  { text: '학생 관리', icon: <People />, path: '/school-admin/students' },
  { text: '학급 관리', icon: <Class />, path: '/school-admin/classes' },
  { text: '평가 현황', icon: <AssessmentIcon />, path: '/school-admin/dashboard' },
  { text: '리포트 출력', icon: <Print />, path: '/school-admin/dashboard' },
];

// 독서 진단 담당 교사 메뉴
const assessmentTeacherMenuItems = [
  { text: '대시보드', icon: <DashboardIcon />, path: '/teacher/dashboard' },
  { text: '학생 관리', icon: <People />, path: '/teacher/students' },
  { text: '검사 배정', icon: <AssignmentIcon />, path: '/teacher/assessments' },
  { text: '피드백 작성', icon: <AssessmentIcon />, path: '/teacher/dashboard' },
  { text: '반별 통계', icon: <BarChart />, path: '/teacher/statistics' },
];

// 문항 개발 교사 메뉴
const questionDeveloperMenuItems = [
  { text: '대시보드', icon: <DashboardIcon />, path: '/question-dev/dashboard' },
  { text: '문항 개발', icon: <Quiz />, path: '/question-dev/dashboard' },
  { text: '도서 관리', icon: <LibraryBooks />, path: '/question-dev/dashboard' },
  { text: '문항 검토', icon: <AssessmentIcon />, path: '/question-dev/dashboard' },
];

// 시스템 관리자 메뉴
const systemAdminMenuItems = [
  { text: '대시보드', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: '사용자 관리', icon: <People />, path: '/admin/dashboard' },
  { text: '문항 DB 관리', icon: <Storage />, path: '/admin/dashboard' },
  { text: '권한 관리', icon: <AdminPanelSettings />, path: '/admin/dashboard' },
  { text: '시스템 설정', icon: <Settings />, path: '/admin/dashboard' },
];

// 사용자 타입별 아이콘
const userTypeIcons: Record<StoredUserType, React.ReactNode> = {
  STUDENT: <Face />,
  PARENT: <FamilyRestroom />,
  SCHOOL_ADMIN: <School />,
  ASSESSMENT_TEACHER: <AssignmentIcon />,
  QUESTION_DEVELOPER: <Quiz />,
  SYSTEM_ADMIN: <Settings />,
};

export default function MainLayout({ children }: MainLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const drawerWidth = isMobile ? 220 : 260;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = getCurrentUser();
  const userType = storedUser?.userType || 'STUDENT';

  // 현재 사용자 타입에 따라 메뉴 결정
  const getMenuItems = () => {
    switch (userType) {
      case 'STUDENT':
        return studentMenuItems;
      case 'PARENT':
        return parentMenuItems;
      case 'SCHOOL_ADMIN':
        return schoolAdminMenuItems;
      case 'ASSESSMENT_TEACHER':
        return assessmentTeacherMenuItems;
      case 'QUESTION_DEVELOPER':
        return questionDeveloperMenuItems;
      case 'SYSTEM_ADMIN':
        return systemAdminMenuItems;
      default:
        return studentMenuItems;
    }
  };

  const menuItems = getMenuItems();
  const userRoleLabel = UserTypeLabels[userType as keyof typeof UserTypeLabels] || '사용자';

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
    handleProfileMenuClose();
    clearCurrentUser();
    navigate('/login');
  };

  const handleExit = () => {
    alert('이용해 주셔서 감사합니다. 로그인 페이지로 이동합니다.');
    clearCurrentUser();
    navigate('/');
  };

  const displayName = storedUser?.name || '사용자';

  const drawer = (
    <div>
      <Toolbar sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          문해력 검사
        </Typography>
        <Typography variant="caption" color="text.secondary">
          독서 새물결
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ px: 2, py: 1.5 }}>
        <Chip
          icon={userTypeIcons[userType] as React.ReactElement}
          label={userRoleLabel}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ width: '100%', justifyContent: 'flex-start' }}
        />
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  '&:hover': { bgcolor: 'primary.light' },
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                  '& .MuiListItemText-primary': { fontWeight: 'bold', color: 'primary.main' },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'text.secondary', minWidth: 40 }}>
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
