import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, GlobeAltIcon, DocumentTextIcon, BellIcon, ServerIcon } from '@heroicons/react/24/outline';
import { getAdminSettings, updateAdminSettings } from '../../services/AdminSettingService';
import toast from 'react-hot-toast';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex-1 min-w-0 mr-4">
      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{label}</p>
      {description && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{description}</p>
      )}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 ${
        checked ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-600'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

const AdminSettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'library' | 'borrowing' | 'notifications' | 'system'>('library');
  const [settings, setSettings] = useState({
    library: {
      name: '',
      address: '',
      phone: '',
      email: '',
      website: '',
    },
    borrowing: {
      maxBooksPerUser: 5,
      defaultBorrowPeriodDays: 14,
      maxRenewals: 2,
      finePerDay: 2.0,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      overdueReminders: true,
    },
    system: {
      maintenanceMode: false,
      allowRegistration: true,
      requireEmailVerification: true,
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await getAdminSettings();
      if (response.success && response.data) {
        const data = response.data as any;
        setSettings({
          library: data.library || settings.library,
          borrowing: data.borrowing || settings.borrowing,
          notifications: data.notifications || settings.notifications,
          system: data.system || settings.system,
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await updateAdminSettings(settings);
      if (response.success) {
        toast.success('Settings saved successfully');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'library' as const, name: 'Library Info', icon: GlobeAltIcon },
    { id: 'borrowing' as const, name: 'Borrowing Rules', icon: DocumentTextIcon },
    { id: 'notifications' as const, name: 'Notifications', icon: BellIcon },
    { id: 'system' as const, name: 'System', icon: ServerIcon },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3">
        <div className="spinner"></div>
        <p className="text-neutral-600 dark:text-neutral-400">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Settings</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Configure library system settings</p>
        </div>
        <button onClick={saveSettings} disabled={saving} className="btn-primary flex items-center">
          {saving ? (
            <>
              <div className="spinner w-4 h-4 mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              Save Settings
            </>
          )}
        </button>
      </div>

      {/* Pill-style Tabs */}
      <div className="card">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        <div>
          {/* Library Settings */}
          {activeTab === 'library' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-4">
                Library Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Library Name
                  </label>
                  <input
                    type="text"
                    value={settings.library.name}
                    onChange={(e) => setSettings({ ...settings, library: { ...settings.library, name: e.target.value } })}
                    className="input-field"
                    placeholder="Enter library name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={settings.library.phone}
                    onChange={(e) => setSettings({ ...settings, library: { ...settings.library, phone: e.target.value } })}
                    className="input-field"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.library.email}
                    onChange={(e) => setSettings({ ...settings, library: { ...settings.library, email: e.target.value } })}
                    className="input-field"
                    placeholder="library@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Website
                  </label>
                  <input
                    type="text"
                    value={settings.library.website}
                    onChange={(e) => setSettings({ ...settings, library: { ...settings.library, website: e.target.value } })}
                    className="input-field"
                    placeholder="https://library.example.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={settings.library.address}
                    onChange={(e) => setSettings({ ...settings, library: { ...settings.library, address: e.target.value } })}
                    className="input-field"
                    placeholder="123 Library Street, City, Country"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Borrowing Settings */}
          {activeTab === 'borrowing' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-4">
                Borrowing Rules
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Max Books Per User
                  </label>
                  <input
                    type="number"
                    value={settings.borrowing.maxBooksPerUser}
                    onChange={(e) => setSettings({ ...settings, borrowing: { ...settings.borrowing, maxBooksPerUser: parseInt(e.target.value) } })}
                    className="input-field"
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Default Borrow Period (Days)
                  </label>
                  <input
                    type="number"
                    value={settings.borrowing.defaultBorrowPeriodDays}
                    onChange={(e) => setSettings({ ...settings, borrowing: { ...settings.borrowing, defaultBorrowPeriodDays: parseInt(e.target.value) } })}
                    className="input-field"
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Max Renewals
                  </label>
                  <input
                    type="number"
                    value={settings.borrowing.maxRenewals}
                    onChange={(e) => setSettings({ ...settings, borrowing: { ...settings.borrowing, maxRenewals: parseInt(e.target.value) } })}
                    className="input-field"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Fine Per Day
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.borrowing.finePerDay}
                    onChange={(e) => setSettings({ ...settings, borrowing: { ...settings.borrowing, finePerDay: parseFloat(e.target.value) } })}
                    className="input-field"
                    min={0}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-4">
                Notification Preferences
              </h3>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                <ToggleSwitch
                  checked={settings.notifications.emailNotifications}
                  onChange={(val) => setSettings({ ...settings, notifications: { ...settings.notifications, emailNotifications: val } })}
                  label="Email Notifications"
                  description="Send email alerts for borrowing activity and due dates"
                />
                <ToggleSwitch
                  checked={settings.notifications.smsNotifications}
                  onChange={(val) => setSettings({ ...settings, notifications: { ...settings.notifications, smsNotifications: val } })}
                  label="SMS Notifications"
                  description="Send SMS reminders to users with registered phone numbers"
                />
                <ToggleSwitch
                  checked={settings.notifications.overdueReminders}
                  onChange={(val) => setSettings({ ...settings, notifications: { ...settings.notifications, overdueReminders: val } })}
                  label="Overdue Reminders"
                  description="Automatically remind users when books are overdue"
                />
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-4">
                System Configuration
              </h3>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                <ToggleSwitch
                  checked={settings.system.maintenanceMode}
                  onChange={(val) => setSettings({ ...settings, system: { ...settings.system, maintenanceMode: val } })}
                  label="Maintenance Mode"
                  description="Temporarily disable the library system for maintenance"
                />
                <ToggleSwitch
                  checked={settings.system.allowRegistration}
                  onChange={(val) => setSettings({ ...settings, system: { ...settings.system, allowRegistration: val } })}
                  label="Allow Registration"
                  description="Allow new users to register for library accounts"
                />
                <ToggleSwitch
                  checked={settings.system.requireEmailVerification}
                  onChange={(val) => setSettings({ ...settings, system: { ...settings.system, requireEmailVerification: val } })}
                  label="Require Email Verification"
                  description="New accounts must verify their email before accessing the library"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
