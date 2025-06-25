import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import LogoTitle from '../../../assets/images/logotitle.png';
import TextField from "../../../components/input/TextField";
import Button from "../../../components/Button";
import LinkText from "../../../components/LinkText";
import Text from "../../../components/Text";
import type { StepComponentProps } from "../../../layout/MultiStepForm";
import { RegisterValidation } from "../../../provider/validation/AuthValidation";
import { handleWatchRegisterForm, userRegister } from "../../../store/auth";
import type { AppDispatch, RootState } from "../../../store/redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const RegisterForm = ({ onNext }: StepComponentProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { registerForm } = useSelector((state: RootState) => state.auth.form.register)
    const methods = useForm({
        mode: "onBlur",
        shouldFocusError: true,
        defaultValues: {
            email: registerForm.email ?? "",
            password: registerForm.password ?? "",
            username: registerForm.username ?? "",
            nickname: registerForm.nickname ?? "",
        },
        resolver: yupResolver(RegisterValidation),
    });
    const { control, getValues, setError, trigger, watch, formState: { errors } } = methods;

    useEffect(() => {
        watch((e) => dispatch(handleWatchRegisterForm(JSON.stringify(e))));
    }, [watch]);

    const handleSubmit = () => {
        trigger().then(async (isValid) => {
            if (!isValid) {
                console.log(errors);
                return;
            }
            const data = getValues();
            console.log("Register Data", data);
            try {
                const res = await dispatch(userRegister(data)).unwrap();
                console.log("Success register:", res);
                navigate('/');
                // onNext?.();
            } catch (e: any) {
                console.error("Error call register api: ", e);
                if (e?.errors) {
                    Object.entries(e.errors).forEach(([field, messages]) => {
                        setError(field as keyof typeof data, {
                            type: "server",
                            message: (messages as string[]).join(", "),
                        });
                    });
                } else {
                    const errorMsg = typeof e === "string"
                        ? e
                        : e?.message || e?.error || "Đã xảy ra lỗi. Vui lòng thử lại.";
                    setError("email", {
                        type: "server",
                        message: errorMsg,
                    });
                }
            }
        }).catch((err) => {
            console.log("Trigger error:", err);
        });
    };

    return (
        <div className="max-w-sm mx-auto bg-white rounded p-8 space-y-4">
            <div className="w-full flex justify-center">
                <img
                    src={LogoTitle}
                    alt="Linksphere Logo"
                    className="h-12 transition-opacity duration-300 w-auto"
                    style={{ objectFit: 'contain' }}
                />
            </div>
            <TextField
                name="email"
                type="text"
                control={control}
                label="Email"
                placeholder="Nhập email"
            />
            <TextField
                name="password"
                type="password"
                control={control}
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
            />
            <TextField
                name="nickname"
                type="text"
                control={control}
                label="Tên đầy đủ"
                placeholder="Nhập tên bạn"
            />
            <TextField
                name="username"
                type="text"
                control={control}
                label="Tên người dùng"
                placeholder="username_123"
            />
            <Text type="caption" className="block text-center">
                Bằng cách đăng ký, bạn đồng ý với{" "}
                <LinkText to="#" className="text-blue-500 font-medium">
                    Điều khoản
                </LinkText>
                {" "} và {" "}
                <LinkText to="#" className="text-blue-500 font-medium">
                    Chính sách quyền riêng tư
                </LinkText>
                {" "}
                của chúng tôi.
            </Text>
            <Button type="submit" onClick={handleSubmit}>
                Đăng ký
            </Button>
            <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="flex-1 h-px bg-gray-300" />
                HOẶC
                <div className="flex-1 h-px bg-gray-300" />
            </div>
            <Text type="body" className="block text-center">
                Bạn có tài khoản?{" "}
                <LinkText to="/login" className="text-blue-500 font-medium">
                    Đăng nhập
                </LinkText>
            </Text>
        </div>
    );
};

export default RegisterForm;
