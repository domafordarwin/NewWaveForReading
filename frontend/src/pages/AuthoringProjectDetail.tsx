import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Tooltip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Save,
  Add,
  Delete,
  Visibility,
  SmartToy,
  Article,
  Search,
  CheckCircle,
  Schedule,
  PlayArrow,
  ExpandMore,
  ContentCopy,
  History,
  Refresh,
  Star,
  StarBorder,
  Send,
  AutoAwesome,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { generateItems, validateGeneratedItem, type GeneratedItem } from "../services/openaiService";

interface AuthoringProject {
  project_id: number;
  title: string;
  grade_band: string;
  topic_tags: string[];
  difficulty_target: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Stimulus {
  stimulus_id: number;
  title: string;
  content_type: string;
  content_text: string | null;
  grade_band: string;
  genre: string | null;
  word_count: number | null;
}

// 실제 DB 스키마에 맞춘 인터페이스
interface AuthoringItem {
  draft_item_id: number;
  project_id: number;
  item_kind: string;
  status: string;
  current_version_id: number | null;
  created_at: string;
  // 조인된 버전 정보
  current_version?: {
    version_id: number;
    content_json: any;
    created_at: string;
  };
}

interface AIGenerationJob {
  job_id: number;
  job_type: string;
  status: string;
  progress: number;
  result_json: any;
  error_message: string | null;
  created_at: string;
}

// 문항 유형 옵션 (DB 스키마의 item_kind에 맞춤)
const itemTypeOptions = [
  { value: "mcq", label: "객관식" },
  { value: "essay", label: "서술형" },
  { value: "composite", label: "복합문항" },
  { value: "survey", label: "설문" },
];

// 상태 설정 (DB 스키마의 status에 맞춤)
const statusConfig: Record<string, { label: string; color: "default" | "primary" | "success" | "warning" | "error" }> = {
  ai_draft: { label: "AI 초안", color: "default" },
  editing: { label: "편집 중", color: "warning" },
  in_review: { label: "검토 중", color: "primary" },
  approved: { label: "승인됨", color: "success" },
  rejected: { label: "반려됨", color: "error" },
};

const gradeBandLabels: Record<string, string> = {
  초저: "초등 저학년",
  초고: "초등 고학년",
  중저: "중등 저학년",
  중고: "중등 고학년",
};

// AI 프롬프트 템플릿
const aiPromptTemplates = [
  {
    id: "reading_comprehension",
    name: "독해력 문항",
    description: "지문 내용 이해도를 평가하는 문항",
    prompt: "주어진 지문을 바탕으로 독해력을 평가하는 {item_type} 문항을 생성해주세요. 학년군: {grade_band}, 난이도: {difficulty}/5",
  },
  {
    id: "inference",
    name: "추론 문항",
    description: "지문에 명시되지 않은 내용을 추론하는 문항",
    prompt: "주어진 지문을 바탕으로 추론 능력을 평가하는 {item_type} 문항을 생성해주세요. 학년군: {grade_band}, 난이도: {difficulty}/5",
  },
  {
    id: "vocabulary",
    name: "어휘력 문항",
    description: "어휘의 의미나 사용법을 평가하는 문항",
    prompt: "주어진 지문의 어휘를 활용하여 어휘력을 평가하는 {item_type} 문항을 생성해주세요. 학년군: {grade_band}, 난이도: {difficulty}/5",
  },
  {
    id: "critical_thinking",
    name: "비판적 사고 문항",
    description: "내용을 비판적으로 분석하는 문항",
    prompt: "주어진 지문을 바탕으로 비판적 사고력을 평가하는 {item_type} 문항을 생성해주세요. 학년군: {grade_band}, 난이도: {difficulty}/5",
  },
  {
    id: "summary",
    name: "요약 문항",
    description: "핵심 내용을 요약하는 문항",
    prompt: "주어진 지문의 핵심 내용을 파악하고 요약하는 {item_type} 문항을 생성해주세요. 학년군: {grade_band}, 난이도: {difficulty}/5",
  },
];

// 루브릭 템플릿
const rubricTemplates = [
  {
    id: "essay_basic",
    name: "서술형 기본 루브릭",
    itemType: "essay",
    criteria: [
      { name: "내용 이해", weight: 40, levels: ["불충분", "기초", "보통", "우수", "탁월"] },
      { name: "논리적 전개", weight: 30, levels: ["불충분", "기초", "보통", "우수", "탁월"] },
      { name: "표현력", weight: 30, levels: ["불충분", "기초", "보통", "우수", "탁월"] },
    ],
  },
  {
    id: "short_answer",
    name: "단답형 기본 루브릭",
    itemType: "short_text",
    criteria: [
      { name: "정확성", weight: 70, levels: ["오답", "부분 정답", "정답"] },
      { name: "표현", weight: 30, levels: ["부적절", "적절"] },
    ],
  },
];

const AuthoringProjectDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // 상태
  const [project, setProject] = useState<AuthoringProject | null>(null);
  const [stimuli, setStimuli] = useState<Stimulus[]>([]);
  const [items, setItems] = useState<AuthoringItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 탭 상태
  const [activeTab, setActiveTab] = useState(0);

