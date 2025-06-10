import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AppRoutes from './router/Router';
import { getLoginUserInformation, setUserTokenFromLocalStorage } from './store/auth';
import type { AppDispatch } from './store/redux';
function App() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const setLogin = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        dispatch(setUserTokenFromLocalStorage(token));
        try {
          await dispatch(getLoginUserInformation(token)).unwrap();
        } catch (e) {
          // Token invalid/expired, will be handled by RequireAuth or axios interceptor
        }
      }
    }
    setLogin();
  }, []);
  return (
      <div className='w-full h-full'>
        <AppRoutes />
      </div>
  )
}

export default App
