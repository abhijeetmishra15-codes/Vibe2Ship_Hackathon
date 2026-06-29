// import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

// const corsHeaders = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
//   'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
// }

// const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

// async function callGemini(prompt: string, systemInstruction?: string, imageBase64?: string, mimeType?: string) {
//   if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set.");

//   const contents: any[] = [];

//   if (imageBase64 && mimeType) {
//     contents.push({
//       parts: [
//         { text: prompt },
//         {
//           inline_data: {
//             mime_type: mimeType,
//             data: imageBase64
//           }
//         }
//       ]
//     });
//   } else {
//     // contents.push({
//     //   parts: [{ text: prompt }]
//     // });
//     const finalPrompt = systemInstruction
//       ? `${systemInstruction}\n\n${prompt}`
//       : prompt;

//     contents.push({
//       parts: [{ text: finalPrompt }]
//     });
//   }

//   const payload: any = { contents };
//   // if (systemInstruction) {
//   //   payload.systemInstruction = {
//   //     parts: [{ text: systemInstruction }]
//   //   };
// }

// // Set lower temperature for deterministic extraction tasks, higher for copilot
// payload.generationConfig = { temperature: 0.2 };

// //const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
// const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;
// try {
//   const response = await fetch(url, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload)
//   });

//   if (!response.ok) {
//     const errText = await response.text();
//     console.error("Gemini API Error:", errText);
//     return JSON.stringify({ error: `Gemini API Error: ${response.status} ${response.statusText}` });
//   }

//   const data = await response.json();
//   const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
//   return text;
// } catch (err: any) {
//   console.error("Gemini fetch exception:", err);
//   return JSON.stringify({ error: "Gemini API fetch failed", details: err.message });
// }
// }

// // Function to safely parse JSON from Gemini's markdown output
// function parseGeminiJson(text: string) {
//   try {
//     let cleanText = text.trim();
//     if (cleanText.startsWith('```json')) cleanText = cleanText.substring(7);
//     if (cleanText.startsWith('```')) cleanText = cleanText.substring(3);
//     if (cleanText.endsWith('```')) cleanText = cleanText.substring(0, cleanText.length - 3);
//     return JSON.parse(cleanText.trim());
//   } catch (e) {
//     console.error("Failed to parse Gemini JSON:", text);
//     throw new Error("Invalid JSON response from AI");
//   }
// }

// Deno.serve(async (req) => {

//   const authHeader = req.headers.get("Authorization");

//   const token = authHeader?.replace("Bearer ", "");
//   // Handle CORS preflight requests
//   if (req.method === 'OPTIONS') {
//     return new Response('ok', { headers: corsHeaders })
//   }

//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader) {
//       return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
//         status: 401,
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' }
//       });
//     }

//     const token = authHeader.replace('Bearer ', '');

//     const supabaseClient = createClient(
//       Deno.env.get('SUPABASE_URL') ?? '',
//       Deno.env.get('SUPABASE_ANON_KEY') ?? '',
//       { global: { headers: { Authorization: authHeader } } }
//     );

//     // Verify authentication by passing the token explicitly (avoids missing localStorage error in Deno)
//     const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
//     if (authError || !user) {
//       return new Response(JSON.stringify({ error: 'Unauthorized', details: authError?.message }), {
//         status: 401,
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' }
//       });
//     }

//     const rawText = await req.text();

//     let requestData;
//     try {
//       requestData = JSON.parse(rawText);
//     } catch (e) {
//       console.error("Failed to parse request JSON:", e);
//       return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
//         status: 400,
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' }
//       });
//     }

//     const { action, payload } = requestData;

//     if (!action || !payload) {
//       return new Response(JSON.stringify({ error: "Missing action or payload in request body" }), {
//         status: 400,
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' }
//       });
//     }

//     if (payload.imageBase64) {
//     }

//     if (action === 'improve_draft') {
//       const { title, description, imageBase64, mimeType } = payload;
//       const prompt = `You are an expert civic intelligence assistant. Improve the following draft report for a municipal system.\nTitle: ${title}\nDescription: ${description}\nIf an image is provided, incorporate its visible details into the description. Provide output in pure JSON format: { "title": "Improved Title", "description": "Improved, structured description suitable for municipal review." }`;

