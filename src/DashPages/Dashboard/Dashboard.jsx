import React, { useState, useEffect } from 'react';
import { FaUserMd, FaUserInjured, FaFlask, FaCalendarCheck, FaChartLine, FaDownload, 
         FaMoon, FaSun, FaStethoscope, FaUserNurse, FaPills, FaHospital, 
         FaAmbulance, FaBed, FaVial, FaNotesMedical } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import dashboardApi from '../../api/dashboardApi';
import axios from 'axios';
import './Dashboard.css';

const StatCard = ({ title, value, icon, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`stat-card ${color}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transform: isHovered ? 'translateY(-5px)' : 'translateY(0)' }}
    >
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3>{title}</h3>
        <h2>{value}</h2>
      </div>
    </div>
  );
};

const RecentActivity = ({ activities, isLoading }) => (
  <div className="card recent-activity-card">
    <h3>Recent Activity</h3>
    {isLoading ? (
      <div className="loading-spinner"></div>
    ) : (
      <>
        <ul className="activity-list">
          {activities.map((activity, index) => (
            <li key={index} className="activity-item">
              <div className="activity-time">{activity.time}</div>
              <div className="activity-description">{activity.description}</div>
            </li>
          ))}
        </ul>
        <Link to="/dashboard/activities" className="view-all-link">
          View All Activity →
        </Link>
      </>
    )}
  </div>
);

const BloodInventoryCard = ({ bloodInventory, isLoading }) => {
  const getStatusClass = (units) => {
    if (units <= 3) return "critical";
    if (units <= 7) return "low";
    return "normal";
  };
  
  const getStatusText = (units) => {
    if (units <= 3) return "Critical";
    if (units <= 7) return "Low";
    return "Normal";
  };

  return (
    <div className="card blood-inventory-card">
      <h3>Blood Inventory</h3>
      {isLoading ? (
        <div className="loading-spinner"></div>
      ) : (
        <>
          <div className="blood-inventory-container">
            {bloodInventory.map((item) => (
              <div key={item.type} className={`blood-type-item ${getStatusClass(item.units)}`}>
                <div className="blood-status-indicator"></div>
                <div className="blood-type">{item.type}</div>
                <div className="blood-units">{item.units} units</div>
                <div className="blood-status-tag">{getStatusText(item.units)}</div>
              </div>
            ))}
          </div>
          <Link to="/dashboard/bloodbank" className="view-all-link">View all inventory →</Link>
        </>
      )}
    </div>
  );
};

const QuickAccess = () => {
  const quickLinks = [
    { name: "Doctors", icon: <FaUserMd className="quick-btn-icon" />, path: "/dashboard/hospitaldoctors" },
    { name: "Beds", icon: <FaBed className="quick-btn-icon" />, path: "/dashboard/beds" },
    { name: "Blood Bank", icon: <FaVial className="quick-btn-icon" />, path: "/dashboard/bloodbank" },
    { name: "Pharmacy", icon: <FaPills className="quick-btn-icon" />, path: "/dashboard/pharmacy" },
    { name: "Staff", icon: <FaUserNurse className="quick-btn-icon" />, path: "/dashboard/nonmedicalstaff" },
    { name: "Profile", icon: <FaHospital className="quick-btn-icon" />, path: "/dashboard/editprofile" }
  ];

  return (
    <div className="card quick-access-card">
      <h3>Quick Access</h3>
      <div className="quick-access-buttons">
        {quickLinks.map((link, index) => (
          <Link key={index} to={link.path} className="quick-access-btn">
            {link.icon}
            <span>{link.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

const HospitalProfileCard = ({ hospital, isLoading }) => {
  return (
    <div className="card hospital-profile-card">
      <h3>Hospital Profile</h3>
      {isLoading ? (
        <div className="loading-spinner"></div>
      ) : (
        <div className="hospital-profile-content">
          <div className="hospital-profile-header">
            <div className="hospital-avatar">
              <img src={hospital.hospitalProfilePhoto} alt={hospital.name} />
            </div>
            <div className="hospital-info">
              <h2>{hospital.name}</h2>
              <p className="hospital-location">{hospital.location}</p>
            </div>
          </div>
          
          <div className="hospital-details">
            <div className="hospital-detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{hospital.email}</span>
            </div>
            <div className="hospital-detail-item">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{hospital.phoneNumber}</span>
            </div>
            <div className="hospital-detail-item">
              <span className="detail-label">Address:</span>
              <span className="detail-value">{hospital.address}</span>
            </div>
          </div>
          
          {hospital.specializations && hospital.specializations.length > 0 && (
            <div className="hospital-specializations">
              <h4>Specializations</h4>
              <div className="specialization-tags">
                {hospital.specializations.map((spec, index) => (
                  <span key={index} className="specialization-tag">{spec}</span>
                ))}
              </div>
            </div>
          )}
          
          <Link to="/dashboard/editprofile" className="view-all-link">
            Edit Profile →
          </Link>
        </div>
      )}
    </div>
  );
};

const AnnouncementsCard = ({ announcements, isLoading }) => {
  return (
    <div className="card announcements-card">
      <h3>Announcements</h3>
      {isLoading ? (
        <div className="loading-spinner"></div>
      ) : (
        <div className="announcements-list">
          {announcements.map((announcement, index) => (
            <div key={index} className={`announcement-item ${announcement.urgent ? 'urgent' : ''}`}>
              <div className="announcement-badge">{announcement.urgent ? 'Urgent' : 'Notice'}</div>
              <h4>{announcement.title}</h4>
              <p>{announcement.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    beds: 0,
    bloodUnits: 0
  });
  const [hospitalProfile, setHospitalProfile] = useState({
    name: '',
    location: '',
    email: '',
    phoneNumber: '',
    address: '',
    hospitalProfilePhoto: 'https://cdn.pixabay.com/photo/2017/01/31/22/32/doctor-2027768_1280.png',
    specializations: [],
    facilities: []
  });
  const [bloodInventory, setBloodInventory] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState({
    stats: true,
    hospital: true,
    blood: true,
    activities: true,
    announcements: true
  });
  const [error, setError] = useState(null);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Toggle dark mode
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    document.body.setAttribute('data-theme', newDarkMode ? 'dark' : 'light');
  };

  // Initialize theme on mount
  useEffect(() => {
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Get current date in a formatted string
  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  // Handle API errors
  const handleApiError = (error, defaultMessage) => {
    console.error('API Error:', error);
    
    // Check if error is due to authentication
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      setError('Your session has expired. Please log in again.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(defaultMessage);
    }
  };

  // Fetch hospital profile
  const fetchHospitalProfile = async () => {
    setLoading(prev => ({ ...prev, hospital: true }));
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.hospital) {
        setHospitalProfile(response.data.hospital);
      }
    } catch (error) {
      console.error('Error fetching hospital profile:', error);
      // Use default values if API fails
    }
    setLoading(prev => ({ ...prev, hospital: false }));
  };

  // Fetch custom hospital statistics
  const fetchHospitalStats = async () => {
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      // Get doctor count for this hospital
      const token = localStorage.getItem('token');
      const hospitalId = localStorage.getItem('userId');
      
      // Fetch doctor count
      const doctorsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/hospitaldoctors/hospital/${hospitalId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const doctorCount = doctorsResponse.data.length || 0;
      
      // Fetch beds data
      const bedsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/beds`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const bedsData = bedsResponse.data || [];
      const bedsCount = bedsData.reduce((total, bed) => total + (bed.available || 0) + (bed.occupied || 0), 0);
      
      // Fetch blood bank data
      const bloodResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/blood-bank`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const bloodData = bloodResponse.data || [];
      const bloodUnits = bloodData.reduce((total, item) => total + (item.unitsAvailable || 0), 0);
      
      setStats({
        doctors: doctorCount,
        patients: 248, // Placeholder - would be fetched from patients API
        beds: bedsCount,
        bloodUnits: bloodUnits
      });
    } catch (error) {
      console.error('Error fetching hospital statistics:', error);
      // Use fallback data if API fails
      setStats({
        doctors: 18,
        patients: 248,
        beds: 50,
        bloodUnits: 52
      });
    }
    setLoading(prev => ({ ...prev, stats: false }));
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch hospital profile
      fetchHospitalProfile();
      
      // Fetch hospital-specific statistics
      fetchHospitalStats();

      // Fetch blood inventory
      setLoading(prev => ({ ...prev, blood: true }));
      try {
        const bloodData = await dashboardApi.getBloodInventory();
        setBloodInventory(bloodData);
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          handleApiError(error, 'Authentication error');
          return; // Stop further API calls if authentication fails
        }
        console.error('Error fetching blood inventory:', error);
        // Use fallback data
        setBloodInventory([
          { type: 'A+', units: 12 },
          { type: 'A-', units: 5 },
          { type: 'B+', units: 8 },
          { type: 'B-', units: 3 },
          { type: 'AB+', units: 2 },
          { type: 'AB-', units: 1 },
          { type: 'O+', units: 15 },
          { type: 'O-', units: 6 }
        ]);
      }
      setLoading(prev => ({ ...prev, blood: false }));

      // Fetch recent activities
      setLoading(prev => ({ ...prev, activities: true }));
      try {
        const activitiesData = await dashboardApi.getRecentActivities();
        setRecentActivities(activitiesData);
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          handleApiError(error, 'Authentication error');
          return;
        }
        console.error('Error fetching activities:', error);
        // Use fallback data
        setRecentActivities([
          { time: '09:45 AM', description: 'Dr. Sarah Johnson checked in patient #1042' },
          { time: '10:15 AM', description: 'Blood sample collected for patient #890' },
          { time: '11:30 AM', description: 'New appointment scheduled for tomorrow' },
          { time: '12:45 PM', description: 'Medication dispensed from pharmacy' },
          { time: '02:00 PM', description: 'Emergency room patient admitted to Ward 3' }
        ]);
      }
      setLoading(prev => ({ ...prev, activities: false }));

      // Fetch announcements
      setLoading(prev => ({ ...prev, announcements: true }));
      try {
        const announcementsData = await dashboardApi.getAnnouncements();
        setAnnouncements(announcementsData);
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          handleApiError(error, 'Authentication error');
          return;
        }
        console.error('Error fetching announcements:', error);
        // Use fallback data
        setAnnouncements([
          { 
            title: 'System Maintenance', 
            message: 'The system will be down for maintenance on Sunday from 2-4 AM.',
            urgent: false
          },
          {
            title: 'COVID-19 Protocol Update',
            message: 'New protocols for COVID-19 screening will be effective starting next week.',
            urgent: true
          },
          {
            title: 'Staff Meeting',
            message: 'Monthly staff meeting scheduled for this Friday at 9:00 AM in Conference Room A.',
            urgent: false
          }
        ]);
      }
      setLoading(prev => ({ ...prev, announcements: false }));
    };

    fetchDashboardData();
  }, [navigate]);

  if (error && error.includes('session has expired')) {
    return (
      <div className="auth-error-container">
        <div className="auth-error-message">
          <h2>{error}</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {error && <div className="error-banner">{error}</div>}
      
      <div className="dashboard-header">
        <div className="header-title">
          <h1>Hospital Dashboard</h1>
          <p className="subtitle">Welcome back, {hospitalProfile.name || 'Admin'} | {getCurrentDate()}</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn theme-toggle" onClick={toggleTheme}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
      
      <div className="stats-grid">
        <StatCard 
          title="Total Doctors" 
          value={stats.doctors} 
          icon={<FaUserMd />} 
          color="blue" 
        />
        <StatCard 
          title="Active Patients" 
          value={stats.patients} 
          icon={<FaUserInjured />} 
          color="green" 
        />
        <StatCard 
          title="Available Beds" 
          value={stats.beds} 
          icon={<FaBed />} 
          color="orange" 
        />
        <StatCard 
          title="Blood Units" 
          value={stats.bloodUnits} 
          icon={<FaVial />} 
          color="red" 
        />
      </div>
      
      <div className="dashboard-profile-section">
        <HospitalProfileCard 
          hospital={hospitalProfile}
          isLoading={loading.hospital}
        />
      </div>
      
      <div className="dashboard-grid">
        <BloodInventoryCard 
          bloodInventory={bloodInventory} 
          isLoading={loading.blood} 
        />
        <RecentActivity 
          activities={recentActivities} 
          isLoading={loading.activities} 
        />
      </div>
      
      <div className="dashboard-grid">
        <QuickAccess />
        <AnnouncementsCard 
          announcements={announcements} 
          isLoading={loading.announcements} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
