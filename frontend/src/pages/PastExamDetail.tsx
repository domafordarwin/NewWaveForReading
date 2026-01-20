import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  ArrowBack,
  ExpandMore,
  CheckCircle,
  Cancel,
  RadioButtonUnchecked,
  MenuBook,
  Quiz,
  Description,
  Grading,
  Assessment,
  School,
  NavigateNext,
  ContentCopy,
  Print,
  Lightbulb,
  Star,
  StarBorder,
} from "@mui/icons-material";
import {
  fetchPastExamItemComplete,
  fetchItemsByStimulus,
} from "../services/pastExamService";
import type {
  PastExamItem,
  ItemOptionWithScoring,
  RubricDetail,
  RubricCriteriaLevel,
  ItemAnswerKey,
  ItemDomain,
} from "../types/pastExam";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <div hidden={value !== index} style={{ paddingTop: 16 }}>
    {value === index && children}
  </div>
);

const PastExamDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 상태
  const [item, setItem] = useState<PastExamItem | null>(null);
  const [options, setOptions] = useState<ItemOptionWithScoring[]>([]);
  const [rubric, setRubric] = useState<RubricDetail | null>(null);
  const [rubricCriteria, setRubricCriteria] = useState<RubricCriteriaLevel[]>(
    [],
  );
  const [, setAnswerKey] = useState<ItemAnswerKey | null>(null);
  const [domains, setDomains] = useState<ItemDomain[]>([]);
  const [relatedItems, setRelatedItems] = useState<PastExamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // 데이터 로드
  useEffect(() => {
    if (id) {
      loadData(parseInt(id));
    }
  }, [id]);

  const loadData = async (itemId: number) => {
    try {
      setLoading(true);
      const data = await fetchPastExamItemComplete(itemId);

      setItem(data.item);
      setOptions(data.options);
      setRubric(data.rubric);
      setRubricCriteria(data.rubricCriteria);
      setAnswerKey(data.answerKey);
      setDomains(data.domains);

      // 같은 지문의 관련 문항 조회
      if (data.item?.stimulus_id) {
        const related = await fetchItemsByStimulus(data.item.stimulus_id);
        setRelatedItems(related.filter((r) => r.item_id !== itemId));
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "문항 정보를 불러오는데 실패했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  // 루브릭 기준을 그룹화
  const groupedRubricCriteria = rubricCriteria.reduce(
    (acc, curr) => {
      if (!acc[curr.criterion_id]) {
        acc[curr.criterion_id] = {
          id: curr.criterion_id,
          name: curr.criterion_name,
          weight: curr.criterion_weight,
          maxPoints: curr.criterion_max_points,
          order: curr.criterion_order,
          levels: [],
        };
      }
      if (curr.level_id) {
        acc[curr.criterion_id].levels.push({
          id: curr.level_id,
          value: curr.level_value || 0,
          descriptor: curr.level_descriptor || "",
          points: curr.level_points || 0,
        });
      }
      return acc;
    },
    {} as Record<
      number,
      {
        id: number;
        name: string;
        weight: number;
        maxPoints: number;
        order: number;
        levels: Array<{
          id: number;
          value: number;
          descriptor: string;
          points: number;
        }>;
      }
    >,
  );

  // 지문 렌더링
  const renderStimulus = () => {
    if (!item?.stimulus_content) return null;

    return (
      <Paper
        sx={{
          p: 3,
          mb: 3,
          bgcolor: "grey.50",
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <MenuBook color="primary" />
          <Typography variant="h6" color="primary">
            {item.stimulus_title || "지문"}
          </Typography>
          {item.stimulus_genre && (
            <Chip label={item.stimulus_genre} size="small" variant="outlined" />
          )}
          {item.stimulus_word_count && (
            <Chip
              label={`${item.stimulus_word_count}자`}
              size="small"
              variant="outlined"
              color="secondary"
            />
          )}
        </Box>

        {/* 지문 이미지 (있는 경우) */}
        {item.stimulus_assets?.images &&
          item.stimulus_assets.images.length > 0 && (
            <Box sx={{ mb: 2 }}>
              {item.stimulus_assets.images.map((img, idx) => (
                <Box key={idx} sx={{ mb: 2, textAlign: "center" }}>
                  <img
                    src={img.url}
                    alt={img.alt || `이미지 ${idx + 1}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: 400,
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                  {img.caption && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {img.caption}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}

        {/* 지문 텍스트 */}
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.8,
            textAlign: "justify",
            fontFamily: "serif",
            fontSize: "1.05rem",
          }}
        >
          {item.stimulus_content}
        </Typography>

        {/* 출처 정보 */}
        {item.stimulus_source && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: "1px solid",
              borderColor: "grey.300",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {item.stimulus_source.source &&
                `출처: ${item.stimulus_source.source}`}
              {item.stimulus_source.author &&
                ` | 저자: ${item.stimulus_source.author}`}
              {item.stimulus_source.copyright &&
                ` | ${item.stimulus_source.copyright}`}
            </Typography>
          </Box>
        )}
      </Paper>
    );
  };

  // 문항 정보 헤더
  const renderItemHeader = () => {
    if (!item) return null;

    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        {/* 브레드크럼 */}
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 2 }}
        >
          <Link
            component="button"
            underline="hover"
            color="inherit"
            onClick={() => navigate("/question-dev/past-exam")}
          >
            기출 문항 DB
          </Link>
          <Link
            component="button"
            underline="hover"
            color="inherit"
            onClick={() =>
              navigate(`/question-dev/past-exam?grade=${item.grade_band}`)
            }
          >
            {item.grade_band_label}
          </Link>
          <Typography color="text.primary">
            {item.item_code || `문항 ${item.item_id}`}
          </Typography>
        </Breadcrumbs>

        {/* 문항 메타 정보 */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            alignItems: "center",
            mb: 2,
          }}
        >
          <Chip
            icon={<School />}
            label={item.grade_band_label}
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={item.item_type === "essay" ? <Description /> : <Quiz />}
            label={item.item_type_label}
            color={item.item_type === "essay" ? "success" : "info"}
          />
          <Chip
            icon={<Grading />}
            label={`${item.max_score}점`}
            color="secondary"
          />
          <Chip
            label={`난이도: ${item.difficulty_label}`}
            color={
              item.difficulty_level && item.difficulty_level >= 4
                ? "error"
                : item.difficulty_level === 3
                  ? "warning"
                  : "success"
            }
            variant="outlined"
          />
        </Box>

        {/* 평가 영역 */}
        {domains.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              평가 영역
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {domains.map((d) => (
                <Chip
                  key={d.domain_id}
                  icon={
                    d.primary_flag ? (
                      <Star fontSize="small" />
                    ) : (
                      <StarBorder fontSize="small" />
                    )
                  }
                  label={`${d.parent_domain_name ? `${d.parent_domain_name} > ` : ""}${d.domain_name}`}
                  size="small"
                  variant={d.primary_flag ? "filled" : "outlined"}
                  color={d.primary_flag ? "primary" : "default"}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* 액션 버튼 */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            onClick={() => setShowAnswer(!showAnswer)}
            startIcon={showAnswer ? <Cancel /> : <CheckCircle />}
          >
            {showAnswer ? "정답 숨기기" : "정답 보기"}
          </Button>
          <Tooltip title="인쇄">
            <IconButton onClick={() => window.print()}>
              <Print />
            </IconButton>
          </Tooltip>
          <Tooltip title="복사">
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(item.question_text);
              }}
            >
              <ContentCopy />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    );
  };

  // 문항 내용
  const renderQuestion = () => {
    if (!item) return null;

    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Quiz color="primary" />
          문항
        </Typography>

        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.8,
            fontSize: "1.1rem",
            p: 2,
            bgcolor: "grey.50",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          {item.question_text}
        </Typography>

        {/* 객관식 보기 */}
        {options.length > 0 && (
          <List sx={{ mt: 2 }}>
            {options.map((opt) => {
              const isCorrect = opt.is_correct;
              const showCorrectness = showAnswer;

              return (
                <ListItem
                  key={opt.option_id}
                  sx={{
                    bgcolor: showCorrectness
                      ? isCorrect
                        ? "success.50"
                        : "grey.50"
                      : "transparent",
                    borderRadius: 1,
                    mb: 1,
                    border: "1px solid",
                    borderColor:
                      showCorrectness && isCorrect
                        ? "success.main"
                        : "grey.200",
                  }}
                >
                  <ListItemIcon>
                    {showCorrectness ? (
                      isCorrect ? (
                        <CheckCircle color="success" />
                      ) : (
                        <RadioButtonUnchecked color="disabled" />
                      )
                    ) : (
                      <RadioButtonUnchecked />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight:
                            showCorrectness && isCorrect ? "bold" : "normal",
                        }}
                      >
                        {opt.label} {opt.option_text}
                      </Typography>
                    }
                    secondary={
                      showAnswer &&
                      opt.feedback && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          💡 {opt.feedback}
                        </Typography>
                      )
                    }
                  />
                  {showAnswer &&
                    opt.partial_score > 0 &&
                    opt.partial_score < 100 && (
                      <Chip
                        label={`근접점수: ${opt.partial_score}%`}
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    )}
                </ListItem>
              );
            })}
          </List>
        )}
      </Paper>
    );
  };

  // 루브릭/채점 기준
  const renderRubric = () => {
    if (!rubric) {
      return (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            이 문항에는 루브릭이 설정되지 않았습니다.
          </Typography>
        </Paper>
      );
    }

    const criteriaArray = Object.values(groupedRubricCriteria).sort(
      (a, b) => a.order - b.order,
    );

    return (
      <Paper sx={{ p: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Grading color="primary" />
          채점 기준 (루브릭)
        </Typography>

        {/* 루브릭 메타 정보 */}
        <Box sx={{ mb: 3 }}>
          <Chip
            label={rubric.rubric_type_label}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ mr: 1 }}
          />
          {rubric.rubric_json?.total_points && (
            <Chip
              label={`총점: ${rubric.rubric_json.total_points}점`}
              color="secondary"
              size="small"
            />
          )}
        </Box>

        {/* 채점 기준 테이블 */}
        {criteriaArray.map((criterion) => (
          <Accordion key={criterion.id} defaultExpanded sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {criterion.name}
                </Typography>
                <Chip
                  label={`가중치 ${criterion.weight}%`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={`최대 ${criterion.maxPoints}점`}
                  size="small"
                  color="secondary"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.100" }}>
                      <TableCell width={80}>수준</TableCell>
                      <TableCell width={80}>점수</TableCell>
                      <TableCell>기술</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {criterion.levels
                      .sort(
                        (
                          a: {
                            id: number;
                            value: number;
                            descriptor: string;
                            points: number;
                          },
                          b: {
                            id: number;
                            value: number;
                            descriptor: string;
                            points: number;
                          },
                        ) => b.value - a.value,
                      )
                      .map(
                        (level: {
                          id: number;
                          value: number;
                          descriptor: string;
                          points: number;
                        }) => (
                          <TableRow
                            key={level.id}
                            sx={{
                              bgcolor:
                                level.value ===
                                Math.max(
                                  ...criterion.levels.map(
                                    (l: { value: number }) => l.value,
                                  ),
                                )
                                  ? "success.50"
                                  : "inherit",
                            }}
                          >
                            <TableCell>
                              <Chip
                                label={level.value}
                                size="small"
                                color={
                                  level.value >= criterion.levels.length - 1
                                    ? "success"
                                    : level.value === 0
                                      ? "error"
                                      : "warning"
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight="bold">
                                {level.points}점
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {level.descriptor}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ),
                      )}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}

        {/* 예시 답안 (있는 경우) */}
        {rubric.rubric_json?.exemplar && (
          <Box sx={{ mt: 3, p: 2, bgcolor: "info.50", borderRadius: 2 }}>
            <Typography variant="subtitle2" color="info.main" gutterBottom>
              <Lightbulb sx={{ mr: 1, verticalAlign: "middle" }} />
              예시 답안
            </Typography>
            <Typography variant="body2">
              {rubric.rubric_json.exemplar}
            </Typography>
          </Box>
        )}
      </Paper>
    );
  };

  // 관련 문항
  const renderRelatedItems = () => {
    if (relatedItems.length === 0) return null;

    return (
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <MenuBook color="primary" />
          같은 지문의 다른 문항
        </Typography>
        <Grid container spacing={2}>
          {relatedItems.map((relItem) => (
            <Grid item xs={12} sm={6} md={4} key={relItem.item_id}>
              <Card
                sx={{
                  cursor: "pointer",
                  "&:hover": { boxShadow: 3 },
                }}
                onClick={() =>
                  navigate(`/question-dev/past-exam/${relItem.item_id}`)
                }
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Chip
                      label={relItem.item_code || `문항 ${relItem.item_id}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip label={relItem.item_type_label} size="small" />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {relItem.question_text}
                  </Typography>
                </CardContent>
              </Card>
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

  if (error || !item) {
    return (
      <Box p={3}>
        <Alert severity="error">{error || "문항을 찾을 수 없습니다."}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/question-dev/past-exam")}
          sx={{ mt: 2 }}
        >
          목록으로
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      {/* 뒤로가기 */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/question-dev/past-exam")}
        sx={{ mb: 2 }}
      >
        목록으로
      </Button>

      {/* 문항 헤더 */}
      {renderItemHeader()}

      {/* 탭 네비게이션 */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={(_, newValue) => setTabIndex(newValue)}
          variant="fullWidth"
        >
          <Tab icon={<Quiz />} iconPosition="start" label="문항" />
          <Tab icon={<Grading />} iconPosition="start" label="채점 기준" />
          <Tab icon={<Assessment />} iconPosition="start" label="영역 분석" />
        </Tabs>
      </Paper>

      {/* 탭 패널 */}
      <TabPanel value={tabIndex} index={0}>
        {/* 지문 */}
        {renderStimulus()}
        {/* 문항 */}
        {renderQuestion()}
        {/* 관련 문항 */}
        {renderRelatedItems()}
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        {renderRubric()}
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <Paper sx={{ p: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Assessment color="primary" />
            평가 영역 분석
          </Typography>

          {domains.length > 0 ? (
            <Grid container spacing={2}>
              {domains.map((domain) => (
                <Grid item xs={12} md={6} key={domain.domain_id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        {domain.primary_flag ? (
                          <Star color="primary" />
                        ) : (
                          <StarBorder color="action" />
                        )}
                        <Typography variant="subtitle1" fontWeight="bold">
                          {domain.domain_name}
                        </Typography>
                        {domain.primary_flag && (
                          <Chip label="주 영역" size="small" color="primary" />
                        )}
                      </Box>
                      {domain.parent_domain_name && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          상위 영역: {domain.parent_domain_name}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        가중치: {domain.weight * 100}%
                      </Typography>
                      {domain.domain_description && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {domain.domain_description}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary">
              평가 영역이 설정되지 않았습니다.
            </Typography>
          )}
        </Paper>
      </TabPanel>
    </Box>
  );
};

export default PastExamDetail;