//       const responseText = await callGemini(prompt, "You are a helpful civic assistant.", imageBase64, mimeType);
//       const result = parseGeminiJson(responseText);

//       if (result.error) {
//         return new Response(JSON.stringify(result), {
//           status: 502,
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' }
//         });
//       }

//       return new Response(JSON.stringify({ success: true, result }), {
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' }
//       });
//     }

//     if (action === 'analyze_issue' || action === 'reanalyze_issue') {
//       const { issueId } = payload;
//       if (!issueId) throw new Error("issueId is required");

//       // 1. Fetch the issue
//       const { data: issue, error: issueErr } = await supabaseClient
//         .from('issues')
//         .select('*')
//         .eq('id', issueId)
//         .single();

//       if (issueErr || !issue) {
//         return new Response(JSON.stringify({ error: "Issue not found" }), {
//           status: 404,
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' }
//         });
//       }

//       // 2. Fetch recent issues for duplicate detection
//       const { data: recentIssues } = await supabaseClient
//         .from('issues')
//         .select('id, title, description, category, location, created_at')
//         .neq('id', issueId)
//         .order('created_at', { ascending: false })
//         .limit(20);

//       // 3. Build the prompt for a massive single-pass analysis
//       const recentContext = recentIssues ? JSON.stringify(recentIssues) : "[]";

//       const prompt = `
// Analyze the following civic issue report carefully.
// ID: ${issue.id}
// Title: ${issue.title}
// Description: ${issue.description}
// Category Hint: ${issue.category}
// Location: ${issue.location}
// Created At: ${issue.created_at}

// We have the following 20 recent issues in the database:
// ${recentContext}

// Your task is to provide a complete JSON analysis containing exactly these fields:
// {
//   "ai_title": "A concise, professional title",
//   "ai_description": "A rewritten, structured professional report description",
//   "ai_summary": "One concise executive summary sentence",
//   "ai_category": "One of: Roads, Water Supply, Electricity, Garbage, Drainage, Street Lights, Traffic, Public Safety, Sanitation, Environment, Encroachment, Other",
//   "ai_severity": "One of: Low, Medium, High, Critical",
//   "responsible_department": "Name of the municipal department to route this to",
//   "suggested_action": "1-2 sentence suggested action for the department",
//   "estimated_resolution_time": "e.g., '3-5 days'",
//   "duplicate_issue_id": "UUID of the most likely duplicate from the recent issues list, or null if none",
//   "duplicate_confidence": 0-100 numeric score of duplicate certainty (0 if none),
//   "ai_confidence": 0-100 numeric score of your overall analysis confidence,
//   "image_analysis": "A brief summary of visible damage/hazards if an image was provided, otherwise 'No image provided'",
//   "fake_report_score": 0-100 numeric score (higher means more likely to be spam/fake. 0 is perfectly genuine)
// }

// Provide ONLY the raw JSON object, no markdown, no other text.
// `;
//       // We will skip actual image bytes here to save bandwidth if it's an uploaded image URL, 
//       // but Gemini could accept the URL if we fetched it, or we rely on the text description.
//       // For this implementation, we just pass text. (If image processing is critical here, we could fetch the image bytes, but text usually suffices for MVP).

//       // const responseText = await callGemini(prompt, "You are an automated backend civic intelligence AI. You only output valid JSON.");
//       // const aiResult = parseGeminiJson(responseText);

//       const responseText = await callGemini(
//         prompt,
//         "You are a helpful civic assistant.",
//         imageBase64,
//         mimeType
//       );

//       let aiResult: any;

//       try {
//         aiResult = parseGeminiJson(responseText);
//       } catch (err) {
//         console.error("Gemini JSON parse failed:", err);

//         aiResult = {
//           title: "AI generated title unavailable",
//           description: responseText || "No structured description returned"
//         };
//       }

//       if (aiResult.error) {
//         // return new Response(JSON.stringify(aiResult), {
//         //   status: 502,
//         //   headers: { ...corsHeaders, 'Content-Type': 'application/json' }
//         // });
//         return new Response(JSON.stringify({ success: true, result: aiResult }), {
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' }
//         });
//       }

