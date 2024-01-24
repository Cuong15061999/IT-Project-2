import './App.css';
import { LoginForm } from './pages/Login/LoginForm';
import { Home } from './pages/Home/Home';
import { Event } from './pages/Event/Event'
import { User } from './pages/User/User'
import { Dashboard } from './pages/Dashboard/Dashboard';

import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className='AppMain'>
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/Dashboard' element={<Dashboard></Dashboard>}></Route>
        <Route path='/Event' element={<Event></Event>}></Route>
        <Route path='/User' element={<User></User>}></Route>


        <Route path='/Login' element={<LoginForm></LoginForm>}></Route>
      </Routes>
    </div>
  );
}

export default App;
