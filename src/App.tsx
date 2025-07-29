import { MessageProvider } from '@layout/MessageProvider';
import AppRoutes from '@router/Router';
import { registerUnauthorizedHandler, unregisterUnauthorizedHandler } from '@services/api';
import { tokenService } from '@services/tokenService';
import { getLoginUserInformation, resetAuthState } from '@store/auth';
import type { AppDispatch } from '@store/redux';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const setLogin = useCallback(async () => {
    if (tokenService.hasValidToken()) {
      try {
        console.log('Token exists, fetching user info...');
        const result = await dispatch(getLoginUserInformation()).unwrap();
        console.log('User info fetched successfully:', result);
      } catch (e) {
        console.error('Error fetching user info:', e);
        // Token invalid
        tokenService.removeTokens();
      }
    } else {
      console.log('No valid token found');
    }
  }, [dispatch]);

  useEffect(() => {
    setLogin();
  }, [setLogin]);

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
