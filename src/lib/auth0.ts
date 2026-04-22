import { NextResponse } from 'next/server';

import { Auth0Client } from '@auth0/nextjs-auth0/server';

import { isSafeReturnTo } from './safe-return-to';

const audience = process.env.AUTH0_AUDIENCE;

/**
 * Server-side Auth0 client. Used by middleware and server components.
 * Environment: AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_SECRET, APP_BASE_URL;
 * optional AUTH0_AUDIENCE (must match the API identifier in Auth0; required for tokens accepted by arvo-auth).
 */
export const auth0 = new Auth0Client({
  authorizationParameters: {
    scope: 'openid profile email',
    ...(audience ? { audience } : {}),
  },
  signInReturnToPath: '/dashboard',
  onCallback: (error, ctx, _session) => {
    if (error) {
      return Promise.resolve(new NextResponse(error.message, { status: 500 }));
    }
    const appBaseUrl = ctx.appBaseUrl;
    if (!appBaseUrl) {
      return Promise.resolve(
        new NextResponse('appBaseUrl could not be resolved for the callback redirect.', {
          status: 500,
        }),
      );
    }
    let target = ctx.returnTo && ctx.returnTo.trim() !== '' ? ctx.returnTo : '/';
    if (!isSafeReturnTo(target, appBaseUrl)) {
      target = '/dashboard';
    }
    return Promise.resolve(NextResponse.redirect(new URL(target, appBaseUrl).toString()));
  },
});
