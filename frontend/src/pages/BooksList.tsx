import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
} from "@mui/material";
import {
  Add,
  Edit,
  Visibility,
  Search,
  MenuBook,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

interface Book {
  book_id: number;
  title: string;
  author: string;
  publisher: string;
  published_year: number;
  category: string;
  difficulty_level: string;
  isbn: string;
  created_at: string;
}

const difficultyLevelLabels: Record<string, string> = {
  ELEM_LOW: "초등 저학년",
  ELEM_HIGH: "초등 고학년",
  MIDDLE: "중등 저학년",
  HIGH: "중등 고학년",
};

const BooksList = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        setBooks([]);
        return;
      }
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (err: any) {
      setError(err.message || "도서 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.author?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (b.publisher?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesDifficulty = !filterDifficulty || b.difficulty_level === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              도서 관리
            </Typography>
            <Typography variant="body2" color="text.secondary">
              등록된 도서 정보를 확인하고 관리합니다.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/question-dev/books/new")}
          >
            새 도서 등록
          </Button>
        </Box>

        {/* 검색 및 필터 */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder="도서 검색 (제목, 저자, 출판사)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: "text.secondary", mr: 1 }} />,
            }}
            sx={{ minWidth: 250 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>난이도</InputLabel>
            <Select
              value={filterDifficulty}
              label="난이도"
              onChange={(e) => setFilterDifficulty(e.target.value)}
            >
              <MenuItem value="">전체</MenuItem>
              <MenuItem value="ELEM_LOW">초등 저학년</MenuItem>
              <MenuItem value="ELEM_HIGH">초등 고학년</MenuItem>
              <MenuItem value="MIDDLE">중등 저학년</MenuItem>
              <MenuItem value="HIGH">중등 고학년</MenuItem>
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
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell>제목</TableCell>
                <TableCell>저자</TableCell>
                <TableCell>출판사</TableCell>
                <TableCell>출판년도</TableCell>
                <TableCell>난이도</TableCell>
                <TableCell>카테고리</TableCell>
                <TableCell align="center">관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBooks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {books.length === 0
                        ? "등록된 도서가 없습니다."
                        : "검색 결과가 없습니다."}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBooks.map((book) => (
                  <TableRow
                    key={book.book_id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/question-dev/books/${book.book_id}`)}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <MenuBook color="primary" />
                        <Typography variant="body2" fontWeight="medium">
                          {book.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.publisher}</TableCell>
                    <TableCell>{book.published_year}</TableCell>
                    <TableCell>
                      <Chip
                        label={difficultyLevelLabels[book.difficulty_level] || book.difficulty_level}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {book.category && (
                        <Chip label={book.category} size="small" />
                      )}
                    </TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="상세보기">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/question-dev/books/${book.book_id}`)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="수정">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/question-dev/books/${book.book_id}/edit`)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="body2" color="text.secondary">
          총 {filteredBooks.length}개 도서
        </Typography>
      </Box>
    </Box>
  );
};

export default BooksList;
