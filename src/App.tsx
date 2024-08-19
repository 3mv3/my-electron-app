import logo from './images/logo.svg';
import './App.css';
import { Text, Button } from 'react-aria-components';
import { useEffect, useState } from 'react';
import {
  Route,
  Routes,
  useNavigate,
  useLocation
} from "react-router-dom";
import ProgressPage from './pages/ProgressPage';
import AdminPage from './pages/AdminPage';
import AddTabModal from './pages/AddTabModal';

function App() {
  const [title, setTitle] = useState('Landing Page')
  const [nextPage, setNextPage] = useState('/admin')
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname == '/') {
      setTitle('Landing Page')
      setNextPage('/admin')
    }
    else {
      setTitle('Admin')
      setNextPage('/')
    }
  }, [location.pathname])

  return (
    <div className="App">
      <header className="App-header">
        <div style={{position: 'fixed', 
          height: '48%', 
          width: '98%', 
          margin: '1%', 
          top: '0', 
          left: '0', 
          outline: '2px dashed blue', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'stretch'}}>
            <Text>{title}</Text>
              <img src={logo} className="App-logo" alt="logo" />
            <Button style={{ position: 'fixed' }} onPress={(e:any) => navigate(nextPage)}>{title == 'Admin' ? 'Back' : 'Admin'}</Button>
        </div>
        <div style={{ position: 'fixed', 
          bottom: '0px', 
          margin: '1%', 
          outline: '2px dashed red', 
          width: '98%', 
          height: '48%', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'stretch'}}>
              <Routes>
                <Route path="/" Component={ProgressPage} />
                <Route path="/admin" Component={AdminPage} />
                <Route path="/addtab" Component={AddTabModal} />
              </Routes>
        </div>
      </header>
    </div>
  );
}

export default App;