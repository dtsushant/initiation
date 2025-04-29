import { UIComponent } from '@xingine/core/xingine.type';

export const UserLoginComponent: UIComponent = {
  component: 'FormRenderer',
  path: '/users/create',
  icon: 'user-plus',
  roles: ['admin'],
  permissions: ['user.authenticate'],
  meta: {
    fields: [
      { name: 'email', label: 'Email', inputType: 'text', required: true },
      {
        name: 'password',
        label: 'Password',
        inputType: 'password',
        required: true,
      },
      {
        name: 'sample',
        label: 'Sample',
        inputType: 'text',
        required: true,
      },
      {
        name: 'ujjwal',
        label: 'Ujjwal lai sample',
        inputType: 'text',
        required: true,
      },
    ],
  },
};
