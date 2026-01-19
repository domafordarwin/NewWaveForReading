import { useState, useEffect } from "react";
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
  Divider,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
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
  ExpandMore,
  History,
  Refresh,
  Star,
  StarBorder,
  Send,
  AutoAwesome,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import {
  generateItems,
  validateGeneratedItem,
  type GeneratedItem,
} from "../services/openaiService";

interface AuthoringProject {
  project_id: number;
  title: string;
  grade_band: string;
  topic_tags: string[];
  difficulty_target: number | null;
  status: string;
  primary_project_stimulus_id: number | null; // 프로젝트별 편집 가능한 지문 복사본 ID
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
  stimulus_id?: number | null; // 연결된 지문 ID
  // 조인된 버전 정보
  current_version?: {
    version_id: number;
    content_json: any;
    created_at: string;
  };
}

// DB 프롬프트 템플릿 인터페이스
interface PromptBaseTemplate {
  base_template_id: number;
  template_name: string;
  template_code: string;
  persona_text: string;
  input_schema_text: string;
  task_text: string;
  quality_rules_text: string;
  output_format_text: string;
  self_check_text: string;
  placeholders: string[];
  target_grade_bands: string[];
  version: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface PromptAreaTemplate {
  area_template_id: number;
  area_code: string;
  area_name: string;
  area_description: string | null;
  objective_text: string;
  guidelines_text: string;
  example_patterns: string | null;
  skill_tags: string[];
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface UserFavoritePrompt {
  favorite_id: number;
  user_id: number;
  favorite_name: string;
  base_template_id: number | null;
  area_template_id: number | null;
  custom_prompt_text: string | null;
  custom_overrides: Record<string, string>;
  usage_count: number;
  last_used_at: string | null;
}

// 문항 유형 옵션 (DB 스키마의 item_kind에 맞춤)
const itemTypeOptions = [
  { value: "mcq", label: "객관식" },
  { value: "essay", label: "서술형" },
  { value: "composite", label: "복합문항" },
  { value: "survey", label: "설문" },
];

// 상태 설정 (DB 스키마의 status에 맞춤)
const statusConfig: Record<
  string,
  {
    label: string;
    color: "default" | "primary" | "success" | "warning" | "error";
  }
> = {
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

// 루브릭 템플릿
const rubricTemplates = [
  {
    id: "essay_basic",
    name: "서술형 기본 루브릭",
    itemType: "essay",
    criteria: [
      {
        name: "내용 이해",
        weight: 40,
        levels: ["불충분", "기초", "보통", "우수", "탁월"],
      },
      {
        name: "논리적 전개",
        weight: 30,
        levels: ["불충분", "기초", "보통", "우수", "탁월"],
      },
      {
        name: "표현력",
        weight: 30,
        levels: ["불충분", "기초", "보통", "우수", "탁월"],
      },
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
  const [_activeTab, _setActiveTab] = useState(0);

  // 지문 선택 다이얼로그
  const [stimulusDialogOpen, setStimulusDialogOpen] = useState(false);
  const [availableStimuli, setAvailableStimuli] = useState<Stimulus[]>([]);
  const [stimulusSearch, setStimulusSearch] = useState("");
  const [selectedStimulus, setSelectedStimulus] = useState<Stimulus | null>(
    null,
  );

  // 지문 편집 상태
  const [isEditingStimulus, setIsEditingStimulus] = useState(false);
  const [editingStimulusData, setEditingStimulusData] = useState({
    title: "",
    content_text: "",
    genre: "",
  });
  const [stimulusUpdateSaving, setStimulusUpdateSaving] = useState(false);

  // AI 생성 다이얼로그
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiItemType, setAiItemType] = useState("mcq_single");
  const [aiNumOptions, setAiNumOptions] = useState(5); // 객관식 보기 개수 (기본값 5개)
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
  const [_itemVersions, _setItemVersions] = useState<any[]>([]);

  // 새 지문 생성 다이얼로그
  const [newStimulusDialogOpen, setNewStimulusDialogOpen] = useState(false);
  const [newStimulusSaving, setNewStimulusSaving] = useState(false);
  const [newStimulusData, setNewStimulusData] = useState({
    title: "",
    content_type: "text" as string,
    content_text: "",
    genre: "" as string,
    source: "",
  });

  // 프롬프트 즐겨찾기 (로컬)
  const [favoritePrompts, setFavoritePrompts] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoritePrompts");
    return saved ? JSON.parse(saved) : [];
  });

  // DB 프롬프트 템플릿 상태
  const [dbBaseTemplates, setDbBaseTemplates] = useState<PromptBaseTemplate[]>(
    [],
  );
  const [dbAreaTemplates, setDbAreaTemplates] = useState<PromptAreaTemplate[]>(
    [],
  );
  const [selectedBaseTemplate, setSelectedBaseTemplate] =
    useState<PromptBaseTemplate | null>(null);
  const [selectedAreaTemplate, setSelectedAreaTemplate] =
    useState<PromptAreaTemplate | null>(null);
  const [userFavoritePrompts, setUserFavoritePrompts] = useState<
    UserFavoritePrompt[]
  >([]);
  const [composedPrompt, setComposedPrompt] = useState<string>("");
  const [isPromptModified, setIsPromptModified] = useState(false);
  const [promptSaving, setPromptSaving] = useState(false);
  const [showBasePromptDetail, setShowBasePromptDetail] = useState(false);

  // 데이터 로드
  useEffect(() => {
    if (id) {
      fetchProjectData();
    }
  }, [id]);

  const fetchProjectData = async () => {
    if (!supabase || !id) {
      console.error("Missing supabase or id:", { supabase: !!supabase, id });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Fetching project with id:", id);

      // 프로젝트 조회
      const { data: projectData, error: projectError } = await supabase
        .from("authoring_projects")
        .select("*")
        .eq("project_id", parseInt(id))
        .single();

      console.log("Project data:", { projectData, projectError });

      if (projectError) throw projectError;
      if (!projectData) throw new Error("프로젝트를 찾을 수 없습니다.");

      setProject(projectData);

      // 프로젝트에 저장된 지문 ID 설정 및 지문 자동 로드
      if (projectData.primary_stimulus_id) {
        setProjectStimulusId(projectData.primary_stimulus_id);

        // 연결된 지문 자동 로드
        const { data: linkedStimulus } = await supabase
          .from("stimuli")
          .select("*")
          .eq("stimulus_id", projectData.primary_stimulus_id)
          .single();

        if (linkedStimulus) {
          setSelectedStimulus(linkedStimulus);
        }
      }

      // 연결된 지문 조회
      const { data: stimuliData } = await supabase
        .from("stimuli")
        .select("*")
        .order("created_at", { ascending: false });

      if (stimuliData) {
        setStimuli(stimuliData);
      }

      // 프로젝트의 문항 조회
      const { data: itemsData, error: itemsError } = await supabase
        .from("authoring_items")
        .select("*")
        .eq("project_id", parseInt(id))
        .order("created_at", { ascending: false });

      if (itemsError) {
        console.error("Items fetch error:", itemsError);
      }

      if (itemsData && itemsData.length > 0) {
        console.log("Items fetched:", itemsData.length);
        // 버전 정보를 별도로 조회
        const versionIds = itemsData
          .map((item: any) => item.current_version_id)
          .filter((id: any) => id != null);

        let versionsMap: Record<number, any> = {};

        if (versionIds.length > 0) {
          console.log("Fetching versions for ids:", versionIds);
          const { data: versionsData, error: versionsError } = await supabase
            .from("authoring_item_versions")
            .select("version_id, content_json, created_at")
            .in("version_id", versionIds);

          console.log("Versions data:", {
            count: versionsData?.length,
            error: versionsError,
          });

          if (versionsData) {
            versionsMap = versionsData.reduce(
              (acc: Record<number, any>, v: any) => {
                acc[v.version_id] = v;
                return acc;
              },
              {},
            );
          }
        }

        // 조인된 데이터 구조 정리
        const formattedItems = itemsData.map((item: any) => ({
          ...item,
          current_version: item.current_version_id
            ? versionsMap[item.current_version_id] || null
            : null,
        }));
        setItems(formattedItems);
        console.log("Items set:", formattedItems.length);
      } else {
        console.log("No items found for project");
        setItems([]);
      }
    } catch (err: any) {
      console.error("Error fetching project data:", err);
      setError(err.message || "데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // DB 프롬프트 템플릿 로드 (실패 시 fallback 데이터 사용)
  const fetchPromptTemplates = async () => {
    // Fallback 데이터 - DB 연결 실패 시 사용
    const fallbackBaseTemplate: PromptBaseTemplate = {
      base_template_id: 0,
      template_name: "기본 문해력 진단 평가",
      template_code: "DEFAULT_LITERACY",
      persona_text:
        "너는 문해력 진단 평가의 전문 문항 개발자다. 주어진 지문을 바탕으로 학생의 읽기 능력을 측정하는 문항을 설계한다.",
      input_schema_text:
        "- grade_band: {GRADE_BAND}\n- difficulty_level: {DIFFICULTY}\n- num_items: {NUM_ITEMS}\n- num_options: {NUM_OPTIONS}\n- stimulus_text: {STIMULUS_TEXT}",
      task_text:
        "주어진 지문을 바탕으로 객관식 문항을 생성하라. 정답은 명확히 하나만 존재해야 한다.",
      quality_rules_text:
        "- 정답은 하나만 존재해야 한다\n- 보기들은 길이와 문체가 비슷해야 한다\n- 지문에 근거한 정답이어야 한다",
      output_format_text:
        '{"items": [{"stem": "string", "options": ["string"], "correct_index": number}]}',
      self_check_text: "정답이 1개인지, 지문 근거가 있는지 확인하라.",
      placeholders: [
        "GRADE_BAND",
        "DIFFICULTY",
        "NUM_ITEMS",
        "NUM_OPTIONS",
        "STIMULUS_TEXT",
      ],
      target_grade_bands: ["초저", "초고", "중저", "중고"],
      version: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const fallbackAreaTemplates: PromptAreaTemplate[] = [
      {
        area_template_id: 1,
        area_code: "READING_COMPREHENSION",
        area_name: "독해력 문항",
        area_description: "지문 내용 이해도를 평가",
        objective_text:
          "지문에 명시적으로 제시된 정보를 정확히 찾고 이해하는 능력을 측정한다.",
        guidelines_text: "정답은 지문에 직접 근거가 있어야 한다.",
        example_patterns: null,
        skill_tags: ["detail", "relationship"],
        display_order: 1,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        area_template_id: 2,
        area_code: "INFERENCE",
        area_name: "추론 문항",
        area_description: "지문 단서 기반 추론 평가",
        objective_text:
          "지문에 직접 쓰이지 않은 결론을 논리적으로 도출하는 능력을 측정한다.",
        guidelines_text: "정답은 지문 단서 2개 이상으로 정당화 가능해야 한다.",
        example_patterns: null,
        skill_tags: ["inference", "implication"],
        display_order: 2,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        area_template_id: 3,
        area_code: "VOCAB_IN_CONTEXT",
        area_name: "어휘력 문항",
        area_description: "문맥 속 어휘 의미 파악",
        objective_text: "문맥 속 단어/표현의 의미를 파악하는 능력을 측정한다.",
        guidelines_text: "핵심 이해에 영향이 큰 단어/표현을 선택하라.",
        example_patterns: null,
        skill_tags: ["vocabulary", "context"],
        display_order: 3,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        area_template_id: 4,
        area_code: "CRITICAL_THINKING",
        area_name: "비판적 사고 문항",
        area_description: "논리적 타당성 평가",
        objective_text:
          "글의 주장과 근거를 구분하고 논리적 타당성을 점검하는 능력을 측정한다.",
        guidelines_text: "주장, 근거, 예시, 결론을 구분하는 문항을 포함하라.",
        example_patterns: null,
        skill_tags: ["critical", "logic"],
        display_order: 4,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        area_template_id: 5,
        area_code: "SUMMARIZATION",
        area_name: "요약 문항",
        area_description: "핵심 내용 추출 평가",
        objective_text:
          "지문의 핵심 내용을 추출하고 주제/요지를 파악하는 능력을 측정한다.",
        guidelines_text:
          "가장 적절한 요약문, 제목, 주제문을 고르는 문항을 포함하라.",
        example_patterns: null,
        skill_tags: ["summary", "main_idea"],
        display_order: 5,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    if (!supabase) {
      // Supabase 연결 없으면 fallback 사용
      console.log("Using fallback prompt templates (no supabase)");
      setDbBaseTemplates([fallbackBaseTemplate]);
      setDbAreaTemplates(fallbackAreaTemplates);
      if (!selectedBaseTemplate) setSelectedBaseTemplate(fallbackBaseTemplate);
      if (!selectedAreaTemplate)
        setSelectedAreaTemplate(fallbackAreaTemplates[0]);
      return;
    }

    try {
      // Base 템플릿 로드
      const { data: baseData, error: baseError } = await supabase
        .from("prompt_base_templates")
        .select("*")
        .eq("is_active", true)
        .order("template_name");

      if (baseError) {
        console.error("Base templates fetch error:", baseError);
        // 에러 시 fallback 사용
        setDbBaseTemplates([fallbackBaseTemplate]);
        if (!selectedBaseTemplate)
          setSelectedBaseTemplate(fallbackBaseTemplate);
      } else if (baseData && baseData.length > 0) {
        setDbBaseTemplates(baseData);
        if (!selectedBaseTemplate) setSelectedBaseTemplate(baseData[0]);
      } else {
        // 데이터 없으면 fallback 사용
        setDbBaseTemplates([fallbackBaseTemplate]);
        if (!selectedBaseTemplate)
          setSelectedBaseTemplate(fallbackBaseTemplate);
      }

      // Area 템플릿 로드
      const { data: areaData, error: areaError } = await supabase
        .from("prompt_area_templates")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (areaError) {
        console.error("Area templates fetch error:", areaError);
        // 에러 시 fallback 사용
        setDbAreaTemplates(fallbackAreaTemplates);
        if (!selectedAreaTemplate)
          setSelectedAreaTemplate(fallbackAreaTemplates[0]);
      } else if (areaData && areaData.length > 0) {
        setDbAreaTemplates(areaData);
        // 기본 영역 선택 (독해력)
        if (!selectedAreaTemplate) {
          const defaultArea =
            areaData.find(
              (a: PromptAreaTemplate) =>
                a.area_code === "READING_COMPREHENSION",
            ) || areaData[0];
          setSelectedAreaTemplate(defaultArea);
        }
      } else {
        // 데이터 없으면 fallback 사용
        setDbAreaTemplates(fallbackAreaTemplates);
        if (!selectedAreaTemplate)
          setSelectedAreaTemplate(fallbackAreaTemplates[0]);
      }

      // 사용자 즐겨찾기 프롬프트 로드 (user_id=1 임시 사용)
      const { data: favData } = await supabase
        .from("prompt_user_favorites")
        .select("*")
        .eq("user_id", 1)
        .order("usage_count", { ascending: false });

      if (favData) {
        setUserFavoritePrompts(favData);
      }
    } catch (err) {
      console.error("Error fetching prompt templates:", err);
    }
  };

  // 프롬프트 조합 함수
  const composePrompt = (
    baseTemplate: PromptBaseTemplate | null,
    areaTemplate: PromptAreaTemplate | null,
    stimulus: Stimulus | null,
    projectData: AuthoringProject | null,
    itemCount: number,
    numOptions: number,
  ): string => {
    if (!baseTemplate || !areaTemplate) {
      return "프롬프트 템플릿을 선택해주세요.";
    }

    // 플레이스홀더 치환
    const replacePlaceholders = (text: string): string => {
      return text
        .replace(/{STIMULUS_ID}/g, stimulus?.stimulus_id?.toString() || "N/A")
        .replace(/{GRADE_BAND}/g, projectData?.grade_band || "중저")
        .replace(
          /{DIFFICULTY}/g,
          (projectData?.difficulty_target || 3).toString(),
        )
        .replace(/{NUM_ITEMS}/g, itemCount.toString())
        .replace(/{NUM_OPTIONS}/g, numOptions.toString())
        .replace(
          /{STIMULUS_TEXT}/g,
          stimulus?.content_text || "[지문을 선택해주세요]",
        );
    };

    // 전체 프롬프트 조합
    const fullPrompt = `## [ROLE / PERSONA]
${baseTemplate.persona_text}

## [INPUT]
${replacePlaceholders(baseTemplate.input_schema_text)}

## [TASK]
${baseTemplate.task_text}

## [AREA PROMPT - ${areaTemplate.area_name}]
### 목표
${areaTemplate.objective_text}

### 문항 설계 지침
${areaTemplate.guidelines_text}
${areaTemplate.example_patterns ? `\n### 예시 패턴\n${areaTemplate.example_patterns}` : ""}

## [QUALITY RULES]
${baseTemplate.quality_rules_text}

## [OUTPUT FORMAT]
${baseTemplate.output_format_text}

## [SELF-CHECK]
${baseTemplate.self_check_text}`;

    return fullPrompt;
  };

  // 영역 템플릿 변경 시 프롬프트 재조합
  useEffect(() => {
    if (selectedBaseTemplate && selectedAreaTemplate) {
      const newPrompt = composePrompt(
        selectedBaseTemplate,
        selectedAreaTemplate,
        selectedStimulus,
        project,
        aiItemCount,
        aiNumOptions,
      );
      setComposedPrompt(newPrompt);
      setIsPromptModified(false);
      setAiCustomPrompt(""); // 기존 커스텀 프롬프트 초기화
    }
  }, [
    selectedBaseTemplate,
    selectedAreaTemplate,
    selectedStimulus,
    project,
    aiItemCount,
    aiNumOptions,
  ]);

  // AI 다이얼로그 열릴 때 프롬프트 템플릿 로드
  useEffect(() => {
    if (aiDialogOpen) {
      fetchPromptTemplates();
    }
  }, [aiDialogOpen]);

  // 사용자 커스텀 프롬프트 저장
  const handleSaveCustomPrompt = async () => {
    if (!supabase || !selectedBaseTemplate || !selectedAreaTemplate) {
      setError("프롬프트 템플릿을 먼저 선택해주세요.");
      return;
    }

    const customPromptText = aiCustomPrompt || composedPrompt;
    if (!customPromptText.trim()) {
      setError("저장할 프롬프트가 없습니다.");
      return;
    }

    setPromptSaving(true);

    try {
      const favoriteName = `${selectedAreaTemplate.area_name} 커스텀 - ${new Date().toLocaleDateString()}`;

      const { data, error: insertError } = await supabase
        .from("prompt_user_favorites")
        .insert([
          {
            user_id: 1, // TODO: 실제 로그인 사용자 ID로 변경
            favorite_name: favoriteName,
            base_template_id: selectedBaseTemplate.base_template_id,
            area_template_id: selectedAreaTemplate.area_template_id,
            custom_prompt_text: customPromptText,
            custom_overrides: {},
            usage_count: 0,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // 즐겨찾기 목록 갱신
      setUserFavoritePrompts((prev) => [data, ...prev]);
      setSuccess("프롬프트가 저장되었습니다.");
      setIsPromptModified(false);
    } catch (err: any) {
      setError(err.message || "프롬프트 저장에 실패했습니다.");
    } finally {
      setPromptSaving(false);
    }
  };

  // 저장된 프롬프트 불러오기
  const handleLoadFavoritePrompt = (favorite: UserFavoritePrompt) => {
    if (favorite.custom_prompt_text) {
      setAiCustomPrompt(favorite.custom_prompt_text);
      setIsPromptModified(true);
    }
    // 사용 횟수 업데이트
    if (supabase) {
      supabase
        .from("prompt_user_favorites")
        .update({
          usage_count: (favorite.usage_count || 0) + 1,
          last_used_at: new Date().toISOString(),
        })
        .eq("favorite_id", favorite.favorite_id)
        .then();
    }
  };

  // 저장된 프롬프트 삭제
  const handleDeleteFavoritePrompt = async (favoriteId: number) => {
    if (!supabase || !window.confirm("이 프롬프트를 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase
        .from("prompt_user_favorites")
        .delete()
        .eq("favorite_id", favoriteId);

      if (error) throw error;

      setUserFavoritePrompts((prev) =>
        prev.filter((f) => f.favorite_id !== favoriteId),
      );
      setSuccess("프롬프트가 삭제되었습니다.");
    } catch (err: any) {
      setError(err.message || "프롬프트 삭제에 실패했습니다.");
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
    setIsEditingStimulus(false); // 편집 모드 해제
    // 선택한 지문이 이미 프로젝트에 저장된 것인지 확인
    if (projectStimulusId !== stimulus.stimulus_id) {
      // 다른 지문 선택됨 - 저장 필요 상태로 변경하지 않음 (버튼으로 명시적 저장)
    }
  };

  // 지문 편집 시작
  const handleStartEditStimulus = () => {
    if (selectedStimulus) {
      setEditingStimulusData({
        title: selectedStimulus.title,
        content_text: selectedStimulus.content_text || "",
        genre: selectedStimulus.genre || "",
      });
      setIsEditingStimulus(true);
    }
  };

  // 지문 편집 취소
  const handleCancelEditStimulus = () => {
    setIsEditingStimulus(false);
    setEditingStimulusData({ title: "", content_text: "", genre: "" });
  };

  // 지문 편집 저장
  const handleSaveEditStimulus = async () => {
    if (!supabase || !selectedStimulus) return;

    setStimulusUpdateSaving(true);
    setError(null);
    try {
      const wordCount = editingStimulusData.content_text.replace(
        /\s/g,
        "",
      ).length;

      const { data, error } = await supabase
        .from("stimuli")
        .update({
          title: editingStimulusData.title,
          content_text: editingStimulusData.content_text,
          genre: editingStimulusData.genre || null,
          word_count: wordCount > 0 ? wordCount : null,
          updated_at: new Date().toISOString(),
        })
        .eq("stimulus_id", selectedStimulus.stimulus_id)
        .select()
        .single();

      if (error) throw error;

      // 업데이트된 지문으로 상태 갱신
      setSelectedStimulus(data);
      // stimuli 목록도 업데이트
      setStimuli((prev) =>
        prev.map((s) => (s.stimulus_id === data.stimulus_id ? data : s)),
      );
      setIsEditingStimulus(false);
      setSuccess("지문이 수정되었습니다.");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "지문 수정에 실패했습니다.";
      setError(errorMessage);
      console.error("지문 수정 에러:", err);
    } finally {
      setStimulusUpdateSaving(false);
    }
  };

  // 선택된 지문을 프로젝트에 연결 저장
  const [stimulusSaving, setStimulusSaving] = useState(false);
  const [projectStimulusId, setProjectStimulusId] = useState<number | null>(
    null,
  );

  const handleSaveStimulusToProject = async () => {
    if (!supabase || !project || !selectedStimulus) {
      setError("지문을 먼저 선택해주세요.");
      return;
    }

    setStimulusSaving(true);
    setError(null);

    try {
      // 프로젝트에 지문 연결 (primary_stimulus_id 업데이트)
      const { error: updateError } = await supabase
        .from("authoring_projects")
        .update({
          primary_stimulus_id: selectedStimulus.stimulus_id,
          updated_at: new Date().toISOString(),
        })
        .eq("project_id", project.project_id);

      if (updateError) {
        console.error("프로젝트 지문 연결 실패:", updateError);
        // primary_stimulus_id 컬럼이 없으면 에러 메시지 표시
        if (updateError.message?.includes("primary_stimulus_id")) {
          throw new Error(
            "DB에 primary_stimulus_id 컬럼이 없습니다. Supabase에서 MUST_RUN_add_primary_stimulus_id.sql을 실행해주세요.",
          );
        }
        throw updateError;
      }

      setProjectStimulusId(selectedStimulus.stimulus_id);
      setSuccess(
        `지문 "${selectedStimulus.title}"이(가) 프로젝트에 연결되었습니다.`,
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "지문 저장에 실패했습니다.";
      setError(errorMessage);
      console.error("지문 저장 에러:", err);
    } finally {
      setStimulusSaving(false);
    }
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
      // DB 프롬프트 또는 커스텀 프롬프트 사용 (fallback 제거)
      const finalPrompt = aiCustomPrompt || composedPrompt;

      if (!finalPrompt || finalPrompt === "프롬프트 템플릿을 선택해주세요.") {
        throw new Error(
          "프롬프트가 준비되지 않았습니다. 템플릿을 선택해주세요.",
        );
      }

      // 지문 길이 확인 로그
      const stimulusText = selectedStimulus.content_text || "";
      console.log("=== 지문 정보 ===");
      console.log("지문 제목:", selectedStimulus.title);
      console.log("지문 전체 길이:", stimulusText.length);
      console.log("지문 내용 (처음 200자):", stimulusText.substring(0, 200));
      console.log("지문 내용 (마지막 200자):", stimulusText.substring(Math.max(0, stimulusText.length - 200)));

      // OpenAI 서비스를 통한 문항 생성
      const response = await generateItems({
        stimulusText: stimulusText,
        stimulusTitle: selectedStimulus.title,
        itemType: aiItemType || "mcq_single",
        gradeBand: project.grade_band,
        difficulty: project.difficulty_target || 3,
        count: aiItemCount,
        numOptions: aiItemType?.startsWith("mcq") ? aiNumOptions : undefined,
        customPrompt: finalPrompt,
      });

      if (!response.success) {
        throw new Error(response.error || "문항 생성에 실패했습니다.");
      }

      // 프롬프트 사용 로그 기록
      if (supabase && selectedBaseTemplate && selectedAreaTemplate) {
        await supabase
          .from("prompt_usage_logs")
          .insert([
            {
              base_template_id: selectedBaseTemplate.base_template_id,
              area_template_id: selectedAreaTemplate.area_template_id,
              user_id: 1, // TODO: 실제 사용자 ID
              project_id: project.project_id,
              stimulus_id: selectedStimulus.stimulus_id,
              final_prompt_text: finalPrompt.substring(0, 5000), // 최대 길이 제한
              input_params: {
                item_type: aiItemType,
                item_count: aiItemCount,
                num_options: aiNumOptions,
                difficulty: project.difficulty_target,
              },
              model_name: "gpt-4",
              items_generated: response.items.length,
            },
          ])
          .then(); // 비동기로 기록 (에러 무시)
      }

      // 생성된 문항 설정
      const itemsWithValidation = response.items.map((item) => ({
        ...item,
        rubric:
          item.rubric ||
          (item.item_type === "essay"
            ? rubricTemplates.find((r) => r.itemType === "essay")
            : null),
      }));

      console.log("Generated items with validation:", itemsWithValidation);
      setAiGeneratedItems(itemsWithValidation);
      setSuccess(
        `AI 문항 초안 ${response.items.length}개가 생성되었습니다. 검토 후 저장해주세요.`,
      );

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
      // item_type 기본값 처리
      const itemType = item.item_type || "mcq_single";
      const itemKind =
        itemType === "mcq_single" || itemType === "mcq_multi"
          ? "mcq"
          : itemType;

      // 1. 먼저 authoring_items에 문항 생성 (stimulus_id 포함)
      const { data: itemData, error: itemError } = await supabase
        .from("authoring_items")
        .insert([
          {
            project_id: project.project_id,
            item_kind: itemKind,
            status: "ai_draft",
            stimulus_id: selectedStimulus.stimulus_id,
          },
        ])
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
        .insert([
          {
            draft_item_id: itemData.draft_item_id,
            content_json: contentJson,
            change_summary: "AI 초안 생성",
          },
        ])
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
      setAiGeneratedItems((prev) => prev.filter((_, i) => i !== index));
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
        .insert([
          {
            draft_item_id: editingItem.draft_item_id,
            based_on_version_id: editingItem.current_version_id,
            content_json: contentJson,
            change_summary: "수동 편집",
          },
        ])
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

  // 새 지문 저장
  const handleSaveNewStimulus = async () => {
    if (!supabase || !project) {
      setError("데이터베이스 연결이 필요합니다.");
      return;
    }

    if (!newStimulusData.title.trim()) {
      setError("지문 제목을 입력해주세요.");
      return;
    }

    if (!newStimulusData.content_text.trim()) {
      setError("지문 내용을 입력해주세요.");
      return;
    }

    try {
      setNewStimulusSaving(true);
      setError(null);

      // 글자 수 계산
      const wordCount = newStimulusData.content_text.replace(/\s/g, "").length;

      const { data, error: insertError } = await supabase
        .from("stimuli")
        .insert([
          {
            title: newStimulusData.title,
            content_type: newStimulusData.content_type,
            content_text: newStimulusData.content_text,
            grade_band: project.grade_band, // 프로젝트 학년군 사용
            genre: newStimulusData.genre || null,
            source_meta_json: newStimulusData.source
              ? { source: newStimulusData.source }
              : {},
            word_count: wordCount > 0 ? wordCount : null,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // 생성된 지문 자동 선택
      setSelectedStimulus(data);

      // 프로젝트 저장 상태 초기화 (새 지문이므로 아직 프로젝트에 저장 안됨)
      setProjectStimulusId(null);

      // 지문 목록 갱신
      await fetchAvailableStimuli();

      // 다이얼로그 닫기 및 초기화
      setNewStimulusDialogOpen(false);
      setNewStimulusData({
        title: "",
        content_type: "text",
        content_text: "",
        genre: "",
        source: "",
      });

      setSuccess(`지문 "${data.title}"이(가) 생성되었습니다.`);
    } catch (err: any) {
      setError(err.message || "지문 저장에 실패했습니다.");
    } finally {
      setNewStimulusSaving(false);
    }
  };

  // 새 지문 다이얼로그 열기
  const handleOpenNewStimulusDialog = () => {
    // 기본값 설정 (프로젝트 제목 기반)
    const timestamp = new Date().toISOString().slice(0, 10);
    setNewStimulusData({
      title: `${project?.title || ""}_지문_${timestamp}`,
      content_type: "text",
      content_text: "",
      genre: "",
      source: "",
    });
    setNewStimulusDialogOpen(true);
  };

  // 프롬프트 즐겨찾기 토글
  const toggleFavoritePrompt = (promptId: string) => {
    setFavoritePrompts((prev) => {
      const newFavorites = prev.includes(promptId)
        ? prev.filter((id) => id !== promptId)
        : [...prev, promptId];
      localStorage.setItem("favoritePrompts", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  // 유사 문항 검색 (현재 미사용 - 향후 기능 구현용)
  // const _searchSimilarItems = async (stem: string) => {
  //   if (!supabase) return [];

  //   const { data } = await supabase
  //     .from("item_bank")
  //     .select("*")
  //     .ilike("stem", `%${stem.substring(0, 20)}%`)
  //     .limit(5);

  //   return data || [];
  // };

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
        <Button
          onClick={() => navigate("/question-dev/authoring")}
          sx={{ ml: 2 }}
        >
          목록으로
        </Button>
      </Alert>
    );
  }

  const filteredStimuli = availableStimuli.filter(
    (s) =>
      s.title.toLowerCase().includes(stimulusSearch.toLowerCase()) ||
      (s.content_text?.toLowerCase().includes(stimulusSearch.toLowerCase()) ??
        false),
  );

  return (
    <Box>
      {/* 헤더 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
                  label={
                    gradeBandLabels[project.grade_band] || project.grade_band
                  }
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
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* 왼쪽: 지문 영역 */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
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
                  onClick={handleOpenNewStimulusDialog}
                >
                  새 지문
                </Button>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {selectedStimulus ? (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {selectedStimulus.title}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      startIcon={
                        stimulusSaving ? (
                          <CircularProgress size={16} />
                        ) : (
                          <Save />
                        )
                      }
                      onClick={handleSaveStimulusToProject}
                      disabled={
                        stimulusSaving ||
                        projectStimulusId === selectedStimulus.stimulus_id
                      }
                    >
                      {projectStimulusId === selectedStimulus.stimulus_id
                        ? "저장됨"
                        : "저장"}
                    </Button>
                    <IconButton
                      size="small"
                      onClick={handleStartEditStimulus}
                      title="지문 편집"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() =>
                        navigate(
                          `/question-dev/stimuli/${selectedStimulus.stimulus_id}`,
                        )
                      }
                      title="상세 보기"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {/* 지문 편집 모드 */}
                {isEditingStimulus ? (
                  <Box>
                    <TextField
                      fullWidth
                      label="제목"
                      value={editingStimulusData.title}
                      onChange={(e) =>
                        setEditingStimulusData({
                          ...editingStimulusData,
                          title: e.target.value,
                        })
                      }
                      sx={{ mb: 2 }}
                      size="small"
                    />
                    <TextField
                      fullWidth
                      label="장르"
                      value={editingStimulusData.genre}
                      onChange={(e) =>
                        setEditingStimulusData({
                          ...editingStimulusData,
                          genre: e.target.value,
                        })
                      }
                      sx={{ mb: 2 }}
                      size="small"
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={10}
                      label="본문"
                      value={editingStimulusData.content_text}
                      onChange={(e) =>
                        setEditingStimulusData({
                          ...editingStimulusData,
                          content_text: e.target.value,
                        })
                      }
                      sx={{ mb: 2 }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={handleCancelEditStimulus}
                        disabled={stimulusUpdateSaving}
                      >
                        취소
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={
                          stimulusUpdateSaving ? (
                            <CircularProgress size={16} />
                          ) : (
                            <Save />
                          )
                        }
                        onClick={handleSaveEditStimulus}
                        disabled={
                          stimulusUpdateSaving ||
                          !editingStimulusData.title.trim()
                        }
                      >
                        저장
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <Chip
                        label={selectedStimulus.content_type}
                        size="small"
                      />
                      <Chip
                        label={
                          gradeBandLabels[selectedStimulus.grade_band] ||
                          selectedStimulus.grade_band
                        }
                        size="small"
                        variant="outlined"
                      />
                      {selectedStimulus.genre && (
                        <Chip
                          label={selectedStimulus.genre}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {selectedStimulus.word_count && (
                        <Chip
                          label={`${selectedStimulus.word_count}자`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "#f9fafb",
                        borderRadius: 2,
                        maxHeight: 300,
                        overflow: "auto",
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.8,
                        fontSize: "0.9rem",
                      }}
                    >
                      {selectedStimulus.content_text || "내용이 없습니다."}
                    </Box>
                  </>
                )}
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Article
                  sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                />
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
                <AutoAwesome
                  sx={{ mr: 1, verticalAlign: "middle", color: "primary.main" }}
                />
                AI 생성 문항 ({aiGeneratedItems.length}개)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {aiGeneratedItems.map((item, idx) => {
                const validationErrors = validateItem(item);
                return (
                  <Card key={idx} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Chip
                          label={
                            itemTypeOptions.find(
                              (o) => o.value === item.item_type,
                            )?.label || item.item_type
                          }
                          size="small"
                          color="primary"
                        />
                        <Chip
                          label="AI 생성"
                          size="small"
                          icon={<SmartToy />}
                        />
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
                                  fontWeight: opt.is_correct
                                    ? "bold"
                                    : "normal",
                                  color: opt.is_correct
                                    ? "success.main"
                                    : "text.primary",
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                      {validationErrors.length > 0 && (
                        <Alert severity="warning" sx={{ mt: 1 }}>
                          {validationErrors.map((err, i) => (
                            <Typography
                              key={i}
                              variant="caption"
                              display="block"
                            >
                              - {err}
                            </Typography>
                          ))}
                        </Alert>
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 1,
                          mt: 2,
                        }}
                      >
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => {
                            setEditingItemData({
                              stem: item.stem || "",
                              item_type: item.item_type || "mcq_single",
                              options: item.options || [],
                              rubric: item.rubric || null,
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
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
                <SmartToy
                  sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                />
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
                      <TableCell>지문</TableCell>
                      <TableCell>상태</TableCell>
                      <TableCell>버전</TableCell>
                      <TableCell align="center">관리</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, idx) => {
                      const content = item.current_version?.content_json || {};
                      const versionCount = item.current_version_id ? 1 : 0;
                      // 연결된 지문 정보 (stimulus_id 또는 content_json에서)
                      const linkedStimulusId =
                        item.stimulus_id || content.stimulus_id;
                      const linkedStimulus = linkedStimulusId
                        ? stimuli.find(
                            (s: Stimulus) => s.stimulus_id === linkedStimulusId,
                          )
                        : null;
                      return (
                        <TableRow key={item.draft_item_id} hover>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>
                            <Chip
                              label={
                                itemTypeOptions.find(
                                  (o) => o.value === item.item_kind,
                                )?.label || item.item_kind
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                maxWidth: 200,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {content.stem || "(내용 없음)"}
                            </Typography>
                            {item.status === "ai_draft" && (
                              <Chip
                                label="AI"
                                size="small"
                                sx={{ ml: 1 }}
                                icon={<SmartToy />}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            {linkedStimulus ? (
                              <Tooltip title={linkedStimulus.title}>
                                <Chip
                                  label={
                                    linkedStimulus.title?.substring(0, 10) +
                                    (linkedStimulus.title?.length > 10
                                      ? "..."
                                      : "")
                                  }
                                  size="small"
                                  variant="outlined"
                                  icon={<Article />}
                                  onClick={() =>
                                    setSelectedStimulus(linkedStimulus)
                                  }
                                  sx={{ cursor: "pointer" }}
                                />
                              </Tooltip>
                            ) : (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                -
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                statusConfig[item.status]?.label || item.status
                              }
                              color={
                                statusConfig[item.status]?.color || "default"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>v{versionCount}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="수정">
                              <IconButton
                                size="small"
                                onClick={() => handleEditItem(item)}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="삭제">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleDeleteItem(item.draft_item_id)
                                }
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
                    {
                      items.filter(
                        (i) =>
                          i.status === "ai_draft" || i.status === "editing",
                      ).length
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    초안/편집
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper
                  sx={{ p: 2, textAlign: "center", bgcolor: "warning.50" }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="warning.main"
                  >
                    {items.filter((i) => i.status === "in_review").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    검토 중
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper
                  sx={{ p: 2, textAlign: "center", bgcolor: "success.50" }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {items.filter((i) => i.status === "approved").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    승인됨
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper sx={{ p: 2, textAlign: "center", bgcolor: "error.50" }}>
                  <Typography variant="h4" fontWeight="bold" color="error.main">
                    {items.filter((i) => i.status === "rejected").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    반려됨
                  </Typography>
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
        disableRestoreFocus
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
              startAdornment: (
                <Search sx={{ color: "text.secondary", mr: 1 }} />
              ),
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
                        <Chip
                          label={
                            gradeBandLabels[stimulus.grade_band] ||
                            stimulus.grade_band
                          }
                          size="small"
                          variant="outlined"
                        />
                        {stimulus.genre && (
                          <Chip
                            label={stimulus.genre}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mt: 1 }}
                      >
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
              handleOpenNewStimulusDialog();
            }}
          >
            새 지문 등록
          </Button>
        </DialogActions>
      </Dialog>

      {/* 새 지문 생성 다이얼로그 */}
      <Dialog
        open={newStimulusDialogOpen}
        onClose={() => setNewStimulusDialogOpen(false)}
        maxWidth="md"
        fullWidth
        disableRestoreFocus
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Article color="primary" />새 지문 등록
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="지문 제목"
              value={newStimulusData.title}
              onChange={(e) =>
                setNewStimulusData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              sx={{ mb: 2 }}
              required
            />

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>콘텐츠 유형</InputLabel>
                  <Select
                    value={newStimulusData.content_type}
                    label="콘텐츠 유형"
                    onChange={(e) =>
                      setNewStimulusData((prev) => ({
                        ...prev,
                        content_type: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="text">텍스트</MenuItem>
                    <MenuItem value="html">HTML</MenuItem>
                    <MenuItem value="markdown">마크다운</MenuItem>
                    <MenuItem value="mixed">복합</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>장르</InputLabel>
                  <Select
                    value={newStimulusData.genre}
                    label="장르"
                    onChange={(e) =>
                      setNewStimulusData((prev) => ({
                        ...prev,
                        genre: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="">선택 안 함</MenuItem>
                    <MenuItem value="문학-시">문학-시</MenuItem>
                    <MenuItem value="문학-소설">문학-소설</MenuItem>
                    <MenuItem value="문학-수필">문학-수필</MenuItem>
                    <MenuItem value="비문학-설명문">비문학-설명문</MenuItem>
                    <MenuItem value="비문학-논설문">비문학-논설문</MenuItem>
                    <MenuItem value="비문학-기사문">비문학-기사문</MenuItem>
                    <MenuItem value="복합">복합</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="지문 내용"
              multiline
              rows={12}
              value={newStimulusData.content_text}
              onChange={(e) =>
                setNewStimulusData((prev) => ({
                  ...prev,
                  content_text: e.target.value,
                }))
              }
              placeholder="지문 내용을 입력하세요..."
              sx={{ mb: 2 }}
              required
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                글자 수:{" "}
                {newStimulusData.content_text.replace(/\s/g, "").length}자
              </Typography>
              <Chip
                label={`학년군: ${gradeBandLabels[project?.grade_band || ""] || project?.grade_band || "미지정"}`}
                size="small"
                variant="outlined"
              />
            </Box>

            <TextField
              fullWidth
              label="출처 (선택)"
              value={newStimulusData.source}
              onChange={(e) =>
                setNewStimulusData((prev) => ({
                  ...prev,
                  source: e.target.value,
                }))
              }
              placeholder="예: 2024 수능, 교과서 p.123"
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setNewStimulusDialogOpen(false)}>취소</Button>
          <Button
            variant="contained"
            startIcon={
              newStimulusSaving ? <CircularProgress size={16} /> : <Save />
            }
            onClick={handleSaveNewStimulus}
            disabled={
              newStimulusSaving ||
              !newStimulusData.title.trim() ||
              !newStimulusData.content_text.trim()
            }
          >
            {newStimulusSaving ? "저장 중..." : "지문 저장"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI 문항 생성 다이얼로그 */}
      <Dialog
        open={aiDialogOpen}
        onClose={() => setAiDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        disableRestoreFocus
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SmartToy color="primary" />
            AI 문항 초안 생성
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {/* 왼쪽: 설정 영역 */}
            <Grid item xs={12} md={4}>
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

              {/* 객관식일 때만 보기 개수 표시 */}
              {aiItemType?.startsWith("mcq") && (
                <>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    gutterBottom
                  >
                    객관식 보기 개수
                  </Typography>
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <Select
                      value={aiNumOptions}
                      onChange={(e) =>
                        setAiNumOptions(e.target.value as number)
                      }
                    >
                      {[2, 3, 4, 5, 6].map((num) => (
                        <MenuItem key={num} value={num}>
                          {num}개 (정답 1개 포함)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}

              <Divider sx={{ my: 2 }} />

              {/* 기본 프롬프트 템플릿 */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold">
                  기본 프롬프트
                </Typography>
                <Button
                  size="small"
                  onClick={() => setShowBasePromptDetail(!showBasePromptDetail)}
                >
                  {showBasePromptDetail ? "접기" : "상세보기"}
                </Button>
              </Box>
              {dbBaseTemplates.length > 0 ? (
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <Select
                    value={selectedBaseTemplate?.base_template_id || ""}
                    onChange={(e) => {
                      const template = dbBaseTemplates.find(
                        (t) => t.base_template_id === e.target.value,
                      );
                      if (template) setSelectedBaseTemplate(template);
                    }}
                  >
                    {dbBaseTemplates.map((template) => (
                      <MenuItem
                        key={template.base_template_id}
                        value={template.base_template_id}
                      >
                        {template.template_name} (v{template.version})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="caption">
                    DB에서 프롬프트 템플릿을 불러오는 중...
                  </Typography>
                </Alert>
              )}

              {showBasePromptDetail && selectedBaseTemplate && (
                <Paper
                  variant="outlined"
                  sx={{ p: 1.5, mb: 2, maxHeight: 200, overflow: "auto" }}
                >
                  <Typography
                    variant="caption"
                    color="primary"
                    fontWeight="bold"
                  >
                    페르소나:
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mb: 1, whiteSpace: "pre-wrap" }}
                  >
                    {selectedBaseTemplate.persona_text.substring(0, 200)}...
                  </Typography>
                  <Typography
                    variant="caption"
                    color="primary"
                    fontWeight="bold"
                  >
                    품질 규칙:
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ whiteSpace: "pre-wrap" }}
                  >
                    {selectedBaseTemplate.quality_rules_text.substring(0, 200)}
                    ...
                  </Typography>
                </Paper>
              )}

              {/* 영역별 프롬프트 템플릿 */}
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                영역 프롬프트
              </Typography>
              {dbAreaTemplates.map((template) => (
                <Card
                  key={template.area_template_id}
                  variant="outlined"
                  sx={{
                    mb: 1,
                    cursor: "pointer",
                    bgcolor:
                      selectedAreaTemplate?.area_template_id ===
                      template.area_template_id
                        ? "primary.50"
                        : "transparent",
                    borderColor:
                      selectedAreaTemplate?.area_template_id ===
                      template.area_template_id
                        ? "primary.main"
                        : "divider",
                  }}
                  onClick={() => setSelectedAreaTemplate(template)}
                >
                  <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" fontWeight="medium">
                        {template.area_name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoritePrompt(template.area_code);
                        }}
                      >
                        {favoritePrompts.includes(template.area_code) ? (
                          <Star fontSize="small" color="warning" />
                        ) : (
                          <StarBorder fontSize="small" />
                        )}
                      </IconButton>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {template.area_description ||
                        template.objective_text.substring(0, 50)}
                      ...
                    </Typography>
                  </CardContent>
                </Card>
              ))}

              {/* 저장된 커스텀 프롬프트 */}
              {userFavoritePrompts.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    gutterBottom
                  >
                    내 저장된 프롬프트
                  </Typography>
                  {userFavoritePrompts.slice(0, 3).map((fav) => (
                    <Card
                      key={fav.favorite_id}
                      variant="outlined"
                      sx={{ mb: 1, cursor: "pointer" }}
                      onClick={() => handleLoadFavoritePrompt(fav)}
                    >
                      <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="caption" fontWeight="medium">
                            {fav.favorite_name}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFavoritePrompt(fav.favorite_id);
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          사용: {fav.usage_count}회
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </Grid>

            {/* 오른쪽: 프롬프트 미리보기 및 수정 */}
            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold">
                  프롬프트 미리보기 및 수정
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {isPromptModified && (
                    <Chip label="수정됨" size="small" color="warning" />
                  )}
                  <Button
                    size="small"
                    startIcon={
                      promptSaving ? <CircularProgress size={14} /> : <Save />
                    }
                    onClick={handleSaveCustomPrompt}
                    disabled={
                      promptSaving || (!aiCustomPrompt && !isPromptModified)
                    }
                  >
                    프롬프트 저장
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Refresh />}
                    onClick={() => {
                      setAiCustomPrompt("");
                      setIsPromptModified(false);
                      if (selectedBaseTemplate && selectedAreaTemplate) {
                        const newPrompt = composePrompt(
                          selectedBaseTemplate,
                          selectedAreaTemplate,
                          selectedStimulus,
                          project,
                          aiItemCount,
                          aiNumOptions,
                        );
                        setComposedPrompt(newPrompt);
                      }
                    }}
                  >
                    초기화
                  </Button>
                </Box>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={18}
                value={aiCustomPrompt || composedPrompt}
                onChange={(e) => {
                  setAiCustomPrompt(e.target.value);
                  setIsPromptModified(true);
                }}
                placeholder="프롬프트를 직접 수정하거나 추가 지시사항을 입력하세요..."
                sx={{
                  mb: 2,
                  "& .MuiInputBase-root": {
                    fontFamily: "monospace",
                    fontSize: "0.85rem",
                  },
                }}
              />

              {selectedStimulus && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="caption" fontWeight="bold">
                    선택된 지문: {selectedStimulus.title}
                  </Typography>
                  <Typography variant="caption" display="block">
                    {selectedStimulus.word_count}자 |{" "}
                    {gradeBandLabels[selectedStimulus.grade_band]}
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
        disableRestoreFocus
      >
        <DialogTitle>문항 편집</DialogTitle>
        <DialogContent>
          <FormControl fullWidth size="small" sx={{ mb: 2, mt: 1 }}>
            <InputLabel>문항 유형</InputLabel>
            <Select
              value={editingItemData.item_type}
              label="문항 유형"
              onChange={(e) =>
                setEditingItemData({
                  ...editingItemData,
                  item_type: e.target.value,
                })
              }
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
            onChange={(e) =>
              setEditingItemData({ ...editingItemData, stem: e.target.value })
            }
            sx={{ mb: 2 }}
          />

          {editingItemData.item_type?.startsWith("mcq") && (
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
                      setEditingItemData({
                        ...editingItemData,
                        options: newOptions,
                      });
                    }}
                    placeholder={`선택지 ${String.fromCharCode(65 + idx)}`}
                  />
                  <Button
                    variant={opt.is_correct ? "contained" : "outlined"}
                    color={opt.is_correct ? "success" : "inherit"}
                    onClick={() => {
                      const newOptions = editingItemData.options.map(
                        (o, i) => ({
                          ...o,
                          is_correct:
                            editingItemData.item_type === "mcq_single"
                              ? i === idx
                              : i === idx
                                ? !o.is_correct
                                : o.is_correct,
                        }),
                      );
                      setEditingItemData({
                        ...editingItemData,
                        options: newOptions,
                      });
                    }}
                  >
                    {opt.is_correct ? <CheckCircle /> : "정답"}
                  </Button>
                  <IconButton
                    onClick={() => {
                      const newOptions = editingItemData.options.filter(
                        (_, i) => i !== idx,
                      );
                      setEditingItemData({
                        ...editingItemData,
                        options: newOptions,
                      });
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
                    options: [
                      ...editingItemData.options,
                      { text: "", is_correct: false },
                    ],
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  서술형 문항의 채점 기준을 설정합니다.
                </Typography>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>루브릭 템플릿</InputLabel>
                  <Select
                    value=""
                    label="루브릭 템플릿"
                    onChange={(e) => {
                      const template = rubricTemplates.find(
                        (r) => r.id === e.target.value,
                      );
                      if (template) {
                        setEditingItemData({
                          ...editingItemData,
                          rubric: template,
                        });
                      }
                    }}
                  >
                    {rubricTemplates
                      .filter((r) => r.itemType === "essay")
                      .map((template) => (
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
                        {editingItemData.rubric.criteria?.map(
                          (c: any, idx: number) => (
                            <TableRow key={idx}>
                              <TableCell>{c.name}</TableCell>
                              <TableCell>{c.weight}%</TableCell>
                              <TableCell>{c.levels?.join(" / ")}</TableCell>
                            </TableRow>
                          ),
                        )}
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
        disableRestoreFocus
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
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      width: "100%",
                    }}
                  >
                    <Typography fontWeight="bold" sx={{ flex: 1 }}>
                      {(content.stem || "(내용 없음)").substring(0, 50)}...
                    </Typography>
                    <Chip
                      label={item.current_version_id ? "v1" : "v0"}
                      size="small"
                    />
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
