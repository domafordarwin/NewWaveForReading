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
  FilterList,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface ItemBank {
  item_id: number;
  item_code: string | null;
  grade_band: string;
  item_type: string;
  stem: string;
  max_score: number;
  difficulty_level: number | null;
  is_active: boolean;
  created_at: string;
}

const itemTypeLabels: Record<string, string> = {
  mcq_single: "객관식 (단일)",
  mcq_multi: "객관식 (복수)",
  short_text: "단답형",
  essay: "서술형",
  fill_blank: "빈칸 채우기",
  composite: "복합문항",
  survey: "설문",
};

const gradeBandLabels: Record<string, string> = {
  초저: "초등 저학년",
  초고: "초등 고학년",
  중저: "중등 저학년",
  중고: "중등 고학년",
};

const ItemBankList = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ItemBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("item_bank")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err: any) {
      setError(err.message || "문항 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.stem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.item_code?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesGrade = !filterGrade || item.grade_band === filterGrade;
    const matchesType = !filterType || item.item_type === filterType;
    return matchesSearch && matchesGrade && matchesType;
  });

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              문항 은행
            </Typography>
            <Typography variant="body2" color="text.secondary">
              등록된 문항을 조회하고 관리합니다.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/question-dev/items/new")}
          >
            새 문항 등록
          </Button>
        </Box>

        {/* 검색 및 필터 */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder="문항 검색..."
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
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>문항 유형</InputLabel>
            <Select
              value={filterType}
              label="문항 유형"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="">전체</MenuItem>
              <MenuItem value="mcq_single">객관식 (단일)</MenuItem>
              <MenuItem value="mcq_multi">객관식 (복수)</MenuItem>
              <MenuItem value="short_text">단답형</MenuItem>
              <MenuItem value="essay">서술형</MenuItem>
              <MenuItem value="fill_blank">빈칸 채우기</MenuItem>
              <MenuItem value="composite">복합문항</MenuItem>
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
                <TableCell>문항 코드</TableCell>
                <TableCell>학년군</TableCell>
                <TableCell>유형</TableCell>
                <TableCell sx={{ maxWidth: 400 }}>문항 내용</TableCell>
                <TableCell align="center">배점</TableCell>
                <TableCell align="center">난이도</TableCell>
                <TableCell align="center">상태</TableCell>
                <TableCell align="center">관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {items.length === 0
                        ? "등록된 문항이 없습니다."
                        : "검색 결과가 없습니다."}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.item_id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {item.item_code || `#${item.item_id}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={gradeBandLabels[item.grade_band] || item.grade_band}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={itemTypeLabels[item.item_type] || item.item_type}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 400 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.stem}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{item.max_score}점</TableCell>
                    <TableCell align="center">
                      {item.difficulty_level ? `${item.difficulty_level}/5` : "-"}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={item.is_active ? "활성" : "비활성"}
                        size="small"
                        color={item.is_active ? "success" : "default"}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="상세보기">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/question-dev/items/${item.item_id}`)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="수정">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/question-dev/items/${item.item_id}/edit`)}
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
          총 {filteredItems.length}개 문항
        </Typography>
      </Box>
    </Box>
  );
};

export default ItemBankList;
