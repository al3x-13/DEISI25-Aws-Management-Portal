import { z } from "zod";
import { extendZodWithOpenApi } from "@anatine/zod-openapi";

extendZodWithOpenApi(z);

export enum SSHKeyPairType {
	RSA = "rsa",
	ED25519 = "ed25519"
};

export enum SSHPrivateKeyFileFormat {
	PEM = ".pem",
	PPK = ".ppk"
};

export enum SSHKeyAccessType {
	Private = "private",
	Public = "public"
};

export const SSHKeySchema = z.object({
	Name: z.string().openapi({
		example: 'webserver-ssh-key'
	}),
	KeyPairType: z.nativeEnum(SSHKeyPairType).openapi({
		example: SSHKeyPairType.RSA
	}),
	PrivateKeyFileFormat: z.nativeEnum(SSHPrivateKeyFileFormat).openapi({
		example: SSHPrivateKeyFileFormat.PEM
	}),
	KeyAccessType: z.nativeEnum(SSHKeyAccessType).openapi({
		example: SSHKeyAccessType.Private
	}),
	PrivateKeyValue: z.string()
}).openapi({
	title: 'SSH Key',
	description: 'Describes an AWS SSH Key'
});
export type SSHKey = z.infer<typeof SSHKeySchema>;
