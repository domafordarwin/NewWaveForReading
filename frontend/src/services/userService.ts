import { supabase } from './supabaseClient';
import type { User } from '../types';

export const getUserByEmail = async (email: string): Promise<User | null> => {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    throw error;
  }

  return data;
};

export const getAllUsers = async (): Promise<User[]> => {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('user_id');

  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }

  return data || [];
};
