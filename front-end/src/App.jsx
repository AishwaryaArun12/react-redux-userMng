import { useState } from 'react'
import Signup from './components/signup';
import Login from './components/login';
import Home from './components/home';
import {BrowserRouter as Router,Routes, Route} from 'react-router-dom'
import Admin from './components/admin';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Routes>
        <Route exact path='/signup' element={<Signup />}/>
      </Routes>
      <Routes>
        <Route path='/login' element={<Login />}/>
      </Routes>
      <Routes>
        <Route path='/' element={<Home />}/>
      </Routes>
      <Routes>
        <Route path='/admin' element={<Admin />}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
