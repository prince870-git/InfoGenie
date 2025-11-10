import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ExternalLink, Bookmark, Share2, Download } from 'lucide-react-native';
import { searchInfoGenie, saveResearch } from '@/utils/searchApi';

export default function Results() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (!params.q) {
        setError('No query provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const searchResult = await searchInfoGenie(params.q, params.mode || 'general');
        
        // Check if the response has an error but still has data
        if (searchResult && searchResult.error) {
          console.warn('API returned error but with data:', searchResult.error);
          // Still show the results if we have them
          if (searchResult.summary || searchResult.sources) {
            setResult(searchResult);
          } else {
            setError(searchResult.error || 'Search failed');
          }
        } else if (searchResult) {
          setResult(searchResult);
        } else {
          setError('No results returned from server');
        }
      } catch (err) {
        console.error('Search error:', err);
        let errorMessage = err.message || 'Failed to perform search';
        
        // Provide helpful error message if it's a JSON parse error
        if (errorMessage.includes('JSON') || errorMessage.includes('DOCTYPE') || errorMessage.includes('Failed to fetch')) {
          errorMessage = 'API server is not responding. Please make sure:\n\n1. The web API server is running (check port 4000-4003)\n2. Run: cd apps/web && npm run dev\n3. Check your browser console for CORS errors';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [params.q, params.mode]);

  const handleSave = async () => {
    if (!result || saving) return;

    try {
      setSaving(true);
      await saveResearch(
        result.timestamp || Date.now().toString(),
        params.q,
        'General',
        result.summary
      );
      alert('Research saved successfully!');
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save research');
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    if (!result) return;

    try {
      const shareContent = {
        message: `InfoGenie Research: ${params.q}\n\n${result.summary}\n\nSources: ${result.sources?.length || 0} found`,
        title: 'InfoGenie Research',
      };
      await Share.share(shareContent);
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  const openSource = (url) => {
    Linking.openURL(url).catch((err) => {
      console.error('Failed to open URL:', err);
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#1E1E1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Searching...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#219079" />
          <Text style={styles.loadingText}>Gathering information from multiple sources...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#1E1E1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!result) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#1E1E1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>No Results</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>No Results Found</Text>
          <Text style={styles.errorMessage}>
            Could not retrieve search results. Please try again.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E1E1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {params.q}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleSave} style={styles.headerActionButton}>
            <Bookmark size={20} color="#219079" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.headerActionButton}>
            <Share2 size={20} color="#219079" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Query Display */}
        <View style={styles.querySection}>
          <Text style={styles.queryText}>{params.q}</Text>
          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>
              {params.mode ? params.mode.charAt(0).toUpperCase() + params.mode.slice(1) : 'General'}
            </Text>
          </View>
        </View>

        {/* AI Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Summary</Text>
          <Text style={styles.summaryText}>{result.summary}</Text>
        </View>

        {/* Sources - Grouped by type */}
        {result.sources && result.sources.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Sources ({result.sources.length})
            </Text>
            
            {/* Group sources by type */}
            {(() => {
              const groupedSources = result.sources.reduce((acc, source) => {
                const type = source.source || 'Other';
                if (!acc[type]) {
                  acc[type] = [];
                }
                acc[type].push(source);
                return acc;
              }, {});

              return Object.entries(groupedSources).map(([sourceType, sources]) => (
                <View key={sourceType} style={styles.sourceGroup}>
                  <Text style={styles.sourceGroupTitle}>{sourceType}</Text>
                  {sources.map((source, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.sourceCard}
                      onPress={() => openSource(source.url)}
                    >
                      <View style={styles.sourceHeader}>
                        <View style={styles.sourceInfo}>
                          <Text style={styles.sourceTitle} numberOfLines={2}>
                            {source.title}
                          </Text>
                        </View>
                        <ExternalLink size={16} color="#219079" />
                      </View>
                      <Text style={styles.sourceSnippet} numberOfLines={3}>
                        {source.snippet}
                      </Text>
                      <Text style={styles.sourceUrl} numberOfLines={1}>
                        {source.displayUrl || source.url}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ));
            })()}
          </View>
        )}

        {/* Citations */}
        {result.citations && result.citations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Citations</Text>
            {result.citations.map((citation, index) => (
              <View key={index} style={styles.citationCard}>
                <Text style={styles.citationText}>
                  [{citation.id}] {citation.title}
                </Text>
                <Text style={styles.citationUrl}>{citation.url}</Text>
                <Text style={styles.citationSource}>
                  Source: {citation.source} • Accessed: {citation.accessDate}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Export Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export</Text>
          <View style={styles.exportButtons}>
            <TouchableOpacity style={styles.exportButton}>
              <Download size={20} color="#219079" />
              <Text style={styles.exportButtonText}>PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton}>
              <Download size={20} color="#219079" />
              <Text style={styles.exportButtonText}>Notes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#70757F',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#F47B20',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#219079',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  querySection: {
    marginBottom: 24,
  },
  queryText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 8,
  },
  modeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0FDF9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modeBadgeText: {
    color: '#219079',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1E1E1E',
  },
  sourceGroup: {
    marginBottom: 24,
  },
  sourceGroupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 12,
    marginTop: 8,
  },
  sourceCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  sourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  sourceInfo: {
    flex: 1,
    marginRight: 8,
  },
  sourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  sourceType: {
    fontSize: 12,
    color: '#219079',
    fontWeight: '500',
  },
  sourceSnippet: {
    fontSize: 14,
    color: '#70757F',
    lineHeight: 20,
    marginBottom: 8,
  },
  sourceUrl: {
    fontSize: 12,
    color: '#838794',
  },
  citationCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  citationText: {
    fontSize: 14,
    color: '#1E1E1E',
    marginBottom: 4,
  },
  citationUrl: {
    fontSize: 12,
    color: '#219079',
    marginBottom: 4,
  },
  citationSource: {
    fontSize: 11,
    color: '#70757F',
  },
  exportButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F0FDF9',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#219079',
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#219079',
  },
});

