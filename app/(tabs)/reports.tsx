import React, { useState } from 'react';
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
import { TriangleAlert as AlertTriangle, Car, Construction, TreePine, Circle, Clock, MapPin, Send, Slice as Police, CloudRain } from 'lucide-react-native';

interface Report {
  id: string;
  type: string;
  description: string;
  location: string;
  timestamp: string;
  status: 'active' | 'resolved';
}

interface ReportType {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
}

export default function ReportsScreen() {
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      type: 'Police',
      description: 'Speed trap reported',
      location: 'Highway 401, Exit 394',
      timestamp: '5 minutes ago',
      status: 'active',
    },
    {
      id: '2',
      type: 'Accident',
      description: 'Minor fender bender, right lane blocked',
      location: 'Main St & Oak Ave',
      timestamp: '12 minutes ago',
      status: 'active',
    },
    {
      id: '3',
      type: 'Road Work',
      description: 'Lane closure for maintenance',
      location: 'I-95 Southbound',
      timestamp: '1 hour ago',
      status: 'resolved',
    },
  ]);

  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportLocation, setReportLocation] = useState('');

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

  const handleSubmitReport = () => {
    if (!selectedReportType || !reportDescription || !reportLocation) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    const newReport: Report = {
      id: Date.now().toString(),
      type: reportTypes.find(t => t.id === selectedReportType)?.name || '',
      description: reportDescription,
      location: reportLocation,
      timestamp: 'Just now',
      status: 'active',
    };

    setReports([newReport, ...reports]);
    
    // Reset form
    setSelectedReportType('');
    setReportDescription('');
    setReportLocation('');
    setShowReportModal(false);

    Alert.alert('Report Submitted', 'Thank you for helping the community stay informed!');
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? '#059669' : '#6B7280';
  };

  const getReportTypeColor = (type: string) => {
    const reportType = reportTypes.find(t => t.name === type);
    return reportType?.color || '#6B7280';
  };

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
          <Text style={styles.sectionTitle}>Active Reports</Text>
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
                    <Text style={styles.metaText}>{report.location}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.metaText}>{report.timestamp}</Text>
                  </View>
                </View>
              </View>
            ))}
        </View>

        {/* Resolved Reports */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recently Resolved</Text>
          {reports
            .filter(report => report.status === 'resolved')
            .map((report) => (
              <View key={report.id} style={[styles.reportCard, styles.resolvedCard]}>
                <View style={styles.reportHeader}>
                  <View style={styles.reportType}>
                    <View
                      style={[
                        styles.typeIndicator,
                        { backgroundColor: '#6B7280' },
                      ]}
                    />
                    <Text style={[styles.typeName, { color: '#6B7280' }]}>
                      {report.type}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: '#6B7280' },
                    ]}>
                    <Text style={styles.statusText}>Resolved</Text>
                  </View>
                </View>
                <Text style={[styles.reportDescription, { color: '#6B7280' }]}>
                  {report.description}
                </Text>
                <View style={styles.reportMeta}>
                  <View style={styles.metaItem}>
                    <MapPin size={14} color="#9CA3AF" />
                    <Text style={[styles.metaText, { color: '#9CA3AF' }]}>
                      {report.location}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Clock size={14} color="#9CA3AF" />
                    <Text style={[styles.metaText, { color: '#9CA3AF' }]}>
                      {report.timestamp}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
        </View>

        {reports.length === 0 && (
          <View style={styles.emptyState}>
            <AlertTriangle size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Reports</Text>
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
  resolvedCard: {
    opacity: 0.7,
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