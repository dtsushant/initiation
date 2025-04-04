import React, { memo, useState, useEffect } from 'react';
import { Page } from '/@/components/common/Page';
import { Form, Input, Button, Checkbox, message } from 'antd';
import {
  EyeInvisibleOutlined,
  LockOutlined,
  MailOutlined,
  LoginOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import logo from '../../assets/initiationLogo.svg';
import { ForgotPasswordModal } from '/@/components/common/modal/ForgotPasswordModal';
import { setLocalStorage } from '/@/utils/storage';
import { JWT_TOKEN } from '/@/constants';
import useApiCall from '/@/hooks/userAPICall';
import { useNavigate, useLocation } from 'react-router-dom';
import { showToast } from '/@/utils/toast';

interface LoginRequestDetail {
  email: string;
  password: string;
}

interface LoginResponseDetail {
  user:{
    bio:string;
    email:string;
    image:string;
    username:string;
    token:string;
  }
}

export const LoginPage = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || '/dashboard';
  const [ form] = Form.useForm();
  // const [loginDetail, setLoginDetail] = useState<LoginRequestDetail | null>(
  //   null
  // );
  const [formFocused, setFormFocused] = useState<string | null>(null);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);

  const onFinish = (values: { email: string; password: string }) => {
    makeApiCall({ user: values });
  };

  // const onFinish = (values: { email: string; password: string }) => {
  //   loginUser({ user: values }); // call API directly
  // };

  const handleFocus = (field: string) => {
    setFormFocused(field);
  };

  const handleBlur = () => {
    setFormFocused(null);
  };

  const showForgotPasswordModal = () => {
    setForgotPasswordVisible(true);
  };

  const hideForgotPasswordModal = () => {
    setForgotPasswordVisible(false);
  };

  const { loading,makeApiCall } = useApiCall<LoginRequestDetail,LoginResponseDetail>({
    endpoint: 'users/users/login',
    method: 'POST',
    onSuccess: (data:LoginResponseDetail) => {
      console.log("the data",data);
      const token = data?.user.token;
      console.log('the token',token)
      setLocalStorage(JWT_TOKEN, token);
      navigate(redirectPath, { replace: true });
    },
    onError: (error: any) => {
      showToast.error(error?.message || 'Something went wrong');
    },
  });

  return (
    <Page headerLess title="Login">
      <div className="flex min-h-screen overflow-hidden">
        {/* Left Column - Logo with animation */}
        <div className="w-1/2 bg-blue-600 flex items-center justify-center p-8">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
          >
            <img src={logo} alt="Logo" className="h-28 drop-shadow-lg" />
          </motion.div>
        </div>

        {/* Right Column - Login Form */}
        <div className="w-1/2 bg-neutral-100 flex items-center justify-center p-4 formbackground">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-[400px] w-full p-8 rounded-xl shadow-md relative overflow-hidden bg-white"
          >
            <motion.h1
              className="text-2xl font-bold mb-6 text-center text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Welcome back 👋
            </motion.h1>

            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              layout="vertical"
              initialValues={{ remember: false }}
              size="large"
              className="space-y-6"
            >
              {/* Email */}
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email.' },
                  { type: 'email', message: 'Invalid email' },
                ]}
              >
                <Input
                  autoComplete="off"
                  prefix={
                    <MailOutlined
                      className={`mr-2 ${formFocused === 'email' ? 'text-primary' : 'text-gray-400'
                        }`}
                    />
                  }
                  className={`h-12 rounded-lg transition-all duration-300 ${formFocused === 'email'
                      ? 'border-blue-500 shadow-sm shadow-blue-200'
                      : 'border-gray-300 hover:border-blue-500'
                    }`}
                  placeholder="Email"
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                />
              </Form.Item>

              {/* Password */}
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please enter your password.' }]}
              >
                <Input.Password
                  prefix={
                    <LockOutlined
                      className={`mr-2 ${formFocused === 'password'
                          ? 'text-primary'
                          : 'text-gray-400'
                        }`}
                    />
                  }
                  className={`h-12 rounded-lg transition-all duration-300 ${formFocused === 'password'
                      ? 'border-blue-500 shadow-sm shadow-blue-200'
                      : 'border-gray-300 hover:border-blue-500'
                    }`}
                  placeholder="Password"
                  iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                  onFocus={() => handleFocus('password')}
                  onBlur={handleBlur}
                />
              </Form.Item>

              {/* Remember Me + Forgot Password */}
              <div className="flex justify-between items-center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <div
                  className="text-sm text-blue-600 cursor-pointer hover:underline"
                  onClick={showForgotPasswordModal}
                >
                  Forgot password?
                </div>
              </div>

              {/* Submit Button */}
              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full h-12 rounded-lg text-base font-medium flex items-center justify-center bg-primary text-white hover:bg-blue-700 transition-all"
                  loading={loading}
                  disabled={loading}
                  icon={!loading && <LoginOutlined className="mr-2" />}
                >
                  {loading ? 'Please wait...' : 'Login'}
                </Button>
              </Form.Item>
            </Form>
          </motion.div>
        </div>
      </div>

      <ForgotPasswordModal
        isVisible={forgotPasswordVisible}
        onClose={hideForgotPasswordModal}
      />
    </Page>

  );
});

LoginPage.displayName = 'LoginPage';
