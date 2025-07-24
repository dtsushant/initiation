import {
  CommissarBuilder,
  ConditionalMeta,
  IconMeta,
  LayoutComponentDetail,
  LayoutComponentDetailBuilder,
  LayoutRenderer,
  LayoutRendererBuilder,
} from "xingine";
import { MenuMeta } from "/@/initiation/components/MenuRenderer.tsx";
import {
  collapseIconMeta,
  darkModeIcon,
  homeIconMeta,
  lightModeIcon,
  searchIcon,
} from "/@/initiation/layouts/custom/constant/component-icons.ts";

const userFormFields = [
  {
    name: "name",
    label: "Name",
    inputType: "input" as const,
    required: true,
    properties: {},
  },
  {
    name: "email",
    label: "Email",
    inputType: "input" as const,
    required: true,
    properties: {},
  },
  {
    name: "role",
    label: "Role",
    inputType: "select",
    properties: {},
  },
];

const userTableData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    active: true,
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    active: true,
    createdAt: "2024-01-02",
  },
];

const userDetailData = {
  name: "John Doe",
  email: "john@example.com",
  role: "Admin",
  active: true,
  createdAt: "2024-01-01",
  lastLogin: "2024-01-15T10:30:00Z",
  profile: {
    avatar: "https://example.com/avatar.jpg",
    department: "Engineering",
    phone: "+1-555-0123",
    bio: "Software engineer with 5 years of experience in web development.",
  },
  permissions: ["read", "write", "admin"],
};

// Create chart component using the builder
//const chartWrapperClass = `min-w-[150px] flex-1 sm:max-w-[calc(25%-1rem)] bg-gray-100 p-4 rounded`;
const chartWrapperClass = `w-full h-[300px] bg-white p-4 shadow rounded`;
const chartComponent = LayoutComponentDetailBuilder.create()
  .chart()
  .charts([
    {
      type: "bar",
      height: 300,
      width: 300,
      title: "Sales Performance",
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Sales",
          data: [4000, 3000, 2000, 2780, 1890, 2390],
          backgroundColor: "#1890ff",
        },
      ],
      style: {
        className: chartWrapperClass,
      },
    },
    {
      type: "line",
      title: "User Growth",
      height: 300,
      width: 300,
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Users",
          data: [240, 221, 229, 200, 218, 250],
          borderColor: "#52c41a",
        },
      ],
      style: {
        className: chartWrapperClass,
      },
    },
    {
      type: "pie",
      title: "Device Distribution",
      height: 300,
      width: 300,
      datasets: [
        {
          label: "Devices",
          data: [400, 300, 300, 200],
          backgroundColor: "#1890ff",
        },
      ],
      style: {
        className: chartWrapperClass,
      },
      labels: ["Desktop", "Mobile", "Tablet", "Other"],
    },
    {
      type: "scatter",
      title: "Revenue Analysis",
      height: 300,
      width: 300,
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        {
          label: "Revenue",
          data: [
            { x: 1, y: 2400 },
            { x: 2, y: 1398 },
            { x: 3, y: 9800 },
            { x: 4, y: 3908 },
          ],
          backgroundColor: "#722ed1",
        },
      ],
      style: {
        className: chartWrapperClass,
      },
    },
  ])
  .build();

// Create form component using the builder
const formComponent = LayoutComponentDetailBuilder.create()
  .withMeta("FormRenderer", {
    action: "handleUserCreate",
    fields: userFormFields,
    event: {
      onSubmit: {
        action: "navigate",
        args: {
          path: "/thank-you",
        },
      },
    },
    properties: {
      title: "Create User",
      submitText: "Create User",
      className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow",
    },
  } as any)
  .build();

// Create table component using the builder
const tableComponent = LayoutComponentDetailBuilder.create()
  .table()
  .dataSourceUrl("/api/users")
  .columns([
    { title: "Name", dataIndex: "name", key: "name", sortable: true },
    { title: "Email", dataIndex: "email", key: "email", sortable: true },
    { title: "Role", dataIndex: "role", key: "role", sortable: true },
    { title: "Status", dataIndex: "active", key: "active" },
    { title: "Created", dataIndex: "createdAt", key: "createdAt" },
  ])
  .build();

// Create detail component using the builder
const detailComponent = LayoutComponentDetailBuilder.create()
  .detailRenderer()
  .action("viewUser")
  .fields([
    { name: "name", label: "Name", inputType: "text" as const, properties: {} },
    {
      name: "email",
      label: "Email",
      inputType: "text" as const,
      properties: {},
    },
    {
      name: "role",
      label: "Role",
      inputType: "badge" as const,
      properties: {},
    },
    {
      name: "active",
      label: "Status",
      inputType: "switch" as const,
      properties: {},
    },
    {
      name: "createdAt",
      label: "Created",
      inputType: "date" as const,
      properties: {},
    },
    {
      name: "lastLogin",
      label: "Last Login",
      inputType: "date" as const,
      properties: {},
    },
  ])
  .build();

