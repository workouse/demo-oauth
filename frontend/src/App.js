import Login from  './components/Login.jsx';
import UserInfo from './components/UserInfo.jsx';
import './App.css';

import {useEffect, useState} from 'react';

function App() {
  let [user,setUser]=useState(null);
    useEffect(()=>{
        fetch('/users/me')
            .then(res=>{
                if(res.status===401){
                    return null;
                }
                return res.json()
            })
            .then(user=>{
                setUser(user)
            });
    },[]);
  return (
    <div className="App">
      <header className="App-header">
        <p>
            Demo Oauth application
        </p>
        {user ? <UserInfo user={user}/> : <Login/>}
      </header>
    </div>
  );
}

export default App;
