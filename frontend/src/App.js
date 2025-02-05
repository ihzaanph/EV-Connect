import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import EVUserDashboard from './components/EvuserDashboard';
import AdminDashboard from './components/AdminDashboard';
import StationOperatorDashboard from './components/OperatorDashboard';
import {BrowserRouter as Router ,Routes,Route} from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route  path= "/" element= {<Login/>}/>
        <Route  path= "/admin-dashboard" element= {<AdminDashboard/>}/>
        <Route  path= "/ev-dashboard" element= {<EVUserDashboard/>}/>
        <Route  path= "/station-dashboard" element= {<StationOperatorDashboard/>}/>
      </Routes>
    </Router>

  );
}

export default App;
