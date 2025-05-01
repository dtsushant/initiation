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
        { name: 'email', label: 'Email', inputType: 'input', required: true },
        { name: 'password', label: 'Password', inputType: 'password' },
        { name: 'rememberMe', label: 'Remember Me', inputType: 'checkbox' },
      ],
    },
  },
};
