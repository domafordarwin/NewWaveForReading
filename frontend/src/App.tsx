import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import StudentAssessments from './pages/StudentAssessments';
import StudentResults from './pages/StudentResults';
import StudentProgress from './pages/StudentProgress';
import StudentFeedback from './pages/StudentFeedback';
import AssessmentTaking from './pages/AssessmentTaking';
import EvaluationResult from './pages/EvaluationResult';
import APITest from './pages/APITest';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentManagement from './pages/StudentManagement';
import AssessmentAssignment from './pages/AssessmentAssignment';
import ClassStatistics from './pages/ClassStatistics';
import ParentDashboard from './pages/ParentDashboard';
import ParentInfo from './pages/ParentInfo';
import AdminDashboard from './pages/AdminDashboard';
import TeacherFeedback from './pages/TeacherFeedback';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
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
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
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
          {/* 로그인 페이지 (메인) */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          
          {/* API 테스트 페이지 */}
          <Route path="/api-test" element={<APITest />} />
          
          {/* 학생용 라우트 */}
          <Route path="/student/*" element={
            <MainLayout>
              <Routes>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="assessments" element={<StudentAssessments />} />
                <Route path="results" element={<StudentResults />} />
                <Route path="progress" element={<StudentProgress />} />
                <Route path="feedback" element={<StudentFeedback />} />
                <Route path="assessment/:assessmentId" element={<AssessmentTaking />} />
                <Route path="result/:assessmentId" element={<EvaluationResult />} />
              </Routes>
            </MainLayout>
          } />
          
          {/* 교사용 라우트 */}
          <Route path="/teacher/*" element={
            <MainLayout>
              <Routes>
                <Route path="dashboard" element={<TeacherDashboard />} />
                <Route path="students" element={<StudentManagement />} />
                <Route path="feedback/:studentId" element={<TeacherFeedback />} />
                <Route path="assessments" element={<AssessmentAssignment />} />
                <Route path="statistics" element={<ClassStatistics />} />
              </Routes>
            </MainLayout>
          } />

          {/* 학부모 라우트 */}
          <Route path="/parent/*" element={
            <MainLayout>
              <Routes>
                <Route path="dashboard" element={<ParentDashboard />} />
                <Route path="info" element={<ParentInfo />} />
                <Route path="result/:assessmentId" element={<EvaluationResult />} />
              </Routes>
            </MainLayout>
          } />

          {/* 관리자 라우트 */}
          <Route path="/admin/*" element={
            <MainLayout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
              </Routes>
            </MainLayout>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
