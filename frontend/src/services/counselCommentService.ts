import { useSupabase } from "./supabaseClient";

export interface CounselComment {
  id: number;
  post_id: number;
  parent_id: number; // 댓글 작성자(부모) id
  content: string;
  created_at: string;
}

export const useCounselComment = () => {
  const supabase = useSupabase();

  // 특정 게시글의 댓글 목록 조회
  const fetchComments = async (post_id: number) => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("counsel_comments")
      .select("*")
      .eq("post_id", post_id)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data as CounselComment[];
  };

  // 댓글 작성
  const addComment = async (
    post_id: number,
    parent_id: number,
    content: string,
  ) => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("counsel_comments")
      .insert([{ post_id, parent_id, content }])
      .select()
      .single();
    if (error) throw error;
    return data as CounselComment;
  };

  return { fetchComments, addComment };
};