// Create popup component using the builder
const popupComponent = LayoutComponentDetailBuilder.create()
  .popup()
  .property("title", "User Profile Details")
  .property("triggerText", "View Full Profile")
  .property("width", 800)
  .property("height", 600)
  .property(
    "content",
    `
        <div class="flex items-center space-x-4">
          <img src="${userDetailData.profile.avatar}" alt="Profile" class="w-20 h-20 rounded-full">
          <div>
            <h2 class="text-2xl font-bold">${userDetailData.name}</h2>
            <p class="text-gray-600">${userDetailData.profile.department} Department</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold mb-2">Contact Information</h3>
            <p><strong>Email:</strong> ${userDetailData.email}</p>
            <p><strong>Phone:</strong> ${userDetailData.profile.phone}</p>
          </div>
          <div>
            <h3 class="font-semibold mb-2">Role & Permissions</h3>
            <p><strong>Role:</strong> ${userDetailData.role}</p>
            <p><strong>Permissions:</strong> ${userDetailData.permissions.join(", ")}</p>
          </div>
        </div>
        <div>
          <h3 class="font-semibold mb-2">Biography</h3>
          <p>${userDetailData.profile.bio}</p>
        </div>
      `,
  )
  .build();

// Create dashboard content with nested structure
const dashboardContent = CommissarBuilder.create()
  .path("/dashboard")
  .wrapper()
  .className("min-h-full max-w-full w-full")
  .addChild(
    // Charts Row
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className(
        "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4 p-4 rounded #{darkMode ? bg-gray-800 shadow-lg text-white : bg-white shadow-md}",
      )
      .style({
        background: "linear-gradient(135deg, #ff7e5f, #feb47b)",
        color: "#ffffff",
        padding: "16px",
        borderRadius: "8px",
      })
      .addChild(chartComponent)
      .build(),
  )
  .addChild(
    // Form and Table Row
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className(
        "w-full bg-white shadow mb-4 p-4 rounded #{darkMode ? bg-gray-800 shadow-lg text-white : bg-white shadow-md}",
      )
      .addChild(formComponent)
      .build(),
  )
  .addChild(
    // Form and Table Row
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className(
        "w-full bg-white mb-4 p-4 rounded #{darkMode ? bg-gray-800 shadow-lg text-white : bg-white shadow-md}",
      )
      .addChild(tableComponent)
      .build(),
  )
  .addChild(
    // Detail and Popup Row
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className(
        "grid grid-cols-1 gap-6 mb-4 p-4 rounded #{darkMode ? bg-gray-800 shadow-lg text-white : bg-white shadow-md}",
      )
      .addChild(
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className(
            "mb-4 p-4 rounded #{darkMode ? bg-gray-800 shadow-lg text-white : bg-white shadow-md}",
          )
          .addChild(detailComponent)
          .addChild(popupComponent)
          .build(),
      )
      .build(),
  )
  .addChild(
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className(
        "flex gap-4 mb-4 p-4 rounded #{darkMode ? bg-gray-800 shadow-lg text-white : bg-white shadow-md}",
      ) // row layout with gap
      .addChildren([
        // Left (Progress / Chart) - 80%
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className("basis-[80%] grow bg-white p-4 rounded shadow")
          .content("Progress Chart Section")
          .build(),

        // Right (User Stats) - 20%
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className("basis-[20%] bg-white p-4 rounded shadow")
          .content("User Stats List")
          .build(),
      ])
      .build(),
  )
  .build();

const sampleCommissar = CommissarBuilder.create()
  .path("/sample-commissar")
  .wrapper()
  .content("this is rendered from sample Commisar")
  .build();

const collapseButton = LayoutComponentDetailBuilder.create()
  .button()
  .name("collapseButton")
  .icon(collapseIconMeta)
  .event({
    onClick: {
      action: "toggleState",
      args: {
        key: "collapsed",
      },
    },
  })
  .className("p-2 rounded-md hover:bg-gray-100 transition-colors")
  .build();

/*const homeButton = LayoutComponentDetailBuilder.create()
  .button()
  .name("HomeButton")
  .icon(homeIconMeta)
  .className("p-2 rounded-md hover:bg-gray-100 transition-colors")
  .build();*/

const homeButton = LayoutComponentDetailBuilder.create()
  .dynamic("LinkRenderer")
  .property("path", "/dashboard")
  .property("icon", homeIconMeta)
  .property("style", {
    className: "p-2 rounded-md hover:bg-gray-100 transition-colors",
  })
  .build();

