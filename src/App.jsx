import { useState, useEffect, useAuth } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import DashLayout from './layouts/DashLayout';

import BloodBankPage from './pages/BloodBankPage/BloodBankPage';
import AboutPage from './pages/AboutPage/AboutPage';
import ContactPage from './pages/ContactPage/ContactPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import HomePage from './pages/Homepage/Homepage';
import DoctorsPage from './pages/DoctorsPage/DoctorsPage';
import HospitalsPage from './pages/HospitalsPage/HospitalsPage';

import Navbar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import Dashboard from './DashPages/Dashboard/Dashboard';
import DashBloodBank from './DashPages/DashBloodBank/DashBloodBank';
import DashDoctors from './DashPages/DashDoctors/DashDoctors';
import Dashbeds from './DashPages/DashBeds/Dashbeds';
import AddDoctorForm from './components/AddDoctorForm/AddDoctorForm';
import BedDetailForm from './components/BedDetailForm/BedDetailForm';
import HospitalSignUp from './pages/HospitalSignUp/HospitalSignUp';
import DoctorSignUp from './pages/DoctorSIgnUp/DoctorSignUp';
import ProfilePage from './DoctorProfilePages/ProfilePage/ProfilePage';
import BloodBankDetailPage from './pages/BloodBankDetailPage/BloodBankDetailPage';
import HospitalDetailsPage from './pages/HospitalDetailsPage/HospitalDetailsPage';
import DoctorDetailsPage from './pages/DoctorDetailsPage/DoctorDetailsPage';
import PrivateRoute from './components/PrivateRoute.jsx';

import HospitalProfilePage from './pages/HospitalProfilePage/HospitalProfilePage';
import DoctorProfilePage from './pages/DoctorProfilePage/DoctorProfilePage';
import BedsDetailPage from './pages/BedsPage/BedsPage';
import BedsPage from './pages/BedsPage/BedsPage';
import Pharmacy from './DashPages/Pharmacy/Pharmacy';
import NonMedicalStaff from './DashPages/NonMedicalStaff/NonMedicalStaff';
import EditProfile from './DashPages/DashProfile/EditProfile';

// New components
import BloodBank from './DashPages/BloodBank/BloodBank';
import HospitalDoctors from './DashPages/HospitalDoctors/HospitalDoctors';
import Beds from './DashPages/Beds/Beds';
import PharmacyPage from './pages/PharmacyPage/PharmacyPage';
import HospitalDoctorsPage from './pages/HospitalDoctorsPage/HospitalDoctorsPage';

import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions/TermsConditions';
import CookiePolicy from './pages/CookiePolicy/CookiePolicy';

const App = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState(null);

    // Check authentication status on app load
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserType = localStorage.getItem('userType');

        if (token) {
        setIsLoggedIn(true);
        setUserType(storedUserType || 'doctor'); // Default to doctor if not available
        }
    }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userType={userType} />
      <main>
        <Routes>
          {/* User routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/hospitals" element={<HospitalsPage />} />
          <Route path="/hospitals/:id" element={<HospitalDetailsPage />} />
          <Route path="/blood-bank" element={<BloodBankPage />} />
          <Route path="/beds" element={<BedsPage/>} />
          <Route path="/pharmacy" element={<PharmacyPage />} />
          <Route path="/hospital-doctors" element={<HospitalDoctorsPage />} />
          <Route path="/blood-bank/:bloodGroup" element={<BloodBankDetailPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctors/:id" element={<DoctorDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUserType={setUserType} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/hospitalsignup" element={<HospitalSignUp />} />
          <Route path="/signup/doctorsignup" element={<DoctorSignUp />} />

          <Route path="/profile/hospital/:id" element={<HospitalProfilePage />} />
          <Route path="/profile/doctor/:id" element={<DoctorProfilePage />} />

          {/* Private Routes */}
          <Route path="/profile" element={<ProfilePage />}/>

          {/* Dash routes - original working routes */}
          <Route path="/dashboard" element={<PrivateRoute><DashLayout><Dashboard /></DashLayout></PrivateRoute>} />
          <Route path="/dashboard/dashbloodbank" element={<PrivateRoute><DashLayout><DashBloodBank /></DashLayout></PrivateRoute>} />
          <Route path="/dashboard/dashdoctors" element={<PrivateRoute><DashLayout><DashDoctors /></DashLayout></PrivateRoute>} />
          <Route path="/dashboard/dashbeds" element={<PrivateRoute><DashLayout><Dashbeds /></DashLayout></PrivateRoute>} />
          
          {/* Enhanced components */}
          <Route path="/dashboard/bloodbank" element={<PrivateRoute><DashLayout><BloodBank /></DashLayout></PrivateRoute>} />
          <Route path="/dashboard/hospitaldoctors" element={<PrivateRoute><DashLayout><HospitalDoctors /></DashLayout></PrivateRoute>} />
          <Route path="/dashboard/beds" element={<PrivateRoute><DashLayout><Beds /></DashLayout></PrivateRoute>} />
          <Route path="/dashboard/pharmacy" element={<PrivateRoute><DashLayout><Pharmacy /></DashLayout></PrivateRoute>} />
          <Route path="/dashboard/nonmedicalstaff" element={<PrivateRoute><DashLayout><NonMedicalStaff /></DashLayout></PrivateRoute>} />
          <Route path="/dashboard/editprofile" element={<PrivateRoute><DashLayout><EditProfile /></DashLayout></PrivateRoute>} />
          
          <Route path="/dashboard/doctors/adddoctorform" element={<PrivateRoute><DashLayout><AddDoctorForm /></DashLayout></PrivateRoute>} />
          <Route path="/dashboard/doctors/bedetailsform" element={<PrivateRoute><DashLayout><BedDetailForm /></DashLayout></PrivateRoute>} />
          <Route path="/dashboard/beds/:bedType" element={<BedsDetailPage />} />

          {/* New policy routes */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/cookies" element={<CookiePolicy />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};


export default App;
