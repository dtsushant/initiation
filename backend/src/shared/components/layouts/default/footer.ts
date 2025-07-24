import { LayoutComponentDetailBuilder } from 'xingine';

const footerLeft = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className(`flex items-center space-x-4`)
  .content(`<span class="text-sm">© 2024 Xingine</span>`)
  .build();
const privacyPolicyLink = LayoutComponentDetailBuilder.create()
  .dynamic('LinkRenderer')
  .property('path', '/privacy-policy')
  .property('label', 'Privacy Policy')
  .property('icon', {
    name: 'UserOutlined',
  })
  .build();
const termsOfServiceLink = LayoutComponentDetailBuilder.create()
  .dynamic('LinkRenderer')
  .property('path', '/terms-of-service')
  .property('label', 'Terms of Service')
  .build();
const supportLink = LayoutComponentDetailBuilder.create()
  .dynamic('LinkRenderer')
  .property('path', '/support')
  .property('label', 'Support')
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
export const DEFAULT_FOOTER_COMPONENT = LayoutComponentDetailBuilder.create()
  .wrapper()
  .addChild(footerContent)
  .build();
