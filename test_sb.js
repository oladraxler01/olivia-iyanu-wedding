const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://koqujpsfbxxmcffrktuu.supabase.co', 'sb_publishable_EGZBy7ZRtNeUvITy5hAYIA_OV6ifBKx');
async function run() {
  const { data, error } = await supabase.from('leaderboards').insert([{ guest_name: 'testuser', game_type: 'maze', score: 99.456 }]);
  console.log('ERROR:', error);
}
run();
