import { useStoreWithInitializer } from "/@/store/store.hook.ts";
import { dispatchOnCall, store } from "/@/store";
import {
  blurField,
  initializeLogin,
  LoginState,
  startLoginIn,
  updateErrors,
  updateField,
  updateFocus,
  updateForgotPasswordVisible,
} from "/@/pages/auth/login.slice.ts";
import { login } from "/@/services/auth.service.ts";
import { loadUserIntoApp } from "/@/types/auth.ts";
import { GenericForm } from "/@/components/GenericForm/GenericForm.tsx";
import { buildGenericFormField } from "/@/types/genericFormField.tsx";
import React from "react";
import { Page } from "/@/components/common/Page.tsx";
import logo from "/@/assets/initiationLogo.svg";
import { motion } from "framer-motion";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  LoginOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Form } from "antd";
import { ForgotPasswordModal } from "/@/components/common/modal/ForgotPasswordModal.tsx";

export function LoginPage() {
  const { errors, loginIn, user, focusField, forgotPasswordVisible } =
    useStoreWithInitializer(
      ({ login }) => login,
      dispatchOnCall(initializeLogin()),
    );
  const [form] = Form.useForm();
  const loading = false;

  const showForgotPasswordModal = () => {
    store.dispatch(updateForgotPasswordVisible(true));
  };

  const hideForgotPasswordModal = () => {
    store.dispatch(updateForgotPasswordVisible(false));
  };

  return (
    <Page headerLess title="Login">
      <div className="flex min-h-screen overflow-hidden">
        <div className="w-1/2 bg-blue-600 flex items-center justify-center p-8">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          >
            <img src={logo} alt="Logo" className="h-28 drop-shadow-lg" />
          </motion.div>
        </div>

        <div className="w-1/2 bg-neutral-100 flex flex-col items-center justify-center p-4 formbackground">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-[400px] w-full block p-8 rounded-xl shadow-md relative overflow-hidden bg-white"
          >
            <motion.h1
              className="text-2xl font-bold mb-6 text-center text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Welcome back 👋
            </motion.h1>
          </motion.div>
          <Form
            form={form}
            name="login"
            layout="vertical"
            initialValues={{ remember: false }}
            onFinish={signIn}
            size="large"
            className="space-y-6"
            onValuesChange={handleFormChange}
          >
            <GenericForm
              disabled={loginIn}
              formObject={user}
              submitButtonText="Sign in"
              errors={errors}
              onChange={onUpdateField}
              onSubmit={signIn}
              fields={[
                buildGenericFormField({
                  name: "email",
                  placeholder: "Email",
                  rules: [
                    { required: true, message: "Please enter your email." },
                    { type: "email", message: "Invalid email" },
                  ],
                  inputProps: {
                    autoComplete: "off",
                    prefix: (
                      <MailOutlined
                        className={`mr-2 ${
                          focusField === "email"
                            ? "text-primary"
                            : "text-gray-400"
                        }`}
                      />
                    ),
                    className:
                      "h-12 rounded-lg transition-all duration-300 border-gray-300 hover:border-blue-500",
                    onFocus: () => store.dispatch(updateFocus("email")),
                    onBlur: () => store.dispatch(blurField()),
                  },
                }),
                buildGenericFormField({
                  name: "password",
                  placeholder: "Password",
                  type: "password",
                  inputProps: {
                    prefix: (
                      <LockOutlined
                        className={`mr-2 ${
                          focusField === "password"
                            ? "text-primary"
                            : "text-gray-400"
                        }`}
                      />
                    ),
                    className: `h-12 rounded-lg transition-all duration-300 ${
                      focusField === "password"
                        ? "border-blue-500 shadow-sm shadow-blue-200"
                        : "border-gray-300 hover:border-blue-500"
                    }`,
                    iconRender: (visible) =>
                      visible ? <EyeOutlined /> : <EyeInvisibleOutlined />,
                    onFocus: () => store.dispatch(updateFocus("email")),
                    onBlur: () => store.dispatch(blurField()),
                  },
                }),
              ]}
            />

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

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 rounded-lg text-base font-medium flex items-center justify-center bg-primary text-white hover:bg-blue-700 transition-all"
                loading={loading}
                disabled={loading}
                icon={!loading && <LoginOutlined className="mr-2" />}
              >
                {loading ? "Please wait..." : "Login"}
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/*<Form.Item
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
            </Form.Item>*/}
      </div>
      <ForgotPasswordModal
        isVisible={forgotPasswordVisible}
        onClose={hideForgotPasswordModal}
      />
    </Page>
  );
}

function onUpdateField(name: string, value: string) {
  store.dispatch(
    updateField({ name: name as keyof LoginState["user"], value }),
  );
}

async function signIn() {
  if (store.getState().login.loginIn) return;
  store.dispatch(startLoginIn());

  const { email, password } = store.getState().login.user;
  const result = await login(email, password);

  result.match({
    ok: (user) => {
      location.hash = "#/dashboard";
      loadUserIntoApp(user);
    },
    err: (e) => {
      store.dispatch(updateErrors(e));
    },
  });
}

async function handleFormChange(
  changedValues: Partial<LoginState["user"]>,
  allValues: LoginState["user"],
) {
  for (const [name, value] of Object.entries(changedValues)) {
    store.dispatch(
      updateField({ name: name as keyof LoginState["user"], value }),
    );
  }
}
