import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    // Get all events starting in the next hour with user notification preferences
    const { data: upcomingEvents, error: eventsError } = await supabase
      .from('family_calendar')
      .select(`
        *,
        families!inner (
          family_members!inner (user_id)
        )
      `)
      .gte('start_time', now.toISOString())
      .lte('start_time', oneHourFromNow.toISOString())

    if (eventsError) throw eventsError

    // If we have upcoming events, fetch notification preferences for relevant users
    if (upcomingEvents && upcomingEvents.length > 0) {
      const userIds = upcomingEvents
        .flatMap(event => event.families.family_members)
        .map(member => member.user_id);

      const { data: notificationPrefs, error: prefsError } = await supabase
        .from('notification_preferences')
        .select('*')
        .in('user_id', userIds);

      if (prefsError) throw prefsError;

      // Combine events with notification preferences
      const eventsWithPrefs = upcomingEvents.map(event => ({
        ...event,
        notification_preferences: event.families.family_members.map(member => ({
          user_id: member.user_id,
          preferences: notificationPrefs?.find(pref => pref.user_id === member.user_id)
        }))
      }));

      console.log('Found upcoming events with preferences:', eventsWithPrefs);

      return new Response(
        JSON.stringify({ 
          upcomingEvents: eventsWithPrefs,
          message: 'Notifications checked successfully' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    return new Response(
      JSON.stringify({ 
        upcomingEvents: [],
        message: 'No upcoming events found' 
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