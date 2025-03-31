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
      <div className="flex justify-center items-center h-full custom-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-[400px] md:min-w-[440px] p-8 mb-4 rounded-xl shadow-md relative overflow-hidden bg-neutral-1"
        >
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-5 bg-primary" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full opacity-5 bg-emeraldgreen-6" />
          <div className="relative">
            <motion.div
              className="flex justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            >
              <img src={logo} height="100" alt="Logo" className="h-16" />
            </motion.div>

            <motion.h1
              className="text-2xl font-bold mb-6 text-center text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Login to your account
            </motion.h1>

            <Form
              form={form}
              name="login"
              initialValues={{ remember: false }}
              onFinish={onFinish}
              layout="vertical"
              className="space-y-8"
              size="large"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Required' },
                    { type: 'email', message: 'Invalid email' },
                  ]}
                  className="mb-6"
                >
                  <Input
                    autoComplete="off"
                    prefix={
                      <MailOutlined
                        className={`mr-2 ${
                          formFocused === 'email'
                            ? 'text-primary'
                            : 'text-gray-400'
                        }`}
                      />
                    }
                    className={`h-12 rounded-lg transition-all duration-300 ${
                      formFocused === 'email'
                        ? 'border-brightorange-2 shadow-sm shadow-orange-100'
                        : 'border-gray-300 hover:border-brightorange-2 transition-colors'
                    }`}
                    placeholder="Email address"
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Required' }]}
                  className="mb-6"
                >
                  <Input.Password
                    prefix={
                      <LockOutlined
                        className={`mr-2 ${
                          formFocused === 'password'
                            ? 'text-primary'
                            : 'text-gray-400'
                        }`}
                      />
                    }
                    className={`h-12 rounded-lg transition-all duration-300 ${
                      formFocused === 'password'
                        ? 'border-brightorange-2 shadow-sm shadow-orange-100'
                        : 'border-gray-300 hover:border-brightorange-2 transition-colors'
                    }`}
                    placeholder="Password"
                    iconRender={(visible) =>
                      visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                    }
                    onFocus={() => handleFocus('password')}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </motion.div>

              <motion.div
                className="flex justify-between items-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-neutral-11 custom-checkbox">
                    Remember me
                  </Checkbox>
                </Form.Item>
                <div
                  className="text-sm text-blue-7 transition-colors duration-300 cursor-pointer hover:text-blue-5"
                  onClick={showForgotPasswordModal}
                >
                  Forgot password?
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Form.Item className="mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={`w-full h-12 rounded-lg text-base font-medium flex items-center justify-center bg-primary text-white transition-all duration-300 transform hover:bg-brightorange-6 hover:scale-[1.02] hover:shadow-md`}
                    loading={loading}
                    disabled={loading}
                    icon={loading ? null : <LoginOutlined className="mr-2" />}
                  >
                    {loading ? 'Please wait...' : 'Login'}
                  </Button>
                </Form.Item>
              </motion.div>
            </Form>
          </div>
        </motion.div>
      </div>
      <ForgotPasswordModal
        isVisible={forgotPasswordVisible}
        onClose={hideForgotPasswordModal}
      />
    </Page>
  );
});

LoginPage.displayName = 'LoginPage';
