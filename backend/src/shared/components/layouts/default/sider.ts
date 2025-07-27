import { LayoutComponentDetailBuilder, MenuMeta } from 'xingine';
import {
  analyticsIcon,
  homeIcon,
  settingsIcon,
  usersIcon,
} from '../../icons/shared.svg-icons-meta';

const siderLogo = LayoutComponentDetailBuilder.create()
  .conditional()
  .condition({
    field: 'collapsed',
    operator: 'eq',
    value: false,
  })
  .trueComponent(
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .content(
        `<h2 class="text-xl font-bold #{darkMode ? 'text-white' : 'text-gray-900'}">Xingine</h2>`,
      )
      .build(),
  )
  .build();

const menuMeta: MenuMeta = {
  menuItems: [
    {
      key: 'home',
      label: 'Home',
      icon: homeIcon,
      path: '/home',
    },
    {
      key: 'users',
      label: 'Users',
      icon: usersIcon,
      children: [
        { key: 'user-list', label: 'User List', path: '/users/list' },
        { key: 'user-create', label: 'Create User', path: '/users/create' },
        { key: 'user-analytics', label: 'Analytics', path: '/users/analytics' },
      ],
    },
    {
      key: 'analytics',
      label: 'Analytics',
      icon: analyticsIcon,
      path: '/users/user-analytics',
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: settingsIcon,
      path: '/settings',
    },
    {
      key: 'login',
      label: 'Login',
      icon: settingsIcon,
      path: '/users/users/login',
    },
  ],
};

const siderMenuComponent = LayoutComponentDetailBuilder.create()
  .dynamic('MenuRenderer')
  .setProperties(menuMeta as Record<string, unknown>)
  .build();

const siderMenuWrapper = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className(`h-full p-4 #{darkMode ? 'bg-gray-800' : 'bg-white'}`)
  .addChild(siderLogo)
  .addChild(siderMenuComponent)
  .build();

export const DEFAULT_SIDER_COMPONENT = LayoutComponentDetailBuilder.create()
  .dynamic('SiderRenderer')
  .property('event', {
    onInit: {
      action: 'setState',
      args: {
        key: 'hasSider',
        value: true,
      },
    },
  })
  .property('style', {
    className: `fixed left-0 top-0 h-screen z-40 transition-all duration-200 #{
                    hasHeader ? "mt-16" : "mt-0"
                } #{collapsed ? "w-20 overflow-hidden" : "w-52"} #{
                    darkMode
                        ? "bg-gray-800 border-r border-gray-700"
                        : "bg-white border-r border-gray-200"
                }`,
  })
  .property('children', [siderMenuWrapper])
  .build();
