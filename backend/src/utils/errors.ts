import { ApiError as ApiErrorJson } from "@deisi25/types/lib/api/types/error";

type ApiErrorData = {
	status: number;
	error: ApiErrorJson;
};

class ApiError {
	private _type: string;
	private _message?: string;
	private _hint?: string;

	constructor(type: string, message?: string, hint?: string) {
		this._type = type;
		this._message = message;
		this._hint = hint;
	}

	public get type() : string {
		return this._type;
	}

	public get message() : string | undefined {
		return this._message;
	}

	public get hint() : string | undefined {
		return this._hint;
	}

	public toJSON(): ApiErrorJson {
		return {
			type: this._type,
			message: this._message,
			hint: this._hint,
		};
	}
}

export { ApiError, type ApiErrorData };
