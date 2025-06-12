import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AppRoutes from './router/Router';
import { getLoginUserInformation } from './store/auth';
import type { AppDispatch } from './store/redux';
import { tokenService } from './services/tokenService';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const setLogin = async () => {
      if (tokenService.hasValidToken()) {
        try {
          await dispatch(getLoginUserInformation()).unwrap();
        } catch (e) {
          // Token invalid/expired, will be handled by RequireAuth or axios interceptor
          tokenService.removeTokens();
        }
      }
    }
    setLogin();
  }, [dispatch]);

  return (
    <div>
      <AppRoutes />
    </div>
  )
}

export default App