  // 지문 선택 다이얼로그
  const [stimulusDialogOpen, setStimulusDialogOpen] = useState(false);
  const [availableStimuli, setAvailableStimuli] = useState<Stimulus[]>([]);
  const [stimulusSearch, setStimulusSearch] = useState("");
  const [selectedStimulus, setSelectedStimulus] = useState<Stimulus | null>(null);

  // AI 생성 다이얼로그
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiItemType, setAiItemType] = useState("mcq_single");
  const [aiPromptTemplate, setAiPromptTemplate] = useState(aiPromptTemplates[0]);
  const [aiCustomPrompt, setAiCustomPrompt] = useState("");
  const [aiItemCount, setAiItemCount] = useState(3);
  const [aiGeneratedItems, setAiGeneratedItems] = useState<any[]>([]);

  // 문항 편집 다이얼로그
  const [itemEditDialogOpen, setItemEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AuthoringItem | null>(null);
  const [editingItemData, setEditingItemData] = useState({
    stem: "",
    item_type: "mcq_single",
    options: [{ text: "", is_correct: false }],
    rubric: null as any,
  });

  // 버전 히스토리 다이얼로그
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [itemVersions, setItemVersions] = useState<any[]>([]);

  // 프롬프트 즐겨찾기
  const [favoritePrompts, setFavoritePrompts] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoritePrompts");
    return saved ? JSON.parse(saved) : [];
  });

  // 데이터 로드
  useEffect(() => {
    if (id) {
      fetchProjectData();
    }
  }, [id]);

  const fetchProjectData = async () => {
    if (!supabase || !id) return;

    try {
      setLoading(true);
      setError(null);

      // 프로젝트 조회
      const { data: projectData, error: projectError } = await supabase
        .from("authoring_projects")
        .select("*")
        .eq("project_id", parseInt(id))
        .single();

      if (projectError) throw projectError;
      if (!projectData) throw new Error("프로젝트를 찾을 수 없습니다.");

      setProject(projectData);

      // 연결된 지문 조회
      const { data: stimuliData } = await supabase
        .from("stimuli")
        .select("*")
        .order("created_at", { ascending: false });

      if (stimuliData) {
        setStimuli(stimuliData);
      }

      // 프로젝트의 문항 조회 (버전 정보 포함)
      const { data: itemsData } = await supabase
        .from("authoring_items")
        .select(`
          draft_item_id,
          project_id,
          item_kind,
          status,
          current_version_id,
          created_at,
          authoring_item_versions!authoring_items_current_version_id_fkey (
            version_id,
            content_json,
            created_at
          )
        `)
        .eq("project_id", parseInt(id))
        .order("created_at", { ascending: false });

      if (itemsData) {
        // 조인된 데이터 구조 정리
        const formattedItems = itemsData.map((item: any) => ({
          ...item,
          current_version: item.authoring_item_versions?.[0] || null,
        }));
        setItems(formattedItems);
      }
    } catch (err: any) {
      setError(err.message || "데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 지문 검색
  const fetchAvailableStimuli = async () => {
    if (!supabase) return;

    const { data } = await supabase
      .from("stimuli")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setAvailableStimuli(data);
    }
  };

  const handleOpenStimulusDialog = () => {
    fetchAvailableStimuli();
    setStimulusDialogOpen(true);
  };

  const handleSelectStimulus = (stimulus: Stimulus) => {
    setSelectedStimulus(stimulus);
    setStimulusDialogOpen(false);
  };

  // AI 문항 생성
  const handleGenerateItems = async () => {
    if (!selectedStimulus || !project) {
      setError("지문을 먼저 선택해주세요.");
      return;
    }

    setAiGenerating(true);
    setAiGeneratedItems([]);

    try {
      // OpenAI 서비스를 통한 문항 생성
      const response = await generateItems({
        stimulusText: selectedStimulus.content_text || "",
        stimulusTitle: selectedStimulus.title,
        itemType: aiItemType,
        gradeBand: project.grade_band,
        difficulty: project.difficulty_target || 3,
        count: aiItemCount,
        customPrompt: aiCustomPrompt || undefined,
      });

      if (!response.success) {
        throw new Error(response.error || "문항 생성에 실패했습니다.");
      }

      // 생성된 문항 설정
      const itemsWithValidation = response.items.map(item => ({
        ...item,
        rubric: item.rubric || (item.item_type === "essay" ? rubricTemplates.find(r => r.itemType === "essay") : null),
      }));

      setAiGeneratedItems(itemsWithValidation);
      setSuccess(`AI 문항 초안 ${response.items.length}개가 생성되었습니다. 검토 후 저장해주세요.`);

      // AI 생성 완료 후 다이얼로그 닫기
      setAiDialogOpen(false);
    } catch (err: any) {
      setError(err.message || "AI 문항 생성에 실패했습니다.");
    } finally {
      setAiGenerating(false);
    }
  };

  // AI 생성 문항 저장 (실제 DB 스키마에 맞춤)
  const handleSaveGeneratedItem = async (item: any, index: number) => {
    if (!supabase || !project || !selectedStimulus) return;

    try {
      // 1. 먼저 authoring_items에 문항 생성
      const { data: itemData, error: itemError } = await supabase
        .from("authoring_items")
        .insert([{
          project_id: project.project_id,
          item_kind: item.item_type === "mcq_single" || item.item_type === "mcq_multi" ? "mcq" : item.item_type,
          status: "ai_draft",
        }])
        .select()
        .single();

      if (itemError) throw itemError;

      // 2. 버전 정보 생성 (content_json에 실제 문항 내용 저장)
      const contentJson = {
        stem: item.stem,
        stimulus_id: selectedStimulus.stimulus_id,
        options: item.options || [],
        explanation: item.explanation || "",
        rubric: item.rubric || null,
        keywords: item.keywords || [],
      };

      const { data: versionData, error: versionError } = await supabase
        .from("authoring_item_versions")
        .insert([{
          draft_item_id: itemData.draft_item_id,
          content_json: contentJson,
          change_summary: "AI 초안 생성",
        }])
        .select()
        .single();

      if (versionError) throw versionError;

      // 3. authoring_items의 current_version_id 업데이트
      await supabase
        .from("authoring_items")
        .update({ current_version_id: versionData.version_id })
        .eq("draft_item_id", itemData.draft_item_id);

      // 목록 새로고침
      await fetchProjectData();

      // 저장된 항목 제거
      setAiGeneratedItems(prev => prev.filter((_, i) => i !== index));
      setSuccess("문항이 저장되었습니다.");
    } catch (err: any) {
      setError(err.message || "문항 저장에 실패했습니다.");
    }
  };

  // 문항 편집
  const handleEditItem = (item: AuthoringItem) => {
    setEditingItem(item);
    const content = item.current_version?.content_json || {};
    setEditingItemData({
      stem: content.stem || "",
      item_type: item.item_kind,
      options: content.options || [{ text: "", is_correct: false }],
      rubric: content.rubric || null,
    });
    setItemEditDialogOpen(true);
  };

  const handleSaveItem = async () => {
    if (!supabase || !editingItem) return;

    try {
      // 새 버전 생성
      const contentJson = {
        stem: editingItemData.stem,
        options: editingItemData.options,
        rubric: editingItemData.rubric,
      };

      const { data: versionData, error: versionError } = await supabase
        .from("authoring_item_versions")
        .insert([{
          draft_item_id: editingItem.draft_item_id,
          based_on_version_id: editingItem.current_version_id,
          content_json: contentJson,
          change_summary: "수동 편집",
        }])
        .select()
        .single();

      if (versionError) throw versionError;

      // current_version_id 및 status 업데이트
      const { error } = await supabase
        .from("authoring_items")
        .update({
          current_version_id: versionData.version_id,
          status: "editing",
        })
        .eq("draft_item_id", editingItem.draft_item_id);

      if (error) throw error;

      setItemEditDialogOpen(false);
      setEditingItem(null);
      await fetchProjectData();
      setSuccess("문항이 수정되었습니다.");
    } catch (err: any) {
      setError(err.message || "문항 수정에 실패했습니다.");
    }
  };

  // 문항 삭제
  const handleDeleteItem = async (itemId: number) => {
    if (!supabase || !window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase
        .from("authoring_items")
        .delete()
        .eq("draft_item_id", itemId);

      if (error) throw error;

      await fetchProjectData();
      setSuccess("문항이 삭제되었습니다.");
    } catch (err: any) {
      setError(err.message || "문항 삭제에 실패했습니다.");
    }
  };

  // 프롬프트 즐겨찾기 토글
  const toggleFavoritePrompt = (promptId: string) => {
    setFavoritePrompts(prev => {
      const newFavorites = prev.includes(promptId)
        ? prev.filter(id => id !== promptId)
        : [...prev, promptId];
      localStorage.setItem("favoritePrompts", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  // 유사 문항 검색
  const searchSimilarItems = async (stem: string) => {
    if (!supabase) return [];

    const { data } = await supabase
      .from("item_bank")
      .select("*")
      .ilike("stem", `%${stem.substring(0, 20)}%`)
      .limit(5);

    return data || [];
  };

  // 유효성 검증 - OpenAI 서비스의 validateGeneratedItem 활용
  const validateItem = (item: any): string[] => {
    return validateGeneratedItem(item as GeneratedItem);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    return (
      <Alert severity="error">
        프로젝트를 찾을 수 없습니다.
        <Button onClick={() => navigate("/question-dev/authoring")} sx={{ ml: 2 }}>
          목록으로
        </Button>
      </Alert>
    );
  }

  const filteredStimuli = availableStimuli.filter(s =>
    s.title.toLowerCase().includes(stimulusSearch.toLowerCase()) ||
    (s.content_text?.toLowerCase().includes(stimulusSearch.toLowerCase()) ?? false)
  );

  return (
    <Box>
      {/* 헤더 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => navigate("/question-dev/authoring")}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {project.title}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                <Chip
                  label={statusConfig[project.status]?.label || project.status}
                  color={statusConfig[project.status]?.color || "default"}
                  size="small"
                />
                <Chip
                  label={gradeBandLabels[project.grade_band] || project.grade_band}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`난이도 ${project.difficulty_target || "-"}/5`}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<History />}
              onClick={() => setVersionHistoryOpen(true)}
            >
              버전 히스토리
            </Button>
            <Button
              variant="contained"
              startIcon={<SmartToy />}
              onClick={() => setAiDialogOpen(true)}
              disabled={!selectedStimulus}
            >
              AI 문항 생성
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
        {/* 왼쪽: 지문 영역 */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                <Article sx={{ mr: 1, verticalAlign: "middle" }} />
                지문
              </Typography>
              <Box>
                <Button
                  size="small"
                  startIcon={<Search />}
                  onClick={handleOpenStimulusDialog}
                >
                  지문 선택
                </Button>
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={() => navigate("/question-dev/stimuli/new")}
                >
                  새 지문
                </Button>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {selectedStimulus ? (
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {selectedStimulus.title}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/question-dev/stimuli/${selectedStimulus.stimulus_id}`)}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                </Box>
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <Chip label={selectedStimulus.content_type} size="small" />
                  <Chip label={gradeBandLabels[selectedStimulus.grade_band] || selectedStimulus.grade_band} size="small" variant="outlined" />
                  {selectedStimulus.genre && <Chip label={selectedStimulus.genre} size="small" variant="outlined" />}
                  {selectedStimulus.word_count && <Chip label={`${selectedStimulus.word_count}자`} size="small" variant="outlined" />}
                </Box>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#f9fafb",
                    borderRadius: 2,
                    maxHeight: 400,
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.8,
                    fontSize: "0.9rem",
                  }}
                >
                  {selectedStimulus.content_text || "내용이 없습니다."}
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Article sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                <Typography color="text.secondary" gutterBottom>
                  지문을 선택해주세요
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Search />}
                  onClick={handleOpenStimulusDialog}
                  sx={{ mt: 1 }}
                >
                  지문 검색
                </Button>
              </Box>
            )}
          </Paper>

          {/* AI 생성된 문항 미리보기 */}
          {aiGeneratedItems.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <AutoAwesome sx={{ mr: 1, verticalAlign: "middle", color: "primary.main" }} />
                AI 생성 문항 ({aiGeneratedItems.length}개)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {aiGeneratedItems.map((item, idx) => {
                const validationErrors = validateItem(item);
                return (
                  <Card key={idx} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Chip
                          label={itemTypeOptions.find(o => o.value === item.item_type)?.label || item.item_type}
                          size="small"
                          color="primary"
                        />
                        <Chip label="AI 생성" size="small" icon={<SmartToy />} />
                      </Box>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {item.stem}
                      </Typography>
                      {item.options?.length > 0 && (
                        <List dense>
                          {item.options.map((opt: any, optIdx: number) => (
                            <ListItem key={optIdx} sx={{ py: 0 }}>
                              <ListItemText
                                primary={`${String.fromCharCode(65 + optIdx)}. ${opt.text}`}
                                primaryTypographyProps={{
                                  fontWeight: opt.is_correct ? "bold" : "normal",
                                  color: opt.is_correct ? "success.main" : "text.primary",
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                      {validationErrors.length > 0 && (
                        <Alert severity="warning" sx={{ mt: 1 }}>
                          {validationErrors.map((err, i) => (
                            <Typography key={i} variant="caption" display="block">
                              - {err}
                            </Typography>
                          ))}
                        </Alert>
                      )}
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => {
                            setEditingItemData({
                              stem: item.stem,
                              item_type: item.item_type,
                              options: item.options || [],
                              rubric: item.rubric,
                            });
                            setItemEditDialogOpen(true);
                          }}
                        >
                          수정
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<Save />}
                          onClick={() => handleSaveGeneratedItem(item, idx)}
                          disabled={validationErrors.length > 0}
                        >
                          저장
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Paper>
          )}
        </Grid>

        {/* 오른쪽: 문항 목록 */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                문항 목록 ({items.length}개)
              </Typography>
              <Button
                startIcon={<Refresh />}
                size="small"
                onClick={fetchProjectData}
              >
                새로고침
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {items.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <SmartToy sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                <Typography color="text.secondary" gutterBottom>
                  아직 문항이 없습니다
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  지문을 선택한 후 AI 문항 생성을 시작해보세요
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.50" }}>
                      <TableCell>번호</TableCell>
                      <TableCell>유형</TableCell>
                      <TableCell>발문</TableCell>
                      <TableCell>상태</TableCell>
                      <TableCell>버전</TableCell>
                      <TableCell align="center">관리</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, idx) => {
                      const content = item.current_version?.content_json || {};
                      const versionCount = item.current_version_id ? 1 : 0;
                      return (
                        <TableRow key={item.draft_item_id} hover>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>
                            <Chip
                              label={itemTypeOptions.find(o => o.value === item.item_kind)?.label || item.item_kind}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                maxWidth: 250,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {content.stem || "(내용 없음)"}
                            </Typography>
                            {item.status === "ai_draft" && (
                              <Chip label="AI" size="small" sx={{ ml: 1 }} icon={<SmartToy />} />
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={statusConfig[item.status]?.label || item.status}
                              color={statusConfig[item.status]?.color || "default"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>v{versionCount}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="수정">
                              <IconButton size="small" onClick={() => handleEditItem(item)}>
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="삭제">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteItem(item.draft_item_id)}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>

          {/* 진행 상황 대시보드 */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              프로젝트 진행 현황
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Paper sx={{ p: 2, textAlign: "center", bgcolor: "grey.50" }}>
                  <Typography variant="h4" fontWeight="bold">
                    {items.filter(i => i.status === "ai_draft" || i.status === "editing").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">초안/편집</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper sx={{ p: 2, textAlign: "center", bgcolor: "warning.50" }}>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {items.filter(i => i.status === "in_review").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">검토 중</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper sx={{ p: 2, textAlign: "center", bgcolor: "success.50" }}>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {items.filter(i => i.status === "approved").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">승인됨</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper sx={{ p: 2, textAlign: "center", bgcolor: "error.50" }}>
                  <Typography variant="h4" fontWeight="bold" color="error.main">
                    {items.filter(i => i.status === "rejected").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">반려됨</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* 지문 선택 다이얼로그 */}
      <Dialog
        open={stimulusDialogOpen}
        onClose={() => setStimulusDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>지문 선택</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            size="small"
            placeholder="지문 검색..."
            value={stimulusSearch}
            onChange={(e) => setStimulusSearch(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: "text.secondary", mr: 1 }} />,
            }}
            sx={{ mb: 2 }}
          />
          <List sx={{ maxHeight: 400, overflow: "auto" }}>
            {filteredStimuli.map((stimulus) => (
              <ListItem
                key={stimulus.stimulus_id}
                button
                onClick={() => handleSelectStimulus(stimulus)}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemText
                  primary={stimulus.title}
                  secondary={
                    <Box>
                      <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                        <Chip label={stimulus.content_type} size="small" />
                        <Chip label={gradeBandLabels[stimulus.grade_band] || stimulus.grade_band} size="small" variant="outlined" />
                        {stimulus.genre && <Chip label={stimulus.genre} size="small" variant="outlined" />}
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                        {stimulus.content_text?.substring(0, 100)}...
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStimulusDialogOpen(false)}>취소</Button>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => {
              setStimulusDialogOpen(false);
              navigate("/question-dev/stimuli/new");
            }}
          >
            새 지문 등록
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI 문항 생성 다이얼로그 */}
      <Dialog
        open={aiDialogOpen}
        onClose={() => setAiDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SmartToy color="primary" />
            AI 문항 초안 생성
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                문항 유형
              </Typography>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <Select
                  value={aiItemType}
                  onChange={(e) => setAiItemType(e.target.value)}
                >
                  {itemTypeOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                생성 개수
              </Typography>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <Select
                  value={aiItemCount}
                  onChange={(e) => setAiItemCount(e.target.value as number)}
                >
                  {[1, 2, 3, 5, 10].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}개
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                프롬프트 템플릿
              </Typography>
              {aiPromptTemplates.map((template) => (
                <Card
                  key={template.id}
                  variant="outlined"
                  sx={{
                    mb: 1,
                    cursor: "pointer",
                    bgcolor: aiPromptTemplate.id === template.id ? "primary.50" : "transparent",
                    borderColor: aiPromptTemplate.id === template.id ? "primary.main" : "divider",
                  }}
                  onClick={() => setAiPromptTemplate(template)}
                >
                  <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="body2" fontWeight="medium">
                        {template.name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoritePrompt(template.id);
                        }}
                      >
                        {favoritePrompts.includes(template.id) ? (
                          <Star fontSize="small" color="warning" />
                        ) : (
                          <StarBorder fontSize="small" />
                        )}
                      </IconButton>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {template.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                프롬프트 미리보기 및 수정
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={8}
                value={aiCustomPrompt || aiPromptTemplate.prompt
                  .replace("{item_type}", itemTypeOptions.find(o => o.value === aiItemType)?.label || aiItemType)
                  .replace("{grade_band}", gradeBandLabels[project.grade_band] || project.grade_band)
                  .replace("{difficulty}", String(project.difficulty_target || 3))
                }
                onChange={(e) => setAiCustomPrompt(e.target.value)}
                placeholder="프롬프트를 직접 수정하거나 추가 지시사항을 입력하세요..."
                sx={{ mb: 2 }}
              />

              {selectedStimulus && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="caption" fontWeight="bold">
                    선택된 지문: {selectedStimulus.title}
                  </Typography>
                  <Typography variant="caption" display="block">
                    {selectedStimulus.word_count}자 | {gradeBandLabels[selectedStimulus.grade_band]}
                  </Typography>
                </Alert>
              )}

              {aiGenerating && (
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <CircularProgress size={32} sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    AI가 문항을 생성하고 있습니다...
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAiDialogOpen(false)}>취소</Button>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={handleGenerateItems}
            disabled={aiGenerating || !selectedStimulus}
          >
            {aiGenerating ? "생성 중..." : "문항 생성"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 문항 편집 다이얼로그 */}
      <Dialog
        open={itemEditDialogOpen}
        onClose={() => setItemEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>문항 편집</DialogTitle>
        <DialogContent>
          <FormControl fullWidth size="small" sx={{ mb: 2, mt: 1 }}>
            <InputLabel>문항 유형</InputLabel>
            <Select
              value={editingItemData.item_type}
              label="문항 유형"
              onChange={(e) => setEditingItemData({ ...editingItemData, item_type: e.target.value })}
            >
              {itemTypeOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="발문"
            value={editingItemData.stem}
            onChange={(e) => setEditingItemData({ ...editingItemData, stem: e.target.value })}
            sx={{ mb: 2 }}
          />

          {editingItemData.item_type.startsWith("mcq") && (
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                선택지
              </Typography>
              {editingItemData.options.map((opt, idx) => (
                <Box key={idx} sx={{ display: "flex", gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={opt.text}
                    onChange={(e) => {
                      const newOptions = [...editingItemData.options];
                      newOptions[idx].text = e.target.value;
                      setEditingItemData({ ...editingItemData, options: newOptions });
                    }}
                    placeholder={`선택지 ${String.fromCharCode(65 + idx)}`}
                  />
                  <Button
                    variant={opt.is_correct ? "contained" : "outlined"}
                    color={opt.is_correct ? "success" : "inherit"}
                    onClick={() => {
                      const newOptions = editingItemData.options.map((o, i) => ({
                        ...o,
                        is_correct: editingItemData.item_type === "mcq_single" ? i === idx : (i === idx ? !o.is_correct : o.is_correct),
                      }));
                      setEditingItemData({ ...editingItemData, options: newOptions });
                    }}
                  >
                    {opt.is_correct ? <CheckCircle /> : "정답"}
                  </Button>
                  <IconButton
                    onClick={() => {
                      const newOptions = editingItemData.options.filter((_, i) => i !== idx);
                      setEditingItemData({ ...editingItemData, options: newOptions });
                    }}
                    disabled={editingItemData.options.length <= 2}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
              <Button
                size="small"
                startIcon={<Add />}
                onClick={() => {
                  setEditingItemData({
                    ...editingItemData,
                    options: [...editingItemData.options, { text: "", is_correct: false }],
                  });
                }}
                disabled={editingItemData.options.length >= 6}
              >
                선택지 추가
              </Button>
            </Box>
          )}

          {editingItemData.item_type === "essay" && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography fontWeight="bold">루브릭 (채점 기준)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  서술형 문항의 채점 기준을 설정합니다.
                </Typography>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>루브릭 템플릿</InputLabel>
                  <Select
                    value=""
                    label="루브릭 템플릿"
                    onChange={(e) => {
                      const template = rubricTemplates.find(r => r.id === e.target.value);
                      if (template) {
                        setEditingItemData({ ...editingItemData, rubric: template });
                      }
                    }}
                  >
                    {rubricTemplates.filter(r => r.itemType === "essay").map((template) => (
                      <MenuItem key={template.id} value={template.id}>
                        {template.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {editingItemData.rubric && (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>평가 기준</TableCell>
                          <TableCell>배점</TableCell>
                          <TableCell>수준</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {editingItemData.rubric.criteria?.map((c: any, idx: number) => (
                          <TableRow key={idx}>
                            <TableCell>{c.name}</TableCell>
                            <TableCell>{c.weight}%</TableCell>
                            <TableCell>{c.levels?.join(" / ")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </AccordionDetails>
            </Accordion>
          )}

          {validateItem(editingItemData).length > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {validateItem(editingItemData).map((err, i) => (
                <Typography key={i} variant="caption" display="block">
                  - {err}
                </Typography>
              ))}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setItemEditDialogOpen(false)}>취소</Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveItem}
            disabled={validateItem(editingItemData).length > 0}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>

      {/* 버전 히스토리 다이얼로그 */}
      <Dialog
        open={versionHistoryOpen}
        onClose={() => setVersionHistoryOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <History />
            버전 히스토리
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            문항의 수정 이력을 확인하고 이전 버전으로 복원할 수 있습니다.
          </Typography>
          {items.map((item) => {
            const content = item.current_version?.content_json || {};
            return (
              <Accordion key={item.draft_item_id}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                    <Typography fontWeight="bold" sx={{ flex: 1 }}>
                      {(content.stem || "(내용 없음)").substring(0, 50)}...
                    </Typography>
                    <Chip label={item.current_version_id ? "v1" : "v0"} size="small" />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="현재 버전"
                        secondary={`생성일: ${new Date(item.created_at).toLocaleString("ko-KR")}`}
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVersionHistoryOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuthoringProjectDetail;
