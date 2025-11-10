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
import { ArrowLeft, Bookmark, Folder, Home, History } from 'lucide-react-native';
import { getSavedResearch } from '@/utils/searchApi';

export default function Saved() {
  const router = useRouter();
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSaved();
  }, []);

  const loadSaved = async () => {
    try {
      setLoading(true);
      const data = await getSavedResearch(null, 50);
      setSaved(data);
    } catch (error) {
      console.error('Error loading saved research:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResearch = (item) => {
    router.push({
      pathname: '/results',
      params: {
        q: item.query || item.title,
        mode: item.search_mode || 'general',
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#1E1E1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Saved Research</Text>
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
        <Text style={styles.headerTitle}>Saved Research</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {saved.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Bookmark size={48} color="#B4B4B4" />
            <Text style={styles.emptyText}>No saved research yet</Text>
            <Text style={styles.emptySubtext}>Save research items to view them here</Text>
          </View>
        ) : (
          saved.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.savedItem}
              onPress={() => handleViewResearch(item)}
            >
              <View style={styles.savedHeader}>
                <Bookmark size={16} color="#219079" />
                <Text style={styles.savedTitle} numberOfLines={2}>
                  {item.title || item.query}
                </Text>
              </View>
              {item.folder && (
                <View style={styles.folderContainer}>
                  <Folder size={12} color="#70757F" />
                  <Text style={styles.folderText}>{item.folder}</Text>
                </View>
              )}
              {item.summary && (
                <Text style={styles.savedSummary} numberOfLines={3}>
                  {item.summary}
                </Text>
              )}
              <Text style={styles.savedDate}>
                Saved {item.saved_at ? new Date(item.saved_at).toLocaleDateString() : ''}
              </Text>
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
          <History size={24} color="#70757F" />
          <Text style={[styles.navLabel, styles.navLabelInactive]}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/saved')}
        >
          <Bookmark size={24} color="#219079" />
          <Text style={styles.navLabel}>Saved</Text>
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
  savedItem: {
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  savedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  savedTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1E1E1E',
    marginLeft: 8,
  },
  folderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  folderText: {
    fontSize: 12,
    color: '#70757F',
    marginLeft: 4,
  },
  savedSummary: {
    fontSize: 14,
    color: '#70757F',
    lineHeight: 20,
    marginBottom: 8,
  },
  savedDate: {
    fontSize: 12,
    color: '#838794',
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

