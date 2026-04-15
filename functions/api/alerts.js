import { orefProxy } from './_proxy.js';

export async function onRequest(context) {
    // ... preflight OPTIONS handling ...

    try {
        // SIDE 1: Stop Cloudflare from caching the Oref response at the edge
        const orefResponse = await fetch("https://www.oref.org.il/WarningMessages/alert/alerts.json", {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': 'https://www.oref.org.il/'
            },
            // The magic Cloudflare object to bypass edge caching
            cf: { 
                cacheTtl: 0,
                cacheEverything: false 
            } 
        });

        const buffer = await orefResponse.arrayBuffer();

        // SIDE 2: Stop the user's browser from caching the final output
        return new Response(buffer, {
            status: orefResponse.status,
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "Access-Control-Allow-Origin": "*",
                
                // The ultimate cache-killing header combo
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
                "Pragma": "no-cache",
                "Expires": "0"
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Fetch failed" }), { status: 500 });
    }
}
