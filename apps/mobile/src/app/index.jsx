import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Brain, Mic, Paperclip, Volume2, Navigation, Home, History, Bookmark } from 'lucide-react-native';

const SEARCH_MODES = [
  {
    id: 'general',
    label: 'General',
    description: 'Quick answers and explanations',
    gradient: ['#219079', '#9BC56E'],
  },
  {
    id: 'research',
    label: 'Research',
    description: 'Academic sources and papers',
    gradient: ['#7056E4', '#9C88FF'],
  },
  {
    id: 'news',
    label: 'News',
    description: 'Latest news and current events',
    gradient: ['#F47B20', '#FF9A56'],
  },
  {
    id: 'tutorial',
    label: 'Tutorial',
    description: 'Step-by-step learning guides',
    gradient: ['#E91E63', '#FF5C93'],
  },
];

export default function InfoGenie() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState('general');
  const [isSearching, setIsSearching] = useState(false);
  const maxCharacters = 2000;

  const handleSearch = async () => {
    if (!query.trim() || isSearching) return;

    setIsSearching(true);
    try {
      router.push({
        pathname: '/results',
        params: {
          q: query.trim(),
          mode: searchMode,
        },
      });
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Brain size={32} color="#219079" />
            <View style={styles.brandText}>
              <Text style={styles.brandTitle}>Info</Text>
              <Text style={[styles.brandTitle, styles.brandTitleAccent]}>Genie</Text>
            </View>
          </View>
          <Text style={styles.tagline}>🧠 Universal AI Research Assistant</Text>
        </View>

        {/* Main Title */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Ask Anything.{'\n'}Get Everything.</Text>
          <Text style={styles.subtitle}>
            Powered by Google, Wikipedia, YouTube, Scholar, and AI
          </Text>
        </View>

        {/* Search Mode Selection */}
        <View style={styles.modeContainer}>
          {SEARCH_MODES.map((mode) => {
            const isActive = searchMode === mode.id;
            return (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.modeCard,
                  isActive && styles.modeCardActive,
                ]}
                onPress={() => setSearchMode(mode.id)}
              >
                <View
                  style={[
                    styles.modeIcon,
                    {
                      backgroundColor: isActive ? mode.gradient[0] : '#F5F5F5',
                    },
                  ]}
                >
                  <Text style={styles.modeIconText}>{mode.label[0]}</Text>
                </View>
                <Text
                  style={[
                    styles.modeLabel,
                    isActive && styles.modeLabelActive,
                  ]}
                >
                  {mode.label}
                </Text>
                <Text style={styles.modeDescription}>{mode.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Search Interface */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Ask me anything... What would you like to research today?"
            placeholderTextColor="#B4B4B4"
            multiline
            maxLength={maxCharacters}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>
            {query.length.toLocaleString()}/{maxCharacters.toLocaleString()}
          </Text>

          <View style={styles.searchDivider} />

          <View style={styles.searchActions}>
            <View style={styles.searchButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Mic size={16} color="#219079" />
                <Text style={styles.actionButtonText}>Voice</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Paperclip size={16} color="#838794" />
                <Text style={styles.actionButtonText}>Upload</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Volume2 size={16} color="#838794" />
                <Text style={styles.actionButtonText}>Read</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.searchButton,
                (!query.trim() || isSearching) && styles.searchButtonDisabled,
              ]}
              onPress={handleSearch}
              disabled={!query.trim() || isSearching}
            >
              {isSearching ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Navigation size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Sources Info */}
        <View style={styles.sourcesSection}>
          <Text style={styles.sourcesTitle}>Powered by Trusted Sources</Text>
          <View style={styles.sourcesGrid}>
            {[
              { title: 'Web Search', desc: 'Google Search' },
              { title: 'Wikipedia', desc: 'Wikipedia API' },
              { title: 'Video Learning', desc: 'YouTube API' },
              { title: 'Scholarly Research', desc: 'Google Scholar' },
            ].map((source, index) => (
              <View key={index} style={styles.sourceCard}>
                <View style={styles.sourceIcon}>
                  <Text style={styles.sourceIconText}>{source.title[0]}</Text>
                </View>
                <Text style={styles.sourceTitle}>{source.title}</Text>
                <Text style={styles.sourceDesc}>{source.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/')}
        >
          <Home size={24} color="#219079" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/history')}
        >
          <History size={24} color="#70757F" />
          <Text style={[styles.navLabel, styles.navLabelInactive]}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/saved')}
        >
          <Bookmark size={24} color="#70757F" />
          <Text style={[styles.navLabel, styles.navLabelInactive]}>Saved</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandText: {
    flexDirection: 'row',
    marginLeft: 12,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  brandTitleAccent: {
    color: '#219079',
  },
  tagline: {
    fontSize: 16,
    color: '#70757F',
    marginTop: 8,
  },
  titleSection: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E1E1E',
    lineHeight: 40,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#70757F',
  },
  modeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  modeCard: {
    width: '48%',
    padding: 16,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E2E2E2',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  modeCardActive: {
    borderColor: '#219079',
    backgroundColor: '#F0FDF9',
  },
  modeIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#219079',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modeIconText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  modeLabelActive: {
    color: '#219079',
  },
  modeDescription: {
    fontSize: 12,
    color: '#70757F',
    textAlign: 'center',
  },
  searchContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 24,
    padding: 20,
    marginBottom: 32,
  },
  searchInput: {
    minHeight: 100,
    fontSize: 18,
    color: '#1E1E1E',
    marginBottom: 8,
  },
  characterCount: {
    fontSize: 12,
    color: '#70757F',
    textAlign: 'right',
    marginBottom: 12,
  },
  searchDivider: {
    height: 1,
    backgroundColor: '#EDEDED',
    marginBottom: 16,
  },
  searchActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#414141',
    fontWeight: '500',
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#219079',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonDisabled: {
    opacity: 0.5,
  },
  sourcesSection: {
    marginBottom: 40,
  },
  sourcesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 16,
  },
  sourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sourceCard: {
    width: '48%',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  sourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#219079',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  sourceIconText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 6,
  },
  sourceDesc: {
    fontSize: 12,
    color: '#219079',
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EDEDED',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: 12,
    color: '#219079',
    fontWeight: '600',
    marginTop: 4,
  },
  navLabelInactive: {
    color: '#70757F',
    fontWeight: '400',
  },
});
