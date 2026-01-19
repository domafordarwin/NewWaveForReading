/**
 * 지문 선택 및 프로젝트별 복사본 관리 훅
 *
 * 핵심 개념:
 * 1. stimuli 테이블의 원본 지문은 읽기 전용
 * 2. 프로젝트에 지문을 연결하면 project_stimuli 테이블에 편집 가능한 복사본 생성
 * 3. 복사본은 프로젝트별로 독립적으로 수정 가능
 */
import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import type { Stimulus, ProjectStimulus, NewStimulusData } from "../types/authoring";

interface UseStimulusManagementReturn {
  // 원본 지문 선택
  selectedOriginalStimulus: Stimulus | null;
  availableStimuli: Stimulus[];
  stimulusSearch: string;
  stimulusDialogOpen: boolean;
  setStimulusSearch: (search: string) => void;
  setStimulusDialogOpen: (open: boolean) => void;
  handleSelectStimulus: (stimulus: Stimulus) => void;
  handleOpenStimulusDialog: () => void;

  // 프로젝트별 복사본
  projectStimulus: ProjectStimulus | null;
  setProjectStimulus: (stimulus: ProjectStimulus | null) => void;
  projectStimulusEditing: boolean;
  setProjectStimulusEditing: (editing: boolean) => void;

  // 새 지문 생성 (직접 작성)
  newStimulusDialogOpen: boolean;
  newStimulusData: NewStimulusData;
  newStimulusSaving: boolean;
  setNewStimulusDialogOpen: (open: boolean) => void;
  setNewStimulusData: (data: NewStimulusData) => void;
  handleOpenNewStimulusDialog: () => void;
  handleSaveNewStimulus: (projectId: number) => Promise<ProjectStimulus | null>;

  // 프로젝트에 지문 연결 (복사본 생성)
  stimulusSaving: boolean;
  handleLinkStimulusToProject: (projectId: number) => Promise<boolean>;

  // 프로젝트 복사본 편집
  handleUpdateProjectStimulus: (
    projectStimulusId: number,
    updates: Partial<ProjectStimulus>
  ) => Promise<boolean>;

  // 프로젝트 복사본 로드
  loadProjectStimulus: (projectId: number) => Promise<void>;
}

