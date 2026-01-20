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
import { useSupabase } from "../services/supabaseClient";

interface ChildInfo {
  user_id: number;
  name: string;
  grade: number;
  school_name: string;
  student_grade_level: string;
  email: string;
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

interface RelationData {
  student_id: number;
  student: ChildInfo[] | ChildInfo;
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
  const supabase = useSupabase();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [children, setChildren] = useState<ChildInfo[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildInfo | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [evaluations, setEvaluations] = useState<EvaluationData[]>([]);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [childDataLoading, setChildDataLoading] = useState(false);

  // 자녀 목록 로드
  useEffect(() => {
    const loadChildren = async () => {
      if (!supabase || !userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 학부모-학생 관계에서 자녀 찾기
        const { data: relationsData, error: relationsError } = await supabase
          .from("student_parent_relations")
          .select(
            `
            student_id,
            student:users!student_parent_relations_student_id_fkey(
              user_id,
              name,
              grade,
              school_name,
              student_grade_level,
              email
            )
          `,
          )
          .eq("parent_id", userId);

        if (relationsError) {
          console.warn("자녀 관계 로드 에러:", relationsError);

          // 관계 테이블이 없으면 이메일 패턴으로 찾기 (레거시 호환)
          const emailMatch = user.email?.match(/parent_student(\d+)@/);
          if (emailMatch) {
            const { data: studentData } = await supabase
              .from("users")
              .select("*")
              .eq("user_type", "STUDENT")
              .eq("email", `student${emailMatch[1]}@example.com`)
              .single();

            if (studentData) {
              setChildren([studentData]);
              setSelectedChild(studentData);
            }
          }
        } else if (relationsData && relationsData.length > 0) {
          const childList = relationsData
            .map((r: RelationData) => {
              return Array.isArray(r.student) ? r.student[0] : r.student;
            })
            .filter(Boolean);
          setChildren(childList);
          if (childList.length > 0) {
            setSelectedChild(childList[0]);
          }
        } else {
          // 데모 데이터
          const demoChild: ChildInfo = {
            user_id: 1,
            name: "김민준",
            grade: 2,
            school_name: "서울중학교",
            student_grade_level: "중저",
            email: "student1@example.com",
          };
          setChildren([demoChild]);
          setSelectedChild(demoChild);
        }
      } catch (err: unknown) {
        console.error("자녀 로드 실패:", err);
        setError(
          err instanceof Error
            ? err.message
            : "데이터를 불러오는데 실패했습니다.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadChildren();
  }, [supabase, userId]);

  // 선택된 자녀의 진단 세션 및 평가 결과 로드
  const selectedChildId = selectedChild?.user_id ?? null;
  useEffect(() => {
    const loadChildData = async () => {
      if (!supabase || !selectedChildId) return;
      setChildDataLoading(true);
      try {
        // 진단 세션 조회
        const { data: sessionsData } = await supabase
          .from("assessment_sessions")
          .select(
            `
            session_id,
            grade_band,
            status,
            created_at,
            stimulus:stimuli(title)
          `,
          )
          .eq("student_id", selectedChildId)
          .order("created_at", { ascending: false });

        setSessions(sessionsData || []);

        if (sessionsData && sessionsData.length > 0) {
          const sessionIds = sessionsData.map((s: SessionData) => s.session_id);

          // 평가 결과 조회
          const { data: evalData } = await supabase
            .from("ai_evaluations")
            .select("*")
            .in("session_id", sessionIds)
            .order("evaluated_at", { ascending: false });

          setEvaluations(evalData || []);
        } else {
          setEvaluations([]);
        }
      } catch (err) {
        console.error("자녀 데이터 로드 실패:", err);
      } finally {
        setChildDataLoading(false);
      }
    };
    loadChildData();
  }, [supabase, selectedChildId]);

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
                      secondary={`${child.school_name || "학교"} ${child.grade || ""}학년`}
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
    </Box>
  );
};

export default ParentChildren;
