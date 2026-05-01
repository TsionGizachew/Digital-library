import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  PlusIcon,
  BookOpenIcon,
  LightBulbIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { DashboardOverview as DashboardOverviewType } from '../../services/dashboardService';
import LibraryChart from './LibraryChart';


interface DashboardOverviewProps {
  overviewData: DashboardOverviewType | null;
  loading: boolean;
  onIssueBook: () => void;
  onShowAddBookModal: () => void;
}

interface StatsWithChange {
  totalBooks: number;
  totalMembers: number;
  borrowedBooks: number;
  overdueBooks: number;
  changes: {
    booksChange: number;
    membersChange: number;
    borrowedChange: number;
    overdueChange: number;
  };
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  overviewData,
  loading,
  onIssueBook,
  onShowAddBookModal
}) => {
  const [showRecommendationForm, setShowRecommendationForm] = useState(false);
  const [recommendation, setRecommendation] = useState({ title: '', description: '', priority: 'medium' });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [statsWithChanges, setStatsWithChanges] = useState<StatsWithChange | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/v1/dashboard/overview', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
        const data = await response.json();
        
        if (data.success && data.data) {
          setRecentActivity(data.data?.recentActivity || []);
          
          // Fetch stats with changes
          const statsResponse = await fetch('/api/v1/admin/dashboard', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
          });
          const statsData = await statsResponse.json();
          
          if (statsData.success && statsData.data) {
            const currentStats = statsData.data;
            
            // Calculate percentage changes (mock calculation - in real app, compare with last month's data)
            const booksChange = currentStats.books?.newThisMonth 
              ? ((currentStats.books.newThisMonth / currentStats.books.total) * 100).toFixed(1)
              : '0.0';
            const membersChange = currentStats.users?.newThisMonth
              ? ((currentStats.users.newThisMonth / currentStats.users.total) * 100).toFixed(1)
              : '0.0';
            
            setStatsWithChanges({
              totalBooks: currentStats.books?.total || 0,
              totalMembers: currentStats.users?.total || 0,
              borrowedBooks: currentStats.bookings?.approved || 0,
              overdueBooks: currentStats.bookings?.overdue || 0,
              changes: {
                booksChange: parseFloat(booksChange),
                membersChange: parseFloat(membersChange),
                borrowedChange: 8.1, // This would be calculated from historical data
                overdueChange: -2.3, // Negative means decrease
              }
            });
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setActivityLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading || !statsWithChanges) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner w-8 h-8 mr-4"></div>
        <span className="text-neutral-600 dark:text-neutral-400">Loading overview...</span>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Books',
      value: statsWithChanges.totalBooks,
      icon: BookOpenIcon,
      bgColor: 'bg-primary-50 dark:bg-primary-900/20',
      iconColor: 'text-primary-600 dark:text-primary-400',
      change: `+${statsWithChanges.changes.booksChange}%`,
      changePositive: true,
    },
    {
      title: 'Active Members',
      value: statsWithChanges.totalMembers,
      icon: UsersIcon,
      bgColor: 'bg-success-50 dark:bg-success-900/20',
      iconColor: 'text-success-600 dark:text-success-400',
      change: `+${statsWithChanges.changes.membersChange}%`,
      changePositive: true,
    },
    {
      title: 'Books Borrowed',
      value: statsWithChanges.borrowedBooks,
      icon: ClipboardDocumentListIcon,
      bgColor: 'bg-warning-50 dark:bg-warning-900/20',
      iconColor: 'text-warning-600 dark:text-warning-400',
      change: `+${statsWithChanges.changes.borrowedChange}%`,
      changePositive: true,
    },
    {
      title: 'Overdue Books',
      value: statsWithChanges.overdueBooks,
      icon: ExclamationTriangleIcon,
      bgColor: 'bg-error-50 dark:bg-error-900/20',
      iconColor: 'text-error-600 dark:text-error-400',
      change: `${statsWithChanges.changes.overdueChange}%`,
      changePositive: statsWithChanges.changes.overdueChange < 0,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-hover"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 truncate">{stat.title}</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{stat.value}</p>
                <p className={`text-xs font-medium mt-2 ${stat.changePositive ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-xl flex-shrink-0 ml-3 ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3 sm:mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <button onClick={onShowAddBookModal} className="btn-primary flex items-center justify-center space-x-2 text-sm sm:text-base">
            <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Add New Book</span>
          </button>
          <button onClick={() => setShowRecommendationForm(true)} className="btn-secondary flex items-center justify-center space-x-2 text-sm sm:text-base">
            <LightBulbIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Submit Recommendation</span>
          </button>
          <button onClick={async () => {
            try {
              const response = await fetch('/api/v1/dashboard/generate-report', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
              });
              if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `library-report-${new Date().toISOString().split('T')[0]}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                toast.success('Report downloaded successfully!');
              } else {
                toast.error('Failed to generate report');
              }
            } catch (error) {
              toast.error('Error generating report');
            }
          }} className="btn-outline flex items-center justify-center space-x-2 text-sm sm:text-base">
            <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="card">
          <LibraryChart type="line" title="Borrowing Trends (Last 6 Months)" />
        </div>
        <div className="card">
          <LibraryChart type="bar" title="Books by Category" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="card">
          <LibraryChart type="doughnut" title="Book Status Distribution" />
        </div>
        <div className="card lg:col-span-2">
          <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3 sm:mb-4">Recent Activity</h3>
          {activityLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="spinner w-6 h-6"></div>
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'pending' ? 'bg-yellow-500' :
                    activity.type === 'rejected' ? 'bg-red-500' :
                    activity.type === 'approved' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{activity.user} - {activity.type}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{activity.book}</p>
                  </div>
                  <span className="text-xs text-neutral-400 whitespace-nowrap">{new Date(activity.timestamp).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">No recent activity</p>
          )}
        </div>
      </div>

      {/* Recommendation Form Modal */}
      {showRecommendationForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowRecommendationForm(false)}>
          <div className="card max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Submit Website Issue/Recommendation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Title</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Brief title of the issue or suggestion"
                  value={recommendation.title}
                  onChange={(e) => setRecommendation({...recommendation, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Description</label>
                <textarea 
                  className="input-field" 
                  rows={4} 
                  placeholder="Describe the issue or suggestion in detail"
                  value={recommendation.description}
                  onChange={(e) => setRecommendation({...recommendation, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Priority</label>
                <select 
                  className="input-field"
                  value={recommendation.priority}
                  onChange={(e) => setRecommendation({...recommendation, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowRecommendationForm(false)} className="btn-outline flex-1">Cancel</button>
                <button onClick={async () => {
            if (!recommendation.title || !recommendation.description) {
              toast.error('Please fill in all fields');
              return;
            }
            
            try {
              const response = await fetch('/api/v1/admin/recommendations', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(recommendation)
              });
              
              const result = await response.json();
              
              if (response.ok && result.success) {
                toast.success('Recommendation submitted successfully!');
                setRecommendation({ title: '', description: '', priority: 'medium' });
                setShowRecommendationForm(false);
              } else {
                toast.error(result.message || 'Failed to submit recommendation');
              }
            } catch (error) {
              console.error('Error submitting recommendation:', error);
              toast.error('Failed to submit recommendation. Please try again.');
            }
          }} className="btn-primary flex-1">Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default DashboardOverview;
