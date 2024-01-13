import type { User } from "$lib/domain/user";

// TODO: update this
const UNPROTECTED_ROUTES = [
	"/",
	"/login"
];

function userCanAccessRoute(route: string, user: User | undefined): boolean {
	if (!user) {
		if (routeIsProtected(route)) {
			return false;
		}
		return true;
	}

	if (user.role === 'admin') {
		if (isRootRoute(route)) {
			return false;
		}
		return true;
	}

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
	return route.startsWith('/root');
}

export { userCanAccessRoute, routeIsProtected };
