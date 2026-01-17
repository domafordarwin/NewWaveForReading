import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import ParentDashboard from './pages/ParentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import SchoolAdminDashboard from './pages/SchoolAdminDashboard';
import QuestionDeveloperDashboard from './pages/QuestionDeveloperDashboard';
import SystemAdminDashboard from './pages/SystemAdminDashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body, #root': {
          height: '100%',
          width: '100%',
        },
        body: {
          margin: 0,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* 로그인 페이지 */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* 학생 라우트 */}
          <Route path="/student/*" element={
            <MainLayout>
              <Routes>
                <Route path="dashboard" element={<StudentDashboard />} />
              </Routes>
            </MainLayout>
          } />

          {/* 학부모 라우트 */}
          <Route path="/parent/*" element={
            <MainLayout>
              <Routes>
                <Route path="dashboard" element={<ParentDashboard />} />
              </Routes>
            </MainLayout>
          } />

          {/* 진단 담당 교사 라우트 */}
          <Route path="/teacher/*" element={
            <MainLayout>
              <Routes>
                <Route path="dashboard" element={<TeacherDashboard />} />
              </Routes>
            </MainLayout>
          } />

          {/* 학교 관리자 라우트 */}
          <Route path="/school-admin/*" element={
            <MainLayout>
              <Routes>
                <Route path="dashboard" element={<SchoolAdminDashboard />} />
              </Routes>
            </MainLayout>
          } />

          {/* 문항 개발 교사 라우트 */}
          <Route path="/question-dev/*" element={
            <MainLayout>
              <Routes>
                <Route path="dashboard" element={<QuestionDeveloperDashboard />} />
              </Routes>
            </MainLayout>
          } />

          {/* 시스템 관리자 라우트 */}
          <Route path="/admin/*" element={
            <MainLayout>
              <Routes>
                <Route path="dashboard" element={<SystemAdminDashboard />} />
              </Routes>
            </MainLayout>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
