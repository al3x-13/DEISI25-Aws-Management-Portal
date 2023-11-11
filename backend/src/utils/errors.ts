interface ApiErrorJson {
	error: string;
	description?: string;
};

class ApiError {
	private _error: string;
	private _description?: string;

	constructor(error: string, description?: string) {
		this._error = error;
		this._description = description;
	}

	public get error() : string {
		return this._error;
	}

	public get description() : string | undefined {
		return this._description;
	}

	public toJSON(): ApiErrorJson {
		return {
			error: this._error,
			description: this._description,
		};
	}
}
