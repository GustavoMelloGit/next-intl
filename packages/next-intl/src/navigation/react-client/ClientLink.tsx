import React, {ComponentProps, ReactElement, forwardRef} from 'react';
import useLocale from '../../react-client/useLocale';
import {LocalePrefixConfigVerbose, Locales} from '../../routing/types';
import {getLocalePrefix} from '../../shared/utils';
import BaseLink from '../shared/BaseLink';

type Props<AppLocales extends Locales> = Omit<
  ComponentProps<typeof BaseLink>,
  'locale' | 'prefix' | 'localePrefixMode'
> & {
  locale?: AppLocales[number];
  localePrefix: LocalePrefixConfigVerbose<AppLocales>;
};

function ClientLink<AppLocales extends Locales>(
  {locale, localePrefix, ...rest}: Props<AppLocales>,
  ref: Props<AppLocales>['ref']
) {
  const defaultLocale = useLocale();
  const finalLocale = locale || defaultLocale;
  const prefix = getLocalePrefix(finalLocale, localePrefix);

  return (
    <BaseLink
      ref={ref}
      locale={finalLocale}
      localePrefixMode={localePrefix.mode}
      prefix={prefix}
      {...rest}
    />
  );
}

/**
 * Wraps `next/link` and prefixes the `href` with the current locale if
 * necessary.
 *
 * @example
 * ```tsx
 * import {Link} from 'next-intl';
 *
 * // When the user is on `/en`, the link will point to `/en/about`
 * <Link href="/about">About</Link>
 *
 * // You can override the `locale` to switch to another language
 * <Link href="/" locale="de">Switch to German</Link>
 * ```
 *
 * Note that when a `locale` prop is passed to switch the locale, the `prefetch`
 * prop is not supported. This is because Next.js would prefetch the page and
 * the `set-cookie` response header would cause the locale cookie on the current
 * page to be overwritten before the user even decides to change the locale.
 */
const ClientLinkWithRef = forwardRef(ClientLink) as <
  AppLocales extends Locales
>(
  props: Props<AppLocales> & {ref?: Props<AppLocales>['ref']}
) => ReactElement;
(ClientLinkWithRef as any).displayName = 'ClientLink';
export default ClientLinkWithRef;
