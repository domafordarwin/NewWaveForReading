import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Badge,
  InputAdornment,
  Collapse,
  Divider,
} from "@mui/material";
import {
  Search,
  FilterList,
  ViewModule,
  ViewList,
  ExpandMore,
  ExpandLess,
  Quiz,
  Description,
  Assessment,
  School,
  MenuBook,
} from "@mui/icons-material";
import {
  fetchPastExamItems,
  fetchPastExamStatistics,
} from "../services/pastExamService";
import type { PastExamItem, PastExamStatistics } from "../types/pastExam";
import {
  GRADE_BAND_OPTIONS,
  ITEM_TYPE_OPTIONS,
  DIFFICULTY_OPTIONS,
} from "../types/pastExam";

// 학년군 탭 인덱스 매핑
const gradeBandTabs = ["all", "초저", "초고", "중저", "중고"];

const PastExamList = () => {
  const navigate = useNavigate();

  // 상태
  const [items, setItems] = useState<PastExamItem[]>([]);
  const [statistics, setStatistics] = useState<PastExamStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 필터 상태
  const [tabIndex, setTabIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterDifficulty, setFilterDifficulty] = useState<number | "">("");
  const [showFilters, setShowFilters] = useState(false);

  // 뷰 모드
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // 지문별 그룹화 상태
  const [groupByStimulus, setGroupByStimulus] = useState(true);

  // 데이터 로드
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsData, statsData] = await Promise.all([
        fetchPastExamItems(),
        fetchPastExamStatistics(),
      ]);
      setItems(itemsData);
      setStatistics(statsData);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "데이터를 불러오는데 실패했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  // 필터링된 문항
  const filteredItems = useMemo(() => {
    let result = items;

    // 학년군 필터
    if (tabIndex > 0) {
      const gradeBand = gradeBandTabs[tabIndex];
      result = result.filter((item) => item.grade_band === gradeBand);
    }

    // 검색어 필터
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.question_text.toLowerCase().includes(term) ||
          item.item_code?.toLowerCase().includes(term) ||
          item.stimulus_content?.toLowerCase().includes(term),
      );
    }

    // 문항 유형 필터
    if (filterType) {
      result = result.filter((item) => item.item_type === filterType);
    }

    // 난이도 필터
    if (filterDifficulty !== "") {
      result = result.filter(
        (item) => item.difficulty_level === filterDifficulty,
      );
    }

    return result;
  }, [items, tabIndex, searchTerm, filterType, filterDifficulty]);

  // 지문별 그룹화
  const groupedItems = useMemo(() => {
    if (!groupByStimulus) {
      return { ungrouped: filteredItems };
    }

    const groups: Record<string, PastExamItem[]> = {};

    filteredItems.forEach((item) => {
      const key = item.stimulus_id
        ? `${item.stimulus_id}__${item.stimulus_title || "지문"}`
        : "no_stimulus";

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });

    return groups;
  }, [filteredItems, groupByStimulus]);

  // 통계 카드
  const renderStatisticsCards = () => {
    const currentGradeBand = tabIndex === 0 ? null : gradeBandTabs[tabIndex];
    const relevantStats = currentGradeBand
      ? statistics.filter((s) => s.grade_band === currentGradeBand)
      : statistics;

    const totalItems = relevantStats.reduce((sum, s) => sum + s.total_items, 0);
    const mcqCount = relevantStats.reduce(
      (sum, s) => sum + s.mcq_single_count + s.mcq_multi_count,
      0,
    );
    const essayCount = relevantStats.reduce((sum, s) => sum + s.essay_count, 0);

    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Card sx={{ bgcolor: "primary.light", color: "white" }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="h4" fontWeight="bold">
                {totalItems}
              </Typography>
              <Typography variant="body2">총 문항 수</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ bgcolor: "info.light", color: "white" }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="h4" fontWeight="bold">
                {mcqCount}
              </Typography>
              <Typography variant="body2">객관식</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ bgcolor: "success.light", color: "white" }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="h4" fontWeight="bold">
                {essayCount}
              </Typography>
              <Typography variant="body2">서술형</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ bgcolor: "warning.light", color: "white" }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="h4" fontWeight="bold">
                {tabIndex === 0 ? statistics.length : 1}
              </Typography>
              <Typography variant="body2">학년군</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  // 문항 카드
  const renderItemCard = (item: PastExamItem) => {
    const isEssay = item.item_type === "essay";

    return (
      <Card
        key={item.item_id}
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
        <CardActionArea
          onClick={() => navigate(`/question-dev/past-exam/${item.item_id}`)}
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            {/* 헤더 */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Chip
                label={item.item_code || `문항 ${item.item_id}`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                label={item.difficulty_label}
                size="small"
                color={
                  item.difficulty_level && item.difficulty_level >= 4
                    ? "error"
                    : item.difficulty_level === 3
                      ? "warning"
                      : "success"
                }
              />
            </Box>

            {/* 문항 유형 & 배점 */}
            <Box sx={{ display: "flex", gap: 0.5, mb: 1.5 }}>
              <Chip
                icon={
                  isEssay ? (
                    <Description fontSize="small" />
                  ) : (
                    <Quiz fontSize="small" />
                  )
                }
                label={item.item_type_label}
                size="small"
                variant="filled"
                sx={{ bgcolor: isEssay ? "success.50" : "info.50" }}
              />
              <Chip
                label={`${item.max_score}점`}
                size="small"
                variant="outlined"
                color="secondary"
              />
            </Box>

            {/* 문제 텍스트 */}
            <Typography
              variant="body2"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: 1.5,
                minHeight: "4.5em",
              }}
            >
              {item.question_text}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  };

  // 지문 그룹 렌더링
  const renderStimulusGroup = (key: string, groupItems: PastExamItem[]) => {
    if (key === "no_stimulus") {
      return (
        <Box key={key} sx={{ mb: 4 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            📝 개별 문항 (지문 없음)
          </Typography>
          <Grid container spacing={2}>
            {groupItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.item_id}>
                {renderItemCard(item)}
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    }

    const [, stimulusTitle] = key.split("__");
    const firstItem = groupItems[0];

    return (
      <Paper key={key} sx={{ mb: 4, p: 3, bgcolor: "grey.50" }}>
        {/* 지문 헤더 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <MenuBook color="primary" />
          <Typography variant="h6" color="primary">
            {stimulusTitle}
          </Typography>
          <Badge
            badgeContent={groupItems.length}
            color="primary"
            sx={{ ml: 1 }}
          >
            <Quiz color="action" />
          </Badge>
        </Box>

        {/* 지문 미리보기 */}
        {firstItem.stimulus_content && (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
              maxHeight: 150,
              overflow: "hidden",
              position: "relative",
              bgcolor: "white",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 40,
                background: "linear-gradient(transparent, white)",
              },
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
            >
              {firstItem.stimulus_content}
            </Typography>
          </Paper>
        )}

        {/* 문항 그리드 */}
        <Grid container spacing={2}>
          {groupItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.item_id}>
              {renderItemCard(item)}
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
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

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* 페이지 헤더 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          📚 기출 문항 DB
        </Typography>
        <Typography variant="body1" color="text.secondary">
          문해력 진단 평가 기출 문항과 채점 기준을 확인하세요
        </Typography>
      </Box>

      {/* 통계 카드 */}
      {renderStatisticsCards()}

      {/* 필터 영역 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        {/* 학년군 탭 */}
        <Tabs
          value={tabIndex}
          onChange={(_, newValue) => setTabIndex(newValue)}
          sx={{ mb: 2 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            icon={<School />}
            iconPosition="start"
            label={`전체 (${items.length})`}
          />
          {GRADE_BAND_OPTIONS.map((opt) => {
            const count = items.filter(
              (i) => i.grade_band === opt.value,
            ).length;
            return (
              <Tab
                key={opt.value}
                label={`${opt.label} (${count})`}
                disabled={count === 0}
              />
            );
          })}
        </Tabs>

        <Divider sx={{ mb: 2 }} />

        {/* 검색 및 필터 토글 */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <TextField
            placeholder="문항 검색..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 250, flexGrow: 1, maxWidth: 400 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="outlined"
            startIcon={<FilterList />}
            endIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
            onClick={() => setShowFilters(!showFilters)}
          >
            필터
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title="지문별 그룹화">
            <IconButton
              color={groupByStimulus ? "primary" : "default"}
              onClick={() => setGroupByStimulus(!groupByStimulus)}
            >
              <MenuBook />
            </IconButton>
          </Tooltip>

          <Tooltip title="그리드 보기">
            <IconButton
              color={viewMode === "grid" ? "primary" : "default"}
              onClick={() => setViewMode("grid")}
            >
              <ViewModule />
            </IconButton>
          </Tooltip>

          <Tooltip title="리스트 보기">
            <IconButton
              color={viewMode === "list" ? "primary" : "default"}
              onClick={() => setViewMode("list")}
            >
              <ViewList />
            </IconButton>
          </Tooltip>
        </Box>

        {/* 상세 필터 */}
        <Collapse in={showFilters}>
          <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>문항 유형</InputLabel>
              <Select
                value={filterType}
                label="문항 유형"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="">전체</MenuItem>
                {ITEM_TYPE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>난이도</InputLabel>
              <Select
                value={filterDifficulty}
                label="난이도"
                onChange={(e) =>
                  setFilterDifficulty(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              >
                <MenuItem value="">전체</MenuItem>
                {DIFFICULTY_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="text"
              onClick={() => {
                setSearchTerm("");
                setFilterType("");
                setFilterDifficulty("");
              }}
            >
              필터 초기화
            </Button>
          </Box>
        </Collapse>
      </Paper>

      {/* 검색 결과 */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {filteredItems.length}개의 문항
        </Typography>
      </Box>

      {/* 문항 목록 */}
      {filteredItems.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Assessment sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            조건에 맞는 문항이 없습니다
          </Typography>
          <Typography variant="body2" color="text.secondary">
            다른 필터 조건을 시도해보세요
          </Typography>
        </Paper>
      ) : groupByStimulus ? (
        // 지문별 그룹 뷰
        Object.entries(groupedItems).map(([key, groupItems]) =>
          renderStimulusGroup(key, groupItems),
        )
      ) : (
        // 일반 그리드 뷰
        <Grid container spacing={2}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.item_id}>
              {renderItemCard(item)}
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PastExamList;
