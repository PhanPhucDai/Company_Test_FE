import { Routes, Route } from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import PostManagement from './pages/postmanament';

const App = () => {
  return (
    <Routes>
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/' element={<Login />} />
      <Route path='/postmanagement' element={<PostManagement />} />
    </Routes>
  );
};

export default App;
