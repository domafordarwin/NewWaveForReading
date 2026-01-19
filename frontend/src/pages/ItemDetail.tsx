import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  CheckCircle,
  Cancel,
  ExpandMore,
  RadioButtonChecked,
  RadioButtonUnchecked,
  Assignment,
  School,
  Grade,
  Category,
} from "@mui/icons-material";
import { supabase } from "../services/supabaseClient";

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
  updated_at: string;
  stimulus_id: number | null;
  constraints_json: any;
}

interface ItemOption {
  option_id: number;
  item_id: number;
  label: string;
  option_text: string;
  display_order: number;
}

interface ItemOptionScoring {
  option_id: number;
  is_correct: boolean;
  partial_score: number;
  rationale_text: string;
}

interface ItemKey {
  key_id: number;
  target_type: string;
  target_item_id: number;
  answer_type: string;
  correct_option_ids: number[];
  correct_text: string | null;
}

interface Rubric {
  rubric_id: number;
  rubric_type: string;
  target_type: string;
  item_id: number;
  rubric_json: any;
}

interface RubricCriterion {
  criterion_id: number;
  rubric_id: number;
  name: string;
  weight: number;
  max_points: number;
  display_order: number;
}

interface RubricLevel {
  level_id: number;
  criterion_id: number;
  level_value: number;
  descriptor: string;
  points: number;
}

