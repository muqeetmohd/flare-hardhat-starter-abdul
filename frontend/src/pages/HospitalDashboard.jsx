import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  DocumentTextIcon, 
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import SlabButton from '../components/ui/SlabButton';
import EmergencyRequestCard from '../components/ui/EmergencyRequestCard';

const HospitalDashboard = ({ user, onCreateRequest }) => {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    totalFundsReceived: 0,
    pendingPayouts: 0,
    totalRequests: 0,
    activeRequests: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Simulate API calls
      setTimeout(() => {
        setStats({
          totalFundsReceived: 125000,
          pendingPayouts: 15000,
          totalRequests: 45,
          activeRequests: 8
        });
        
        setRequests([
          {
            id: 'REQ-001',
            hospitalName: user.hospitalInfo?.name || 'Your Hospital',
            xrplAddress: user.hospitalInfo?.xrplAddress || 'rYourHospital123',
            amountRequested: 5000,
            amountFunded: 5000,
            status: 'funded',
            daysOpen: 1,
            isVerified: true,
            patientInfo: {
              age: 34,
              condition: 'Emergency Surgery',
              urgency: 'life_threatening',
              estimatedDuration: '2-3 days'
            },
            contributors: 45
          },
          {
            id: 'REQ-002',
            hospitalName: user.hospitalInfo?.name || 'Your Hospital',
            xrplAddress: user.hospitalInfo?.xrplAddress || 'rYourHospital123',
            amountRequested: 2500,
            amountFunded: 1800,
            status: 'partially_funded',
            daysOpen: 3,
            isVerified: true,
            patientInfo: {
              age: 28,
              condition: 'Trauma Treatment',
              urgency: 'emergency',
              estimatedDuration: '1 week'
            },
            contributors: 23
          },
          {
            id: 'REQ-003',
            hospitalName: user.hospitalInfo?.name || 'Your Hospital',
            xrplAddress: user.hospitalInfo?.xrplAddress || 'rYourHospital123',
            amountRequested: 1200,
            amountFunded: 0,
            status: 'pending',
            daysOpen: 5,
            isVerified: false,
            patientInfo: {
              age: 45,
              condition: 'Cancer Treatment',
              urgency: 'urgent',
              estimatedDuration: '2 weeks'
            },
            contributors: 0
          }
        ]);
        
        setIsLoading(false);
      }, 1000);
    };

    fetchData();
  }, [user]);

  const statusConfig = {
    pending: { color: 'bg-muted', label: 'Pending Review' },
    verified: { color: 'bg-accent-2', label: 'Verified' },
    funded: { color: 'bg-accent-2', label: 'Fully Funded' },
    partially_funded: { color: 'bg-accent-3', label: 'Partially Funded' }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4, 
        delay: i * 0.1,
        ease: [0.2, 0.9, 0.25, 1]
      }
    })
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <section className="py-8 px-4 bg-panel border-b-2 border-[rgba(11,13,15,0.06)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-ink mb-2">
                Hospital Dashboard
              </h1>
              <p className="text-muted">
                Manage emergency requests and track funding for {user.hospitalInfo?.name}
              </p>
            </div>
            
            <SlabButton
              variant="primary"
              size="lg"
              icon={<PlusIcon className="w-5 h-5" />}
              label="Create Emergency Request"
              onClick={() => setShowCreateForm(true)}
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="slab-container"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-ink">Total Funds Received</h3>
                  <CurrencyDollarIcon className="w-6 h-6 text-accent-2" />
                </div>
                <div className="text-3xl font-bold text-accent-2">
                  ${stats.totalFundsReceived.toLocaleString()}
                </div>
                <div className="text-sm text-muted mt-1">
                  Across {stats.totalRequests} requests
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="slab-container"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-ink">Pending Payouts</h3>
                  <ClockIcon className="w-6 h-6 text-accent-3" />
                </div>
                <div className="text-3xl font-bold text-accent-3">
                  ${stats.pendingPayouts.toLocaleString()}
                </div>
                <div className="text-sm text-muted mt-1">
                  {stats.activeRequests} active requests
                </div>
              </motion.div>
            </div>

            {/* Recent Requests */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-ink">Recent Requests</h2>
                <SlabButton
                  variant="ghost"
                  size="md"
                  label="View All"
                />
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  // Loading skeletons
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="card-req">
                      <div className="card-strip loading-skeleton" />
                      <div className="flex-1 space-y-3">
                        <div className="loading-skeleton h-6 w-3/4 rounded" />
                        <div className="loading-skeleton h-4 w-1/2 rounded" />
                        <div className="loading-skeleton h-12 w-full rounded" />
                        <div className="flex gap-2">
                          <div className="loading-skeleton h-8 w-20 rounded" />
                          <div className="loading-skeleton h-8 w-24 rounded" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  requests.map((request, i) => (
                    <motion.div
                      key={request.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                    >
                      <EmergencyRequestCard
                        requestId={request.id}
                        hospitalName={request.hospitalName}
                        xrplAddress={request.xrplAddress}
                        amountRequested={request.amountRequested}
                        amountFunded={request.amountFunded}
                        status={request.status}
                        daysOpen={request.daysOpen}
                        isVerified={request.isVerified}
                        patientInfo={request.patientInfo}
                        contributors={request.contributors}
                        onFund={() => console.log('Fund request:', request.id)}
                        onView={(id) => console.log('View request:', id)}
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Verification Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="slab-container"
            >
              <h3 className="text-lg font-bold text-ink mb-4">Verification Status</h3>
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircleIcon className="w-6 h-6 text-accent-2" />
                <div>
                  <div className="font-semibold text-ink">Verified Hospital</div>
                  <div className="text-sm text-muted">All requests auto-approved</div>
                </div>
              </div>
              <div className="text-xs text-muted">
                License: {user.hospitalInfo?.license || 'MED-12345'}
              </div>
            </motion.div>

            {/* Recent Donors */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="slab-container"
            >
              <h3 className="text-lg font-bold text-ink mb-4">Recent Donors</h3>
              <div className="space-y-3">
                {[
                  { name: 'Sarah M.', amount: 25, time: '2h ago' },
                  { name: 'John D.', amount: 50, time: '4h ago' },
                  { name: 'Anonymous', amount: 15, time: '6h ago' },
                  { name: 'Maria L.', amount: 100, time: '8h ago' }
                ].map((donor, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[rgba(11,13,15,0.06)] last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-accent-2 rounded-full flex items-center justify-center">
                        <UserGroupIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-ink">{donor.name}</div>
                        <div className="text-xs text-muted">{donor.time}</div>
                      </div>
                    </div>
                    <div className="font-semibold text-accent-2">
                      ${donor.amount}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="slab-container"
            >
              <h3 className="text-lg font-bold text-ink mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <SlabButton
                  variant="secondary"
                  size="md"
                  icon={<DocumentTextIcon className="w-4 h-4" />}
                  label="Upload Documents"
                  className="w-full"
                />
                <SlabButton
                  variant="ghost"
                  size="md"
                  icon={<CheckCircleIcon className="w-4 h-4" />}
                  label="Verify Request"
                  className="w-full"
                />
                <SlabButton
                  variant="ghost"
                  size="md"
                  icon={<ExclamationTriangleIcon className="w-4 h-4" />}
                  label="Report Issue"
                  className="w-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Create Request Modal */}
      {showCreateForm && (
        <CreateRequestModal
          onClose={() => setShowCreateForm(false)}
          onSubmit={(data) => {
            console.log('Create request:', data);
            setShowCreateForm(false);
          }}
        />
      )}
    </div>
  );
};

// Create Request Modal Component
const CreateRequestModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    patientAge: '',
    condition: '',
    urgency: 'urgent',
    estimatedDuration: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-glass flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="modal-content w-full max-w-2xl"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-ink">Create Emergency Request</h2>
            <button
              onClick={onClose}
              className="p-2 text-muted hover:text-ink transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Request Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="form-input"
                  placeholder="Emergency Surgery - Patient Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Amount Needed ($)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="form-input"
                  placeholder="5000"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="form-input h-24"
                placeholder="Detailed description of the emergency and treatment needed..."
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Patient Age
                </label>
                <input
                  type="number"
                  value={formData.patientAge}
                  onChange={(e) => setFormData({...formData, patientAge: e.target.value})}
                  className="form-input"
                  placeholder="34"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Condition
                </label>
                <input
                  type="text"
                  value={formData.condition}
                  onChange={(e) => setFormData({...formData, condition: e.target.value})}
                  className="form-input"
                  placeholder="Emergency Surgery"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Urgency
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                  className="form-input"
                >
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                  <option value="life_threatening">Life Threatening</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <SlabButton
                variant="ghost"
                size="md"
                label="Cancel"
                onClick={onClose}
              />
              <SlabButton
                variant="primary"
                size="md"
                label="Create Request"
                type="submit"
              />
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default HospitalDashboard;
