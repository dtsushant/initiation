import { LayoutComponentDetailBuilder } from 'xingine';
import {
  collapseIconMeta,
  darkModeIcon,
  homeIconMeta,
  lightModeIcon,
  searchIcon,
} from '../../icons/shared.svg-icons-meta';

const collapseButton = LayoutComponentDetailBuilder.create()
  .button()
  .name('collapseButton')
  .icon(collapseIconMeta)
  .event({
    onClick: {
      action: 'toggleState',
      args: {
        key: 'collapsed',
      },
    },
  })
  .className('p-2 rounded-md hover:bg-gray-100 transition-colors')
  .build();

const homeButton = LayoutComponentDetailBuilder.create()
  .dynamic('LinkRenderer')
  .property('path', '/dashboard')
  .property('icon', homeIconMeta)
  .property('style', {
    className: 'p-2 rounded-md hover:bg-gray-100 transition-colors',
  })
  .build();

const leftSection = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className('flex items-center space-x-4')
  .addChild(collapseButton)
  .addChild(homeButton)
  .build();

const searchInput = LayoutComponentDetailBuilder.create()
  .input()
  .name('search')
  .placeholder('Search with Icon...')
  .icon(searchIcon)
  .className(
    'w-full h-10 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
  )
  .build();

const middleSection = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className('flex-1 max-w-md mx-4')
  .addChild(searchInput)
  .build();

const darkModeButton = LayoutComponentDetailBuilder.create()
  .button()
  .event({
    onClick: {
      action: 'toggleState',
      args: {
        key: 'darkMode',
      },
    },
  })
  .name('DarkModeButton')
  .icon(darkModeIcon)
  .className(
    `p-2 rounded-md #{darkMode ? 'bg-gray-700':'bg-gray-100'} hover:bg-gray-100 transition-colors`,
  )
  .build();

const lightModeButton = LayoutComponentDetailBuilder.create()
  .button()
  .event({
    onClick: {
      action: 'toggleState',
      args: {
        key: 'darkMode',
      },
    },
  })
  .name('LightModeButton')
  .icon(lightModeIcon)
  .className(
    `p-2 rounded-md #{darkMode ? 'bg-gray-700':'bg-gray-100'} transition-colors`,
  )
  .build();

const darkModeToggle = LayoutComponentDetailBuilder.create()
  .conditional()
  .condition({
    field: 'darkMode',
    operator: 'eq',
    value: false,
  })
  .trueComponent(darkModeButton)
  .falseComponent(lightModeButton)
  .build();

const notificationComponent = LayoutComponentDetailBuilder.create()
  .button()
  .name('notifications')
  .content(
    `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width='2' d="M15 17h5l-5 5v-5zM15 17H9a6 6 0 01-6-6V9a6 6 0 016-6h6a6 6 0 016 6v2" />
              </svg>
              <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">3</span>`,
  )
  .className('p-2 rounded-md transition-colors relative')
  .build();

const userMenuToggle = LayoutComponentDetailBuilder.create()
  .button()
  .event({
    onClick: {
      action: 'toggleState',
      args: {
        key: 'userDropdownOpen',
      },
    },
  })
  .name('userDropdown')
  .content(
    `<div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">U</div>
                <svg class="w-4 h-4 transition-transform #{userDropdownOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width='2' d="M19 9l-7 7-7-7" />
                </svg>`,
  )
  .className('flex items-center space-x-2 p-2 rounded-md transition-colors')
  .build();

const profileSettingsButton = LayoutComponentDetailBuilder.create()
  .button()
  .name('ProfileSettingsButton')
  .className(`w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md`)
  .content('Settings')
  .build();

const logoutButton = LayoutComponentDetailBuilder.create()
  .button()
  .name('LogoutButton')
  .className(`w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md`)
  .content('Logout')
  .build();

const userMenuWrapper = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className(
    `py-2 px-4 text-sm text-gray-700 #{darkMode ? 'text-gray-300' : 'text-gray-700'} hover:bg-gray-100 hover:text-gray-900 transition-colors`,
  )
  .addChildren([profileSettingsButton, logoutButton])
  .build();

const userMenuContent = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className(
    `absolute right-0 mt-2 w-48 bg-white border #{darkMode ? 'bg-gray-800 border-gray-700':'bg-white border-gray-200'} rounded-md shadow-lg z-50`,
  )
  .addChild(userMenuWrapper)
  .build();

const userMenuDisplayCondition = LayoutComponentDetailBuilder.create()
  .conditional()
  .condition({
    field: 'userDropdownOpen',
    operator: 'eq',
    value: true,
  })
  .trueComponent(userMenuContent)
  .build();

const userSectionComponent = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className('relative')
  .addChild(userMenuToggle)
  .addChild(userMenuDisplayCondition)
  .build();

const rightSection = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className('flex items-center space-x-3')
  .addChild(darkModeToggle)
  .addChild(notificationComponent)
  .addChild(userSectionComponent)
  .build();

export const DEFAULT_HEADER_COMPONENT = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className(
    `h-16 px-4 flex items-center #{darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} justify-between`,
  )
  .addChild(
    // Left section
    leftSection,
  )
  .addChild(
    // Middle section with search
    middleSection,
  )
  .addChild(
    // Right section with user menu
    rightSection,
  )
  .build();