const leftSection = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className("flex items-center space-x-4")
  .addChild(collapseButton)
  .addChild(homeButton)
  .build();

const searchInput = LayoutComponentDetailBuilder.create()
  .input()
  .name("search")
  .placeholder("Search with Icon...")
  .icon(searchIcon)
  .className(
    "w-full h-10 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
  )
  .build();

const middleSection = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className("flex-1 max-w-md mx-4")
  .addChild(searchInput)
  .build();

const darkModeButton = LayoutComponentDetailBuilder.create()
  .button()
  .event({
    onClick: {
      action: "toggleState",
      args: {
        key: "darkMode",
      },
    },
  })
  .name("DarkModeButton")
  .icon(darkModeIcon)
  .className(
    `p-2 rounded-md #{darkMode ? 'bg-gray-700':'bg-gray-100'} hover:bg-gray-100 transition-colors`,
  )
  .build();

const lightModeButton = LayoutComponentDetailBuilder.create()
  .button()
  .event({
    onClick: {
      action: "toggleState",
      args: {
        key: "darkMode",
      },
    },
  })
  .name("LightModeButton")
  .icon(lightModeIcon)
  .className(
    `p-2 rounded-md #{darkMode ? 'bg-gray-700':'bg-gray-100'} transition-colors`,
  )
  .build();

const darkModeToggle = LayoutComponentDetailBuilder.create()
  .conditional()
  .condition({
    field: "darkMode",
    operator: "eq",
    value: false,
  })
  .trueComponent(darkModeButton)
  .falseComponent(lightModeButton)
  .build();

const notificationComponent = LayoutComponentDetailBuilder.create()
  .button()
  .name("notifications")
  .content(
    `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width='2' d="M15 17h5l-5 5v-5zM15 17H9a6 6 0 01-6-6V9a6 6 0 016-6h6a6 6 0 016 6v2" />
              </svg>
              <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">3</span>`,
  )
  .className("p-2 rounded-md transition-colors relative")
  .build();

const userMenuToggle = LayoutComponentDetailBuilder.create()
  .button()
  .event({
    onClick: {
      action: "toggleState",
      args: {
        key: "userDropdownOpen",
      },
    },
  })
  .name("userDropdown")
  .content(
    `<div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">U</div>
                <svg class="w-4 h-4 transition-transform #{userDropdownOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width='2' d="M19 9l-7 7-7-7" />
                </svg>`,
  )
  .className("flex items-center space-x-2 p-2 rounded-md transition-colors")
  .build();

const profileSettingsButton = LayoutComponentDetailBuilder.create()
  .button()
  .name("ProfileSettingsButton")
  .className(`w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md`)
  .content("Settings")
  .build();

const logoutButton = LayoutComponentDetailBuilder.create()
  .button()
  .name("LogoutButton")
  .className(`w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md`)
  .content("Logout")
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
    field: "userDropdownOpen",
    operator: "eq",
    value: true,
  })
  .trueComponent(userMenuContent)
  .build();

const userSectionComponent = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className("relative")
  .addChild(userMenuToggle)
  .addChild(userMenuDisplayCondition)
  .build();

const rightSection = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className("flex items-center space-x-3")
  .addChild(darkModeToggle)
  .addChild(notificationComponent)
  .addChild(userSectionComponent)
  .build();

// Create header with complex nested structure
const headerComponent = LayoutComponentDetailBuilder.create()
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

const conditionalLogo: ConditionalMeta = {
  condition: {
    field: "collapsed",
    operator: "eq",
    value: false,
  },
  trueComponent: {
    meta: {
      component: "WrapperRenderer",
      properties: {
        content: `<h2 class="text-xl font-bold #{darkMode ? 'text-white' : 'text-gray-900'}">Xingine</h2>`,
      },
    },
  },
};

