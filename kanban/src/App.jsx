
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { LoginPage } from './component/Login'
import { RegisterPage } from './component/Register'
import { LoginPage } from './component/Login';
import KanbanBoard from './Pages/Board';
import { UserProvider } from './Storage/Token';
import CreateBoard from './Pages/CreateBoard';
import BoardPage from './Pages/Dashboard';

import HomePage from './Pages/Home';
import Navbar from './component/navbar';


function App() {


  return (
    <div>
      <UserProvider>
      
      <BrowserRouter>
  
<Routes>
  <Route path='/' element={<HomePage/>}></Route>
  <Route path='/register' element={ <RegisterPage/>}></Route>
  <Route path='/loginpage' element={<LoginPage/>}></Route>
  <Route path='/Board' element={<KanbanBoard/>}></Route>
  <Route path='/createBoard' element={<CreateBoard/>}></Route>
  <Route path='/dashboard' element={<BoardPage/>}></Route>
</Routes>

</BrowserRouter>
      </UserProvider>


    </div>
   
   
  )
}

export default App
