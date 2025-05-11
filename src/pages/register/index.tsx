import OTPForm from "./components/OtpForm";
import RegisterForm from "./components/RegisterForm";
import MultiStepForm from "../../provider/layout/MultiStepForm";

const Register = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <MultiStepForm
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