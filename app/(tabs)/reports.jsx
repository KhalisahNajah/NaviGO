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
  Image,
} from 'react-native';
import { TriangleAlert, Car, Construction, TreePine, Clock, MapPin, Send, Shield, CloudRain } from 'lucide-react-native';

export default function ReportsScreen() {
  const [reports, setReports] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportLocation, setReportLocation] = useState('');
  const [loading, setLoading] = useState(true);

  const reportTypes = [
    {
      id: 'police',
      name: 'Police',
      icon: Shield,
      color: '#3B82F6',
      description: 'Police presence or speed trap',
    },
    {
      id: 'accident',
      name: 'Accident',
      icon: TriangleAlert,
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
      icon: TriangleAlert,
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
  }, []);

  const loadReports = async () => {
    try {
      const mockReports = [
        {
          id: '1',
          type: 'Accident',
          description: 'Multi-car accident blocking two lanes on Highway 101 North',
          location: {
            address: 'Highway 101 North, Exit 42',
            coordinates: { lat: 37.7749, lng: -122.4194 }
          },
          status: 'active',
          votes: { helpful: 15, notHelpful: 2 },
          createdAt: new Date(Date.now() - 1800000)
        },
        {
          id: '2',
          type: 'Road Work',
          description: 'Construction crew working on bridge repairs, expect delays',
          location: {
            address: 'Bay Bridge, Eastbound',
            coordinates: { lat: 37.7949, lng: -122.3994 }
          },
          status: 'active',
          votes: { helpful: 8, notHelpful: 1 },
          createdAt: new Date(Date.now() - 3600000)
        },
        {
          id: '3',
          type: 'Police',
          description: 'Speed trap setup near downtown exit',
          location: {
            address: 'I-280 South, Exit 57',
            coordinates: { lat: 37.7649, lng: -122.4294 }
          },
          status: 'active',
          votes: { helpful: 23, notHelpful: 0 },
          createdAt: new Date(Date.now() - 900000)
        }
      ];
      setReports(mockReports);
    } catch (error) {
      console.error('Error loading reports:', error);
      Alert.alert('Error', 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!selectedReportType || !reportDescription || !reportLocation) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    try {
      const reportType = reportTypes.find(t => t.id === selectedReportType);
      if (!reportType) return;

      const newReport = {
        id: Date.now().toString(),
        type: reportType.name,
        description: reportDescription,
        location: {
          address: reportLocation,
          coordinates: { lat: 0, lng: 0 }
        },
        status: 'active',
        votes: { helpful: 0, notHelpful: 0 },
        createdAt: new Date()
      };

      setReports(prev => [newReport, ...prev]);
      
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

  const handleVoteOnReport = async (reportId, voteType) => {
    try {
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? {
              ...report,
              votes: {
                ...report.votes,
                [voteType]: report.votes[voteType] + 1
              }
            }
          : report
      ));
      Alert.alert('Thank you', 'Your vote has been recorded!');
    } catch (error) {
      console.error('Error voting on report:', error);
      Alert.alert('Error', 'Failed to record your vote');
    }
  };

  const getReportTypeColor = (type) => {
    const reportType = reportTypes.find(t => t.name === type);
    return reportType?.color || '#6B7280';
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
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
          <TriangleAlert size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
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
                  <View style={styles.statusBadge}>
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
            <TriangleAlert size={48} color="#9CA3AF" />
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
    backgroundColor: '#059669',
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