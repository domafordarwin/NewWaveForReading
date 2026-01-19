import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Save, Cancel, ArrowBack } from "@mui/icons-material";
import { supabase } from "../services/supabaseClient";

interface BookFormData {
  title: string;
  author: string;
  publisher: string;
  category: string;
  difficulty_level: string;
  published_year: number;
  isbn: string;
  description: string;
}

const BooksEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    publisher: "",
    category: "",
    difficulty_level: "ELEM_HIGH",
    published_year: new Date().getFullYear(),
    isbn: "",
    description: "",
  });

  useEffect(() => {
    if (id) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        setError("데이터베이스 연결이 필요합니다.");
        return;
      }

      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("book_id", id)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title || "",
        author: data.author || "",
        publisher: data.publisher || "",
        category: data.category || "",
        difficulty_level: data.difficulty_level || "ELEM_HIGH",
        published_year: data.published_year || new Date().getFullYear(),
        isbn: data.isbn || "",
        description: data.description || "",
      });
    } catch (err: any) {
      setError(err.message || "도서 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.author.trim()) {
      setError("제목과 저자는 필수 입력 항목입니다.");
      return;
    }

    if (!supabase) {
      setError("데이터베이스 연결이 필요합니다.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const { error: updateError } = await supabase
        .from("books")
        .update({
          title: formData.title,
          author: formData.author,
          publisher: formData.publisher || null,
          category: formData.category || null,
          difficulty_level: formData.difficulty_level,
          published_year: formData.published_year,
          isbn: formData.isbn || null,
          description: formData.description || null,
        })
        .eq("book_id", id);

      if (updateError) throw updateError;

      // 수정 완료 후 상세보기 페이지로 이동
      navigate(`/question-dev/books/${id}`);
    } catch (err: any) {
      setError(err.message || "도서 수정 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/question-dev/books/${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !formData.title) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate("/question-dev/books")}>
          목록으로 돌아가기
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(`/question-dev/books/${id}`)}
          sx={{ mb: 2 }}
        >
          상세보기로
        </Button>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          도서 정보 수정
        </Typography>
        <Typography variant="body2" color="text.secondary">
          도서 정보를 수정합니다.
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* 좌측: 기본 정보 */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                기본 정보
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  label="도서 제목"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  fullWidth
                  placeholder="도서의 제목을 입력하세요"
                />

                <TextField
                  label="저자"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                  fullWidth
                  placeholder="저자명을 입력하세요"
                />

                <TextField
                  label="출판사"
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  fullWidth
                  placeholder="출판사명을 입력하세요"
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>난이도</InputLabel>
                      <Select
                        value={formData.difficulty_level}
                        label="난이도"
                        onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                      >
                        <MenuItem value="ELEM_LOW">초등 저학년</MenuItem>
                        <MenuItem value="ELEM_HIGH">초등 고학년</MenuItem>
                        <MenuItem value="MIDDLE">중등 저학년</MenuItem>
                        <MenuItem value="HIGH">중등 고학년</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="출판년도"
                      type="number"
                      value={formData.published_year}
                      onChange={(e) => setFormData({ ...formData, published_year: parseInt(e.target.value) })}
                      fullWidth
                      inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
                    />
                  </Grid>
                </Grid>

                <TextField
                  label="카테고리"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  fullWidth
                  placeholder="예: 문학, 인문/사회, 과학 등"
                  helperText="도서의 장르나 분야를 입력하세요"
                />

                <TextField
                  label="ISBN"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  fullWidth
                  placeholder="978-89-1234-567-8"
                  helperText="ISBN-10 또는 ISBN-13"
                />
              </Box>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                도서 설명
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <TextField
                label="도서 설명"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={8}
                fullWidth
                placeholder="도서의 내용이나 특징을 간단히 설명해주세요..."
              />
            </Paper>
          </Grid>

          {/* 우측: 안내 */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                안내
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  • 제목과 저자는 필수 입력 항목입니다.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • 난이도는 학생의 학년군에 맞게 선택해주세요.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • ISBN은 도서 뒷표지나 저작권 페이지에서 확인할 수 있습니다.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • 도서 설명은 독자들이 책을 선택하는 데 도움이 됩니다.
                </Typography>
              </Box>
            </Paper>

            <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<Save />}
                disabled={saving}
                fullWidth
              >
                {saving ? "저장 중..." : "변경사항 저장"}
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={saving}
                fullWidth
              >
                취소
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default BooksEdit;
