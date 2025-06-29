import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  RefreshControl,
  Image,
} from 'react-native';
import { MessageCircle, Send, MapPin, Clock, Users, TriangleAlert } from 'lucide-react-native';

export default function ChatScreen() {
  const [activeRoom, setActiveRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    if (activeRoom) {
      loadRoomMessages(activeRoom);
    }
  }, [activeRoom]);

  const initializeChat = async () => {
    try {
      await loadNearbyRooms();
      setLoading(false);
    } catch (error) {
      console.error('Error initializing chat:', error);
      setLoading(false);
    }
  };

  const loadNearbyRooms = async () => {
    const mockRooms = [
      {
        id: 'highway-101-north',
        name: 'Highway 101 North',
        description: 'Traffic updates for Highway 101 northbound',
        activeUsers: 23,
        lastActivity: new Date(Date.now() - 120000),
        location: { lat: 37.7749, lng: -122.4194, radius: 10 }
      },
      {
        id: 'downtown-area',
        name: 'Downtown Traffic',
        description: 'City center traffic and parking updates',
        activeUsers: 45,
        lastActivity: new Date(Date.now() - 60000),
        location: { lat: 37.7849, lng: -122.4094, radius: 5 }
      },
      {
        id: 'bridge-traffic',
        name: 'Bay Bridge',
        description: 'Bridge traffic conditions and delays',
        activeUsers: 67,
        lastActivity: new Date(Date.now() - 30000),
        location: { lat: 37.7949, lng: -122.3994, radius: 8 }
      },
      {
        id: 'airport-route',
        name: 'Airport Route',
        description: 'Traffic to/from SFO Airport',
        activeUsers: 34,
        lastActivity: new Date(Date.now() - 300000),
        location: { lat: 37.6213, lng: -122.3790, radius: 15 }
      }
    ];

    setRooms(mockRooms);
    
    if (mockRooms.length > 0) {
      const mostActive = mockRooms.reduce((prev, current) => 
        prev.activeUsers > current.activeUsers ? prev : current
      );
      setActiveRoom(mostActive.id);
    }
  };

  const loadRoomMessages = async (roomId) => {
    const mockMessages = [
      {
        id: '1',
        user: 'TrafficBot',
        userId: 'bot',
        message: 'Welcome to the traffic chat! Share updates to help fellow drivers.',
        timestamp: new Date(Date.now() - 1800000),
        type: 'message',
      },
      {
        id: '2',
        user: 'Sarah M.',
        userId: 'user1',
        message: 'Heavy traffic at Exit 42, accident in left lane. Expect 15-20 min delays.',
        timestamp: new Date(Date.now() - 900000),
        type: 'traffic_alert',
        urgency: 'high',
        location: {
          address: 'Highway 101, Exit 42',
          coordinates: { lat: 37.7749, lng: -122.4194 }
        }
      },
      {
        id: '3',
        user: 'Mike R.',
        userId: 'user2',
        message: 'Thanks for the heads up! Taking the alternate route via Oak Street.',
        timestamp: new Date(Date.now() - 840000),
        type: 'message',
      },
      {
        id: '4',
        user: 'Lisa K.',
        userId: 'user3',
        message: 'Construction crew just arrived at the scene. Should clear up soon.',
        timestamp: new Date(Date.now() - 600000),
        type: 'traffic_alert',
        urgency: 'medium',
        location: {
          address: 'Highway 101, Exit 42',
          coordinates: { lat: 37.7749, lng: -122.4194 }
        }
      },
      {
        id: '5',
        user: 'David L.',
        userId: 'user4',
        message: 'All clear now! Traffic flowing normally again.',
        timestamp: new Date(Date.now() - 180000),
        type: 'traffic_alert',
        urgency: 'low',
      }
    ];

    setMessages(mockMessages);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeRoom) return;

    const message = {
      id: Date.now().toString(),
      user: 'You',
      userId: 'current_user',
      message: newMessage.trim(),
      timestamp: new Date(),
      type: 'message',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleQuickAlert = (alertType, alertMessage) => {
    if (!activeRoom) return;

    const message = {
      id: Date.now().toString(),
      user: 'You',
      userId: 'current_user',
      message: alertMessage,
      timestamp: new Date(),
      type: 'traffic_alert',
      urgency: 'high',
    };

    setMessages(prev => [...prev, message]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadNearbyRooms();
      if (activeRoom) {
        await loadRoomMessages(activeRoom);
      }
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getMessageStyle = (message) => {
    if (message.type === 'traffic_alert') {
      switch (message.urgency) {
        case 'high': return styles.alertHigh;
        case 'medium': return styles.alertMedium;
        case 'low': return styles.alertLow;
        default: return styles.alertMedium;
      }
    }
    return message.userId === 'current_user' ? styles.messageOwn : styles.messageOther;
  };

  const getAlertIcon = (urgency) => {
    switch (urgency) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return 'ℹ️';
      default: return '💬';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <MessageCircle size={48} color="#9CA3AF" />
        <Text style={styles.loadingText}>Loading traffic chat...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Traffic Chat</Text>
        <View style={styles.headerInfo}>
          <Users size={16} color="#6B7280" />
          <Text style={styles.userCount}>
            {rooms.find(r => r.id === activeRoom)?.activeUsers || 0} online
          </Text>
        </View>
      </View>

      {/* Room Selector */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.roomSelector}
        contentContainerStyle={styles.roomSelectorContent}>
        {rooms.map((room) => (
          <TouchableOpacity
            key={room.id}
            style={[
              styles.roomCard,
              activeRoom === room.id && styles.roomCardActive
            ]}
            onPress={() => setActiveRoom(room.id)}>
            <Text style={[
              styles.roomName,
              activeRoom === room.id && styles.roomNameActive
            ]}>
              {room.name}
            </Text>
            <View style={styles.roomMeta}>
              <Text style={[
                styles.roomUsers,
                activeRoom === room.id && styles.roomUsersActive
              ]}>
                {room.activeUsers} users
              </Text>
              <Text style={[
                styles.roomActivity,
                activeRoom === room.id && styles.roomActivityActive
              ]}>
                {formatTime(room.lastActivity)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Messages */}
      <ScrollView 
        style={styles.messagesContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {messages.map((message) => (
          <View key={message.id} style={[styles.message, getMessageStyle(message)]}>
            <View style={styles.messageHeader}>
              <Text style={styles.messageUser}>
                {message.type === 'traffic_alert' && getAlertIcon(message.urgency)} {message.user}
              </Text>
              <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
            </View>
            <Text style={styles.messageText}>{message.message}</Text>
            {message.location && (
              <View style={styles.messageLocation}>
                <MapPin size={12} color="#6B7280" />
                <Text style={styles.messageLocationText}>{message.location.address}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Quick Alerts */}
      <View style={styles.quickAlerts}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.quickAlertButton}
            onPress={() => handleQuickAlert('accident', '🚨 Accident reported at my location')}>
            <Text style={styles.quickAlertText}>🚨 Accident</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAlertButton}
            onPress={() => handleQuickAlert('heavy_traffic', '🚗 Heavy traffic here')}>
            <Text style={styles.quickAlertText}>🚗 Heavy Traffic</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAlertButton}
            onPress={() => handleQuickAlert('construction', '🚧 Construction work')}>
            <Text style={styles.quickAlertText}>🚧 Construction</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAlertButton}
            onPress={() => handleQuickAlert('clear', '✅ All clear now')}>
            <Text style={styles.quickAlertText}>✅ All Clear</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Share traffic updates..."
          multiline
          maxLength={200}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !newMessage.trim() && styles.sendButtonDisabled
          ]}
          onPress={handleSendMessage}
          disabled={!newMessage.trim()}>
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
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
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userCount: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  roomSelector: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  roomSelectorContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  roomCard: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    minWidth: 120,
  },
  roomCardActive: {
    backgroundColor: '#2563EB',
  },
  roomName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  roomNameActive: {
    color: '#FFFFFF',
  },
  roomMeta: {
    marginTop: 4,
  },
  roomUsers: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  roomUsersActive: {
    color: '#E5E7EB',
  },
  roomActivity: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  roomActivityActive: {
    color: '#D1D5DB',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  message: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    maxWidth: '85%',
  },
  messageOther: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  messageOwn: {
    backgroundColor: '#2563EB',
    alignSelf: 'flex-end',
  },
  alertHigh: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    alignSelf: 'stretch',
    maxWidth: '100%',
  },
  alertMedium: {
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    alignSelf: 'stretch',
    maxWidth: '100%',
  },
  alertLow: {
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
    alignSelf: 'stretch',
    maxWidth: '100%',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  messageUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  messageTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  messageText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  messageLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  messageLocationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  quickAlerts: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  quickAlertButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginLeft: 16,
  },
  quickAlertText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#2563EB',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
});