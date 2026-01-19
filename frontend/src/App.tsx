import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import SchoolAdminDashboard from "./pages/SchoolAdminDashboard";
import QuestionDeveloperDashboard from "./pages/QuestionDeveloperDashboard";
import SystemAdminDashboard from "./pages/SystemAdminDashboard";
import ReadingProInfo from "./pages/ReadingProInfo";
import ReportSample from "./pages/ReportSample";
import ItemBankList from "./pages/ItemBankList";
import ItemDetail from "./pages/ItemDetail";
import ItemEdit from "./pages/ItemEdit";
import StimuliList from "./pages/StimuliList";
import StimuliDetail from "./pages/StimuliDetail";
import StimuliEdit from "./pages/StimuliEdit";
import AuthoringProjects from "./pages/AuthoringProjects";
import AuthoringProjectDetail from "./pages/AuthoringProjectDetail";
import DomainList from "./pages/DomainList";
import ReadingQuestionGuide from "./pages/ReadingQuestionGuide";
import StimuliNew from "./pages/StimuliNew";
import TestPage from "./pages/TestPage";
import DiagnosticsPage from "./pages/DiagnosticsPage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#667eea",
    },
    secondary: {
      main: "#764ba2",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "html, body, #root": {
          height: "100%",
          width: "100%",
        },
        body: {
          margin: 0,
        },
      },
    },
  },
});

const AuthoringEditRedirect = () => {
  const { id } = useParams();
  const targetId = id ?? "";
  return <Navigate to={`/question-dev/authoring/${targetId}`} replace />;
};

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
          <Route path="/student" element={<MainLayout />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route
              path="report-sample"
              element={<ReportSample type="student" />}
            />
          </Route>

          {/* 학부모 라우트 */}
          <Route path="/parent" element={<MainLayout />}>
            <Route path="dashboard" element={<ParentDashboard />} />
            <Route
              path="report-sample"
              element={<ReportSample type="parent" />}
            />
            <Route path="info" element={<ReadingProInfo />} />
          </Route>

          {/* 진단 담당 교사 라우트 */}
          <Route path="/teacher" element={<MainLayout />}>
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route
              path="report-sample"
              element={<ReportSample type="teacher" />}
            />
            <Route
              path="reading-question-guide"
              element={<ReadingQuestionGuide />}
            />
          </Route>

          {/* 학교 관리자 라우트 */}
          <Route path="/school-admin" element={<MainLayout />}>
            <Route path="dashboard" element={<SchoolAdminDashboard />} />
            <Route
              path="report-sample"
              element={<ReportSample type="school" />}
            />
          </Route>

          {/* 문항 개발 교사 라우트 */}
          <Route path="/question-dev" element={<MainLayout />}>
            <Route path="dashboard" element={<QuestionDeveloperDashboard />} />
            <Route path="items" element={<ItemBankList />} />
            <Route path="items/:id" element={<ItemDetail />} />
            <Route path="items/:id/edit" element={<ItemEdit />} />
            <Route path="stimuli" element={<StimuliList />} />
            <Route path="stimuli/new" element={<StimuliNew />} />
            <Route path="stimuli/:id" element={<StimuliDetail />} />
            <Route path="stimuli/:id/edit" element={<StimuliEdit />} />
            <Route path="authoring" element={<AuthoringProjects />} />
            <Route path="authoring/:id" element={<AuthoringProjectDetail />} />
            <Route
              path="authoring/:id/edit"
              element={<AuthoringEditRedirect />}
            />
            <Route path="test" element={<TestPage />} />
            <Route path="test/:id" element={<TestPage />} />
            <Route path="domains" element={<DomainList />} />
          </Route>

          {/* 시스템 관리자 라우트 */}
          <Route path="/admin" element={<MainLayout />}>
            <Route path="dashboard" element={<SystemAdminDashboard />} />
            <Route path="diagnostics" element={<DiagnosticsPage />} />
          </Route>

          {/* 진단 페이지 (모든 사용자 접근 가능) */}
          <Route path="/diagnostics" element={<MainLayout />}>
            <Route index element={<DiagnosticsPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
