import { UIComponent } from '@xingine/core/xingine.type';
import { FieldMeta } from '@xingine/core/component/component-meta-map';

export const UserLoginComponent: UIComponent = {
  component: 'UserLogin',
  path: '/users/login',
  icon: 'user-plus',
  roles: ['admin'],
  permissions: ['user.authenticate'],
  meta: {
    component: 'FormRenderer',
    properties: {
      fields: [
        {
          name: 'email',
          label: 'Email',
          inputType: 'input',
          required: true,
          properties: {
            placeholder: 'Enter your email',
            email: true,
          },
        },
        {
          name: 'password',
          label: 'Password',
          inputType: 'password',
          required: true,
          properties: {
            placeholder: 'Enter your password',
          },
        },
        { name: 'rememberMe', label: 'Remember Me', inputType: 'checkbox' },
        {
          name: 'submit',
          label: 'Submit',
          inputType: 'button',
          properties: { text: 'Login', type: 'primary' },
        },
      ],
      action: 'user/users/login',
    },
  },
};
