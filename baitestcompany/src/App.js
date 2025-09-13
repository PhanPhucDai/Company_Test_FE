import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import PostManagement from './pages/PostManament';

const App = () => {
  return (
    <Routes>
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/postmanagement' element={<PostManagement />} />
    </Routes>
  );
};

export default App;
