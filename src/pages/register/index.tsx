import MultiStepForm from "@layout/MultiStepForm";
import { handleRegisterChangeStep } from "@store/auth";
import type { RootState } from "@store/redux";
import { useDispatch, useSelector } from "react-redux";
import OTPForm from "./components/OtpForm";
import RegisterForm from "./components/RegisterForm";

const Register = () => {
  const dispatch = useDispatch();
  const { step } = useSelector((state: RootState) => state.auth.form.register)
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <MultiStepForm
        step={step}
        onNext={() => dispatch(handleRegisterChangeStep(step + 1))}
        onBack={() => dispatch(handleRegisterChangeStep(step - 1))}
        steps={[
          <RegisterForm key="register" />,
          <OTPForm key="otp" />,
        ]}
        onComplete={() => console.log("Đăng ký hoàn tất!")}
      />
    </div>

  )
}
export default Register;