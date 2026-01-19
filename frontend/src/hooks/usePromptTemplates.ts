/**
 * 프롬프트 템플릿 관리 훅
 */
import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import type {
  PromptBaseTemplate,
  PromptAreaTemplate,
  UserFavoritePrompt,
  AuthoringProject,
  Stimulus,
} from "../types/authoring";

interface UsePromptTemplatesReturn {
  // 템플릿 목록
  dbBaseTemplates: PromptBaseTemplate[];
  dbAreaTemplates: PromptAreaTemplate[];
  userFavoritePrompts: UserFavoritePrompt[];
  favoritePrompts: string[];

  // 선택된 템플릿
  selectedBaseTemplate: PromptBaseTemplate | null;
  selectedAreaTemplate: PromptAreaTemplate | null;
  setSelectedBaseTemplate: (template: PromptBaseTemplate | null) => void;
  setSelectedAreaTemplate: (template: PromptAreaTemplate | null) => void;

  // 조합된 프롬프트
  composedPrompt: string;
  setComposedPrompt: (prompt: string) => void;
  isPromptModified: boolean;
  setIsPromptModified: (modified: boolean) => void;
  showBasePromptDetail: boolean;
  setShowBasePromptDetail: (show: boolean) => void;

  // 상태
  promptSaving: boolean;

  // 핸들러
  fetchPromptTemplates: () => Promise<void>;
  handleSaveCustomPrompt: (
    aiCustomPrompt: string,
  ) => Promise<void>;
  handleLoadFavoritePrompt: (favorite: UserFavoritePrompt) => void;
  handleDeleteFavoritePrompt: (favoriteId: number) => Promise<void>;
  toggleFavoritePrompt: (promptId: string) => void;
  composePrompt: (
    baseTemplate: PromptBaseTemplate | null,
    areaTemplate: PromptAreaTemplate | null,
    stimulus: Stimulus | null,
    project: AuthoringProject | null,
    itemCount: number,
    numOptions: number,
  ) => string;
}

export const usePromptTemplates = (
  _project: AuthoringProject | null,
  setError: (error: string | null) => void,
  setSuccess: (success: string | null) => void,
  setAiCustomPrompt: (prompt: string) => void,
): UsePromptTemplatesReturn => {
  // 로컬 즐겨찾기 (localStorage 기반)
  const [favoritePrompts, setFavoritePrompts] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoritePrompts");
    return saved ? JSON.parse(saved) : [];
  });

  // DB 템플릿
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

  // 사용자 저장 프롬프트
  const [userFavoritePrompts, setUserFavoritePrompts] = useState<
    UserFavoritePrompt[]
  >([]);
  const [composedPrompt, setComposedPrompt] = useState<string>("");
  const [isPromptModified, setIsPromptModified] = useState(false);
  const [promptSaving, setPromptSaving] = useState(false);
  const [showBasePromptDetail, setShowBasePromptDetail] = useState(false);

  const fetchPromptTemplates = async () => {
    if (!supabase) return;

    try {
      // Base 템플릿 조회
      const { data: baseData } = await supabase
        .from("prompt_base_templates")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (baseData) {
        setDbBaseTemplates(baseData);
        // 첫 번째 템플릿을 기본 선택
        if (baseData.length > 0 && !selectedBaseTemplate) {
          setSelectedBaseTemplate(baseData[0]);
        }
      }

      // Area 템플릿 조회
      const { data: areaData } = await supabase
        .from("prompt_area_templates")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (areaData) {
        setDbAreaTemplates(areaData);
      }

      // 사용자 즐겨찾기 조회
      const { data: favData } = await supabase
        .from("prompt_user_favorites")
        .select("*")
        .eq("user_id", 1) // TODO: 실제 사용자 ID
        .order("last_used_at", { ascending: false });

      if (favData) {
        setUserFavoritePrompts(favData);
      }
    } catch (err: any) {
      console.error("프롬프트 템플릿 로드 실패:", err);
    }
  };

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

  const handleSaveCustomPrompt = async (aiCustomPrompt: string) => {
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

  const toggleFavoritePrompt = (promptId: string) => {
    setFavoritePrompts((prev) => {
      const newFavorites = prev.includes(promptId)
        ? prev.filter((id) => id !== promptId)
        : [...prev, promptId];
      localStorage.setItem("favoritePrompts", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  return {
    dbBaseTemplates,
    dbAreaTemplates,
    userFavoritePrompts,
    favoritePrompts,
    selectedBaseTemplate,
    selectedAreaTemplate,
    setSelectedBaseTemplate,
    setSelectedAreaTemplate,
    composedPrompt,
    setComposedPrompt,
    isPromptModified,
    setIsPromptModified,
    showBasePromptDetail,
    setShowBasePromptDetail,
    promptSaving,
    fetchPromptTemplates,
    handleSaveCustomPrompt,
    handleLoadFavoritePrompt,
    handleDeleteFavoritePrompt,
    toggleFavoritePrompt,
    composePrompt,
  };
};
