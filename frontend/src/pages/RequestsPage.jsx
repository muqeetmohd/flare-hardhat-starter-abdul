import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FunnelIcon, 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import EmergencyRequestCard from '../components/ui/EmergencyRequestCard';
import SlabButton from '../components/ui/SlabButton';

const RequestsPage = ({ user, onDonate }) => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    urgency: 'all',
    search: ''
  });

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const mockRequests = [
          {
            id: 'REQ-001',
            hospitalName: 'City General Hospital',
            xrplAddress: 'rCityGeneral123456789',
            amountRequested: 5000,
            amountFunded: 3200,
            status: 'partially_funded',
            daysOpen: 2,
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
            hospitalName: 'Regional Medical Center',
            xrplAddress: 'rRegionalMed987654321',
            amountRequested: 2500,
            amountFunded: 2500,
            status: 'funded',
            daysOpen: 1,
            isVerified: true,
            patientInfo: {
              age: 28,
              condition: 'Trauma Treatment',
              urgency: 'emergency',
              estimatedDuration: '1 week'
            },
            contributors: 67
          },
          {
            id: 'REQ-003',
            hospitalName: 'Community Health Clinic',
            xrplAddress: 'rCommunityHealth456789',
            amountRequested: 1200,
            amountFunded: 800,
            status: 'pending',
            daysOpen: 5,
            isVerified: true,
            patientInfo: {
              age: 45,
              condition: 'Cancer Treatment',
              urgency: 'urgent',
              estimatedDuration: '2 weeks'
            },
            contributors: 23
          },
          {
            id: 'REQ-004',
            hospitalName: 'Emergency Care Unit',
            xrplAddress: 'rEmergencyCare789123',
            amountRequested: 8000,
            amountFunded: 0,
            status: 'pending',
            daysOpen: 1,
            isVerified: true,
            patientInfo: {
              age: 12,
              condition: 'Pediatric Emergency',
              urgency: 'life_threatening',
              estimatedDuration: '3-5 days'
            },
            contributors: 0
          },
          {
            id: 'REQ-005',
            hospitalName: 'Metro Hospital',
            xrplAddress: 'rMetroHospital456789',
            amountRequested: 3000,
            amountFunded: 3000,
            status: 'funded',
            daysOpen: 3,
            isVerified: true,
            patientInfo: {
              age: 67,
              condition: 'Heart Surgery',
              urgency: 'emergency',
              estimatedDuration: '1 week'
            },
            contributors: 89
          }
        ];
        
        setRequests(mockRequests);
        setFilteredRequests(mockRequests);
        setIsLoading(false);
      }, 1000);
    };

    fetchRequests();
  }, []);

  // Filter requests
  useEffect(() => {
    let filtered = requests;

    if (filters.status !== 'all') {
      filtered = filtered.filter(req => req.status === filters.status);
    }

    if (filters.urgency !== 'all') {
      filtered = filtered.filter(req => req.patientInfo?.urgency === filters.urgency);
    }

    if (filters.search) {
      filtered = filtered.filter(req => 
        req.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        req.hospitalName.toLowerCase().includes(filters.search.toLowerCase()) ||
        req.patientInfo?.condition.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  }, [requests, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-ink mb-4">
              Emergency Requests
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Real people, real emergencies, real impact. Your donations fund 
              life-saving treatments within hours.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="form-input pl-10 w-full"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="form-input"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="partially_funded">Partially Funded</option>
                <option value="funded">Fully Funded</option>
              </select>

              {/* Urgency Filter */}
              <select
                value={filters.urgency}
                onChange={(e) => handleFilterChange('urgency', e.target.value)}
                className="form-input"
              >
                <option value="all">All Urgency</option>
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
                <option value="life_threatening">Life Threatening</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted">
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              <span>{filteredRequests.length} requests found</span>
            </div>
          </div>
        </div>
      </section>

      {/* Requests Grid */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            // Loading skeletons
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
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
              ))}
            </div>
          ) : filteredRequests.length === 0 ? (
            // Empty state
            <div className="text-center py-16">
              <FunnelIcon className="w-16 h-16 text-muted mx-auto mb-4" />
              <h3 className="text-xl font-bold text-ink mb-2">No requests found</h3>
              <p className="text-muted mb-6">
                Try adjusting your filters or check back later for new requests.
              </p>
              <SlabButton
                variant="ghost"
                size="md"
                label="Clear Filters"
                onClick={() => setFilters({ status: 'all', urgency: 'all', search: '' })}
              />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((request, i) => (
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
                    onFund={() => onDonate?.(request.id)}
                    onView={(id) => console.log('View request:', id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RequestsPage;
