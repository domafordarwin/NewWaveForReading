import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Add,
  Edit,
  Search,
  PlayArrow,
  CheckCircle,
  Schedule,
  Archive,
  SmartToy,
  Info,
  CheckCircleOutline,
  LightbulbOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

interface AuthoringProject {
  project_id: number;
  title: string;
  grade_band: string;
  topic_tags: string[];
  difficulty_target: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const statusConfig: Record<string, { label: string; color: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info"; icon: React.ReactNode }> = {
  draft: { label: "초안", color: "default", icon: <Edit /> },
  in_review: { label: "검토 중", color: "warning", icon: <Schedule /> },
  approved: { label: "승인됨", color: "success", icon: <CheckCircle /> },
  published: { label: "발행됨", color: "primary", icon: <PlayArrow /> },
  archived: { label: "보관됨", color: "default", icon: <Archive /> },
};

const gradeBandLabels: Record<string, string> = {
  초저: "초등 저학년",
  초고: "초등 고학년",
  중저: "중등 저학년",
  중고: "중등 고학년",
};

// 프로젝트 생성 가이드 단계
const projectCreationSteps = [
  "프로젝트 기본 정보 입력",
  "지문 선택 또는 생성",
  "AI 문항 초안 생성",
  "문항 검토 및 수정",
];

// 문항 제작 핵심 원칙 (5.01-5.10)
const coreItemPrinciples = [
  { code: "5.01", title: "지문과 문항의 분리", desc: "지문(stimulus)과 문항(item)을 독립적으로 관리합니다." },
  { code: "5.02", title: "복합 구성 지원", desc: "하나의 지문에 여러 문항, 여러 지문에 하나의 문항 연결이 가능합니다." },
  { code: "5.03", title: "문항 파트 구성", desc: "복합문항은 여러 파트(part)로 구성됩니다." },
  { code: "5.04", title: "응답 유형 구분", desc: "객관식, 단답형, 서술형, 빈칸 채우기 등을 지원합니다." },
  { code: "5.05", title: "채점 방식 정의", desc: "자동/수동/부분점수 등 다양한 채점 방식을 설정합니다." },
  { code: "5.06", title: "루브릭 지원", desc: "서술형 문항에 대한 상세 채점 기준을 정의합니다." },
  { code: "5.07", title: "난이도 관리", desc: "목표 난이도와 실제 난이도를 별도로 관리합니다." },
  { code: "5.08", title: "메타데이터 관리", desc: "영역, 학년군, 성취기준 등 메타정보를 관리합니다." },
  { code: "5.09", title: "버전 관리", desc: "문항의 수정 이력을 버전별로 보관합니다." },
  { code: "5.10", title: "검토 워크플로우", desc: "초안-검토-승인-발행의 단계별 관리를 지원합니다." },
];

// 플레이스홀더 생성 함수
const generateProjectPlaceholder = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // 26
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 01
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${year}${month}_문항제작_${random}`;
};

const AuthoringProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<AuthoringProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    title: generateProjectPlaceholder(),
    grade_band: "초고",
    difficulty_target: 3,
  });
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        setProjects([]);
        return;
      }
      const { data, error } = await supabase
        .from("authoring_projects")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      setError(err.message || "프로젝트 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      if (!supabase) {
        setError("데이터베이스 연결이 필요합니다.");
        return;
      }
      const { data, error } = await supabase
        .from("authoring_projects")
        .insert([newProject])
        .select()
        .single();

      if (error) throw error;

      setOpenNewDialog(false);
      setNewProject({ title: generateProjectPlaceholder(), grade_band: "초고", difficulty_target: 3 });
      navigate(`/question-dev/authoring/${data.project_id}`);
    } catch (err: any) {
      setError(err.message || "프로젝트 생성에 실패했습니다.");
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    const counts: Record<string, number> = {
      draft: 0,
      in_review: 0,
      approved: 0,
      published: 0,
    };
    projects.forEach((p) => {
      if (counts[p.status] !== undefined) counts[p.status]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              문항 제작 프로젝트
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI 기반 문항 생성 및 검토 워크플로우를 관리합니다.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenNewDialog(true)}
          >
            새 프로젝트
          </Button>
        </Box>

        {/* 상태별 요약 */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: "center", bgcolor: "grey.50" }}>
              <Typography variant="h4" fontWeight="bold">{statusCounts.draft}</Typography>
              <Typography variant="body2" color="text.secondary">초안</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: "center", bgcolor: "warning.50" }}>
              <Typography variant="h4" fontWeight="bold" color="warning.main">{statusCounts.in_review}</Typography>
              <Typography variant="body2" color="text.secondary">검토 중</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: "center", bgcolor: "success.50" }}>
              <Typography variant="h4" fontWeight="bold" color="success.main">{statusCounts.approved}</Typography>
              <Typography variant="body2" color="text.secondary">승인됨</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: "center", bgcolor: "primary.50" }}>
              <Typography variant="h4" fontWeight="bold" color="primary.main">{statusCounts.published}</Typography>
              <Typography variant="body2" color="text.secondary">발행됨</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* 검색 및 필터 */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder="프로젝트 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: "text.secondary", mr: 1 }} />,
            }}
            sx={{ minWidth: 250 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>상태</InputLabel>
            <Select
              value={filterStatus}
              label="상태"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="">전체</MenuItem>
              <MenuItem value="draft">초안</MenuItem>
              <MenuItem value="in_review">검토 중</MenuItem>
              <MenuItem value="approved">승인됨</MenuItem>
              <MenuItem value="published">발행됨</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredProjects.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <SmartToy sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {projects.length === 0
              ? "아직 프로젝트가 없습니다."
              : "검색 결과가 없습니다."}
          </Typography>
          {projects.length === 0 && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenNewDialog(true)}
              sx={{ mt: 2 }}
            >
              첫 프로젝트 만들기
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredProjects.map((project) => {
            const status = statusConfig[project.status] || statusConfig.draft;
            return (
              <Grid item xs={12} sm={6} md={4} key={project.project_id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Chip
                        label={status.label}
                        color={status.color}
                        size="small"
                        icon={status.icon as any}
                      />
                      <Chip
                        label={gradeBandLabels[project.grade_band] || project.grade_band}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {project.title}
                    </Typography>
                    {project.topic_tags.length > 0 && (
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}>
                        {project.topic_tags.slice(0, 3).map((tag, idx) => (
                          <Chip key={idx} label={tag} size="small" variant="outlined" />
                        ))}
                        {project.topic_tags.length > 3 && (
                          <Chip label={`+${project.topic_tags.length - 3}`} size="small" />
                        )}
                      </Box>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      목표 난이도: {project.difficulty_target || "-"}/5
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      최종 수정: {new Date(project.updated_at).toLocaleDateString("ko-KR")}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end", p: 2, pt: 0 }}>
                    <Button
                      size="small"
                      onClick={() => navigate(`/question-dev/authoring/${project.project_id}`)}
                    >
                      상세보기
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => navigate(`/question-dev/authoring/${project.project_id}/edit`)}
                    >
                      작업하기
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* 새 프로젝트 생성 다이얼로그 */}
      <Dialog open={openNewDialog} onClose={() => setOpenNewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SmartToy color="primary" />
            새 문항 제작 프로젝트
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* 프로젝트 생성 워크플로우 안내 */}
          <Paper sx={{ p: 2, mb: 3, bgcolor: "primary.50", border: "1px solid", borderColor: "primary.200" }}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary.main" gutterBottom>
              <Info sx={{ fontSize: 18, mr: 0.5, verticalAlign: "middle" }} />
              문항 제작 워크플로우
            </Typography>
            <Stepper activeStep={0} alternativeLabel sx={{ mt: 2 }}>
              {projectCreationSteps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          <Grid container spacing={3}>
            {/* 왼쪽: 기본 정보 입력 */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                기본 정보
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                label="프로젝트 제목"
                fullWidth
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                placeholder={generateProjectPlaceholder()}
                helperText="예: 2601_문항제작_초고_서술형"
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>학년군</InputLabel>
                <Select
                  value={newProject.grade_band}
                  label="학년군"
                  onChange={(e) => setNewProject({ ...newProject, grade_band: e.target.value })}
                >
                  <MenuItem value="초저">초등 저학년 (1-2학년)</MenuItem>
                  <MenuItem value="초고">초등 고학년 (3-6학년)</MenuItem>
                  <MenuItem value="중저">중등 저학년 (중1-2)</MenuItem>
                  <MenuItem value="중고">중등 고학년 (중3-고1)</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>목표 난이도</InputLabel>
                <Select
                  value={newProject.difficulty_target}
                  label="목표 난이도"
                  onChange={(e) => setNewProject({ ...newProject, difficulty_target: e.target.value as number })}
                >
                  <MenuItem value={1}>1단계 (매우 쉬움) - 기초 이해</MenuItem>
                  <MenuItem value={2}>2단계 (쉬움) - 내용 파악</MenuItem>
                  <MenuItem value={3}>3단계 (보통) - 추론 적용</MenuItem>
                  <MenuItem value={4}>4단계 (어려움) - 분석 종합</MenuItem>
                  <MenuItem value={5}>5단계 (매우 어려움) - 비판 평가</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* 오른쪽: 가이드 */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  <LightbulbOutlined sx={{ fontSize: 18, mr: 0.5, verticalAlign: "middle" }} />
                  문항 제작 원칙
                </Typography>
                <Button size="small" onClick={() => setShowGuide(!showGuide)}>
                  {showGuide ? "접기" : "펼치기"}
                </Button>
              </Box>
              {showGuide && (
                <Paper variant="outlined" sx={{ maxHeight: 280, overflow: "auto", p: 1 }}>
                  <List dense>
                    {coreItemPrinciples.map((principle) => (
                      <ListItem key={principle.code} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleOutline color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight="medium">
                              [{principle.code}] {principle.title}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {principle.desc}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* 다음 단계 안내 */}
          <Alert severity="info" icon={<Info />}>
            프로젝트 생성 후 <strong>지문 선택</strong> 또는 <strong>새 지문 등록</strong>을 진행합니다.
            이후 AI를 활용하여 문항 초안을 자동 생성할 수 있습니다.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenNewDialog(false)}>취소</Button>
          <Button
            variant="contained"
            onClick={handleCreateProject}
            disabled={!newProject.title.trim()}
            startIcon={<Add />}
          >
            프로젝트 생성
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuthoringProjects;
