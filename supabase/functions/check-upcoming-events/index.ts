import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Create a single supabase client for interacting with your database
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const now = new Date()
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000)

    // Get all events starting in the next hour
    const { data: upcomingEvents, error: eventsError } = await supabase
      .from('family_calendar')
      .select(`
        *,
        families!inner(
          family_members!inner(
            user_id,
            notification_preferences(browser_notifications)
          )
        )
      `)
      .gte('start_time', now.toISOString())
      .lte('start_time', oneHourFromNow.toISOString())

    if (eventsError) throw eventsError

    console.log('Found upcoming events:', upcomingEvents)

    return new Response(
      JSON.stringify({ 
        upcomingEvents,
        message: 'Notifications checked successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})