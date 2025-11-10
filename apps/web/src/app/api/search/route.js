export async function POST(request) {
  let query = "Unknown";
  let mode = "general";
  
  try {
    const body = await request.json();
    query = body.query || "Unknown";
    mode = body.mode || "general";

    if (!query || !query.trim()) {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    // Initialize results container
    const sources = {
      web: [],
      wikipedia: [],
      youtube: [],
      scholar: [],
    };

    const searchPromises = [];

    // 1. Google Web Search
    searchPromises.push(
      fetch(`/integrations/google-search/search?q=${encodeURIComponent(query)}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Google Search API returned ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.status === "success" && data.items) {
            sources.web = data.items.slice(0, 10).map((item) => ({
              title: item.title,
              url: item.link,
              snippet: item.snippet,
              displayUrl: item.displayLink,
              source: "Google Search",
            }));
          }
        })
        .catch((err) => {
          console.error("Google Search failed:", err);
          // Add multiple demo results if integration fails
          sources.web = [
            {
              title: `${query} - Web Search Results`,
              url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
              snippet: `Search results for "${query}". Google Search integration is not configured. Click to search on Google directly.`,
              displayUrl: "google.com",
              source: "Google Search (Demo)",
            },
            {
              title: `${query} - Information`,
              url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
              snippet: `Find comprehensive information about "${query}" on Google Search.`,
              displayUrl: "google.com",
              source: "Google Search (Demo)",
            },
            {
              title: `${query} - Details`,
              url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
              snippet: `Explore detailed information about "${query}" through Google's search engine.`,
              displayUrl: "google.com",
              source: "Google Search (Demo)",
            },
          ];
        }),
    );

    // 2. Wikipedia Search (simulated for now - in production would use Wikipedia API)
    searchPromises.push(
      fetch(
        `/integrations/google-search/search?q=${encodeURIComponent(query + " site:wikipedia.org")}`,
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Wikipedia Search API returned ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.status === "success" && data.items) {
            sources.wikipedia = data.items.slice(0, 5).map((item) => ({
              title: item.title,
              url: item.link,
              snippet: item.snippet,
              displayUrl: item.displayLink,
              source: "Wikipedia",
            }));
          }
        })
        .catch((err) => {
          console.error("Wikipedia search failed:", err);
          // Add demo Wikipedia link
          sources.wikipedia = [{
            title: `${query} - Wikipedia`,
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`,
            snippet: `Wikipedia article about "${query}". Wikipedia integration is not configured. Click to view on Wikipedia.`,
            displayUrl: "wikipedia.org",
            source: "Wikipedia (Demo)",
          }];
        }),
    );

    // 3. YouTube Search (simulated - in production would use YouTube API)
    if (mode === "tutorial" || mode === "general") {
      searchPromises.push(
        fetch(
          `/integrations/google-search/search?q=${encodeURIComponent(query + " site:youtube.com")}`,
        )
          .then((res) => {
            if (!res.ok) {
              throw new Error(`YouTube Search API returned ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
          if (data.status === "success" && data.items) {
            sources.youtube = data.items.slice(0, 5).map((item) => ({
              title: item.title,
              url: item.link,
              snippet: item.snippet,
              displayUrl: item.displayUrl,
              source: "YouTube",
            }));
          }
          })
          .catch((err) => {
            console.error("YouTube search failed:", err);
            // Add demo YouTube link
            sources.youtube = [{
              title: `${query} - YouTube Videos`,
              url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
              snippet: `YouTube videos about "${query}". YouTube integration is not configured. Click to search on YouTube.`,
              displayUrl: "youtube.com",
              source: "YouTube (Demo)",
            }];
          }),
      );
    }

    // 4. Scholar Search (for research mode)
    if (mode === "research") {
      searchPromises.push(
        fetch(
          `/integrations/google-search/search?q=${encodeURIComponent(query + " filetype:pdf OR site:scholar.google.com")}`,
        )
          .then((res) => {
            if (!res.ok) {
              throw new Error(`Scholar Search API returned ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
          if (data.status === "success" && data.items) {
            sources.scholar = data.items.slice(0, 5).map((item) => ({
              title: item.title,
              url: item.link,
              snippet: item.snippet,
              displayUrl: item.displayUrl,
              source: "Academic Sources",
            }));
          }
          })
          .catch((err) => {
            console.error("Scholar search failed:", err);
            // Add demo Scholar link
            sources.scholar = [{
              title: `${query} - Google Scholar`,
              url: `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`,
              snippet: `Academic papers about "${query}". Scholar integration is not configured. Click to search on Google Scholar.`,
              displayUrl: "scholar.google.com",
              source: "Academic Sources (Demo)",
            }];
          }),
      );
    }

    // Wait for all searches to complete
    await Promise.all(searchPromises);

    // Combine all sources
    const allSources = [
      ...sources.web,
      ...sources.wikipedia,
      ...sources.youtube,
      ...sources.scholar,
    ];

    // Even if no sources found, provide demo sources
    if (allSources.length === 0) {
      allSources = [
        {
          title: `${query} - General Information`,
          url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
          snippet: `General information about "${query}". Search integrations are not configured.`,
          displayUrl: "google.com",
          source: "Web Search (Demo)",
        },
      ];
    }

    // Prepare content for AI summarization
    const sourceContent = allSources
      .map(
        (source, index) =>
          `[${index + 1}] ${source.title}\n${source.snippet}\nSource: ${source.source}\nURL: ${source.url}\n`,
      )
      .join("\n");

    // Create AI summary prompt based on mode
    let systemPrompt = "";
    let userPrompt = "";

    switch (mode) {
      case "research":
        systemPrompt =
          "You are an academic research assistant. Provide comprehensive, well-sourced information with proper citations. Focus on accuracy and depth.";
        userPrompt = `Research Question: "${query}"\n\nBased on the following sources, provide a detailed research summary with:\n1. Executive summary\n2. Key findings with citations\n3. Academic context\n4. Areas for further research\n\nSources:\n${sourceContent}`;
        break;

      case "news":
        systemPrompt =
          "You are a news analyst. Focus on current events, recent developments, and factual reporting with proper source attribution.";
        userPrompt = `News Topic: "${query}"\n\nBased on the following sources, provide a news summary with:\n1. Current situation overview\n2. Key developments and timeline\n3. Different perspectives if applicable\n4. Source reliability notes\n\nSources:\n${sourceContent}`;
        break;

      case "tutorial":
        systemPrompt =
          "You are an educational instructor. Provide step-by-step explanations that are easy to understand and actionable.";
        userPrompt = `Learning Topic: "${query}"\n\nBased on the following sources, create a learning guide with:\n1. Simple explanation of the concept\n2. Step-by-step breakdown\n3. Practical examples\n4. Learning resources and next steps\n\nSources:\n${sourceContent}`;
        break;

      default: // general
        systemPrompt =
          "You are a helpful research assistant. Provide clear, concise, and accurate information with proper citations.";
        userPrompt = `Question: "${query}"\n\nBased on the following sources, provide a comprehensive answer with:\n1. Clear explanation\n2. Key points with citations\n3. Additional context\n4. Relevant examples\n\nSources:\n${sourceContent}`;
    }

    // Get AI summary from Gemini API
    let summary = null;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDr70njWcY5t-JXDiGV9mD9iH_nc7l5G68";
    
    try {
      // Combine system prompt and user prompt for Gemini
      const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
      
      // Use Gemini API for AI summary - try multiple models/endpoints
      const modelsToTry = [
        'v1/models/gemini-1.5-flash:generateContent',
        'v1beta/models/gemini-1.5-flash:generateContent',
        'v1/models/gemini-pro:generateContent',
        'v1beta/models/gemini-pro:generateContent',
      ];
      
      for (const modelEndpoint of modelsToTry) {
        try {
          const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/${modelEndpoint}?key=${GEMINI_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{
                  parts: [{
                    text: fullPrompt
                  }]
                }],
                generationConfig: {
                  temperature: 0.7,
                  topK: 40,
                  topP: 0.95,
                  maxOutputTokens: 2048,
                }
              }),
            }
          );

          if (geminiResponse.ok) {
            const geminiData = await geminiResponse.json();
            if (geminiData.candidates && geminiData.candidates[0] && geminiData.candidates[0].content && geminiData.candidates[0].content.parts && geminiData.candidates[0].content.parts[0]) {
              summary = geminiData.candidates[0].content.parts[0].text;
              if (summary && summary.trim()) {
                console.log(`✅ Gemini API success with ${modelEndpoint}`);
                break; // Success, exit loop
              }
            }
          }
        } catch (modelError) {
          // Continue to next model
          continue;
        }
      }
    } catch (aiError) {
      console.error("AI summary error:", aiError);
    }
    
    // If Gemini failed or returned no summary, use fallback
    if (!summary || !summary.trim()) {
      console.log("Using fallback summary from sources");
      summary = `Based on ${allSources.length} source(s), here's what I found about "${query}":\n\n${allSources.map((s, i) => `${i + 1}. ${s.title}: ${s.snippet}`).join('\n\n')}`;
    }

    // Generate citations
    const citations = allSources.map((source, index) => ({
      id: index + 1,
      title: source.title,
      url: source.url,
      source: source.source,
      accessDate: new Date().toLocaleDateString(),
      snippet: source.snippet,
    }));

    const searchResult = {
      query,
      mode,
      summary,
      sources: allSources,
      citations,
      timestamp: new Date().toISOString(),
    };

    // Save to search history (skip if DB not configured or if it fails)
    try {
      // Use relative URL for server-side fetch (same server)
      const historyUrl = '/api/search-history';
      
      await fetch(historyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          search_mode: mode,
          summary,
          sources: allSources,
          citations,
          user_id: "anonymous", // TODO: Get actual user ID when authentication is implemented
        }),
      }).catch(() => {
        // Silently fail - history is optional
      });
    } catch (historyError) {
      // Don't fail the search if history save fails
      console.error("Failed to save search history:", historyError);
    }

    // Ensure we always return a valid response structure
    if (!searchResult.summary) {
      searchResult.summary = `Research results for "${query}". ${allSources.length} source(s) found.`;
    }
    
    if (!searchResult.sources || searchResult.sources.length === 0) {
      searchResult.sources = [{
        title: `${query} - Search Results`,
        url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        snippet: `Search for "${query}" on Google to find more information.`,
        displayUrl: "google.com",
        source: "Google Search",
      }];
    }
    
    return Response.json(searchResult);
  } catch (error) {
    console.error("Search API error:", error);
    // Return a valid response even on error so the mobile app doesn't break
    return Response.json({
      query: query,
      mode: mode,
      summary: `Error occurred while searching for "${query}". Please try again.`,
      sources: [{
        title: `${query} - Search Results`,
        url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        snippet: `An error occurred. Please try searching again.`,
        displayUrl: "google.com",
        source: "Error",
      }],
      citations: [],
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
}
