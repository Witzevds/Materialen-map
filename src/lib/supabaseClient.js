import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl === "your_supabase_url_here"
) {
  console.error("⚠️  SUPABASE NOT CONFIGURED!");
  console.error("📝 Please follow these steps:");
  console.error("1. Create a Supabase project at https://supabase.com");
  console.error("2. Copy your project URL and anon key");
  console.error("3. Update the .env.local file in the project root");
  console.error("4. Restart the dev server");
  console.error("\nSee SETUP.md for detailed instructions.");
}

// Create client with fallback values to prevent errors during setup
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);
