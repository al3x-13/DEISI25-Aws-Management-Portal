import { getUserDataFromJwt, type User } from "$lib/domain/user";
import { validateUserToken } from "$lib/utils/auth-validation";
import { routeIsProtected, userCanAccessRoute } from "$lib/utils/route-validation";
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const authorizeRouteAccess: Handle = async ({ event, resolve }) => {
	const reqPath = event.url.pathname;
	const protectedRoute = routeIsProtected(reqPath);
	const token = event.cookies.get('token');
	const validToken = token ? await validateUserToken(token) : false;
	const user: User | null | undefined = token ? getUserDataFromJwt(token) : undefined;

	// set user info on 'locals'
	if (validToken && user) {
		event.locals.user = user;
	}

	// invalidate cookies and user info if token is not valid 
	// when trying to access a protected route
	if (!validToken && protectedRoute) {
		event.cookies.delete('token', { path: '/' });
		event.locals.user = undefined;
	}

	// require authentication for protected routes
	if (protectedRoute) {
		if (!validToken || !user || !userCanAccessRoute(reqPath, user)) {
			throw redirect(303, "/login");
		}

		// set user info on 'locals'
		event.locals.user = user;
	}

	return resolve(event);
}

// redirects that improve UX
const smartRedirects: Handle = async ({ event, resolve }) => {
	const reqPath = event.url.pathname;
	const token = event.cookies.get('token');
	const user: User | null = token ? getUserDataFromJwt(token) : null;

	// if the user is not authenticated just resolve the request as usual
	if (!user) {
		return resolve(event);
	}

	// TODO: update this when all account types are fully implemented

	// redirect authenticated users away from login page
	// they will be redirected to their dashboards
	if (reqPath === '/login') {
		switch (user.role) {
			case 'root': {
				throw redirect(303, '/root');
			}
			case 'admin': {
				// TODO: implement this
				break;
			}
			default: {
				throw redirect(303, '/dashboard');
			}
		}
	}

	return resolve(event);
}

export const handle: Handle = sequence(
	authorizeRouteAccess,
	smartRedirects
);