//       // 4. Save to issue_ai_analysis table
//       const upsertData = {
//         issue_id: issue.id,
//         ai_title: aiResult.ai_title,
//         ai_description: aiResult.ai_description,
//         ai_summary: aiResult.ai_summary,
//         ai_category: aiResult.ai_category,
//         ai_severity: aiResult.ai_severity,
//         responsible_department: aiResult.responsible_department,
//         suggested_action: aiResult.suggested_action,
//         estimated_resolution_time: aiResult.estimated_resolution_time,
//         duplicate_issue_id: aiResult.duplicate_issue_id || null,
//         duplicate_confidence: aiResult.duplicate_confidence || 0,
//         ai_confidence: aiResult.ai_confidence || 100,
//         image_analysis: aiResult.image_analysis || '',
//         fake_report_score: aiResult.fake_report_score || 0,
//         model_name: "gemini-1.5-flash",
//         prompt_version: "v1",
//         updated_at: new Date().toISOString()
//       };

//       const { error: upsertErr } = await supabaseClient
//         .from('issue_ai_analysis')
//         .upsert(upsertData, { onConflict: 'issue_id' });

//       if (upsertErr) throw upsertErr;

//       return new Response(JSON.stringify({ success: true, result: upsertData }), {
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' }
//       });
//     }

//     if (action === 'copilot_chat') {
//       const { message, context } = payload;

//       // Fetch high-level stats for context
//       const { data: issues } = await supabaseClient.from('issues').select('id, title, status, category');
//       const { data: aiData } = await supabaseClient.from('issue_ai_analysis').select('issue_id, ai_severity, responsible_department');

//       const systemInstruction = `You are a Context-Aware Copilot for a Civic Intelligence Platform.
// User Context: ${JSON.stringify(context)}
// Available minimal stats: Total Issues: ${issues?.length || 0}.
// (Do not list all issues, just use the context provided by the user).
// Answer concisely and professionally.`;

//       const responseText = await callGemini(message, systemInstruction);
//       let chatResult;
//       try {
//         chatResult = JSON.parse(responseText);
//       } catch (e) {
//         chatResult = { text: responseText };
//       }

//       if (chatResult.error) {
//         return new Response(JSON.stringify(chatResult), {
//           status: 502,
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' }
//         });
//       }

//       return new Response(JSON.stringify({ success: true, text: chatResult.text || responseText }), {
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' }
//       });
//     }

//     return new Response(JSON.stringify({ error: "Unknown action" }), {
//       status: 400,
//       headers: { ...corsHeaders, 'Content-Type': 'application/json' }
//     });
//   } catch (error: any) {
//     console.error("Edge Function Error:", error);
//     return new Response(JSON.stringify({ error: "Unknown server error", details: error.message }), {
//       status: 500,
//       headers: { ...corsHeaders, 'Content-Type': 'application/json' }
//     });
//   }
// });



import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

async function callGemini(prompt: string, systemInstruction?: string, imageBase64?: string, mimeType?: string) {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set.");

  const contents: any[] = [];

  const finalPrompt = systemInstruction
    ? `${systemInstruction}\n\n${prompt}`
    : prompt;

  if (imageBase64 && mimeType) {
    contents.push({
      parts: [
        { text: finalPrompt },
        {
          inline_data: {
            mime_type: mimeType,
            data: imageBase64
          }
        }
      ]
    });
  } else {
    contents.push({
      parts: [{ text: finalPrompt }]
    });
  }

  const payload: any = { contents };

  payload.generationConfig = { temperature: 0.2 };

  //const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  //const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  //const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${GEMINI_API_KEY}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error:", errText);
      return JSON.stringify({ error: `Gemini API Error: ${response.status} ${response.statusText}` });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return text;
  } catch (err: any) {
    console.error("Gemini fetch exception:", err);
    return JSON.stringify({ error: "Gemini API fetch failed", details: err.message });
  }
}

