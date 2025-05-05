import { UIComponent } from '@xingine/core/xingine.type';

export const UserBinaComponent: UIComponent = {
  component: 'HiBina',
  path: '/users/bina',
  icon: 'user-plus',
  roles: ['admin'],
  permissions: ['user.authenticate'],
  meta: {
    component: 'FormRenderer',
    properties: {
      fields: [
        { name: 'email', label: 'Email', inputType: 'input', required: true },
        {
          name: 'something',
          label: 'Bina',
          inputType: 'input',
          required: true,
        },
        { name: 'password', label: 'Password', inputType: 'password' },
      ],
      action: '',
    },
  },
};
