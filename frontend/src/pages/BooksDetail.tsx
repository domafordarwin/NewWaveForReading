import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Delete,
  MenuBook,
  Person,
  Business,
  Category,
  CalendarToday,
  Code,
  Description,
} from "@mui/icons-material";
import { supabase } from "../services/supabaseClient";

interface Book {
  book_id: number;
  title: string;
  author: string;
  publisher: string;
  category: string;
  difficulty_level: string;
  published_year: number;
  isbn: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const difficultyLevelLabels: Record<string, string> = {
  ELEM_LOW: "초등 저학년",
  ELEM_HIGH: "초등 고학년",
  MIDDLE: "중등 저학년",
  HIGH: "중등 고학년",
};

const BooksDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
      setBook(data);
    } catch (err: any) {
      setError(err.message || "도서 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      if (!supabase) {
        setError("데이터베이스 연결이 필요합니다.");
        return;
      }

      const { error } = await supabase
        .from("books")
        .delete()
        .eq("book_id", id);

      if (error) throw error;

      navigate("/question-dev/books", {
        state: { message: "도서가 삭제되었습니다." }
      });
    } catch (err: any) {
      setError(err.message || "도서 삭제에 실패했습니다.");
      setDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !book) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || "도서를 찾을 수 없습니다."}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate("/question-dev/books")}>
          목록으로 돌아가기
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* 헤더 */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/question-dev/books")}
            sx={{ mb: 2 }}
          >
            목록으로
          </Button>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            도서 상세 정보
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/question-dev/books/${id}/edit`)}
          >
            수정
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            삭제
          </Button>
        </Box>
      </Box>

      {/* 도서 정보 */}
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={3}>
          {/* 제목 */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <MenuBook sx={{ fontSize: 40, color: "primary.main" }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {book.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {book.author}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 3 }} />
          </Grid>

          {/* 기본 정보 */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Person fontSize="small" color="action" />
                <Typography variant="subtitle2" color="text.secondary">
                  저자
                </Typography>
              </Box>
              <Typography variant="body1">{book.author}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Business fontSize="small" color="action" />
                <Typography variant="subtitle2" color="text.secondary">
                  출판사
                </Typography>
              </Box>
              <Typography variant="body1">{book.publisher || "-"}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <CalendarToday fontSize="small" color="action" />
                <Typography variant="subtitle2" color="text.secondary">
                  출판년도
                </Typography>
              </Box>
              <Typography variant="body1">{book.published_year || "-"}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Code fontSize="small" color="action" />
                <Typography variant="subtitle2" color="text.secondary">
                  ISBN
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
                {book.isbn || "-"}
              </Typography>
            </Box>
          </Grid>

          {/* 분류 정보 */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Category fontSize="small" color="action" />
                <Typography variant="subtitle2" color="text.secondary">
                  카테고리
                </Typography>
              </Box>
              {book.category ? (
                <Chip label={book.category} color="default" />
              ) : (
                <Typography variant="body1">-</Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Description fontSize="small" color="action" />
                <Typography variant="subtitle2" color="text.secondary">
                  난이도
                </Typography>
              </Box>
              <Chip
                label={difficultyLevelLabels[book.difficulty_level] || book.difficulty_level}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Grid>

          {/* 설명 */}
          {book.description && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  설명
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {book.description}
                </Typography>
              </Box>
            </Grid>
          )}

          {/* 메타 정보 */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mt: 3, display: "flex", gap: 3 }}>
              <Typography variant="caption" color="text.secondary">
                등록일: {new Date(book.created_at).toLocaleString("ko-KR")}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                수정일: {new Date(book.updated_at).toLocaleString("ko-KR")}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>도서 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText>
            '{book.title}' 도서를 삭제하시겠습니까?
            <br />
            삭제된 데이터는 복구할 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            취소
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? "삭제 중..." : "삭제"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BooksDetail;
