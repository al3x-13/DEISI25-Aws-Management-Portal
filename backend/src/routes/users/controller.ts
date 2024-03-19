import express, { Request, Response } from "express";
import { getJwtData, validateJwt } from "../../auth/jwt";
import { ApiError } from "../../utils/errors";
import { initServer } from "@ts-rest/express";
import { usersContracts } from "@deisi25/types";
import { getUsers } from "../../lib/users/user-management";
import { User } from "../../lib/users";

const server = initServer();

const usersController = server.router(usersContracts, {
	default: async ({ req }) => {
        const users:User[] = await getUsers();

        const result = [];

        for(let i=0; i < users.length; i++) {
            const user = users[i];

            result.push({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.created_at
            });
        }

		return {
			status: 200,
			body: {
				users: result,
			},
		};
	},
});

export default usersController;
