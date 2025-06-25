import { LockOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store/redux';
import { resetForgotPasswordState, clearAuthError, setForgotPasswordStep } from '../../store/auth';
import type { AppDispatch } from '../../store/redux';
import MultiStepForm from '../../layout/MultiStepForm';
import EmailForm from './components/EmailForm';
import VerifyCodeForm from './components/VerifyCodeForm';
import ResetPasswordForm from './components/ResetPasswordForm';

const ForgotPassword = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { step } = useSelector((state: RootState) => state.auth.form.forgotPassword);
    const { error } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        return () => {
            dispatch(resetForgotPasswordState());
            dispatch(clearAuthError());
        };
    }, [dispatch]);

    const handleNext = () => {
        dispatch(setForgotPasswordStep(step + 1));
        dispatch(clearAuthError());
    };

    const handleBack = () => {
        if (step > 0) {
            dispatch(setForgotPasswordStep(step - 1));
            dispatch(clearAuthError());
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="max-w-sm mx-auto bg-white p-8 rounded text-center space-y-4">
                <div className="flex justify-center">
                    <LockOutlined />
                </div>
                <MultiStepForm
                    steps={[
                        <EmailForm />,
                        <VerifyCodeForm />,
                        <ResetPasswordForm />
                    ]}
                    step={step}
                    onNext={handleNext}
                    onBack={handleBack}
                />
            </div>
        </div>
    );
};

export default ForgotPassword;
