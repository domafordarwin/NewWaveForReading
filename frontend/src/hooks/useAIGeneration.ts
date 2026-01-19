/**
 * AI 문항 생성 관리 훅
 */
import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { generateItems } from "../services/openaiService";
import type { AuthoringProject, Stimulus } from "../types/authoring";
import { rubricTemplates } from "../constants/itemConfig";

interface UseAIGenerationReturn {
  // 다이얼로그 상태
  aiDialogOpen: boolean;
  setAiDialogOpen: (open: boolean) => void;

  // 생성 설정
  aiItemType: string;
  aiNumOptions: number;
  aiCustomPrompt: string;
  aiItemCount: number;
  setAiItemType: (type: string) => void;
  setAiNumOptions: (num: number) => void;
  setAiCustomPrompt: (prompt: string) => void;
  setAiItemCount: (count: number) => void;

  // 생성 결과
  aiGenerating: boolean;
  aiGeneratedItems: any[];
  setAiGeneratedItems: (items: any[]) => void;

  // 핸들러
  handleGenerateItems: (
    selectedStimulus: Stimulus | null,
    project: AuthoringProject | null,
    composedPrompt: string,
    selectedBaseTemplate: any,
    selectedAreaTemplate: any,
  ) => Promise<void>;
  handleSaveGeneratedItem: (
    item: any,
    index: number,
    project: AuthoringProject | null,
    selectedStimulus: Stimulus | null,
    refreshItems: () => Promise<void>,
  ) => Promise<void>;
}

export const useAIGeneration = (
  setError: (error: string | null) => void,
  setSuccess: (success: string | null) => void,
): UseAIGenerationReturn => {
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiItemType, setAiItemType] = useState("mcq_single");
  const [aiNumOptions, setAiNumOptions] = useState(5);
  const [aiCustomPrompt, setAiCustomPrompt] = useState("");
  const [aiItemCount, setAiItemCount] = useState(3);
  const [aiGeneratedItems, setAiGeneratedItems] = useState<any[]>([]);

  const handleGenerateItems = async (
    selectedStimulus: Stimulus | null,
    project: AuthoringProject | null,
    composedPrompt: string,
    selectedBaseTemplate: any,
    selectedAreaTemplate: any,
  ) => {
    if (!selectedStimulus || !project) {
      setError("지문을 먼저 선택해주세요.");
      return;
    }

    setAiGenerating(true);
    setAiGeneratedItems([]);

    try {
      // DB 프롬프트 또는 커스텀 프롬프트 사용
      const finalPrompt = aiCustomPrompt || composedPrompt;

      if (!finalPrompt || finalPrompt === "프롬프트 템플릿을 선택해주세요.") {
        throw new Error(
          "프롬프트가 준비되지 않았습니다. 템플릿을 선택해주세요.",
        );
      }

      // OpenAI 서비스를 통한 문항 생성
      const response = await generateItems({
        stimulusText: selectedStimulus.content_text || "",
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
              final_prompt_text: finalPrompt.substring(0, 5000),
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
          .then();
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

  const handleSaveGeneratedItem = async (
    item: any,
    index: number,
    project: AuthoringProject | null,
    selectedStimulus: Stimulus | null,
    refreshItems: () => Promise<void>,
  ) => {
    if (!supabase || !project || !selectedStimulus) return;

    try {
      // 1. authoring_items에 문항 생성
      const { data: itemData, error: itemError } = await supabase
        .from("authoring_items")
        .insert([
          {
            project_id: project.project_id,
            item_kind:
              item.item_type === "mcq_single" || item.item_type === "mcq_multi"
                ? "mcq"
                : item.item_type,
            status: "ai_draft",
          },
        ])
        .select()
        .single();

      if (itemError) throw itemError;

      // 2. authoring_item_versions에 버전 저장
      const contentJson = {
        stem: item.stem,
        options: item.options || [],
        rubric: item.rubric || null,
        explanation: item.explanation || "",
        keywords: item.keywords || [],
        answer_hint: item.answer_hint || "",
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
      const { error: updateError } = await supabase
        .from("authoring_items")
        .update({ current_version_id: versionData.version_id })
        .eq("draft_item_id", itemData.draft_item_id);

      if (updateError) throw updateError;

      // 생성된 아이템 목록에서 제거
      setAiGeneratedItems((prev) => prev.filter((_, i) => i !== index));
      setSuccess("문항이 저장되었습니다.");

      // 문항 목록 새로고침
      await refreshItems();
    } catch (err: any) {
      setError(err.message || "문항 저장에 실패했습니다.");
    }
  };

  return {
    aiDialogOpen,
    setAiDialogOpen,
    aiItemType,
    aiNumOptions,
    aiCustomPrompt,
    aiItemCount,
    setAiItemType,
    setAiNumOptions,
    setAiCustomPrompt,
    setAiItemCount,
    aiGenerating,
    aiGeneratedItems,
    setAiGeneratedItems,
    handleGenerateItems,
    handleSaveGeneratedItem,
  };
};
