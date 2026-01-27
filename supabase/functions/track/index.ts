import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TrackRequest {
  bot_id: string;
  token: string;
  type: "msg_in" | "msg_out" | "handoff" | "lead" | "error";
  date?: string;
}

interface EventsDaily {
  id: string;
  msg_in_count: number;
  msg_out_count: number;
  handoff_count: number;
  lead_count: number;
  error_count: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body: TrackRequest = await req.json();

    // Validate required fields
    if (!body.bot_id || !body.token || !body.type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: bot_id, token, type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate type
    const validTypes = ["msg_in", "msg_out", "handoff", "lead", "error"];
    if (!validTypes.includes(body.type)) {
      return new Response(
        JSON.stringify({ error: `Invalid type. Must be one of: ${validTypes.join(", ")}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch bot and validate token
    const { data: bot, error: botError } = await supabase
      .from("bots")
      .select("id, company_id, token, status")
      .eq("id", body.bot_id)
      .single();

    if (botError || !bot) {
      return new Response(
        JSON.stringify({ error: "Bot not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (bot.token !== body.token) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (bot.status === "paused") {
      return new Response(
        JSON.stringify({ error: "Bot is paused" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Resolve date
    const eventDate = body.date || new Date().toISOString().split("T")[0];

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
      return new Response(
        JSON.stringify({ error: "Invalid date format. Use YYYY-MM-DD" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if record exists for this bot and date
    const { data: existing, error: existingError } = await supabase
      .from("events_daily")
      .select("id, msg_in_count, msg_out_count, handoff_count, lead_count, error_count")
      .eq("bot_id", body.bot_id)
      .eq("date", eventDate)
      .maybeSingle();

    if (existing) {
      // Update existing record
      const typedExisting = existing as EventsDaily;
      let updateData = {};
      
      switch (body.type) {
        case "msg_in":
          updateData = { msg_in_count: typedExisting.msg_in_count + 1 };
          break;
        case "msg_out":
          updateData = { msg_out_count: typedExisting.msg_out_count + 1 };
          break;
        case "handoff":
          updateData = { handoff_count: typedExisting.handoff_count + 1 };
          break;
        case "lead":
          updateData = { lead_count: typedExisting.lead_count + 1 };
          break;
        case "error":
          updateData = { error_count: typedExisting.error_count + 1 };
          break;
      }

      await supabase
        .from("events_daily")
        .update(updateData)
        .eq("id", typedExisting.id);
    } else {
      // Insert new record
      const insertData: Record<string, unknown> = {
        company_id: bot.company_id,
        bot_id: body.bot_id,
        date: eventDate,
        msg_in_count: body.type === "msg_in" ? 1 : 0,
        msg_out_count: body.type === "msg_out" ? 1 : 0,
        handoff_count: body.type === "handoff" ? 1 : 0,
        lead_count: body.type === "lead" ? 1 : 0,
        error_count: body.type === "error" ? 1 : 0,
      };

      await supabase
        .from("events_daily")
        .insert(insertData);
    }

    // Update bot's last_event_at
    await supabase
      .from("bots")
      .update({ last_event_at: new Date().toISOString() })
      .eq("id", body.bot_id);

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in track function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
