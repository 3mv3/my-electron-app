import logo from './images/logo.svg';
import './App.css';
import DropDown from './components/DropDown'
import MyTab from './components/Tabs';
import { TableBody, Text, ProgressBar, Button, Modal, Dialog,Header } from 'react-aria-components';
import { useEffect, useState } from 'react';
import {
  HashRouter,
  Route
} from "react-router-dom";

function App() {
  const [adminView, setAdmin] = useState(false)
  const [isOpen, setOpen] = useState(false);
  const [file, setFile] = useState('')

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
            <Text>{adminView ? 'Admin' : 'Landing Page'}</Text>
              <img src={logo} className="App-logo" alt="logo" />
            <Button onClick={(e: any) => setAdmin(!adminView)}>{adminView ? 'Return' : 'Admin'}</Button>
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
{ !adminView && 
            <MyTab></MyTab>
        }
        { adminView && 
            <MyTab isAdmin></MyTab>
        }
  </div>
        
      </header>
    </div>
  );
}

export default App;
