import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './router/Router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getUser, setUserTokenFromLocalStorage } from './store/auth';
import type { AppDispatch } from './store/redux';
function App() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setUserTokenFromLocalStorage(token));
      dispatch(getUser(token));
    }
  }, []);
  return (
    <BrowserRouter>
      <div className='w-full h-full'>
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App
