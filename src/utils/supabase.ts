import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Interface for waiting list entry
export interface WaitingListEntry {
  first_name: string;
  email: string;
}

// Function to add a new entry to the waiting list
export const addToWaitingList = async (entry: WaitingListEntry) => {
  try {
    const { data, error } = await supabase
      .from('waiting_list')
      .insert([entry])
      .select();
    
    if (error) {
      throw error;
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error adding to waiting list:', error);
    return { success: false, error };
  }
};

// Function to check if an email already exists in the waiting list
export const checkEmailExists = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from('waiting_list')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (error) {
      throw error;
    }
    
    return { exists: !!data, data };
  } catch (error) {
    console.error('Error checking email:', error);
    return { exists: false, error };
  }
}; 