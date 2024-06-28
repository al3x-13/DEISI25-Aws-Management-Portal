import { SSHKey } from "@deisi25/types/lib/resources/ssh/ssh";
import * as crypto from "crypto";
import dotenv from "dotenv";
import db from "../../../db/db";


dotenv.config();
const sshEncryptionAlgorithm = 'aes-256-cbc';


/**
 * Encrypt SSH key value with AES-256-CBC.
 * @returns Encrypted key value
 */
export function encryptSSHkey(sshKey: string): string {
	const secret = process.env.SSH_SECRET!.substring(0, 32);
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(sshEncryptionAlgorithm, Buffer.from(secret), iv);
    let encrypted = cipher.update(sshKey);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('base64');
}


/**
 * Decrypt SSH key value encrypted with AES-256-CBC.
 * @returns Decrypted key value
 */
export function decryptSSHKey(sshKey: string): string {
	const secret = process.env.SSH_SECRET!.substring(0, 32);
	const textParts = sshKey.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'base64');
    const decipher = crypto.createDecipheriv(sshEncryptionAlgorithm, Buffer.from(secret), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}


/**
 * Check if the given SSH key is owned (created by) the given user.
 * @param keyName SSH key name
 * @param userId User id
 * @returns Whether the user owns the key
 */
export async function isSSHKeyOwner(keyName: string, userId: number): Promise<boolean> {
	const query = await db.query(
		'SELECT name, created_by FROM ssh_keys WHERE name = $1',
		[ keyName ]
	);
	return query.rows[0].created_by === userId;
}


/**
 * Get all SSH keys accessible by the given user.
 * @param userId User id
 * @returns All accessible SSH keys
 */
export async function getUserAccessibleSSHKeys(userId: number): Promise<SSHKey[]> {
	const query = await db.query(
		"SELECT * FROM ssh_keys WHERE key_access_type = 'public' OR created_by = $1",
		[ userId ]
	);

	const data = query.rows;
	const keys: SSHKey[] = [];

	for (let i = 0; i < data.length; i++) {
		const key = data[i];
		keys.push({
			Name: key.name,
			KeyPairType: key.key_pair_type,
			PrivateKeyFileFormat: key.private_key_file_format,
			KeyAccessType: key.key_access_type,
			PrivateKeyValue: decryptSSHKey(key.private_key_value),
		});
	}

	return keys;
}


/**
 * Check if the given key name is available (i.e. not taken).
 * @param keyName Key name
 * @returns Whether the given name is available
 */
export async function checkKeyNameAvailability(keyName: string): Promise<boolean> {
	const query = await db.query('SELECT name FROM ssh_keys');

	for (let i = 0; i < query.rows.length; i++) {
		const name: string = query.rows[i].name;
		if (name.toLowerCase() === keyName.toLowerCase()) {
			return false;
		}
	}

	return true;
}
