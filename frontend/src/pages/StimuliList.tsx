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
  Article,
  Image,
  PictureAsPdf,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

interface Stimulus {
  stimulus_id: number;
  title: string;
  content_type: string;
  content_text: string | null;
  grade_band: string;
  genre: string | null;
  word_count: number | null;
  created_at: string;
  updated_at: string;
}

const contentTypeIcons: Record<string, React.ReactNode> = {
  text: <Article />,
  html: <Article />,
  markdown: <Article />,
  image: <Image />,
  pdf: <PictureAsPdf />,
  mixed: <Article />,
};

const contentTypeLabels: Record<string, string> = {
  text: "텍스트",
  html: "HTML",
  markdown: "마크다운",
  image: "이미지",
  table: "표",
  pdf: "PDF",
  mixed: "복합",
};

const gradeBandLabels: Record<string, string> = {
  초저: "초등 저학년",
  초고: "초등 고학년",
  중저: "중등 저학년",
  중고: "중등 고학년",
};

const StimuliList = () => {
  const navigate = useNavigate();
  const [stimuli, setStimuli] = useState<Stimulus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState<string>("");

  useEffect(() => {
    fetchStimuli();
  }, []);

  const fetchStimuli = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        setStimuli([]);
        return;
      }
      const { data, error } = await supabase
        .from("stimuli")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStimuli(data || []);
    } catch (err: any) {
      setError(err.message || "지문 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const filteredStimuli = stimuli.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.content_text?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesGrade = !filterGrade || s.grade_band === filterGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              지문 관리
            </Typography>
            <Typography variant="body2" color="text.secondary">
              문항에 사용될 지문과 자료를 관리합니다.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/question-dev/stimuli/new")}
          >
            새 지문 등록
          </Button>
        </Box>

        {/* 검색 및 필터 */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder="지문 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: "text.secondary", mr: 1 }} />,
            }}
            sx={{ minWidth: 250 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>학년군</InputLabel>
            <Select
              value={filterGrade}
              label="학년군"
              onChange={(e) => setFilterGrade(e.target.value)}
            >
              <MenuItem value="">전체</MenuItem>
              <MenuItem value="초저">초등 저학년</MenuItem>
              <MenuItem value="초고">초등 고학년</MenuItem>
              <MenuItem value="중저">중등 저학년</MenuItem>
              <MenuItem value="중고">중등 고학년</MenuItem>
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
                <TableCell>유형</TableCell>
                <TableCell>제목</TableCell>
                <TableCell>학년군</TableCell>
                <TableCell>장르</TableCell>
                <TableCell align="center">글자수</TableCell>
                <TableCell>등록일</TableCell>
                <TableCell>최종 수정일</TableCell>
                <TableCell align="center">관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStimuli.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {stimuli.length === 0
                        ? "등록된 지문이 없습니다."
                        : "검색 결과가 없습니다."}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStimuli.map((stimulus) => (
                  <TableRow key={stimulus.stimulus_id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {contentTypeIcons[stimulus.content_type] || <Article />}
                        <Typography variant="body2">
                          {contentTypeLabels[stimulus.content_type] || stimulus.content_type}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {stimulus.title}
                      </Typography>
                      {stimulus.content_text && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "block",
                            maxWidth: 300,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {stimulus.content_text.substring(0, 100)}...
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={gradeBandLabels[stimulus.grade_band] || stimulus.grade_band}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {stimulus.genre && (
                        <Chip label={stimulus.genre} size="small" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {stimulus.word_count ? `${stimulus.word_count}자` : "-"}
                    </TableCell>
                    <TableCell>
                      {new Date(stimulus.created_at).toLocaleDateString("ko-KR")}
                    </TableCell>
                    <TableCell>
                      {new Date(stimulus.updated_at).toLocaleDateString("ko-KR")}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="상세보기">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/question-dev/stimuli/${stimulus.stimulus_id}`)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="수정">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/question-dev/stimuli/${stimulus.stimulus_id}/edit`)}
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
          총 {filteredStimuli.length}개 지문
        </Typography>
      </Box>
    </Box>
  );
};

export default StimuliList;
