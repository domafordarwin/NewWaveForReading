import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  Assessment,
  Person,
  Logout,
  School,
  Face,
  FamilyRestroom,
  AdminPanelSettings,
  Assignment,
  Quiz,
  Settings,
  Info,
  Description,
  LibraryBooks,
  Article,
  SmartToy,
  Category,
  MenuBook,
} from "@mui/icons-material";
import { getCurrentUser, clearCurrentUser } from "../utils/session";
import type { UserType } from "../types";

const drawerWidth = 260;

interface MainLayoutProps {
  children: React.ReactNode;
}

// 사용자 타입별 메뉴 구성
const menusByUserType: Record<UserType, { label: string; icon: React.ReactNode; path: string }[]> = {
  STUDENT: [
    { label: "대시보드", icon: <Dashboard />, path: "/student/dashboard" },
    { label: "진단 목록", icon: <Assessment />, path: "/student/assessments" },
    { label: "내 결과", icon: <Person />, path: "/student/results" },
    { label: "보고서 샘플", icon: <Description />, path: "/student/report-sample" },
  ],
  PARENT: [
    { label: "대시보드", icon: <Dashboard />, path: "/parent/dashboard" },
    { label: "자녀 정보", icon: <FamilyRestroom />, path: "/parent/children" },
    { label: "보고서 샘플", icon: <Description />, path: "/parent/report-sample" },
    { label: "리딩 PRO 소개", icon: <Info />, path: "/parent/info" },
  ],
  SCHOOL_ADMIN: [
    { label: "대시보드", icon: <Dashboard />, path: "/school-admin/dashboard" },
    { label: "학생 관리", icon: <Person />, path: "/school-admin/students" },
    { label: "반 관리", icon: <School />, path: "/school-admin/classes" },
    { label: "보고서 샘플", icon: <Description />, path: "/school-admin/report-sample" },
  ],
  ASSESSMENT_TEACHER: [
    { label: "대시보드", icon: <Dashboard />, path: "/teacher/dashboard" },
    { label: "학생 관리", icon: <Person />, path: "/teacher/students" },
    { label: "진단 배정", icon: <Assignment />, path: "/teacher/assessments" },
    { label: "보고서 샘플", icon: <Description />, path: "/teacher/report-sample" },
    { label: "독서 발문 가이드", icon: <MenuBook />, path: "/teacher/reading-question-guide" },
  ],
  QUESTION_DEVELOPER: [
    { label: "대시보드", icon: <Dashboard />, path: "/question-dev/dashboard" },
    { label: "문항 은행", icon: <LibraryBooks />, path: "/question-dev/items" },
    { label: "지문 관리", icon: <Article />, path: "/question-dev/stimuli" },
    { label: "문항 제작", icon: <SmartToy />, path: "/question-dev/authoring" },
    { label: "평가 영역", icon: <Category />, path: "/question-dev/domains" },
  ],
  SYSTEM_ADMIN: [
    { label: "대시보드", icon: <Dashboard />, path: "/admin/dashboard" },
    { label: "사용자 관리", icon: <Person />, path: "/admin/users" },
    { label: "시스템 설정", icon: <Settings />, path: "/admin/settings" },
  ],
};

// 사용자 타입별 아이콘
const userTypeIcons: Record<UserType, React.ReactNode> = {
  STUDENT: <Face />,
  PARENT: <FamilyRestroom />,
  SCHOOL_ADMIN: <AdminPanelSettings />,
  ASSESSMENT_TEACHER: <Assignment />,
  QUESTION_DEVELOPER: <Quiz />,
  SYSTEM_ADMIN: <Settings />,
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    clearCurrentUser();
    navigate("/");
  };

  const userType = user?.userType || "STUDENT";
  const menus = menusByUserType[userType];

  const drawer = (
    <Box>
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
        <Box
          component="img"
          src="/reading_pro_logo.png"
          alt="리딩 PRO 로고"
          sx={{ width: 360, height: 180, objectFit: "contain" }}
        />
      </Box>
      <Divider />
      <List sx={{ px: 1 }}>
        {menus.map((menu) => (
          <ListItem key={menu.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === menu.path}
              onClick={() => {
                navigate(menu.path);
                setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": { backgroundColor: "primary.dark" },
                  "& .MuiListItemIcon-root": { color: "white" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{menu.icon}</ListItemIcon>
              <ListItemText primary={menu.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "white",
          color: "text.primary",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {user?.name}
            </Typography>
            <IconButton onClick={handleMenuOpen}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main" }}>
                {userTypeIcons[userType]}
              </Avatar>
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem disabled>
              <Typography variant="body2">{user?.email}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
              로그아웃
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
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
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
