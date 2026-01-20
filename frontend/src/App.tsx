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
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import StudentDashboardNew from "./pages/StudentDashboardNew";
import StudentFeedback from "./pages/StudentFeedback";
import ParentDashboard from "./pages/ParentDashboard";
import ParentDashboardNew from "./pages/ParentDashboardNew";
import ParentChildren from "./pages/ParentChildren";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherDashboardNew from "./pages/TeacherDashboardNew";
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
import BooksList from "./pages/BooksList";
import BooksNew from "./pages/BooksNew";
import BooksDetail from "./pages/BooksDetail";
import BooksEdit from "./pages/BooksEdit";
import AuthoringProjects from "./pages/AuthoringProjects";
import AuthoringProjectDetail from "./pages/AuthoringProjectDetail";
import DomainList from "./pages/DomainList";
import ReadingQuestionGuide from "./pages/ReadingQuestionGuide";
import StimuliNew from "./pages/StimuliNew";
import TestPage from "./pages/TestPage";
import DiagnosticsPage from "./pages/DiagnosticsPage";
import PromptManagement from "./pages/PromptManagement";
import PastExamList from "./pages/PastExamList";
import PastExamDetail from "./pages/PastExamDetail";
import DiagnosticAssessmentList from "./pages/DiagnosticAssessmentList";
import DiagnosticAssessmentCreate from "./pages/DiagnosticAssessmentCreate";
import DiagnosticAssessmentDetail from "./pages/DiagnosticAssessmentDetail";
import StudentAssessmentList from "./pages/StudentAssessmentList";
import StudentAssessmentTake from "./pages/StudentAssessmentTake";
import StudentAssessmentComplete from "./pages/StudentAssessmentComplete";
import StudentAssessmentResult from "./pages/StudentAssessmentResult";
import StudentResults from "./pages/StudentResults";
import MidHighDiagnosticAssessment from "./pages/MidHighDiagnosticAssessment";
import MidLowDiagnosticAssessment from "./pages/MidLowDiagnosticAssessment";
import ElemHighDiagnosticAssessment from "./pages/ElemHighDiagnosticAssessment";
import ElemLowDiagnosticAssessment from "./pages/ElemLowDiagnosticAssessment";
import SchoolAdminStudents from "./pages/SchoolAdminStudents";
import SchoolAdminClasses from "./pages/SchoolAdminClasses";

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
          <Route
            path="/student"
            element={
              <PrivateRoute allowedUserTypes={["STUDENT"]}>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="dashboard-new" element={<StudentDashboardNew />} />
            <Route path="feedback" element={<StudentFeedback />} />
            <Route path="feedback/:sessionId" element={<StudentFeedback />} />
            <Route
              path="report-sample"
              element={<ReportSample type="student" />}
            />
            {/* 진단 평가 */}
            <Route path="assessments" element={<StudentAssessmentList />} />
            <Route
              path="assessments/:assessmentId/take"
              element={<StudentAssessmentTake />}
            />
            <Route
              path="assessments/:assessmentId/complete"
              element={<StudentAssessmentComplete />}
            />
            <Route
              path="assessments/results/:attemptId"
              element={<StudentAssessmentResult />}
            />
            <Route path="results" element={<StudentResults />} />
            {/* 중등 고학년 진단 평가 */}
            <Route
              path="midhigh-diagnostic"
              element={<MidHighDiagnosticAssessment />}
            />
            {/* 중등 저학년 진단 평가 */}
            <Route
              path="midlow-diagnostic"
              element={<MidLowDiagnosticAssessment />}
            />
            {/* 초등 고학년 진단 평가 */}
            <Route
              path="elemhigh-diagnostic"
              element={<ElemHighDiagnosticAssessment />}
            />
            {/* 초등 저학년 진단 평가 */}
            <Route
              path="elemlow-diagnostic"
              element={<ElemLowDiagnosticAssessment />}
            />
          </Route>

          {/* 학부모 라우트 */}
          <Route
            path="/parent"
            element={
              <PrivateRoute allowedUserTypes={["PARENT"]}>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<ParentDashboardNew />} />
            <Route path="dashboard-old" element={<ParentDashboard />} />
            <Route path="children" element={<ParentChildren />} />
            <Route
              path="report-sample"
              element={<ReportSample type="parent" />}
            />
            <Route path="info" element={<ReadingProInfo />} />
          </Route>

          {/* 진단 담당 교사 라우트 */}
          <Route
            path="/teacher"
            element={
              <PrivateRoute allowedUserTypes={["ASSESSMENT_TEACHER"]}>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="dashboard-new" element={<TeacherDashboardNew />} />
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
          <Route
            path="/school-admin"
            element={
              <PrivateRoute allowedUserTypes={["SCHOOL_ADMIN"]}>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<SchoolAdminDashboard />} />
            <Route path="students" element={<SchoolAdminStudents />} />
            <Route path="classes" element={<SchoolAdminClasses />} />
            <Route
              path="report-sample"
              element={<ReportSample type="school" />}
            />
          </Route>

          {/* 문항 개발 교사 라우트 */}
          <Route
            path="/question-dev"
            element={
              <PrivateRoute allowedUserTypes={["QUESTION_DEVELOPER"]}>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<QuestionDeveloperDashboard />} />
            <Route path="items" element={<ItemBankList />} />
            <Route path="items/:id" element={<ItemDetail />} />
            <Route path="items/:id/edit" element={<ItemEdit />} />
            <Route path="stimuli" element={<StimuliList />} />
            <Route path="stimuli/new" element={<StimuliNew />} />
            <Route path="stimuli/:id" element={<StimuliDetail />} />
            <Route path="stimuli/:id/edit" element={<StimuliEdit />} />
            <Route path="books" element={<BooksList />} />
            <Route path="books/new" element={<BooksNew />} />
            <Route path="books/:id" element={<BooksDetail />} />
            <Route path="books/:id/edit" element={<BooksEdit />} />
            <Route path="authoring" element={<AuthoringProjects />} />
            <Route path="authoring/:id" element={<AuthoringProjectDetail />} />
            <Route
              path="authoring/:id/edit"
              element={<AuthoringEditRedirect />}
            />
            <Route path="test" element={<TestPage />} />
            <Route path="test/:id" element={<TestPage />} />
            <Route path="domains" element={<DomainList />} />
            <Route path="prompts" element={<PromptManagement />} />
            {/* 기출 문항 DB */}
            <Route path="past-exam" element={<PastExamList />} />
            <Route path="past-exam/:id" element={<PastExamDetail />} />
            {/* 진단 평가 */}
            <Route
              path="diagnostic-assessments"
              element={<DiagnosticAssessmentList />}
            />
            <Route
              path="diagnostic-assessments/create"
              element={<DiagnosticAssessmentCreate />}
            />
            <Route
              path="diagnostic-assessments/:assessmentId"
              element={<DiagnosticAssessmentDetail />}
            />
          </Route>

          {/* 시스템 관리자 라우트 */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedUserTypes={["SYSTEM_ADMIN"]}>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<SystemAdminDashboard />} />
            <Route path="diagnostics" element={<DiagnosticsPage />} />
          </Route>

          {/* 진단 페이지 (로그인 필요) */}
          <Route
            path="/diagnostics"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<DiagnosticsPage />} />
          </Route>

          {/* 진단 평가 직접 접근 (로그인 없이 접근 가능) */}
          <Route
            path="/diagnostic/midhigh"
            element={<MidHighDiagnosticAssessment />}
          />
          <Route
            path="/diagnostic/midlow"
            element={<MidLowDiagnosticAssessment />}
          />
          <Route
            path="/diagnostic/elemhigh"
            element={<ElemHighDiagnosticAssessment />}
          />
          <Route
            path="/diagnostic/elemlow"
            element={<ElemLowDiagnosticAssessment />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
