import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = ({ cookies }) => {
	const token = cookies.get('token');
	cookies.delete('token', { path: '/' });
	throw redirect(303, '/');
}