interface Stimulus {
  stimulus_id: number;
  title: string;
  content_text: string;
  content_type: string;
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

const difficultyLabels: Record<number, string> = {
  1: "하",
  2: "중하",
  3: "중",
  4: "중상",
  5: "상",
};

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<ItemBank | null>(null);
  const [options, setOptions] = useState<ItemOption[]>([]);
  const [optionScoring, setOptionScoring] = useState<
    Record<number, ItemOptionScoring>
  >({});
  const [itemKey, setItemKey] = useState<ItemKey | null>(null);
  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [rubricCriteria, setRubricCriteria] = useState<RubricCriterion[]>([]);
  const [rubricLevels, setRubricLevels] = useState<
    Record<number, RubricLevel[]>
  >({});
  const [stimulus, setStimulus] = useState<Stimulus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchItemDetail(parseInt(id));
    }
  }, [id]);

  const fetchItemDetail = async (itemId: number) => {
    try {
      setLoading(true);
      if (!supabase) {
        setError("데이터베이스 연결이 설정되지 않았습니다.");
        return;
      }

      // 문항 기본 정보 조회
      const { data: itemData, error: itemError } = await supabase
        .from("item_bank")
        .select("*")
        .eq("item_id", itemId)
        .single();

      if (itemError) throw itemError;
      setItem(itemData);

      // 지문 조회
      if (itemData.stimulus_id) {
        const { data: stimulusData } = await supabase
          .from("stimuli")
          .select("*")
          .eq("stimulus_id", itemData.stimulus_id)
          .single();
        setStimulus(stimulusData);
      }

      // 문항 옵션 조회 (객관식)
      if (itemData.item_type?.startsWith("mcq")) {
        const { data: optionsData } = await supabase
          .from("item_options")
          .select("*")
          .eq("item_id", itemId)
          .order("display_order");
        setOptions(optionsData || []);

        // 옵션 채점 정보 조회
        if (optionsData && optionsData.length > 0) {
          const optionIds = optionsData.map((o) => o.option_id);
          const { data: scoringData } = await supabase
            .from("item_option_scoring")
            .select("*")
            .in("option_id", optionIds);

          if (scoringData) {
            const scoringMap: Record<number, ItemOptionScoring> = {};
            scoringData.forEach((s) => {
              scoringMap[s.option_id] = s;
            });
            setOptionScoring(scoringMap);
          }
        }
      }

      // 정답 키 조회
      const { data: keyData } = await supabase
        .from("item_keys")
        .select("*")
        .eq("target_type", "item")
        .eq("target_item_id", itemId)
        .single();
      setItemKey(keyData);

      // 루브릭 조회 (서술형)
      if (
        itemData.item_type === "essay" ||
        itemData.item_type === "composite"
      ) {
        const { data: rubricData } = await supabase
          .from("rubrics")
          .select("*")
          .eq("item_id", itemId)
          .single();

        if (rubricData) {
          setRubric(rubricData);

          // 루브릭 기준 조회
          const { data: criteriaData } = await supabase
            .from("rubric_criteria")
            .select("*")
            .eq("rubric_id", rubricData.rubric_id)
            .order("display_order");

          if (criteriaData && criteriaData.length > 0) {
            setRubricCriteria(criteriaData);

            // 각 기준별 레벨 조회
            const criterionIds = criteriaData.map((c) => c.criterion_id);
            const { data: levelsData } = await supabase
              .from("rubric_levels")
              .select("*")
              .in("criterion_id", criterionIds)
              .order("level_value", { ascending: false });

            if (levelsData) {
              const levelsMap: Record<number, RubricLevel[]> = {};
              levelsData.forEach((l) => {
                if (!levelsMap[l.criterion_id]) {
                  levelsMap[l.criterion_id] = [];
                }
                levelsMap[l.criterion_id].push(l);
              });
              setRubricLevels(levelsMap);
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "문항 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !item) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "문항을 찾을 수 없습니다."}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/question-dev/items")}
        >
          목록으로
        </Button>
      </Box>
    );
  }

  const isCorrectOption = (optionId: number): boolean => {
    if (itemKey?.correct_option_ids) {
      return itemKey.correct_option_ids.includes(optionId);
    }
    return optionScoring[optionId]?.is_correct || false;
  };

  return (
    <Box>
      {/* 헤더 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate("/question-dev/items")}
              sx={{ mb: 2 }}
            >
              목록으로
            </Button>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              문항 상세 정보
            </Typography>
            <Typography variant="body2" color="text.secondary">
              문항 코드: {item.item_code || `#${item.item_id}`}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/question-dev/items/${item.item_id}/edit`)}
          >
            수정
          </Button>
        </Box>

        {/* 기본 정보 칩 */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            icon={<School />}
            label={gradeBandLabels[item.grade_band] || item.grade_band}
            color="primary"
          />
          <Chip
            icon={<Category />}
            label={itemTypeLabels[item.item_type] || item.item_type}
          />
          <Chip icon={<Grade />} label={`배점: ${item.max_score}점`} />
          {item.difficulty_level && (
            <Chip
              label={`난이도: ${difficultyLabels[item.difficulty_level] || item.difficulty_level}`}
            />
          )}
          <Chip
            icon={item.is_active ? <CheckCircle /> : <Cancel />}
            label={item.is_active ? "활성" : "비활성"}
            color={item.is_active ? "success" : "default"}
          />
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* 지문 */}
        {stimulus && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Assignment />
                  지문
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  {stimulus.title}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-wrap",
                    bgcolor: "grey.50",
                    p: 2,
                    borderRadius: 1,
                    maxHeight: 300,
                    overflow: "auto",
                  }}
                >
                  {stimulus.content_text}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* 문항 내용 */}
        <Grid item xs={12} md={item.item_type?.startsWith("mcq") ? 8 : 12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                문항 내용
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-wrap",
                  p: 2,
                  bgcolor: "grey.50",
                  borderRadius: 1,
                }}
              >
                {item.stem}
              </Typography>

              {/* 객관식 보기 */}
              {options.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    보기
                  </Typography>
                  <List>
                    {options.map((option) => {
                      const isCorrect = isCorrectOption(option.option_id);
                      const scoring = optionScoring[option.option_id];

                      return (
                        <ListItem
                          key={option.option_id}
                          sx={{
                            bgcolor: isCorrect
                              ? "success.light"
                              : "transparent",
                            borderRadius: 1,
                            mb: 1,
                            border: "1px solid",
                            borderColor: isCorrect
                              ? "success.main"
                              : "grey.300",
                          }}
                        >
                          <ListItemIcon>
                            {isCorrect ? (
                              <RadioButtonChecked color="success" />
                            ) : (
                              <RadioButtonUnchecked />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Typography fontWeight="bold">
                                  {option.label}
                                </Typography>
                                <Typography>{option.option_text}</Typography>
                                {isCorrect && (
                                  <Chip
                                    label="정답"
                                    size="small"
                                    color="success"
                                  />
                                )}
                              </Box>
                            }
                            secondary={
                              scoring?.rationale_text && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {scoring.rationale_text}
                                  {scoring.partial_score !== undefined && (
                                    <> (근접도: {scoring.partial_score}%)</>
                                  )}
                                </Typography>
                              )
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 정답 정보 (객관식) */}
        {item.item_type?.startsWith("mcq") && itemKey && (
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  정답 정보
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  정답 유형:{" "}
                  {itemKey.answer_type === "single_option"
                    ? "단일 선택"
                    : "복수 선택"}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    정답:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {options
                      .filter((o) => isCorrectOption(o.option_id))
                      .map((o) => (
                        <Chip
                          key={o.option_id}
                          label={o.label}
                          color="success"
                          variant="filled"
                        />
                      ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* 루브릭 (서술형) */}
        {rubric && rubricCriteria.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  채점 기준 (루브릭)
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {rubric.rubric_json?.title || "서술형 채점 기준"} - 총점:{" "}
                  {rubric.rubric_json?.total_points || item.max_score}점
                </Typography>
                <Divider sx={{ my: 2 }} />

                {rubricCriteria.map((criterion) => (
                  <Accordion key={criterion.criterion_id} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          width: "100%",
                        }}
                      >
                        <Typography fontWeight="bold">
                          {criterion.name}
                        </Typography>
                        <Chip
                          label={`${criterion.max_points}점`}
                          size="small"
                          color="primary"
                        />
                        <Chip
                          label={`가중치: ${criterion.weight}%`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {(rubricLevels[criterion.criterion_id] || []).map(
                          (level) => (
                            <ListItem
                              key={level.level_id}
                              sx={{
                                bgcolor: "grey.50",
                                borderRadius: 1,
                                mb: 1,
                              }}
                            >
                              <ListItemText
                                primary={
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Chip
                                      label={`${level.points}점`}
                                      size="small"
                                      color={
                                        level.points === criterion.max_points
                                          ? "success"
                                          : "default"
                                      }
                                    />
                                    <Typography variant="body2">
                                      {level.descriptor}
                                    </Typography>
                                  </Box>
                                }
                              />
                            </ListItem>
                          ),
                        )}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* 메타 정보 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                메타 정보
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">
                    생성일
                  </Typography>
                  <Typography variant="body2">
                    {new Date(item.created_at).toLocaleString("ko-KR")}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">
                    수정일
                  </Typography>
                  <Typography variant="body2">
                    {new Date(item.updated_at).toLocaleString("ko-KR")}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">
                    문항 ID
                  </Typography>
                  <Typography variant="body2">{item.item_id}</Typography>
                </Grid>
                {item.constraints_json &&
                  Object.keys(item.constraints_json).length > 0 && (
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        제약 조건
                      </Typography>
                      <Typography variant="body2">
                        {JSON.stringify(item.constraints_json)}
                      </Typography>
                    </Grid>
                  )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ItemDetail;
