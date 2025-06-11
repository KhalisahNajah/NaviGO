import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { User, Settings, MapPin, Bell, Shield, CircleHelp as HelpCircle, Star, Phone, Navigation, Fuel, ChevronRight } from 'lucide-react-native';

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [voiceNavigation, setVoiceNavigation] = useState(true);
  const [autoReroute, setAutoReroute] = useState(true);

  const stats = {
    tripsSaved: 47,
    fuelSaved: '$234.50',
    reportsSubmitted: 12,
    communityRating: 4.8,
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const MenuSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const MenuItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showArrow = true,
    rightElement 
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    rightElement?: React.ReactNode;
  }) => {
    const IconComponent = icon;
    return (
      <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuItemLeft}>
          <View style={styles.iconContainer}>
            <IconComponent size={20} color="#2563EB" />
          </View>
          <View>
            <Text style={styles.menuItemTitle}>{title}</Text>
            {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
          </View>
        </View>
        <View style={styles.menuItemRight}>
          {rightElement}
          {showArrow && <ChevronRight size={16} color="#9CA3AF" />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* Profile Info */}
      <View style={styles.profileCard}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <User size={32} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john.doe@example.com</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Statistics */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Your Impact</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Navigation size={20} color="#2563EB" />
            <Text style={styles.statValue}>{stats.tripsSaved}</Text>
            <Text style={styles.statLabel}>Trips Saved</Text>
          </View>
          <View style={styles.statItem}>
            <Fuel size={20} color="#059669" />
            <Text style={styles.statValue}>{stats.fuelSaved}</Text>
            <Text style={styles.statLabel}>Fuel Saved</Text>
          </View>
          <View style={styles.statItem}>
            <Shield size={20} color="#EA580C" />
            <Text style={styles.statValue}>{stats.reportsSubmitted}</Text>
            <Text style={styles.statLabel}>Reports</Text>
          </View>
          <View style={styles.statItem}>
            <Star size={20} color="#F59E0B" />
            <Text style={styles.statValue}>{stats.communityRating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      {/* Navigation Settings */}
      <MenuSection title="Navigation">
        <MenuItem
          icon={Navigation}
          title="Voice Navigation"
          subtitle="Turn-by-turn voice guidance"
          showArrow={false}
          rightElement={
            <Switch
              value={voiceNavigation}
              onValueChange={setVoiceNavigation}
              trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
              thumbColor={voiceNavigation ? '#2563EB' : '#9CA3AF'}
            />
          }
        />
        <MenuItem
          icon={MapPin}
          title="Auto Re-route"
          subtitle="Automatically find better routes"
          showArrow={false}
          rightElement={
            <Switch
              value={autoReroute}
              onValueChange={setAutoReroute}
              trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
              thumbColor={autoReroute ? '#2563EB' : '#9CA3AF'}
            />
          }
        />
        <MenuItem
          icon={Fuel}
          title="Fuel Preferences"
          subtitle="Manage fuel types and prices"
          onPress={() => Alert.alert('Navigation', 'Fuel preferences coming soon')}
        />
      </MenuSection>

      {/* Privacy & Notifications */}
      <MenuSection title="Privacy & Notifications">
        <MenuItem
          icon={Bell}
          title="Push Notifications"
          subtitle="Traffic alerts and updates"
          showArrow={false}
          rightElement={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
              thumbColor={notifications ? '#2563EB' : '#9CA3AF'}
            />
          }
        />
        <MenuItem
          icon={MapPin}
          title="Location Sharing"
          subtitle="Help improve traffic data"
          showArrow={false}
          rightElement={
            <Switch
              value={locationSharing}
              onValueChange={setLocationSharing}
              trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
              thumbColor={locationSharing ? '#2563EB' : '#9CA3AF'}
            />
          }
        />
        <MenuItem
          icon={Shield}
          title="Privacy Settings"
          subtitle="Manage your data and privacy"
          onPress={() => Alert.alert('Privacy', 'Privacy settings coming soon')}
        />
      </MenuSection>

      {/* Support */}
      <MenuSection title="Support">
        <MenuItem
          icon={HelpCircle}
          title="Help & FAQ"
          subtitle="Get answers to common questions"
          onPress={() => Alert.alert('Help', 'Help center coming soon')}
        />
        <MenuItem
          icon={Phone}
          title="Contact Support"
          subtitle="Get help from our team"
          onPress={() => Alert.alert('Support', 'Contact support coming soon')}
        />
        <MenuItem
          icon={Star}
          title="Rate the App"
          subtitle="Help us improve with your feedback"
          onPress={() => Alert.alert('Rating', 'App rating coming soon')}
        />
      </MenuSection>

      {/* Account */}
      <MenuSection title="Account">
        <MenuItem
          icon={Settings}
          title="App Settings"
          subtitle="Customize your experience"
          onPress={() => Alert.alert('Settings', 'App settings coming soon')}
        />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </MenuSection>

      <View style={styles.footer}>
        <Text style={styles.footerText}>NaviFuel v1.0.0</Text>
        <Text style={styles.footerText}>Made with ❤️ for safer roads</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  editButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    padding: 16,
    paddingBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    margin: 16,
    marginTop: 8,
    backgroundColor: '#FEF2F2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    padding: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});