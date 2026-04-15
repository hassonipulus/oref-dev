import { orefProxy } from './_proxy.js';

export async function onRequest(context) {
    // Handle preflight CORS requests automatically
    if (context.request.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        });
    }

    try {
        // Fetch the official Oref history JSON
        const orefResponse = await fetch("https://www.oref.org.il/WarningMessages/History/AlertsHistory.json", {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': 'https://www.oref.org.il/'
            },
            cf: { cacheTtl: 0, cacheEverything: false } // Bust Cloudflare's edge cache
        });

        // Pull the data as an arrayBuffer to prevent byte-order-mark (BOM) corruption
        const buffer = await orefResponse.arrayBuffer();

        // Send it back to your frontend
        return new Response(buffer, {
            status: orefResponse.status,
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"
            }
        });

    } catch (error) {
        // Graceful fail: Return empty array so the frontend doesn't crash
        return new Response("[]", { 
            status: 200, 
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" 
            } 
        });
    }
}
