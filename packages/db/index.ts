import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export * from './types';

export const createBrowserClient = (supabaseUrl: string, supabaseAnonKey: string) => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};
