"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Brain,
  Globe,
  FileText,
  Youtube,
  TrendingUp,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  FileDown,
  Volume2,
  Copy,
  Search,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function ResultsPage() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("general");

  useEffect(() => {
    // Get query parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("q");
    const searchMode = urlParams.get("mode") || "general";

    if (!searchQuery) {
      window.location.href = "/";
      return;
    }

    setQuery(searchQuery);
    setMode(searchMode);
    performSearch(searchQuery, searchMode);
  }, []);

  const performSearch = async (searchQuery, searchMode) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, mode: searchMode }),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setResults(data);

      // Save to search history and get the ID
      try {
        const historyResponse = await fetch("/api/search-history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: data.query,
            search_mode: data.mode,
            summary: data.summary,
            sources: data.sources,
            citations: data.citations,
            user_id: "anonymous", // TODO: Replace with actual user ID when auth is implemented
          }),
        });

        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setResults((prev) => ({ ...prev, searchHistoryId: historyData.id }));
        }
      } catch (error) {
        console.error("Error saving search history:", error);
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to perform search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResearch = async () => {
    if (!results || !results.searchHistoryId) return;

    try {
      const response = await fetch("/api/saved-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          search_id: results.searchHistoryId,
          title: `Research: ${results.query}`,
          folder: "General",
          notes: "",
          user_id: "anonymous",
        }),
      });

      if (response.ok) {
        setSaved(true);
      }
    } catch (error) {
      console.error("Error saving research:", error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getSourceIcon = (source) => {
    if (source.includes("Google")) return Globe;
    if (source.includes("Wikipedia")) return FileText;
    if (source.includes("YouTube")) return Youtube;
    if (source.includes("Academic")) return TrendingUp;
    return Globe;
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case "research":
        return "from-[#7056E4] to-[#9C88FF]";
      case "news":
        return "from-[#F47B20] to-[#FF9A56]";
      case "tutorial":
        return "from-[#E91E63] to-[#FF5C93]";
      default:
        return "from-[#219079] to-[#9BC56E]";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] font-inter flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-[#219079] to-[#9BC56E] rounded-3xl flex items-center justify-center mb-4 mx-auto animate-pulse">
            <Brain size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-[#1E1E1E] dark:text-white mb-2">
            Researching your question...
          </h2>
          <p className="text-[#70757F] dark:text-[#A8ADB4] mb-4">
            Gathering information from multiple sources
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-[#70757F] dark:text-[#A8ADB4]">
            <Loader2 size={16} className="animate-spin" />
            <span>Searching Google, Wikipedia, and more...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] font-inter flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#1E1E1E] dark:text-white mb-2">
            Search Error
          </h2>
          <p className="text-[#70757F] dark:text-[#A8ADB4] mb-4">{error}</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-gradient-to-r from-[#219079] to-[#9BC56E] text-white px-6 py-3 rounded-2xl font-medium hover:from-[#1E8169] hover:to-[#8AB05E] transition-all"
          >
            Try New Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] font-inter">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-[#121212] border-b border-[#EDEDED] dark:border-[#333333] z-40 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => (window.location.href = "/")}
              className="mr-4 p-2 hover:bg-[#F7F7F7] dark:hover:bg-[#262626] rounded-2xl transition-colors"
            >
              <ArrowLeft size={20} className="text-[#1E1E1E] dark:text-white" />
            </button>

            <div className="flex items-center">
              <Brain className="w-8 h-8 text-[#219079] dark:text-[#4DD0B1] mr-3" />
              <div>
                <span className="text-lg font-bold text-[#1E1E1E] dark:text-white">
                  Info
                </span>
                <span className="text-lg font-bold text-[#219079] dark:text-[#4DD0B1]">
                  Genie
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSaveResearch}
              className={`flex items-center space-x-2 px-4 py-2 rounded-2xl border transition-colors ${
                saved
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                  : "border-[#E2E2E2] dark:border-[#333333] hover:border-[#D6D6D6] dark:hover:border-[#404040] text-[#1E1E1E] dark:text-white"
              }`}
            >
              {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              <span className="text-sm font-medium">
                {saved ? "Saved" : "Save"}
              </span>
            </button>

            <button className="flex items-center space-x-2 px-4 py-2 rounded-2xl border border-[#E2E2E2] dark:border-[#333333] hover:border-[#D6D6D6] dark:hover:border-[#404040] text-[#1E1E1E] dark:text-white transition-colors">
              <FileDown size={16} />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Query Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div
              className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${getModeColor(results?.mode)} flex items-center justify-center mr-3`}
            >
              <Search size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1E1E1E] dark:text-white">
                {results?.query}
              </h1>
              <p className="text-sm text-[#70757F] dark:text-[#A8ADB4] capitalize">
                {results?.mode} search •{" "}
                {new Date(results?.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-gradient-to-r from-[#F0FDF9] to-[#F0F9FF] dark:from-[#0D2818] dark:to-[#0C1A2B] border border-[#E2E8F0] dark:border-[#334155] rounded-3xl p-8 mb-8">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-[#219079] to-[#9BC56E] flex items-center justify-center mr-3">
              <Brain size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-[#1E1E1E] dark:text-white">
              AI Research Summary
            </h2>
          </div>

          <div className="prose prose-lg max-w-none text-[#374151] dark:text-[#D1D5DB] mb-6">
            <div className="whitespace-pre-wrap">{results?.summary}</div>
          </div>

          <div className="flex items-center space-x-4 pt-4 border-t border-[#E5E7EB] dark:border-[#4B5563]">
            <button
              onClick={() => copyToClipboard(results?.summary)}
              className="flex items-center space-x-2 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#374151] dark:hover:text-[#D1D5DB] transition-colors"
            >
              <Copy size={16} />
              <span className="text-sm">Copy Summary</span>
            </button>
            <button className="flex items-center space-x-2 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#374151] dark:hover:text-[#D1D5DB] transition-colors">
              <Volume2 size={16} />
              <span className="text-sm">Read Aloud</span>
            </button>
          </div>
        </div>

        {/* Sources */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-[#1E1E1E] dark:text-white mb-6">
            Sources ({results?.sources?.length || 0})
          </h3>
          <div className="grid gap-4">
            {results?.sources?.map((source, index) => {
              const IconComponent = getSourceIcon(source.source);
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-3xl p-6 hover:border-[#D6D6D6] dark:hover:border-[#404040] hover:shadow-md dark:hover:shadow-none transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#219079] to-[#9BC56E] flex items-center justify-center mr-3">
                        <IconComponent size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-[#219079] dark:text-[#4DD0B1] font-medium mb-1">
                          {source.source}
                        </p>
                        <p className="text-xs text-[#70757F] dark:text-[#A8ADB4]">
                          {source.displayUrl}
                        </p>
                      </div>
                    </div>

                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-[#F7F7F7] dark:hover:bg-[#262626] rounded-xl transition-colors"
                    >
                      <ExternalLink
                        size={16}
                        className="text-[#70757F] dark:text-[#A8ADB4]"
                      />
                    </a>
                  </div>

                  <h4 className="font-bold text-[#1E1E1E] dark:text-white mb-2 line-clamp-2">
                    {source.title}
                  </h4>

                  <p className="text-sm text-[#6B6E73] dark:text-[#A8ADB4] leading-relaxed">
                    {source.snippet}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Citations */}
        {results?.citations?.length > 0 && (
          <div className="bg-[#F8F9FA] dark:bg-[#1A1A1A] rounded-3xl p-8">
            <h3 className="text-xl font-bold text-[#1E1E1E] dark:text-white mb-6">
              Citations
            </h3>
            <div className="space-y-4">
              {results.citations.map((citation, index) => (
                <div
                  key={index}
                  className="text-sm text-[#374151] dark:text-[#D1D5DB] leading-relaxed"
                >
                  <span className="font-medium">[{citation.id}]</span>{" "}
                  {citation.title}.<em className="ml-1">{citation.source}</em>.
                  Accessed {citation.accessDate}.{" "}
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#219079] dark:text-[#4DD0B1] hover:underline break-all"
                  >
                    {citation.url}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
