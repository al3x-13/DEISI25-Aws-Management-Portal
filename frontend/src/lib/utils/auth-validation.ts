async function validateUserToken(token: string): Promise<boolean> {
	return fetch(
		"http://localhost:3000/user/validate",
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Cookie": `token=${token}`,
			},
		}
	).then(async (res) => {
		const data = await res.json();

		if (res.status != 200) {
			return false;
		}

		return data.valid;
	});
}

export { validateUserToken };
