import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AppRoutes from './router/Router';
import { getLoginUserInformation, resetAuthState } from './store/auth';
import type { AppDispatch } from './store/redux';
import { tokenService } from './services/tokenService';
import { MessageProvider } from './provider/layout/MessageProvider';
import { registerUnauthorizedHandler, unregisterUnauthorizedHandler } from './services/api';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const setLogin = async () => {
      if (tokenService.hasValidToken()) {
        try {
          console.log('Token exists, fetching user info...');
          const result = await dispatch(getLoginUserInformation()).unwrap();
          console.log('User info fetched successfully:', result);
        } catch (e) {
          console.error('Error fetching user info:', e);
          // Token invalid/expired, will be handled by RequireAuth or axios interceptor
          tokenService.removeTokens();
        }
      } else {
        console.log('No valid token found');
      }
    }
    setLogin();
  }, [dispatch]);

  // Register unauthorized handler
  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch(resetAuthState());
      navigate('/login');
    };

    registerUnauthorizedHandler(handleUnauthorized);
    return () => unregisterUnauthorizedHandler(handleUnauthorized);
  }, [dispatch, navigate]);

  return (
    <MessageProvider>
      <AppRoutes />
    </MessageProvider>
  )
}

export default App
