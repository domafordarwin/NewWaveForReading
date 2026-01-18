import { useState } from "react";
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
  Article,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

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

const StimuliNew = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content_type: "text",
    content_text: "",
    content_url: "",
    grade_band: "초고",
    genre: "",
    source: "",
    author: "",
  });

  const calculateWordCount = (text: string): number => {
    if (!text) return 0;
    // Remove whitespace and count characters (Korean style word count)
    return text.replace(/\s/g, "").length;
  };

  const handleSave = async () => {
    if (!supabase) {
      setError("데이터베이스 연결이 필요합니다.");
      return;
    }

    if (!formData.title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const wordCount = calculateWordCount(formData.content_text);

      const { data, error: insertError } = await supabase
        .from("stimuli")
        .insert([{
          title: formData.title,
          content_type: formData.content_type,
          content_text: formData.content_text || null,
          content_url: formData.content_url || null,
          grade_band: formData.grade_band,
          genre: formData.genre || null,
          source: formData.source || null,
          author: formData.author || null,
          word_count: wordCount > 0 ? wordCount : null,
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // 생성 완료 후 상세 페이지로 이동
      navigate(`/question-dev/stimuli/${data.stimulus_id}`);
    } catch (err: any) {
      setError(err.message || "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
            <Box sx={{ color: "primary.main" }}>
              <Article sx={{ fontSize: 40 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                새 지문 등록
              </Typography>
              <Typography variant="body2" color="text.secondary">
                문항에 사용될 새로운 지문을 등록합니다.
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={saving || !formData.title.trim()}
          >
            {saving ? "저장 중..." : "저장"}
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
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
                placeholder="지문의 제목을 입력하세요"
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
              안내
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="body2" color="text.secondary" paragraph>
              지문은 문항 제작의 기초 자료입니다. 다음 사항을 고려하여 작성해주세요:
            </Typography>
            <Box component="ul" sx={{ pl: 2, "& li": { mb: 1 } }}>
              <Typography component="li" variant="body2" color="text.secondary">
                학년군에 적합한 어휘와 문장 구조를 사용하세요.
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                저작권에 문제가 없는 자료인지 확인하세요.
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                출처를 명확히 기재해주세요.
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                문항 출제에 적합한 길이와 내용인지 검토하세요.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StimuliNew;
