import { Button, Form, Input, Space } from "antd";
import { omit } from "lodash";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoLight from "~/assets/images/logo-light.png";
import WhiteBox from "~/components/common/WhiteBox";
import AuthModule from "~/modules/auth";
import { PATH_APP } from "~/routes/allPath";
import { useLogin } from "../auth.hook";

type FieldType = {
  login: string;
  password: string;
  remember?: string;
};
export default function LoginSeller() {
  const [isLoading, onLogin] = useLogin();
  const token = AuthModule.hook.useToken();
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      navigate(PATH_APP.main.root);
    } else {
      navigate(PATH_APP.auth.loginSeller);
    }
  }, [token, navigate]);
  const onFinish = (values: any) => {
    onLogin(omit(values, ["remember"]));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="auth--login">
      <div className="auth--login__logo">
        <img src={logoLight} alt="logo-light" />
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
            name="login"
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
          <Space style={{ width: "100%" , marginTop: "10px", display: "flex", justifyContent: "center"}}>
            <span>Bạn là người quản lý?</span>
            <Button onClick={() => navigate(PATH_APP.auth.login)} target="_blank" type = 'link'>Đăng nhập tại đây</Button>
          </Space>
        </Form>
      </WhiteBox>
    </div>
  );
}
