import { lazy, Suspense } from "react";
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

const Login = lazy(() => import("./pages/Login"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const StudentDashboardNew = lazy(() => import("./pages/StudentDashboardNew"));
const StudentFeedback = lazy(() => import("./pages/StudentFeedback"));
const ParentDashboardNew = lazy(() => import("./pages/ParentDashboardNew"));
const ParentChildren = lazy(() => import("./pages/ParentChildren"));
const ParentRecommendedBooks = lazy(
  () => import("./pages/ParentRecommendedBooks"),
);
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const TeacherDashboardNew = lazy(() => import("./pages/TeacherDashboardNew"));
const SchoolAdminDashboard = lazy(() => import("./pages/SchoolAdminDashboard"));
const QuestionDeveloperDashboard = lazy(
  () => import("./pages/QuestionDeveloperDashboard"),
);
const SystemAdminDashboard = lazy(() => import("./pages/SystemAdminDashboard"));
const ReadingProInfo = lazy(() => import("./pages/ReadingProInfo"));
const ReportSample = lazy(() => import("./pages/ReportSample"));
const ItemBankList = lazy(() => import("./pages/ItemBankList"));
const ItemDetail = lazy(() => import("./pages/ItemDetail"));
const ItemEdit = lazy(() => import("./pages/ItemEdit"));
const StimuliList = lazy(() => import("./pages/StimuliList"));
const StimuliDetail = lazy(() => import("./pages/StimuliDetail"));
const StimuliEdit = lazy(() => import("./pages/StimuliEdit"));
const BooksList = lazy(() => import("./pages/BooksList"));
const BooksNew = lazy(() => import("./pages/BooksNew"));
const BooksDetail = lazy(() => import("./pages/BooksDetail"));
const BooksEdit = lazy(() => import("./pages/BooksEdit"));
const AuthoringProjects = lazy(() => import("./pages/AuthoringProjects"));
const AuthoringProjectDetail = lazy(
  () => import("./pages/AuthoringProjectDetail"),
);
const DomainList = lazy(() => import("./pages/DomainList"));
const ReadingQuestionGuide = lazy(() => import("./pages/ReadingQuestionGuide"));
const StimuliNew = lazy(() => import("./pages/StimuliNew"));
const TestPage = lazy(() => import("./pages/TestPage"));
const DiagnosticsPage = lazy(() => import("./pages/DiagnosticsPage"));
const PromptManagement = lazy(() => import("./pages/PromptManagement"));
const PastExamList = lazy(() => import("./pages/PastExamList"));
const PastExamDetail = lazy(() => import("./pages/PastExamDetail"));
const DiagnosticAssessmentList = lazy(
  () => import("./pages/DiagnosticAssessmentList"),
);
const DiagnosticAssessmentCreate = lazy(
  () => import("./pages/DiagnosticAssessmentCreate"),
);
const DiagnosticAssessmentDetail = lazy(
  () => import("./pages/DiagnosticAssessmentDetail"),
);
const StudentAssessmentList = lazy(
  () => import("./pages/StudentAssessmentList"),
);
const StudentAssessmentTake = lazy(
  () => import("./pages/StudentAssessmentTake"),
);
const StudentAssessmentComplete = lazy(
  () => import("./pages/StudentAssessmentComplete"),
);
const StudentAssessmentResult = lazy(
  () => import("./pages/StudentAssessmentResult"),
);
const StudentResults = lazy(() => import("./pages/StudentResults"));
const MidHighDiagnosticAssessment = lazy(
  () => import("./pages/MidHighDiagnosticAssessment"),
);
const MidLowDiagnosticAssessment = lazy(
  () => import("./pages/MidLowDiagnosticAssessment"),
);
const ElemHighDiagnosticAssessment = lazy(
  () => import("./pages/ElemHighDiagnosticAssessment"),
);
const ElemLowDiagnosticAssessment = lazy(
  () => import("./pages/ElemLowDiagnosticAssessment"),
);
const SchoolAdminStudents = lazy(() => import("./pages/SchoolAdminStudents"));
const SchoolAdminClasses = lazy(() => import("./pages/SchoolAdminClasses"));

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
        <Suspense fallback={<div>Loading...</div>}>
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
              <Route
                path="dashboard-old"
                element={<Navigate to="/parent/dashboard" replace />}
              />
              <Route path="children" element={<ParentChildren />} />
              <Route
                path="report-sample"
                element={<ReportSample type="parent" />}
              />
              <Route path="info" element={<ReadingProInfo />} />
              <Route
                path="recommended-books"
                element={<ParentRecommendedBooks />}
              />
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
              <Route
                path="authoring/:id"
                element={<AuthoringProjectDetail />}
              />
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
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
