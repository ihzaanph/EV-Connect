import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import EVUserDashboard from './components/EvuserDashboard';
import AdminDashboard from './components/AdminDashboard';
import StationOperatorDashboard from './components/OperatorDashboard';
import StationMap from "./components/StationMap";
import ManageStations from "./components/MangeStation";
import UpdateStation from "./components/UpdateStation"
import {BrowserRouter as Router ,Routes,Route} from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route  path= "/" element= {<Login/>}/>
        <Route  path= "/admin-dashboard" element= {<AdminDashboard/>}/>
        <Route  path= "/ev-dashboard" element= {<EVUserDashboard/>}/>
        <Route  path= "/station-dashboard" element= {<StationOperatorDashboard/>}/>
        <Route path="/stationmap" element={<StationMap />} />
        <Route path="/operator/manage-stations" element={<ManageStations />} />
        <Route path="/update-station/:id" element={<UpdateStation />} />
      </Routes>
    </Router>

  );
}

export default App;
