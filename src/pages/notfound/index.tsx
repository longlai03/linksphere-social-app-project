import Text from "../../provider/layout/components/Text";
import LinkText from "../../provider/layout/components/LinkText";
const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-4">
            <Text type="h1">404 Not Found</Text>
            <Text>
                Liên kết bạn theo dõi có thể bị hỏng hoặc trang này có thể đã bị gỡ.{" "}
                <LinkText to="/">Quay lại trang chủ.</LinkText>
            </Text>
            <div className="flex gap-4">
                <LinkText to="/login">Đăng nhập</LinkText>
                <LinkText to="/register">Đăng ký</LinkText>
            </div>
        </div>
    );
};

export default NotFound;
