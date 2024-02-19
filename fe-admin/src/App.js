import './App.css';
import { LoginForm } from './pages/Login/LoginForm';
import { Home } from './pages/Home/Home';
import { Event } from './pages/Event/Event'
import { User } from './pages/User/User'
import { Dashboard } from './pages/Dashboard/Dashboard';

import { Routes, Route } from 'react-router-dom'
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <div className='AppMain'>
      <Routes>
        <Route path='/' element={<RequireAuth><Home></Home></RequireAuth>}></Route>
        <Route path='/dashboard' element={<RequireAuth><Dashboard></Dashboard></RequireAuth>}></Route>
        <Route path='/event' element={<RequireAuth><Event></Event></RequireAuth>}></Route>
        <Route path='/user' element={<RequireAuth><User></User></RequireAuth>}></Route>
        <Route path='/login' element={<RequireAuth><LoginForm></LoginForm></RequireAuth>}></Route>
      </Routes>
    </div>
  );
}

export default App;
