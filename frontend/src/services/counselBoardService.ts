import { useSupabase } from "./supabaseClient";

export interface CounselPost {
  id: number;
  parent_id: number;
  title: string;
  content: string;
  created_at: string;
}

export const useCounselBoard = () => {
  const supabase = useSupabase();

  const fetchPosts = async () => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("counsel_board")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as CounselPost[];
  };

  const addPost = async (parent_id: number, title: string, content: string) => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("counsel_board")
      .insert([{ parent_id, title, content }])
      .select()
      .single();
    if (error) throw error;
    return data as CounselPost;
  };

  return { fetchPosts, addPost };
};
