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
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add,
  Edit,
  Visibility,
  Search,
  PlayArrow,
  CheckCircle,
  Schedule,
  Archive,
  SmartToy,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

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

const AuthoringProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<AuthoringProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    grade_band: "초고",
    difficulty_target: 3,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
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
      const { data, error } = await supabase
        .from("authoring_projects")
        .insert([newProject])
        .select()
        .single();

      if (error) throw error;

      setOpenNewDialog(false);
      setNewProject({ title: "", grade_band: "초고", difficulty_target: 3 });
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
      <Dialog open={openNewDialog} onClose={() => setOpenNewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>새 문항 제작 프로젝트</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="프로젝트 제목"
            fullWidth
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>학년군</InputLabel>
            <Select
              value={newProject.grade_band}
              label="학년군"
              onChange={(e) => setNewProject({ ...newProject, grade_band: e.target.value })}
            >
              <MenuItem value="초저">초등 저학년</MenuItem>
              <MenuItem value="초고">초등 고학년</MenuItem>
              <MenuItem value="중저">중등 저학년</MenuItem>
              <MenuItem value="중고">중등 고학년</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>목표 난이도</InputLabel>
            <Select
              value={newProject.difficulty_target}
              label="목표 난이도"
              onChange={(e) => setNewProject({ ...newProject, difficulty_target: e.target.value as number })}
            >
              <MenuItem value={1}>1 (매우 쉬움)</MenuItem>
              <MenuItem value={2}>2 (쉬움)</MenuItem>
              <MenuItem value={3}>3 (보통)</MenuItem>
              <MenuItem value={4}>4 (어려움)</MenuItem>
              <MenuItem value={5}>5 (매우 어려움)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewDialog(false)}>취소</Button>
          <Button
            variant="contained"
            onClick={handleCreateProject}
            disabled={!newProject.title.trim()}
          >
            생성
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuthoringProjects;
