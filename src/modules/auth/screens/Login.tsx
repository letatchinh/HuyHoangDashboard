import { Button, Form, Input } from "antd";
import { omit } from "lodash";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WhiteBox from "~/components/common/WhiteBox";
import AuthModule from "~/modules/auth";
import { AUTH, PATH_APP } from "~/routes/allPath";
import { useLogin } from "../auth.hook";

type FieldType = {
  userName: string;
  password: string;
};
export default function Login() {
  const {pathname} = useLocation();
  const [isLoading, onLogin] = useLogin();
  const token = AuthModule.hook.useToken();
  // const adapter = AuthModule.hook.useAdapter();
  const navigate = useNavigate();
  const refPersist =useMemo(()=>JSON.parse(localStorage.getItem('persist:auth')??JSON.stringify({'token':'null'})),[pathname]);
  useEffect(() => {
    if (token) {
        navigate(PATH_APP.main.root);
    } else {
      if (pathname !== AUTH.login) navigate(AUTH.login);
    };
  }, [token, navigate, refPersist, pathname]);
  
  const onFinish = (values: any) => {
    onLogin(omit(values, ["remember"]));
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="auth--login">
      <div className="auth--login__logo">
        {/* <img src={logoLight} alt="logo-light" /> */}
      </div>
      <WhiteBox className="auth--login__box">
        <h5 className="auth--login__welcome">Welcome Back !</h5>
        <p style={{ color: "#74788d" }}>Đăng nhập để vào trang Dashboard</p>
        <Form
          className="auth--login__form"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Tên đăng nhập"
            name="userName"
            rules={[{ required: true, message: "Vui lòng nhập tài khoản" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              loading={isLoading}
              className="mt-3"
              size="large"
              block
              type="primary"
              htmlType="submit"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </WhiteBox>
    </div>
  );
}