const siderLogo = LayoutComponentDetailBuilder.create()
  .conditional()
  .condition({
    field: "collapsed",
    operator: "eq",
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

const dashBoardIcon: IconMeta = {
  svg: {
    svg: `<svg class="w-5 h-5 ant-menu-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h7v7H3V3zM14 3h7v7h-7V3zM14 14h7v7h-7v-7zM3 14h7v7H3v-7z" />
                    </svg>`,
  },
};

const usersIcon: IconMeta = {
  svg: {
    svg: `<svg class="w-5 h-5 ant-menu-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="butt" stroke-linejoin="butt" stroke-width="2" d="M17 20v-2a4 4 0 0 0-3-3.87M7 20v-2a4 4 0 0 1 3-3.87M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm5 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                    </svg>`,
  },
};

const analyticsIcon: IconMeta = {
  svg: {
    svg: `<svg class="w-5 h-5 ant-menu-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 20V10M10 20V4M16 20v-6M22 20V14" />
                    </svg>`,
  },
};

const settingsIcon: IconMeta = {
  svg: {
    svg: `<svg class="w-5 h-5 ant-menu-item-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M10.325 4.317a1.724 1.724 0 003.35 0 1.724 1.724 0 012.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572 1.724 1.724 0 010 3.35 1.724 1.724 0 00-1.065 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.065 1.724 1.724 0 01-3.35 0 1.724 1.724 0 00-2.573-1.065c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.573 1.724 1.724 0 010-3.35 1.724 1.724 0 001.065-2.572c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.573-1.066z" />
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>`,
  },
};

const menuMeta: MenuMeta = {
  menuItems: [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: dashBoardIcon,
      path: "/dashboard",
    },
    {
      key: "users",
      label: "Users",
      icon: usersIcon,
      children: [
        { key: "user-list", label: "User List", path: "/users/list" },
        { key: "user-create", label: "Create User", path: "/users/create" },
        { key: "user-analytics", label: "Analytics", path: "/users/analytics" },
      ],
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: analyticsIcon,
      path: "/analytics",
    },
    {
      key: "settings",
      label: "Settings",
      icon: settingsIcon,
      path: "/settings",
    },
  ],
};

const siderMenuComponent = LayoutComponentDetailBuilder.create()
  .dynamic("MenuRenderer")
  .setProperties(menuMeta)
  .build();

const siderMenuWrapper = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className(`h-full p-4 #{darkMode ? 'bg-gray-800' : 'bg-white'}`)
  .addChild(siderLogo)
  .addChild(siderMenuComponent)
  .build();

const siderComponent = LayoutComponentDetailBuilder.create()
  .dynamic("SiderRenderer")
  .property("event", {
    onInit: {
      action: "setState",
      args: {
        key: "hasSider",
        value: true,
      },
    },
  })
  .property("style", {
    className: `fixed left-0 top-0 h-screen z-40 transition-all duration-200 #{
                    hasHeader ? "mt-16" : "mt-0"
                } #{collapsed ? "w-20 overflow-hidden" : "w-52"} #{
                    darkMode
                        ? "bg-gray-800 border-r border-gray-700"
                        : "bg-white border-r border-gray-200"
                }`,
  })
  .property("children", [siderMenuWrapper])
  .build();

const footerLeft = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className(`flex items-center space-x-4`)
  .content(`<span class="text-sm">© 2024 Xingine</span>`)
  .build();
const privacyPolicyLink = LayoutComponentDetailBuilder.create()
  .dynamic("LinkRenderer")
  .property("path", "/privacy-policy")
  .property("label", "Privacy Policy")
  .property("icon", {
    name: "UserOutlined",
  })
  .build();
const termsOfServiceLink = LayoutComponentDetailBuilder.create()
  .dynamic("LinkRenderer")
  .property("path", "/terms-of-service")
  .property("label", "Terms of Service")
  .build();
const supportLink = LayoutComponentDetailBuilder.create()
  .dynamic("LinkRenderer")
  .property("path", "/support")
  .property("label", "Support")
  .build();
const footerCenter = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className(`hidden md:flex items-center space-x-6`)
  .addChild(privacyPolicyLink)
  .addChild(termsOfServiceLink)
  .addChild(supportLink)
  .build();

const footerRight = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className(`flex items-center space-x-4`)
  .content(
    `<span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          v1.0.8
        </span>`,
  )
  .build();
const footerContent = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className(
    `h-16 px-6 flex items-center justify-between #{
        darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'
    }`,
  )
  .addChild(footerLeft)
  .addChild(footerCenter)
  .addChild(footerRight)
  .build();
const footerComponent = LayoutComponentDetailBuilder.create()
  .wrapper()
  .addChild(footerContent)
  .build();

export function getDefaultTemplate(): LayoutRenderer {
  return LayoutRendererBuilder.create()
    .type("tailwind")
    .className("min-h-screen")
    .withHeader(headerComponent, {
      className: `fixed top-0 left-0 right-0 h-16 z-50 shadow-sm #{
                    darkMode
                        ? "bg-gray-800 border-r border-gray-700"
                        : "bg-white border-r border-gray-200"
                }`,
    })
    .addContentCommissar(dashboardContent)
    .addContentCommissar(sampleCommissar)
    .withSider(siderComponent)
    .withFooter(footerComponent, {
      className: `fixed bottom-0 left-0 right-0 h-16 z-30 transition-all duration-200 
        #{hasSider && collapsed ? "ml-20" : hasSider && collapsed === false ? "ml-52" : ""}
        #{
                darkMode
                  ? "bg-gray-800 border-t border-gray-700"
                  : "bg-white border-t border-gray-200"
              } shadow-sm`,
    })
    .build();
}
