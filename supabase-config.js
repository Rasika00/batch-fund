/**
 * RT Funds - Supabase Configuration
 * 
 * Connected to: uwfxbqhobwpuftszmxlh.supabase.co
 */

const SUPABASE_URL = 'https://uwfxbqhobwpuftszmxlh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_9lBZvICHa6TKMbk3MYYA8g_f0XDACEy';

// Export for use in browser
if (typeof window !== 'undefined') {
    window.SUPABASE_URL = SUPABASE_URL;
    window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
}

// Export for Node.js (Netlify Functions)
if (typeof module !== 'undefined') {
    module.exports = { SUPABASE_URL, SUPABASE_ANON_KEY };
}