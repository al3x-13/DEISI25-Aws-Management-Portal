import { getUserDataFromJwt, type User } from "$lib/domain/user";
import { validateUserToken } from "$lib/utils/auth-validation";
import { routeIsProtected, userCanAccessRoute } from "$lib/utils/route-validation";
import { redirect, type Handle } from "@sveltejs/kit";

const authorizeRouteAccess: Handle = async ({ event, resolve }) => {
	const reqPath = event.url.pathname;
	const protectedRoute = routeIsProtected(reqPath);
	const token = event.cookies.get('token');
	const validToken = token ? await validateUserToken(token) : false;
	const user: User | null | undefined = token ? getUserDataFromJwt(token) : undefined;

	console.log(`Route: ${reqPath}`);
	console.log(`Valid token: ${validToken}`);
	console.log(`User: ${user}`);

	// set user info on 'locals'
	if (validToken && user) {
		console.log('user done');
		event.locals.user = user;
	}

	// invalidate cookies and user info if token is not valid when trying to access a protected route
	if (!validToken && protectedRoute) {
		console.log('here');
		event.cookies.delete('token');
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
/*const smartRedirects: Handle = async ({ event, resolve }) => {
	const reqPath = event.url.pathname;
	const token = event.cookies.get('token');

	// redirect authenticated users away from login page
	// TODO: improve this when all account types are fully implemented
	if (userIsAuthenticated(token)) {
		// TODO: finish this
		// implement this based on the account role
		throw redirect(303, '/');
	}

	return resolve(event);
}*/

export const handle: Handle = authorizeRouteAccess;
