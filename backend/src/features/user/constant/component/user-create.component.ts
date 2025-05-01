import { UIComponent } from '@xingine/core/xingine.type';

export const UserCreateComponent: UIComponent = {
  component: 'UserCreate',
  path: '/users/create',
  icon: 'user-plus',
  roles: ['admin'],
  permissions: ['user.authenticate'],
  meta: {
    component: 'FormRenderer',
    properties: {
      fields: [],
    },
  },
};