// Function to safely parse JSON from Gemini's markdown output
function parseGeminiJson(text: string) {
  try {
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) cleanText = cleanText.substring(7);
    if (cleanText.startsWith('```')) cleanText = cleanText.substring(3);
    if (cleanText.endsWith('```')) cleanText = cleanText.substring(0, cleanText.length - 3);
    return JSON.parse(cleanText.trim());
  } catch (e) {
    console.error("Failed to parse Gemini JSON:", text);
    throw new Error("Invalid JSON response from AI");
  }
}

Deno.serve(async (req) => {

  const authHeader = req.headers.get("Authorization");

  const token = authHeader?.replace("Bearer ", "");

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized', details: authError?.message }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const rawText = await req.text();

    let requestData;
    try {
      requestData = JSON.parse(rawText);
    } catch (e) {
      console.error("Failed to parse request JSON:", e);
      return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { action, payload } = requestData;

    if (!action || !payload) {
      return new Response(JSON.stringify({ error: "Missing action or payload in request body" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (payload.imageBase64) {
    }

    // -------------------- IMPROVE DRAFT --------------------
    if (action === 'improve_draft') {
      const { title, description, imageBase64, mimeType } = payload;

      const prompt =
        `You are an expert civic intelligence assistant. Improve the following draft report for a municipal system.
Title: ${title}
Description: ${description}
Provide output in pure JSON format: { "title": "Improved Title", "description": "Improved structured description", "category": "Pothole | Garbage | Water Leakage | Streetlight | Sewer | Public Infrastructure", "severity": "Low | Medium | High | Critical" }`;

      const responseText = await callGemini(
        prompt,
        "You are a helpful civic assistant.",
        imageBase64,
        mimeType
      );

      let result: any;

      try {
        result = parseGeminiJson(responseText);
      } catch (err) {
        console.error("Gemini JSON parse failed:", err);

        result = {
          title: "AI generated title unavailable",
          description: responseText || "No structured response"
        };
      }

      if (result.error) {
        return new Response(JSON.stringify(result), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true, result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // -------------------- ANALYZE ISSUE --------------------
    if (action === 'analyze_issue' || action === 'reanalyze_issue') {
      const { issueId } = payload;

      if (!issueId) throw new Error("issueId is required");

      const { data: issue, error: issueErr } = await supabaseClient
        .from('issues')
        .select('*')
        .eq('id', issueId)
        .single();

      if (issueErr || !issue) {
        return new Response(JSON.stringify({ error: "Issue not found" }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const { data: recentIssues } = await supabaseClient
        .from('issues')
        .select(`
          id, title, description, category, location, created_at,
          issue_ai_analysis ( image_analysis )
        `)
        .neq('id', issueId)
        .order('created_at', { ascending: false })
        .limit(20);

      const formattedRecentIssues = recentIssues?.map((r: any) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        category: r.category,
        location: r.location,
        image_analysis: r.issue_ai_analysis?.[0]?.image_analysis || "No visual data"
      })) || [];
      
      const recentContext = JSON.stringify(formattedRecentIssues);

      let imageBase64;
      let mimeType;

      if (issue.image_url) {
        try {
          const imgRes = await fetch(issue.image_url);
          if (imgRes.ok) {
            const arrayBuffer = await imgRes.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);
            let binary = '';
            for (let i = 0; i < bytes.byteLength; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            imageBase64 = btoa(binary);
            mimeType = imgRes.headers.get('content-type') || 'image/jpeg';
          }
        } catch (e) {
          console.error("Failed to fetch image for AI analysis:", e);
        }
      }

      const prompt = `
Analyze the following civic issue report carefully. Focus especially on the provided image (if any) and the location coordinates.
ID: ${issue.id}
Title: ${issue.title}
Description: ${issue.description}
Category Hint: ${issue.category}
Location (GPS or Address): ${issue.location}
Created At: ${issue.created_at}

We have the following recent issues in the database (with their visual analyses and locations):
${recentContext}

Your task is to provide a complete JSON analysis containing exactly these fields:
{
  "ai_title": "A concise, professional title",
  "ai_description": "A rewritten, structured professional report description incorporating visible details from the image.",
  "ai_summary": "One concise executive summary sentence",
  "ai_category": "One of: Pothole, Garbage, Water Leakage, Streetlight, Sewer, Public Infrastructure",
  "ai_severity": "One of: Low, Medium, High, Critical",
  "responsible_department": "Name of the municipal department to route this to",
  "suggested_action": "1-2 sentence suggested action for the department",
  "estimated_resolution_time": "e.g., '3-5 days'",
  "duplicate_issue_id": "Return the exact 'id' from a recent issue if it's a duplicate based on highly similar Location coordinates AND matching visual features (image), otherwise return null",
  "duplicate_confidence": "Number between 0 and 100",
  "ai_confidence": "Number between 0 and 100",
  "image_analysis": "A detailed description of the provided image (objects, damage, severity), or 'No image provided'",
  "fake_report_score": "Number between 0 and 100 (higher means spam/fake)"
}

Provide ONLY the raw JSON object, no markdown, no other text.
`;

      const responseText = await callGemini(
        prompt,
        "You are an automated civic intelligence AI. You only output valid JSON.",
        imageBase64,
        mimeType
      );

      let aiResult: any;

      try {
        aiResult = parseGeminiJson(responseText);
      } catch (err) {
        console.error("Gemini JSON parse failed:", err);
        aiResult = {};
      }

      const allowedCategories = [
        "Pothole",
        "Garbage",
        "Water Leakage",
        "Streetlight",
        "Sewer",
        "Public Infrastructure"
      ];
      
      const allowedSeverities = ["Low", "Medium", "High", "Critical"];

      const finalCategory = allowedCategories.includes(aiResult?.ai_category)
        ? aiResult.ai_category
        : (allowedCategories.includes(issue.category) ? issue.category : "Public Infrastructure");

      const finalSeverity = allowedSeverities.includes(aiResult?.ai_severity)
        ? aiResult.ai_severity
        : "Medium";

      const parseScore = (val: any) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') {
          const match = val.match(/\d+/);
          if (match) return parseInt(match[0], 10);
        }
        return 0;
      };

      const duplicateId = aiResult?.duplicate_issue_id;
      const cleanDuplicateId = (typeof duplicateId === 'string' && duplicateId !== "null" && duplicateId.toLowerCase() !== "none" && duplicateId.toLowerCase() !== "n/a" && duplicateId.trim() !== "") ? duplicateId.trim() : null;

      const upsertData = {
        issue_id: issue.id,
        ai_title: aiResult?.ai_title || issue.title || "AI analysis failed",
        ai_description: aiResult?.ai_description || issue.description || "No structured description returned",
        ai_summary: aiResult?.ai_summary || "Issue requires manual review",
        ai_category: finalCategory,
        ai_severity: finalSeverity,
        responsible_department: aiResult?.responsible_department || "General Administration",
        suggested_action: aiResult?.suggested_action || "Pending review",
        estimated_resolution_time: aiResult?.estimated_resolution_time || "TBD",
        duplicate_issue_id: cleanDuplicateId,
        duplicate_confidence: parseScore(aiResult?.duplicate_confidence),
        ai_confidence: parseScore(aiResult?.ai_confidence) || 100,
        image_analysis: aiResult?.image_analysis || '',
        fake_report_score: parseScore(aiResult?.fake_report_score),
        model_name: "gemini-1.5-flash",
        prompt_version: "v1",
        updated_at: new Date().toISOString()
      };

      const { error: upsertErr } = await supabaseClient
        .from('issue_ai_analysis')
        .upsert(upsertData, { onConflict: 'issue_id' });

      if (upsertErr) throw upsertErr;

      return new Response(JSON.stringify({ success: true, result: upsertData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // -------------------- COPILOT --------------------
    if (action === 'copilot_chat') {
      const { message, context } = payload;

      const { data: issues } = await supabaseClient
        .from('issues')
        .select('id, title, status, category');

      const systemInstruction = `
You are a civic copilot assistant.
Context: ${JSON.stringify(context)}
Total issues: ${issues?.length || 0}
Answer briefly and clearly.
`;

      const responseText = await callGemini(message, systemInstruction);

      return new Response(JSON.stringify({
        success: true,
        text: responseText
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Edge Function Error:", error);
    return new Response(JSON.stringify({
      error: "Unknown server error",
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});