/**
 * 지문 선택 및 생성 관리 훅
 */
import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import type { Stimulus, NewStimulusData } from "../types/authoring";

interface UseStimulusManagementReturn {
  // 지문 선택
  selectedStimulus: Stimulus | null;
  availableStimuli: Stimulus[];
  stimulusSearch: string;
  stimulusDialogOpen: boolean;
  setStimulusSearch: (search: string) => void;
  setStimulusDialogOpen: (open: boolean) => void;
  handleSelectStimulus: (stimulus: Stimulus) => void;
  handleOpenStimulusDialog: () => void;

  // 새 지문 생성
  newStimulusDialogOpen: boolean;
  newStimulusData: NewStimulusData;
  newStimulusSaving: boolean;
  setNewStimulusDialogOpen: (open: boolean) => void;
  setNewStimulusData: (data: NewStimulusData) => void;
  handleOpenNewStimulusDialog: () => void;
  handleSaveNewStimulus: () => Promise<Stimulus | null>;

  // 프로젝트에 지문 저장
  projectStimulusId: number | null;
  stimulusSaving: boolean;
  handleSaveStimulusToProject: (projectId: number) => Promise<boolean>;
}

export const useStimulusManagement = (): UseStimulusManagementReturn => {
  // 지문 선택 상태
  const [stimulusDialogOpen, setStimulusDialogOpen] = useState(false);
  const [availableStimuli, setAvailableStimuli] = useState<Stimulus[]>([]);
  const [stimulusSearch, setStimulusSearch] = useState("");
  const [selectedStimulus, setSelectedStimulus] = useState<Stimulus | null>(null);

  // 새 지문 생성 상태
  const [newStimulusDialogOpen, setNewStimulusDialogOpen] = useState(false);
  const [newStimulusSaving, setNewStimulusSaving] = useState(false);
  const [newStimulusData, setNewStimulusData] = useState<NewStimulusData>({
    title: "",
    content_type: "text",
    content_text: "",
    grade_band: "초고",
    genre: "설명문",
    source_title: "",
    source_author: "",
    source_year: "",
  });

  // 프로젝트 지문 저장 상태
  const [stimulusSaving, setStimulusSaving] = useState(false);
  const [projectStimulusId, setProjectStimulusId] = useState<number | null>(null);

  const fetchAvailableStimuli = async () => {
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("stimuli")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAvailableStimuli(data || []);
    } catch (err: any) {
      console.error("Failed to fetch stimuli:", err);
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

  const handleOpenNewStimulusDialog = () => {
    setNewStimulusDialogOpen(true);
  };

  const handleSaveNewStimulus = async (): Promise<Stimulus | null> => {
    try {
      if (!supabase) {
        throw new Error("데이터베이스 연결이 필요합니다.");
      }

      setNewStimulusSaving(true);

      const { data, error } = await supabase
        .from("stimuli")
        .insert([newStimulusData])
        .select()
        .single();

      if (error) throw error;

      // 새로 생성한 지문을 선택된 지문으로 설정
      setSelectedStimulus(data);
      setNewStimulusDialogOpen(false);

      // 폼 초기화
      setNewStimulusData({
        title: "",
        content_type: "text",
        content_text: "",
        grade_band: "초고",
        genre: "설명문",
        source_title: "",
        source_author: "",
        source_year: "",
      });

      return data;
    } catch (err: any) {
      console.error("Failed to save new stimulus:", err);
      throw err;
    } finally {
      setNewStimulusSaving(false);
    }
  };

  const handleSaveStimulusToProject = async (projectId: number): Promise<boolean> => {
    if (!selectedStimulus) return false;

    try {
      if (!supabase) {
        throw new Error("데이터베이스 연결이 필요합니다.");
      }

      setStimulusSaving(true);

      const { error: updateError } = await supabase
        .from("authoring_projects")
        .update({
          primary_stimulus_id: selectedStimulus.stimulus_id,
          updated_at: new Date().toISOString(),
        })
        .eq("project_id", projectId);

      if (updateError) {
        // primary_stimulus_id 컬럼이 없으면 로컬 상태만 유지 (정상 동작)
        console.warn("Failed to update primary_stimulus_id:", updateError);
      }

      setProjectStimulusId(selectedStimulus.stimulus_id);
      return true;
    } catch (err: any) {
      console.error("Failed to save stimulus to project:", err);
      return false;
    } finally {
      setStimulusSaving(false);
    }
  };

  return {
    // 지문 선택
    selectedStimulus,
    availableStimuli,
    stimulusSearch,
    stimulusDialogOpen,
    setStimulusSearch,
    setStimulusDialogOpen,
    handleSelectStimulus,
    handleOpenStimulusDialog,

    // 새 지문 생성
    newStimulusDialogOpen,
    newStimulusData,
    newStimulusSaving,
    setNewStimulusDialogOpen,
    setNewStimulusData,
    handleOpenNewStimulusDialog,
    handleSaveNewStimulus,

    // 프로젝트에 지문 저장
    projectStimulusId,
    stimulusSaving,
    handleSaveStimulusToProject,
  };
};
