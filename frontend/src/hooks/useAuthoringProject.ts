/**
 * 문항 제작 프로젝트 데이터 관리 훅
 */
import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import type { AuthoringProject, Stimulus, AuthoringItem } from "../types/authoring";

interface UseAuthoringProjectReturn {
  project: AuthoringProject | null;
  stimuli: Stimulus[];
  items: AuthoringItem[];
  loading: boolean;
  error: string | null;
  success: string | null;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  refreshProject: () => Promise<void>;
  refreshItems: () => Promise<void>;
}

export const useAuthoringProject = (projectId: string | undefined): UseAuthoringProjectReturn => {
  const [project, setProject] = useState<AuthoringProject | null>(null);
  const [stimuli, setStimuli] = useState<Stimulus[]>([]);
  const [items, setItems] = useState<AuthoringItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchProjectData = async () => {
    if (!supabase || !projectId) {
      console.error("Missing supabase or id:", { supabase: !!supabase, projectId });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Fetching project with id:", projectId);

      // 프로젝트 조회
      const { data: projectData, error: projectError } = await supabase
        .from("authoring_projects")
        .select("*")
        .eq("project_id", parseInt(projectId))
        .single();

      console.log("Project data:", { projectData, projectError });

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

      // 프로젝트의 문항 조회
      await fetchItems();
    } catch (err: any) {
      console.error("Project fetch error:", err);
      setError(err.message || "프로젝트 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    if (!supabase || !projectId) return;

    try {
      const { data: itemsData, error: itemsError } = await supabase
        .from("authoring_items")
        .select("*")
        .eq("project_id", parseInt(projectId))
        .order("created_at", { ascending: false });

      if (itemsError) {
        console.error("Items fetch error:", itemsError);
        return;
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
            ? versionsMap[item.current_version_id]
            : undefined,
        }));

        console.log("Formatted items:", formattedItems);
        setItems(formattedItems);
      } else {
        setItems([]);
      }
    } catch (err: any) {
      console.error("Items fetch error:", err);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  return {
    project,
    stimuli,
    items,
    loading,
    error,
    success,
    setError,
    setSuccess,
    refreshProject: fetchProjectData,
    refreshItems: fetchItems,
  };
};
