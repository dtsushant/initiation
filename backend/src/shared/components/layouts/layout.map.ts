import { LayoutRenderer, LayoutRendererBuilder } from 'xingine';
import { DEFAULT_HEADER_COMPONENT } from './default/header';
import { DEFAULT_SIDER_COMPONENT } from './default/sider';
import { DEFAULT_FOOTER_COMPONENT } from './default/footer';
import { DEFAULT_DASHBOARD_COMMISAR } from './default/dashboard';

const headerClass = `fixed top-0 left-0 right-0 h-16 z-50 shadow-sm #{
                darkMode
                    ? "bg-gray-800 border-r border-gray-700"
                    : "bg-white border-r border-gray-200"
            }`;

const footerClass = `fixed bottom-0 left-0 right-0 h-16 z-30 transition-all duration-200 
    #{hasSider && collapsed ? "ml-20" : hasSider && collapsed === false ? "ml-52" : ""}
    #{
            darkMode
              ? "bg-gray-800 border-t border-gray-700"
              : "bg-white border-t border-gray-200"
          } shadow-sm`;
export const TAILWIND_LAYOUT: LayoutRenderer = LayoutRendererBuilder.create()
  .type('tailwind')
  .className('min-h-screen')
  .withHeader(DEFAULT_HEADER_COMPONENT, {
    className: headerClass,
  })
  .withContent([DEFAULT_DASHBOARD_COMMISAR], {
    className: 'flex-1 bg-gray-50 p-6 overflow-auto',
  })
  .withSider(DEFAULT_SIDER_COMPONENT)
  .withFooter(DEFAULT_FOOTER_COMPONENT, {
    className: footerClass,
  })
  .build();

export const LOGIN_LAYOUT: LayoutRenderer = LayoutRendererBuilder.create()
  .type('login')
  .className('min-h-screen')
  .withHeader(DEFAULT_HEADER_COMPONENT, {
    className: headerClass,
  })
  .withContent([], { className: 'flex-1 bg-gray-50 p-6 overflow-auto' })
  .withFooter(DEFAULT_FOOTER_COMPONENT, {
    className: footerClass,
  })
  .build();

export const LAYOUT_MAP: Record<string, LayoutRenderer> = {
  tailwind: TAILWIND_LAYOUT,
  login: LOGIN_LAYOUT,
};
