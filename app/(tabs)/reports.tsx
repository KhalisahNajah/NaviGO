import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { TriangleAlert as AlertTriangle, Car, Construction, TreePine, Clock, MapPin, Send, Slice as Police, CloudRain } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { firebaseService, CommunityReport } from '@/services/firebaseService';

interface ReportType {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
}

export default function ReportsScreen() {
  const { user } = useAuth();
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportLocation, setReportLocation] = useState('');
  const [loading, setLoading] = useState(true);

  const reportTypes: ReportType[] = [
    {
      id: 'police',
      name: 'Police',
      icon: Police,
      color: '#3B82F6',
      description: 'Police presence or speed trap',
    },
    {
      id: 'accident',
      name: 'Accident',
      icon: AlertTriangle,
      color: '#DC2626',
      description: 'Traffic accident or collision',
    },
    {
      id: 'breakdown',
      name: 'Car Breakdown',
      icon: Car,
      color: '#EA580C',
      description: 'Vehicle stopped on roadside',
    },
    {
      id: 'roadwork',
      name: 'Road Work',
      icon: Construction,
      color: '#F59E0B',
      description: 'Construction or maintenance',
    },
    {
      id: 'hazard',
      name: 'Road Hazard',
      icon: AlertTriangle,
      color: '#DC2626',
      description: 'Debris, potholes, or dangerous conditions',
    },
    {
      id: 'weather',
      name: 'Bad Weather',
      icon: CloudRain,
      color: '#6B7280',
      description: 'Heavy rain, fog, or poor visibility',
    },
    {
      id: 'closure',
      name: 'Lane Closure',
      icon: Construction,
      color: '#F59E0B',
      description: 'Temporary lane closure',
    },
    {
      id: 'tree',
      name: 'Fallen Tree',
      icon: TreePine,
      color: '#059669',
      description: 'Tree blocking road',
    },
  ];

  useEffect(() => {
    loadReports();
    
    // Subscribe to real-time updates
    const unsubscribe = firebaseService.subscribeToActiveReports((activeReports) => {
      setReports(activeReports);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadReports = async () => {
    try {
      const activeReports = await firebaseService.getActiveReports();
      setReports(activeReports);
    } catch (error) {
      console.error('Error loading reports:', error);
      Alert.alert('Error', 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!user || !selectedReportType || !reportDescription || !reportLocation) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    try {
      const reportType = reportTypes.find(t => t.id === selectedReportType);
      if (!reportType) return;

      const reportData = {
        userId: user.uid,
        type: reportType.name,
        description: reportDescription,
        location: {
          address: reportLocation,
          coordinates: {
            lat: 0, // In a real app, you'd get actual coordinates
            lng: 0,
          },
        },
        status: 'active' as const,
      };

      await firebaseService.submitReport(reportData);
      
      // Reset form
      setSelectedReportType('');
      setReportDescription('');
      setReportLocation('');
      setShowReportModal(false);

      Alert.alert('Report Submitted', 'Thank you for helping the community stay informed!');
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Error', 'Failed to submit report');
    }
  };

  const handleVoteOnReport = async (reportId: string, voteType: 'helpful' | 'notHelpful') => {
    try {
      await firebaseService.voteOnReport(reportId, voteType);
      Alert.alert('Thank you', 'Your vote has been recorded!');
    } catch (error) {
      console.error('Error voting on report:', error);
      Alert.alert('Error', 'Failed to record your vote');
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? '#059669' : '#6B7280';
  };

  const getReportTypeColor = (type: string) => {
    const reportType = reportTypes.find(t => t.name === type);
    return reportType?.color || '#6B7280';
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'Unknown time';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading reports...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community Reports</Text>
        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => setShowReportModal(true)}>
          <AlertTriangle size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Active Reports */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Reports ({reports.length})</Text>
          {reports
            .filter(report => report.status === 'active')
            .map((report) => (
              <View key={report.id} style={styles.reportCard}>
                <View style={styles.reportHeader}>
                  <View style={styles.reportType}>
                    <View
                      style={[
                        styles.typeIndicator,
                        { backgroundColor: getReportTypeColor(report.type) },
                      ]}
                    />
                    <Text style={styles.typeName}>{report.type}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(report.status) },
                    ]}>
                    <Text style={styles.statusText}>Active</Text>
                  </View>
                </View>
                <Text style={styles.reportDescription}>{report.description}</Text>
                <View style={styles.reportMeta}>
                  <View style={styles.metaItem}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.metaText}>{report.location.address}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.metaText}>{formatTimestamp(report.createdAt)}</Text>
                  </View>
                </View>
                
                {/* Voting buttons */}
                <View style={styles.votingContainer}>
                  <TouchableOpacity
                    style={styles.voteButton}
                    onPress={() => handleVoteOnReport(report.id, 'helpful')}>
                    <Text style={styles.voteButtonText}>👍 Helpful ({report.votes.helpful})</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.voteButton}
                    onPress={() => handleVoteOnReport(report.id, 'notHelpful')}>
                    <Text style={styles.voteButtonText}>👎 Not Helpful ({report.votes.notHelpful})</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
        </View>

        {reports.length === 0 && (
          <View style={styles.emptyState}>
            <AlertTriangle size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Active Reports</Text>
            <Text style={styles.emptyText}>
              Be the first to report road conditions in your area
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Report Modal */}
      <Modal visible={showReportModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Submit Report</Text>
            <TouchableOpacity onPress={() => setShowReportModal(false)}>
              <Text style={styles.closeButton}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.fieldLabel}>What are you reporting?</Text>
            <View style={styles.reportTypeGrid}>
              {reportTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.reportTypeCard,
                      selectedReportType === type.id && styles.reportTypeCardSelected,
                    ]}
                    onPress={() => setSelectedReportType(type.id)}>
                    <IconComponent
                      size={24}
                      color={selectedReportType === type.id ? '#FFFFFF' : type.color}
                    />
                    <Text
                      style={[
                        styles.reportTypeText,
                        selectedReportType === type.id && styles.reportTypeTextSelected,
                      ]}>
                      {type.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Location</Text>
              <TextInput
                style={styles.textInput}
                value={reportLocation}
                onChangeText={setReportLocation}
                placeholder="e.g., Highway 401, Exit 394"
                multiline
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textInputMultiline]}
                value={reportDescription}
                onChangeText={setReportDescription}
                placeholder="Provide additional details..."
                multiline
                numberOfLines={4}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!selectedReportType || !reportDescription || !reportLocation) && 
                styles.submitButtonDisabled,
              ]}
              onPress={handleSubmitReport}
              disabled={!selectedReportType || !reportDescription || !reportLocation}>
              <Send size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Submit Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  reportButton: {
    backgroundColor: '#DC2626',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  typeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  reportDescription: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
    lineHeight: 22,
  },
  reportMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  votingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  voteButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  voteButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '500',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  reportTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  reportTypeCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
    marginRight: '2%',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  reportTypeCardSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  reportTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
    marginTop: 8,
    textAlign: 'center',
  },
  reportTypeTextSelected: {
    color: '#FFFFFF',
  },
  formField: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  textInputMultiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});