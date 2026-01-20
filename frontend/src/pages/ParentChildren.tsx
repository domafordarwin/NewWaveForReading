/**
 * 학부모 - 자녀 정보 페이지
 *
 * 기능:
 * - 자녀 목록 조회
 * - 자녀별 학습 현황 상세
 * - 자녀의 진단 결과 목록
 */
import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Person,
  School,
  Assessment,
  TrendingUp,
  EmojiEvents,
  ChildCare,
} from "@mui/icons-material";
import { getCurrentUser } from "../utils/session";

interface ChildInfo {
  user_id: number;
  name: string;
  grade: number;
  school_name: string;
  student_grade_level: string;
  email: string;
  student_code?: string;
}

interface EvaluationData {
  evaluation_id: number;
  session_id: number;
  comprehension_score: number;
  inference_score: number;
  critical_score: number;
  expression_score: number;
  total_score: number;
  grade_level: string;
  percentile: number;
  evaluated_at: string;
}

interface SessionData {
  session_id: number;
  grade_band: string;
  status: string;
  created_at: string;
  stimulus?: { title: string }[] | { title: string } | null;
}

// 등급별 색상
const gradeColors: Record<string, string> = {
  A: "#4caf50",
  B: "#2196f3",
  C: "#ff9800",
  D: "#f44336",
};

// 학년군 라벨
const getGradeBandLabel = (band: string): string => {
  const labels: Record<string, string> = {
    초저: "초등 저학년 (1-2학년)",
    초고: "초등 고학년 (3-6학년)",
    중저: "중등 저학년 (중1-2학년)",
    중고: "중등 고학년 (중3-고1)",
  };
  return labels[band] || band;
};

