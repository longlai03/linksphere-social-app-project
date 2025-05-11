import { useRef, useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import LoginImage from "../../assets/images/logotitle.png";

const Login = () => {
    const formRef = useRef<HTMLDivElement>(null);
    const [formHeight, setFormHeight] = useState<number | null>(null);

    useEffect(() => {
        if (formRef.current) {
            setFormHeight(formRef.current.clientHeight);
        }
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div
                className="hidden lg:block w-1/2"
                style={{ height: formHeight ? `${formHeight}px` : "auto" }}
            >
                <img
                    src={LoginImage}
                    alt="Linksphere ShowcaseShow"
                    className="h-full w-full object-cover rounded-md"
                />
            </div>
            <div
                ref={formRef}
                className="w-full max-w-sm bg-white p-8 rounded-md shadow"
            >
                <LoginForm />
            </div>
        </div>
    );
};

export default Login;