export const useStimulusManagement = (): UseStimulusManagementReturn => {
  // 원본 지문 선택 상태
  const [stimulusDialogOpen, setStimulusDialogOpen] = useState(false);
  const [availableStimuli, setAvailableStimuli] = useState<Stimulus[]>([]);
  const [stimulusSearch, setStimulusSearch] = useState("");
  const [selectedOriginalStimulus, setSelectedOriginalStimulus] = useState<Stimulus | null>(null);

  // 프로젝트별 복사본 상태
  const [projectStimulus, setProjectStimulus] = useState<ProjectStimulus | null>(null);
  const [projectStimulusEditing, setProjectStimulusEditing] = useState(false);

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
    setSelectedOriginalStimulus(stimulus);
    setStimulusDialogOpen(false);
  };

  const handleOpenNewStimulusDialog = () => {
    setNewStimulusDialogOpen(true);
  };

  /**
   * 새 지문을 프로젝트 전용으로 직접 생성
   * (원본 없이 project_stimuli에 바로 생성)
   */
  const handleSaveNewStimulus = async (projectId: number): Promise<ProjectStimulus | null> => {
    try {
      if (!supabase) {
        throw new Error("데이터베이스 연결이 필요합니다.");
      }

      setNewStimulusSaving(true);

      // 글자 수 계산
      const wordCount = newStimulusData.content_text.replace(/\s/g, "").length;

      // project_stimuli에 직접 생성 (original_stimulus_id는 null)
      const { data, error } = await supabase
        .from("project_stimuli")
        .insert([{
          project_id: projectId,
          original_stimulus_id: null, // 원본 없음
          title: newStimulusData.title,
          content_type: newStimulusData.content_type,
          content_text: newStimulusData.content_text,
          grade_band: newStimulusData.grade_band,
          genre: newStimulusData.genre,
          word_count: wordCount,
          source_title: newStimulusData.source_title || null,
          source_author: newStimulusData.source_author || null,
          source_year: newStimulusData.source_year || null,
          is_modified: false,
          modified_fields: null,
        }])
        .select()
        .single();

      if (error) throw error;

      // 프로젝트에 연결
      await supabase
        .from("authoring_projects")
        .update({
          primary_project_stimulus_id: data.project_stimulus_id,
          updated_at: new Date().toISOString(),
        })
        .eq("project_id", projectId);

      setProjectStimulus(data);
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

  /**
   * 원본 지문을 프로젝트에 연결 (편집 가능한 복사본 생성)
   */
  const handleLinkStimulusToProject = async (projectId: number): Promise<boolean> => {
    if (!selectedOriginalStimulus) return false;

    try {
      if (!supabase) {
        throw new Error("데이터베이스 연결이 필요합니다.");
      }

      setStimulusSaving(true);

      // project_stimuli에 복사본 생성
      const { data: copyData, error: copyError } = await supabase
        .from("project_stimuli")
        .insert([{
          project_id: projectId,
          original_stimulus_id: selectedOriginalStimulus.stimulus_id,
          title: selectedOriginalStimulus.title,
          content_type: selectedOriginalStimulus.content_type,
          content_text: selectedOriginalStimulus.content_text,
          grade_band: selectedOriginalStimulus.grade_band,
          genre: selectedOriginalStimulus.genre,
          word_count: selectedOriginalStimulus.word_count,
          source_title: selectedOriginalStimulus.source_title || null,
          source_author: selectedOriginalStimulus.source_author || null,
          source_year: selectedOriginalStimulus.source_year || null,
          is_modified: false,
          modified_fields: null,
        }])
        .select()
        .single();

      if (copyError) throw copyError;

      // 프로젝트에 복사본 연결
      const { error: updateError } = await supabase
        .from("authoring_projects")
        .update({
          primary_project_stimulus_id: copyData.project_stimulus_id,
          updated_at: new Date().toISOString(),
        })
        .eq("project_id", projectId);

      if (updateError) {
        console.warn("Failed to update project:", updateError);
      }

      setProjectStimulus(copyData);
      return true;
    } catch (err: any) {
      console.error("Failed to link stimulus to project:", err);
      return false;
    } finally {
      setStimulusSaving(false);
    }
  };

  /**
   * 프로젝트 복사본 수정
   */
  const handleUpdateProjectStimulus = async (
    projectStimulusId: number,
    updates: Partial<ProjectStimulus>
  ): Promise<boolean> => {
    try {
      if (!supabase) {
        throw new Error("데이터베이스 연결이 필요합니다.");
      }

      // 수정된 필드 추적
      const modifiedFields = Object.keys(updates);

      const { error } = await supabase
        .from("project_stimuli")
        .update({
          ...updates,
          is_modified: true,
          modified_fields: modifiedFields,
          updated_at: new Date().toISOString(),
        })
        .eq("project_stimulus_id", projectStimulusId);

      if (error) throw error;

      // 로컬 상태 업데이트
      if (projectStimulus) {
        setProjectStimulus({
          ...projectStimulus,
          ...updates,
          is_modified: true,
          modified_fields: modifiedFields,
        });
      }

      return true;
    } catch (err: any) {
      console.error("Failed to update project stimulus:", err);
      return false;
    }
  };

  /**
   * 프로젝트의 복사본 로드
   */
  const loadProjectStimulus = async (projectId: number): Promise<void> => {
    try {
      if (!supabase) return;

      // 프로젝트 정보 조회 (primary_project_stimulus_id 확인)
      const { data: projectData, error: projectError } = await supabase
        .from("authoring_projects")
        .select("primary_project_stimulus_id")
        .eq("project_id", projectId)
        .single();

      if (projectError) throw projectError;

      if (projectData?.primary_project_stimulus_id) {
        // 복사본 로드
        const { data: stimulusData, error: stimulusError } = await supabase
          .from("project_stimuli")
          .select("*")
          .eq("project_stimulus_id", projectData.primary_project_stimulus_id)
          .single();

        if (stimulusError) throw stimulusError;

        setProjectStimulus(stimulusData);

        // 원본 정보도 로드 (있는 경우)
        if (stimulusData.original_stimulus_id) {
          const { data: originalData } = await supabase
            .from("stimuli")
            .select("*")
            .eq("stimulus_id", stimulusData.original_stimulus_id)
            .single();

          if (originalData) {
            setSelectedOriginalStimulus(originalData);
          }
        }
      }
    } catch (err: any) {
      console.error("Failed to load project stimulus:", err);
    }
  };

  return {
    // 원본 지문 선택
    selectedOriginalStimulus,
    availableStimuli,
    stimulusSearch,
    stimulusDialogOpen,
    setStimulusSearch,
    setStimulusDialogOpen,
    handleSelectStimulus,
    handleOpenStimulusDialog,

    // 프로젝트별 복사본
    projectStimulus,
    setProjectStimulus,
    projectStimulusEditing,
    setProjectStimulusEditing,

    // 새 지문 생성
    newStimulusDialogOpen,
    newStimulusData,
    newStimulusSaving,
    setNewStimulusDialogOpen,
    setNewStimulusData,
    handleOpenNewStimulusDialog,
    handleSaveNewStimulus,

    // 프로젝트에 지문 연결
    stimulusSaving,
    handleLinkStimulusToProject,
    handleUpdateProjectStimulus,
    loadProjectStimulus,
  };
};
