import { createStyles } from 'antd-style';
import type { ConfigProviderProps } from 'antd/es/config-provider';

interface ExtendedAliasToken {
  antCls: string;
  fontFamily: string;
  colorPrimary: string;
}

export function getPopupContainerConfig(): HTMLElement {
  return window.document.body;
}

export const formConfig: ConfigProviderProps['form'] = {
  validateMessages: {},
};

export const themeConfig: ConfigProviderProps['theme'] = {
  token: {
    fontFamily: 'lato',
    antCls: '.ant',
  } as ExtendedAliasToken,
  components: {
    Menu: {
      activeBarWidth: 3,
      itemBorderRadius: 0,
      itemMarginInline: 0,
    },
  },
  cssVar: true,
  hashed: false,
};

export const rules = {};

export const useStyle = createStyles(({ css, token }) => {
  const antCls = (token as unknown as ExtendedAliasToken).antCls;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #d9d9d9 transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});
