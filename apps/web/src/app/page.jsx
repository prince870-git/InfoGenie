import React, { useState } from "react";
import {
  Home,
  MessageSquare,
  Search,
  BookOpen,
  Newspaper,
  GraduationCap,
  History,
  Settings,
  Plus,
  Globe,
  Paperclip,
  Mic,
  Volume2,
  Navigation,
  FileDown,
  Bookmark,
  Brain,
  Youtube,
  FileText,
  TrendingUp,
  Menu,
  X,
  User,
} from "lucide-react";

export default function InfoGenie() {
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState("general");
  const [activeNav, setActiveNav] = useState("Research");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const characterCount = query.length;
  const maxCharacters = 2000;

  const navItems = [
    { icon: Home, label: "Dashboard", id: "dashboard" },
    { icon: Search, label: "Research", id: "research" },
    { icon: BookOpen, label: "Saved Research", id: "saved" },
    { icon: History, label: "Search History", id: "history" },
  ];

  const searchModes = [
    {
      id: "general",
      label: "General",
      icon: MessageSquare,
      description: "Quick answers and explanations",
      gradient: "from-[#219079] to-[#9BC56E]",
    },
    {
      id: "research",
      label: "Research",
      icon: BookOpen,
      description: "Academic sources and papers",
      gradient: "from-[#7056E4] to-[#9C88FF]",
    },
    {
      id: "news",
      label: "News",
      icon: Newspaper,
      description: "Latest news and current events",
      gradient: "from-[#F47B20] to-[#FF9A56]",
    },
    {
      id: "tutorial",
      label: "Tutorial",
      icon: GraduationCap,
      description: "Step-by-step learning guides",
      gradient: "from-[#E91E63] to-[#FF5C93]",
    },
  ];

  const sourceCards = [
    {
      icon: Globe,
      title: "Web Search",
      description: "Comprehensive web results from Google's index",
      sources: "Google Search",
    },
    {
      icon: FileText,
      title: "Wikipedia",
      description: "Verified encyclopedic knowledge and definitions",
      sources: "Wikipedia API",
    },
    {
      icon: Youtube,
      title: "Video Learning",
      description: "Educational videos and visual explanations",
      sources: "YouTube API",
    },
    {
      icon: TrendingUp,
      title: "Scholarly Research",
      description: "Peer-reviewed papers and academic sources",
      sources: "Google Scholar",
    },
  ];

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    // Navigate to results page with query parameters
    window.location.href = `/results?q=${encodeURIComponent(query.trim())}&mode=${searchMode}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] font-inter">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-[#121212] border-b border-[#EDEDED] dark:border-[#333333] z-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-3 p-1 hover:bg-[#F7F7F7] dark:hover:bg-[#262626] active:bg-[#F1F1F1] dark:active:bg-[#333333] rounded-2xl transition-colors"
            >
              <Menu size={24} className="text-[#1E1E1E] dark:text-white" />
            </button>
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-[#219079] dark:text-[#4DD0B1] mr-2" />
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
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white dark:bg-[#121212] border-r border-[#EDEDED] dark:border-[#333333] transition-all duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64`}
      >
        <div className="p-6 pt-8 h-full flex flex-col">
          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-1 hover:bg-[#F7F7F7] dark:hover:bg-[#262626] active:bg-[#F1F1F1] dark:active:bg-[#333333] rounded-2xl transition-colors"
          >
            <X size={20} className="text-[#70757F] dark:text-[#A8ADB4]" />
          </button>

          {/* Brand */}
          <div className="flex items-center mb-8">
            <Brain className="w-8 h-8 text-[#219079] dark:text-[#4DD0B1] mr-3" />
            <div>
              <span className="text-xl font-bold text-[#1E1E1E] dark:text-white">
                Info
              </span>
              <span className="text-xl font-bold text-[#219079] dark:text-[#4DD0B1]">
                Genie
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.label;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.label);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-2xl text-left transition-all duration-200 ${
                    isActive
                      ? "bg-[#F1F1F1] dark:bg-[#262626] text-[#1E1E1E] dark:text-white font-bold"
                      : "text-[#70757F] dark:text-[#A8ADB4] hover:bg-[#F7F7F7] dark:hover:bg-[#1E1E1E] active:bg-[#F1F1F1] dark:active:bg-[#262626]"
                  }`}
                >
                  <Icon
                    size={18}
                    className={`mr-3 ${isActive ? "text-[#219079] dark:text-[#4DD0B1]" : "text-[#A8ADB4] dark:text-[#70757F]"}`}
                  />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="space-y-2 pt-6 border-t border-[#EDEDED] dark:border-[#333333]">
            <button className="w-full flex items-center px-4 py-3 text-[#70757F] dark:text-[#A8ADB4] hover:bg-[#F7F7F7] dark:hover:bg-[#1E1E1E] active:bg-[#F1F1F1] dark:active:bg-[#262626] rounded-2xl transition-colors">
              <Settings
                size={18}
                className="mr-3 text-[#A8ADB4] dark:text-[#70757F]"
              />
              <span className="text-sm">Settings</span>
            </button>

            {/* User Profile Placeholder */}
            <div className="flex items-center pt-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#219079] to-[#9BC56E] dark:from-[#4DD0B1] dark:to-[#B5D16A] flex items-center justify-center text-white">
                <User size={20} />
              </div>
              <div className="ml-3 flex-1">
                <div className="text-sm font-bold text-[#1E1E1E] dark:text-white">
                  Sign In
                </div>
                <div className="text-xs text-[#70757F] dark:text-[#A8ADB4]">
                  Sync your research
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 pt-20 lg:pt-0">
        <div className="px-6 py-6 lg:px-12 lg:py-12">
          {/* Header */}
          <div className="flex flex-col mb-8">
            <div className="mb-4 lg:mb-0 flex items-start justify-between">
              <div>
                <p className="text-base lg:text-lg text-[#70757F] dark:text-[#A8ADB4] mb-2">
                  🧠 Universal AI Research Assistant
                </p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#1E1E1E] dark:text-white leading-tight">
                  Ask Anything. Get Everything.
                </h1>
                <p className="text-lg text-[#70757F] dark:text-[#A8ADB4] mt-4">
                  Powered by Google, Wikipedia, YouTube, Scholar, and AI
                </p>
              </div>

              <button
                onClick={() => (window.location.href = "/demo")}
                className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#219079] dark:text-[#4DD0B1] hover:bg-[#F0FDF9] dark:hover:bg-[#0D2818] rounded-xl transition-colors border border-[#219079] dark:border-[#4DD0B1]"
              >
                View Demo
              </button>
            </div>
          </div>

          {/* Search Mode Selection */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {searchModes.map((mode) => {
              const Icon = mode.icon;
              const isActive = searchMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSearchMode(mode.id)}
                  className={`p-4 rounded-3xl border-2 transition-all duration-200 ${
                    isActive
                      ? "border-[#219079] dark:border-[#4DD0B1] bg-[#F0FDF9] dark:bg-[#0D2818]"
                      : "border-[#E2E2E2] dark:border-[#333333] hover:border-[#D6D6D6] dark:hover:border-[#404040] bg-white dark:bg-[#1E1E1E]"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${mode.gradient} flex items-center justify-center mb-3 mx-auto`}
                  >
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3
                    className={`font-bold mb-1 ${isActive ? "text-[#219079] dark:text-[#4DD0B1]" : "text-[#1E1E1E] dark:text-white"}`}
                  >
                    {mode.label}
                  </h3>
                  <p className="text-xs text-[#70757F] dark:text-[#A8ADB4]">
                    {mode.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Search Interface */}
          <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-3xl p-6 mb-12 shadow-sm dark:shadow-none">
            <div className="relative mb-4">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything... What would you like to research today?"
                className="w-full min-h-[80px] sm:min-h-[100px] text-lg resize-none border-none outline-none placeholder-[#B4B4B4] dark:placeholder-[#70757F] font-inter bg-transparent text-[#1E1E1E] dark:text-white"
                style={{ lineHeight: "1.4" }}
              />
              <div className="text-xs text-[#70757F] dark:text-[#A8ADB4] text-right">
                {characterCount.toLocaleString()}/
                {maxCharacters.toLocaleString()}
              </div>
            </div>

            <div className="h-px bg-[#EDEDED] dark:bg-[#333333] mb-4"></div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <button className="flex items-center space-x-2 px-4 py-3 bg-[#F5F5F5] dark:bg-[#262626] border border-[#DADADA] dark:border-[#404040] rounded-2xl hover:bg-[#F7F7F7] dark:hover:bg-[#333333] active:bg-[#F1F1F1] dark:active:bg-[#404040] transition-colors">
                  <Mic
                    size={16}
                    className="text-[#219079] dark:text-[#4DD0B1]"
                  />
                  <span className="text-xs sm:text-sm font-medium text-[#414141] dark:text-[#D1D1D1] hidden sm:inline">
                    Voice Input
                  </span>
                </button>

                <button className="flex items-center space-x-2 text-[#414141] dark:text-[#D1D1D1] hover:bg-[#F7F7F7] dark:hover:bg-[#262626] active:bg-[#F1F1F1] dark:active:bg-[#333333] px-3 py-3 rounded-2xl transition-colors">
                  <Paperclip
                    size={16}
                    className="text-[#838794] dark:text-[#A8ADB4]"
                  />
                  <span className="text-xs sm:text-sm hidden sm:inline">
                    Upload File
                  </span>
                </button>

                <button className="flex items-center space-x-2 text-[#414141] dark:text-[#D1D1D1] hover:bg-[#F7F7F7] dark:hover:bg-[#262626] active:bg-[#F1F1F1] dark:active:bg-[#333333] px-3 py-3 rounded-2xl transition-colors">
                  <Volume2
                    size={16}
                    className="text-[#838794] dark:text-[#A8ADB4]"
                  />
                  <span className="text-xs sm:text-sm hidden sm:inline">
                    Read Aloud
                  </span>
                </button>
              </div>

              <button
                onClick={handleSearch}
                disabled={!query.trim() || isSearching}
                className="w-12 h-12 bg-gradient-to-r from-[#219079] to-[#9BC56E] dark:from-[#4DD0B1] dark:to-[#B5D16A] rounded-3xl flex items-center justify-center text-white shadow-lg hover:shadow-xl dark:shadow-none dark:hover:shadow-lg dark:hover:shadow-[#4DD0B1]/20 active:from-[#1A7359] active:to-[#7A9F54] dark:active:from-[#32B896] dark:active:to-[#9BBD52] transition-all duration-200 disabled:opacity-50 flex-shrink-0"
              >
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Navigation size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Data Sources */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] dark:text-white mb-8">
              Powered by Trusted Sources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sourceCards.map((source, index) => {
                const Icon = source.icon;
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-[#1E1E1E] border border-[#F0F0F0] dark:border-[#333333] rounded-3xl p-6 hover:border-[#D6D6D6] dark:hover:border-[#404040] hover:shadow-md dark:hover:shadow-none dark:hover:bg-[#262626] transition-all duration-200"
                  >
                    <div className="mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#219079] to-[#9BC56E] dark:from-[#4DD0B1] dark:to-[#B5D16A] flex items-center justify-center">
                        <Icon size={24} className="text-white" />
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#1E1E1E] dark:text-white mb-2">
                      {source.title}
                    </h3>
                    <p className="text-sm text-[#6B6E73] dark:text-[#A8ADB4] leading-relaxed mb-3">
                      {source.description}
                    </p>
                    <p className="text-xs text-[#219079] dark:text-[#4DD0B1] font-medium">
                      {source.sources}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
