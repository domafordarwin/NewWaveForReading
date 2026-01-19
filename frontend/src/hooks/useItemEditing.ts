/**
 * 문항 편집 및 삭제 관리 훅
 */
import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import {
  validateGeneratedItem,
  type GeneratedItem,
} from "../services/openaiService";
import type { AuthoringItem, ItemEditData } from "../types/authoring";

interface UseItemEditingReturn {
  // 다이얼로그 상태
  itemEditDialogOpen: boolean;
  setItemEditDialogOpen: (open: boolean) => void;

  // 편집 데이터
  editingItem: AuthoringItem | null;
  editingItemData: ItemEditData;
  setEditingItemData: (data: ItemEditData) => void;

  // 핸들러
  handleEditItem: (item: AuthoringItem) => void;
  handleSaveItem: (refreshItems: () => Promise<void>) => Promise<void>;
  handleDeleteItem: (
    itemId: number,
    refreshItems: () => Promise<void>,
  ) => Promise<void>;
  validateItem: (item: any) => string[];
}

export const useItemEditing = (
  setError: (error: string | null) => void,
  setSuccess: (success: string | null) => void,
): UseItemEditingReturn => {
  const [itemEditDialogOpen, setItemEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AuthoringItem | null>(null);
  const [editingItemData, setEditingItemData] = useState<ItemEditData>({
    stem: "",
    item_type: "mcq",
    options: [{ text: "", is_correct: false }],
    rubric: null,
  });

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

  const handleSaveItem = async (refreshItems: () => Promise<void>) => {
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
      await refreshItems();
      setSuccess("문항이 수정되었습니다.");
    } catch (err: any) {
      setError(err.message || "문항 수정에 실패했습니다.");
    }
  };

  const handleDeleteItem = async (
    itemId: number,
    refreshItems: () => Promise<void>,
  ) => {
    if (!supabase || !window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase
        .from("authoring_items")
        .delete()
        .eq("draft_item_id", itemId);

      if (error) throw error;

      await refreshItems();
      setSuccess("문항이 삭제되었습니다.");
    } catch (err: any) {
      setError(err.message || "문항 삭제에 실패했습니다.");
    }
  };

  const validateItem = (item: any): string[] => {
    return validateGeneratedItem(item as GeneratedItem);
  };

  return {
    itemEditDialogOpen,
    setItemEditDialogOpen,
    editingItem,
    editingItemData,
    setEditingItemData,
    handleEditItem,
    handleSaveItem,
    handleDeleteItem,
    validateItem,
  };
};