const ParentChildren = () => {
  const user = useMemo(() => getCurrentUser(), []);
  const userId = user?.userId ?? null;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [children, setChildren] = useState<ChildInfo[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildInfo | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [evaluations, setEvaluations] = useState<EvaluationData[]>([]);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [childDataLoading, setChildDataLoading] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState<ChildInfo[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [linking, setLinking] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  const demoChildren: ChildInfo[] = [
    {
      user_id: 1,
      name: "김민준",
      grade: 2,
      school_name: "신명중학교",
      student_grade_level: "중저",
      email: "student1@example.com",
      student_code: "SMJ_123456",
    },
    {
      user_id: 2,
      name: "이서연",
      grade: 3,
      school_name: "신명중학교",
      student_grade_level: "중저",
      email: "student2@example.com",
      student_code: "SMJ_654321",
    },
  ];

  const demoSessions: Record<number, SessionData[]> = useMemo(
    () => ({
      1: [
        {
          session_id: 101,
          grade_band: "중저",
          status: "completed",
          created_at: "2025-01-10T09:00:00Z",
          stimulus: { title: "동물농장" },
        },
        {
          session_id: 102,
          grade_band: "중저",
          status: "in_progress",
          created_at: "2025-01-15T09:00:00Z",
          stimulus: { title: "어린왕자" },
        },
      ],
      2: [
        {
          session_id: 201,
          grade_band: "중저",
          status: "completed",
          created_at: "2025-01-12T09:00:00Z",
          stimulus: { title: "사피엔스" },
        },
      ],
    }),
    [],
  );

  const demoEvaluations: Record<number, EvaluationData[]> = useMemo(
    () => ({
      1: [
        {
          evaluation_id: 9001,
          session_id: 101,
          comprehension_score: 18,
          inference_score: 17,
          critical_score: 16,
          expression_score: 19,
          total_score: 70,
          grade_level: "B",
          percentile: 62,
          evaluated_at: "2025-01-11T10:00:00Z",
        },
      ],
      2: [
        {
          evaluation_id: 9101,
          session_id: 201,
          comprehension_score: 20,
          inference_score: 19,
          critical_score: 18,
          expression_score: 20,
          total_score: 77,
          grade_level: "B",
          percentile: 70,
          evaluated_at: "2025-01-13T10:00:00Z",
        },
      ],
    }),
    [],
  );

  useEffect(() => {
    setLoading(true);
    setError(null);
    setChildren(demoChildren);
    setSelectedChild(demoChildren[0] ?? null);
    setLoading(false);
  }, [userId]);

  const selectedChildId = selectedChild?.user_id ?? null;
  useEffect(() => {
    if (!selectedChildId) return;
    setChildDataLoading(true);
    setSessions(demoSessions[selectedChildId] || []);
    setEvaluations(demoEvaluations[selectedChildId] || []);
    setChildDataLoading(false);
  }, [selectedChildId, demoSessions, demoEvaluations]);

  // 통계 계산
  const stats = {
    totalAssessments: evaluations.length,
    averageScore:
      evaluations.length > 0
        ? Math.round(
            evaluations.reduce((sum, e) => sum + e.total_score, 0) /
              evaluations.length,
          )
        : 0,
    latestGrade: evaluations[0]?.grade_level || "N/A",
    percentile: evaluations[0]?.percentile || 0,
  };

  const handleSearchStudents = async () => {
    const keyword = searchName.trim();
    if (!keyword) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    setLinkError(null);
    try {
      const results = demoChildren.filter((child) =>
        child.name.includes(keyword),
      );
      setSearchResults(results);
    } catch (err) {
      setLinkError(
        err instanceof Error ? err.message : "학생 검색에 실패했습니다.",
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const handleLinkStudent = async (student: ChildInfo) => {
    if (!userId) return;
    setLinking(true);
    setLinkError(null);
    const alreadyLinked = children.some(
      (child) => child.user_id === student.user_id,
    );
    if (alreadyLinked) {
      setLinkError("이미 연결된 자녀입니다.");
      setLinking(false);
      return;
    }

    const nextChildren = [...children, student];
    setChildren(nextChildren);
    if (!selectedChild) {
      setSelectedChild(student);
    }
    setLinkDialogOpen(false);
    setSearchName("");
    setSearchResults([]);
    setLinking(false);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        자녀 정보
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        자녀의 학습 현황과 진단 결과를 확인하세요 👨‍👩‍👧‍👦
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* 자녀 목록 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              <ChildCare sx={{ mr: 1, verticalAlign: "middle" }} />
              자녀 목록
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setLinkDialogOpen(true)}
              sx={{ mb: 2 }}
            >
              자녀 연결
            </Button>
            <Divider sx={{ mb: 2 }} />

            {children.length === 0 ? (
              <Typography color="text.secondary">
                연결된 자녀가 없습니다.
              </Typography>
            ) : (
              <List>
                {children.map((child) => (
                  <ListItem
                    key={child.user_id}
                    button
                    selected={selectedChild?.user_id === child.user_id}
                    onClick={() => setSelectedChild(child)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      border:
                        selectedChild?.user_id === child.user_id
                          ? "2px solid"
                          : "1px solid transparent",
                      borderColor:
                        selectedChild?.user_id === child.user_id
                          ? "primary.main"
                          : "transparent",
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor:
                            selectedChild?.user_id === child.user_id
                              ? "primary.main"
                              : "grey.400",
                        }}
                      >
                        {child.name?.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography fontWeight="bold">{child.name}</Typography>
                      }
                      secondary={`${child.school_name || "학교"} ${child.grade || ""}학년 · ${child.student_code || "-"}`}
                    />
                    {selectedChild?.user_id === child.user_id && (
                      <ListItemSecondaryAction>
                        <Chip label="선택됨" size="small" color="primary" />
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* 선택된 자녀 상세 정보 */}
        <Grid item xs={12} md={8}>
          {selectedChild ? (
            <>
              {/* 자녀 프로필 카드 */}
              <Card
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  mb: 3,
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      mb: 3,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: "rgba(255,255,255,0.2)",
                        fontSize: 32,
                      }}
                    >
                      {selectedChild.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {selectedChild.name}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        {selectedChild.school_name || "학교"}{" "}
                        {selectedChild.grade || ""}학년
                      </Typography>
                      <Chip
                        label={getGradeBandLabel(
                          selectedChild.student_grade_level || "중저",
                        )}
                        size="small"
                        sx={{
                          mt: 1,
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                        }}
                      />
                    </Box>
                  </Box>
                  <Divider
                    sx={{ borderColor: "rgba(255,255,255,0.3)", my: 2 }}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Assessment sx={{ fontSize: 32, opacity: 0.8 }} />
                        <Typography variant="h5" fontWeight="bold">
                          {stats.totalAssessments}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          완료 진단
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <TrendingUp sx={{ fontSize: 32, opacity: 0.8 }} />
                        <Typography variant="h5" fontWeight="bold">
                          {stats.averageScore}점
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          평균 점수
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <EmojiEvents sx={{ fontSize: 32, opacity: 0.8 }} />
                        <Typography variant="h5" fontWeight="bold">
                          {stats.latestGrade}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          최근 등급
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <School sx={{ fontSize: 32, opacity: 0.8 }} />
                        <Typography variant="h5" fontWeight="bold">
                          {stats.percentile}%
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          백분위
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* 탭 영역 */}
              <Paper sx={{ p: 3 }}>
                <Tabs
                  value={selectedTab}
                  onChange={(_, newValue) => setSelectedTab(newValue)}
                  sx={{ mb: 3 }}
                >
                  <Tab label="진단 결과" />
                  <Tab label="진단 세션" />
                </Tabs>

                {/* 진단 결과 탭 */}
                {selectedTab === 0 && (
                  <>
                    {childDataLoading ? (
                      <Box sx={{ textAlign: "center", py: 4 }}>
                        <CircularProgress />
                      </Box>
                    ) : evaluations.length === 0 ? (
                      <Box sx={{ textAlign: "center", py: 4 }}>
                        <Assessment
                          sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                        />
                        <Typography color="text.secondary">
                          아직 완료된 진단이 없습니다.
                        </Typography>
                      </Box>
                    ) : (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>평가일</TableCell>
                              <TableCell align="center">이해력</TableCell>
                              <TableCell align="center">추론력</TableCell>
                              <TableCell align="center">비판적 사고</TableCell>
                              <TableCell align="center">표현력</TableCell>
                              <TableCell align="center">총점</TableCell>
                              <TableCell align="center">등급</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {evaluations.map((eval_) => (
                              <TableRow key={eval_.evaluation_id}>
                                <TableCell>
                                  {new Date(
                                    eval_.evaluated_at,
                                  ).toLocaleDateString("ko-KR")}
                                </TableCell>
                                <TableCell align="center">
                                  {eval_.comprehension_score}
                                </TableCell>
                                <TableCell align="center">
                                  {eval_.inference_score}
                                </TableCell>
                                <TableCell align="center">
                                  {eval_.critical_score}
                                </TableCell>
                                <TableCell align="center">
                                  {eval_.expression_score}
                                </TableCell>
                                <TableCell align="center">
                                  <Typography fontWeight="bold">
                                    {eval_.total_score}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Chip
                                    label={eval_.grade_level}
                                    size="small"
                                    sx={{
                                      bgcolor:
                                        gradeColors[eval_.grade_level] ||
                                        "#9e9e9e",
                                      color: "white",
                                      fontWeight: "bold",
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </>
                )}

                {/* 진단 세션 탭 */}
                {selectedTab === 1 && (
                  <>
                    {childDataLoading ? (
                      <Box sx={{ textAlign: "center", py: 4 }}>
                        <CircularProgress />
                      </Box>
                    ) : sessions.length === 0 ? (
                      <Box sx={{ textAlign: "center", py: 4 }}>
                        <Assessment
                          sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                        />
                        <Typography color="text.secondary">
                          진행된 진단 세션이 없습니다.
                        </Typography>
                      </Box>
                    ) : (
                      <List>
                        {sessions.map((session) => (
                          <ListItem
                            key={session.session_id}
                            sx={{
                              border: "1px solid",
                              borderColor: "divider",
                              borderRadius: 2,
                              mb: 1,
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography fontWeight="bold">
                                  {(Array.isArray(session.stimulus)
                                    ? session.stimulus[0]?.title
                                    : session.stimulus?.title) ||
                                    `진단 #${session.session_id}`}
                                </Typography>
                              }
                              secondary={
                                <>
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {new Date(
                                      session.created_at,
                                    ).toLocaleDateString("ko-KR")}
                                    {" • "}
                                    {getGradeBandLabel(session.grade_band)}
                                  </Typography>
                                </>
                              }
                            />
                            <ListItemSecondaryAction>
                              <Chip
                                label={
                                  session.status === "completed"
                                    ? "완료"
                                    : session.status === "in_progress"
                                      ? "진행 중"
                                      : "대기 중"
                                }
                                size="small"
                                color={
                                  session.status === "completed"
                                    ? "success"
                                    : session.status === "in_progress"
                                      ? "warning"
                                      : "default"
                                }
                              />
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </>
                )}
              </Paper>
            </>
          ) : (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Person sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography color="text.secondary">
                왼쪽에서 자녀를 선택해주세요.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Dialog
        open={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>자녀 연결</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <TextField
              label="학생 이름"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleSearchStudents}
              disabled={searchLoading}
            >
              검색
            </Button>
          </Box>
          {linkError && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {linkError}
            </Alert>
          )}
          <List sx={{ mt: 1 }}>
            {searchLoading ? (
              <ListItem>
                <ListItemText primary="검색 중..." />
              </ListItem>
            ) : searchResults.length === 0 ? (
              <ListItem>
                <ListItemText primary="검색 결과가 없습니다." />
              </ListItem>
            ) : (
              searchResults.map((student) => (
                <ListItem
                  key={student.user_id}
                  secondaryAction={
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleLinkStudent(student)}
                      disabled={linking}
                    >
                      연결
                    </Button>
                  }
                >
                  <ListItemText
                    primary={`${student.name} (${student.grade || "-"}학년)`}
                    secondary={`${student.school_name || "학교"} · ${student.student_code || "-"}`}
                  />
                </ListItem>
              ))
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialogOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ParentChildren;
