'use client';
import React, { useState } from 'react';
import {
  Brain,
  Search,
  MessageSquare,
  BookOpen,
  Newspaper,
  GraduationCap,
  ArrowRight,
  Globe,
  FileText,
  Youtube,
  TrendingUp,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';

export default function DemoPage() {
  const [selectedExample, setSelectedExample] = useState(null);

  const exampleQueries = [
    {
      category: 'General',
      icon: MessageSquare,
      color: 'from-[#219079] to-[#9BC56E]',
      queries: [
        'How does photosynthesis work?',
        'What is artificial intelligence?',
        'Explain quantum computing basics',
        'How to start learning programming?'
      ]
    },
    {
      category: 'Research',
      icon: BookOpen,
      color: 'from-[#7056E4] to-[#9C88FF]',
      queries: [
        'Climate change effects on polar ice caps',
        'Latest developments in gene therapy',
        'Renewable energy efficiency studies',
        'Neuroscience research on memory formation'
      ]
    },
    {
      category: 'News',
      icon: Newspaper,
      color: 'from-[#F47B20] to-[#FF9A56]',
      queries: [
        'Latest space exploration missions',
        'Current developments in AI technology',
        'Recent breakthroughs in medicine',
        'Global renewable energy trends'
      ]
    },
    {
      category: 'Tutorial',
      icon: GraduationCap,
      color: 'from-[#E91E63] to-[#FF5C93]',
      queries: [
        'How to build a website from scratch',
        'Learning Python programming basics',
        'Digital marketing fundamentals',
        'Understanding blockchain technology'
      ]
    }
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Summaries',
      description: 'ChatGPT analyzes multiple sources and creates comprehensive, accurate summaries tailored to your search mode.'
    },
    {
      icon: Globe,
      title: 'Multi-Source Research',
      description: 'Searches Google, Wikipedia, YouTube, and academic sources to provide diverse perspectives on any topic.'
    },
    {
      icon: Target,
      title: 'Smart Search Modes',
      description: 'Different modes (General, Research, News, Tutorial) optimize results for your specific needs.'
    },
    {
      icon: Zap,
      title: 'Instant Citations',
      description: 'Automatically generates proper citations for all sources, making research documentation effortless.'
    }
  ];

  const trySearch = (query, mode) => {
    const params = new URLSearchParams({
      q: query,
      mode: mode.toLowerCase()
    });
    window.location.href = `/results?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] font-inter">
      {/* Header */}
      <div className="border-b border-[#EDEDED] dark:border-[#333333] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="w-8 h-8 text-[#219079] dark:text-[#4DD0B1] mr-3" />
            <div>
              <span className="text-xl font-bold text-[#1E1E1E] dark:text-white">Info</span>
              <span className="text-xl font-bold text-[#219079] dark:text-[#4DD0B1]">Genie</span>
              <span className="text-sm text-[#70757F] dark:text-[#A8ADB4] ml-3">Demo</span>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 text-[#219079] dark:text-[#4DD0B1] hover:bg-[#F0FDF9] dark:hover:bg-[#0D2818] rounded-xl transition-colors"
          >
            Back to App
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-r from-[#219079] to-[#9BC56E] rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Brain size={40} className="text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-[#1E1E1E] dark:text-white mb-4">
            AI-Powered Research Assistant
          </h1>
          <p className="text-xl text-[#70757F] dark:text-[#A8ADB4] max-w-2xl mx-auto mb-8">
            Experience the power of ChatGPT combined with multi-source research. Get comprehensive answers, 
            academic summaries, and proper citations in seconds.
          </p>
          
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-[#219079] dark:text-[#4DD0B1]">
              <Sparkles size={20} />
              <span className="font-medium">Powered by ChatGPT</span>
            </div>
            <div className="flex items-center gap-2 text-[#70757F] dark:text-[#A8ADB4]">
              <Globe size={20} />
              <span className="font-medium">Multi-Source Research</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-[#219079] to-[#9BC56E] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1E1E1E] dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#70757F] dark:text-[#A8ADB4] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Example Queries */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1E1E1E] dark:text-white mb-4">
              Try These Example Searches
            </h2>
            <p className="text-lg text-[#70757F] dark:text-[#A8ADB4]">
              Click any query to see InfoGenie's AI research capabilities in action
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {exampleQueries.map((category, categoryIndex) => {
              const Icon = category.icon;
              return (
                <div key={categoryIndex} className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mr-3`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1E1E1E] dark:text-white">
                      {category.category}
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    {category.queries.map((query, queryIndex) => (
                      <button
                        key={queryIndex}
                        onClick={() => trySearch(query, category.category)}
                        className="w-full text-left p-3 rounded-xl text-sm text-[#70757F] dark:text-[#A8ADB4] hover:bg-[#F7F7F7] dark:hover:bg-[#262626] hover:text-[#1E1E1E] dark:hover:text-white transition-colors group flex items-center justify-between"
                      >
                        <span className="pr-2">{query}</span>
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-[#F0FDF9] to-[#F0F9FF] dark:from-[#0D2818] dark:to-[#0C1A2B] border border-[#E2E8F0] dark:border-[#334155] rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1E1E1E] dark:text-white mb-4">
              How InfoGenie Works
            </h2>
            <p className="text-lg text-[#70757F] dark:text-[#A8ADB4]">
              Advanced AI research in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#219079] to-[#9BC56E] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1E1E1E] dark:text-white mb-2">
                1. Multi-Source Search
              </h3>
              <p className="text-[#70757F] dark:text-[#A8ADB4]">
                We search Google, Wikipedia, YouTube, and academic sources to gather comprehensive information
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#7056E4] to-[#9C88FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1E1E1E] dark:text-white mb-2">
                2. AI Analysis
              </h3>
              <p className="text-[#70757F] dark:text-[#A8ADB4]">
                ChatGPT analyzes all sources and creates a tailored summary based on your chosen research mode
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#E91E63] to-[#FF5C93] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1E1E1E] dark:text-white mb-2">
                3. Formatted Results
              </h3>
              <p className="text-[#70757F] dark:text-[#A8ADB4]">
                Get comprehensive answers with proper citations, source links, and the ability to save your research
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <button 
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#219079] to-[#9BC56E] text-white text-lg font-medium rounded-2xl hover:from-[#1A7359] hover:to-[#7A9F54] transition-all shadow-lg hover:shadow-xl"
          >
            <Search size={24} />
            Start Researching Now
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}