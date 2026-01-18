import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Grid,
} from "@mui/material";
import {
  ArrowBack,
  Save,
  Visibility,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

interface Stimulus {
  stimulus_id: number;
  title: string;
  content_type: string;
  content_text: string | null;
  content_url: string | null;
  grade_band: string;
  genre: string | null;
  source: string | null;
  author: string | null;
  word_count: number | null;
  created_at: string;
  updated_at: string;
}

const contentTypeOptions = [
  { value: "text", label: "텍스트" },
  { value: "html", label: "HTML" },
  { value: "markdown", label: "마크다운" },
  { value: "image", label: "이미지" },
  { value: "table", label: "표" },
  { value: "pdf", label: "PDF" },
  { value: "mixed", label: "복합" },
];

const gradeBandOptions = [
  { value: "초저", label: "초등 저학년" },
  { value: "초고", label: "초등 고학년" },
  { value: "중저", label: "중등 저학년" },
  { value: "중고", label: "중등 고학년" },
];

const genreOptions = [
  "문학-시",
  "문학-소설",
  "문학-수필",
  "문학-희곡",
  "비문학-설명문",
  "비문학-논설문",
  "비문학-기사문",
  "비문학-전기문",
  "비문학-안내문",
  "복합",
];

const StimuliEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [stimulus, setStimulus] = useState<Stimulus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content_type: "text",
    content_text: "",
    content_url: "",
    grade_band: "초저",
    genre: "",
    source: "",
    author: "",
  });

  useEffect(() => {
    if (id) {
      fetchStimulusData();
    }
  }, [id]);

  const fetchStimulusData = async () => {
    if (!supabase || !id) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("stimuli")
        .select("*")
        .eq("stimulus_id", parseInt(id))
        .single();

      if (fetchError) throw fetchError;
      if (!data) throw new Error("지문을 찾을 수 없습니다.");

      setStimulus(data);
      setFormData({
        title: data.title || "",
        content_type: data.content_type || "text",
        content_text: data.content_text || "",
        content_url: data.content_url || "",
        grade_band: data.grade_band || "초저",
        genre: data.genre || "",
        source: data.source || "",
        author: data.author || "",
      });
    } catch (err: any) {
      setError(err.message || "지문 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const calculateWordCount = (text: string): number => {
    if (!text) return 0;
    // Remove whitespace and count characters (Korean style word count)
    return text.replace(/\s/g, "").length;
  };

  const handleSave = async () => {
    if (!supabase || !id) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const wordCount = calculateWordCount(formData.content_text);

      const { error: updateError } = await supabase
        .from("stimuli")
        .update({
          title: formData.title,
          content_type: formData.content_type,
          content_text: formData.content_text || null,
          content_url: formData.content_url || null,
          grade_band: formData.grade_band,
          genre: formData.genre || null,
          source: formData.source || null,
          author: formData.author || null,
          word_count: wordCount > 0 ? wordCount : null,
          updated_at: new Date().toISOString(),
        })
        .eq("stimulus_id", parseInt(id));

      if (updateError) throw updateError;

      setSuccess("지문이 성공적으로 저장되었습니다.");
      await fetchStimulusData();
    } catch (err: any) {
      setError(err.message || "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stimulus) {
    return (
      <Alert severity="error">
        지문을 찾을 수 없습니다.
        <Button onClick={() => navigate("/question-dev/stimuli")} sx={{ ml: 2 }}>
          목록으로
        </Button>
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                지문 수정
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stimulus.title}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              onClick={() => navigate(`/question-dev/stimuli/${id}`)}
            >
              상세보기
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "저장 중..." : "저장"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Main Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              기본 정보
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="제목"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                fullWidth
                required
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>콘텐츠 유형</InputLabel>
                    <Select
                      value={formData.content_type}
                      label="콘텐츠 유형"
                      onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                    >
                      {contentTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>학년군</InputLabel>
                    <Select
                      value={formData.grade_band}
                      label="학년군"
                      onChange={(e) => setFormData({ ...formData, grade_band: e.target.value })}
                    >
                      {gradeBandOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>장르</InputLabel>
                    <Select
                      value={formData.genre}
                      label="장르"
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    >
                      <MenuItem value="">선택 안함</MenuItem>
                      {genreOptions.map((genre) => (
                        <MenuItem key={genre} value={genre}>
                          {genre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              지문 내용
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {formData.content_type === "image" || formData.content_type === "pdf" ? (
              <TextField
                label="콘텐츠 URL"
                value={formData.content_url}
                onChange={(e) => setFormData({ ...formData, content_url: e.target.value })}
                fullWidth
                placeholder="https://..."
                helperText="이미지 또는 PDF 파일의 URL을 입력하세요"
              />
            ) : (
              <TextField
                label="지문 텍스트"
                value={formData.content_text}
                onChange={(e) => setFormData({ ...formData, content_text: e.target.value })}
                multiline
                rows={15}
                fullWidth
                placeholder="지문 내용을 입력하세요..."
              />
            )}

            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Typography variant="body2" color="text.secondary">
                글자수: {calculateWordCount(formData.content_text)}자 (공백 제외)
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              출처 정보
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="출처"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                fullWidth
                placeholder="예: 2023년 수능, 교과서 등"
              />

              <TextField
                label="저자"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                fullWidth
                placeholder="저자 또는 작가명"
              />
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              메타 정보
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  지문 ID
                </Typography>
                <Typography variant="body2">{stimulus.stimulus_id}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  생성일
                </Typography>
                <Typography variant="body2">
                  {new Date(stimulus.created_at).toLocaleDateString("ko-KR")}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  수정일
                </Typography>
                <Typography variant="body2">
                  {new Date(stimulus.updated_at).toLocaleDateString("ko-KR")}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StimuliEdit;
