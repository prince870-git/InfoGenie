import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, Search, Home, History as HistoryIcon, Bookmark } from 'lucide-react-native';
import { getSearchHistory } from '@/utils/searchApi';

export default function History() {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getSearchHistory(50);
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAgain = (query, mode) => {
    router.push({
      pathname: '/results',
      params: { q: query, mode: mode || 'general' },
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#1E1E1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search History</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#219079" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E1E1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search History</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Clock size={48} color="#B4B4B4" />
            <Text style={styles.emptyText}>No search history yet</Text>
            <Text style={styles.emptySubtext}>Your recent searches will appear here</Text>
          </View>
        ) : (
          history.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.historyItem}
              onPress={() => handleSearchAgain(item.query, item.search_mode)}
            >
              <View style={styles.historyHeader}>
                <Search size={16} color="#219079" />
                <Text style={styles.historyQuery} numberOfLines={2}>
                  {item.query}
                </Text>
              </View>
              <View style={styles.historyMeta}>
                <Text style={styles.historyMode}>
                  {item.search_mode ? item.search_mode.charAt(0).toUpperCase() + item.search_mode.slice(1) : 'General'}
                </Text>
                <Text style={styles.historyDate}>
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
                </Text>
              </View>
              {item.summary && (
                <Text style={styles.historySummary} numberOfLines={2}>
                  {item.summary}
                </Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/')}
        >
          <Home size={24} color="#70757F" />
          <Text style={[styles.navLabel, styles.navLabelInactive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/history')}
        >
                  <HistoryIcon size={24} color="#219079" />
          <Text style={styles.navLabel}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/saved')}
        >
          <Bookmark size={24} color="#70757F" />
          <Text style={[styles.navLabel, styles.navLabelInactive]}>Saved</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E1E1E',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#70757F',
    marginTop: 8,
  },
  historyItem: {
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyQuery: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1E1E1E',
    marginLeft: 8,
  },
  historyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyMode: {
    fontSize: 12,
    color: '#219079',
    fontWeight: '500',
    backgroundColor: '#F0FDF9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  historyDate: {
    fontSize: 12,
    color: '#70757F',
  },
  historySummary: {
    fontSize: 14,
    color: '#70757F',
    lineHeight: 20,
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

