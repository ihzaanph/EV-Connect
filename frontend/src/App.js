
import './App.css';
import Home from './components/homepage';
import Login from './components/Login';
import EVUserDashboard from './components/EvuserDashboard';
import AdminDashboard from './components/AdminDashboard';
import StationOperatorDashboard from './components/OperatorDashboard';
import StationMap from "./components/NearByStations";
import ManageStations from "./components/MangeStation";
import UpdateStation from "./components/UpdateStation"
import {BrowserRouter as Router ,Routes,Route} from 'react-router-dom'
import { UserProvider } from './context/UserContext';
import EditSlots from "./components/EditSlots";
import RequestsPage from "./components/Request";
import BookingPage from './components/Booking';
import ViewBookingEVUser  from './components/ViewBkEVuser';
import UpdateSlot from './components/UpdateSlotOpr'
import ViewStations from './components/ViewstationEVuser'
import ProfilePageEV from './components/ProfileEVuser'
import ViewBookingsOperator from './components/ViewBkOper'
import StationOperatorProfile from './components/ProfileOpr';
import FeedbackPage from './components/givefeedback';
import ViewFeedbackOperator from './components/Viewfeedback';

function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route  path= "/" element= {<Home/>}/>
        <Route  path= "/login" element= {<Login/>}/>
        <Route  path= "/admin-dashboard" element= {<AdminDashboard/>}/>
        <Route  path= "/ev-dashboard" element= {<EVUserDashboard/>}/>
        <Route  path= "/station-dashboard" element= {<StationOperatorDashboard/>}/>
        <Route path="/stationmap" element={<StationMap />} />
        <Route path="/operator/manage-stations" element={<ManageStations />} />
        <Route path="/update-station/:id" element={<UpdateStation />} />
        <Route path="/edit-slots/:id" element={<EditSlots />} />  
        <Route path="/admin/requests" element={<RequestsPage />} />
        <Route path="/book/:id" element={<BookingPage />} />
        <Route path="/viewbookingevuser" element={<ViewBookingEVUser />} />
        <Route path="/operator/update-slots" element={<UpdateSlot />} />
        <Route path="/viewstations" element={<ViewStations />} />
        <Route path='/profile' element={<ProfilePageEV/>} />
        <Route path='/operator/bookings' element={<ViewBookingsOperator/>} />
        <Route path='/operator/profile' element={<StationOperatorProfile/>} />
        <Route path='/feedback' element={<FeedbackPage/>} />
        <Route path='/operator/feedback' element={<ViewFeedbackOperator/>} />
      </Routes>
    </Router>
    </UserProvider>

  );
}

export default App;
