import type { User } from "$lib/domain/user";

// TODO: update this
const UNPROTECTED_ROUTES = [
	"/",
	"/login",
	"/logout"
];

function userCanAccessRoute(route: string, user: User | undefined): boolean {
	if (!user) {
		if (routeIsProtected(route)) {
			return false;
		}
		return true;
	}

	if (user.role === 'root') {
		if (isRootRoute(route) || !routeIsProtected(route)) {
			return true;
		}
		return false;
	}

	if (user.role !== 'root') {
		return !isRootRoute(route);
	}

	// TODO: update this when more routes are added
	// handle 'admin' routes as well when those are added

	return true;
}

function routeIsProtected(route: string): boolean {
	for (let i = 0; i < UNPROTECTED_ROUTES.length; i++) {
		if (UNPROTECTED_ROUTES[i] === route) {
			return false;
		}
	}
	return true;
}

function isRootRoute(route: string): boolean {
	return route.startsWith('/root') || route.startsWith('/users');
}

export { userCanAccessRoute, routeIsProtected };
