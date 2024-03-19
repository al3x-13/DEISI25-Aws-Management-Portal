import { initContract } from '@ts-rest/core';
import { testContract } from './lib/api/contracts/test-contract';
import { authContract } from './lib/api/contracts/auth-contract';
import { protectedContract } from './lib/api/contracts/protected-contract';
import { ec2Contract } from './lib/api/contracts/resources/ec2-contract';
import { userContract } from './lib/api/contracts/user-contract';
import { usersContracts } from './lib/api/contracts/users-contracts';


/* ##### UNPROTECTED ROUTES ##### */
// Unprotected routes contract
export * from './lib/api/contracts/unprotected-contract';
// Test contract
export * from './lib/api/contracts/test-contract';
// Auth contract
export * from './lib/api/contracts/auth-contract';

/* ##### PROTECTED ROUTES ##### */
// Protected routes contract
export * from './lib/api/contracts/protected-contract';
// User contract
export * from './lib/api/contracts/user-contract';
// EC2 contract
export * from './lib/api/contracts/resources/ec2-contract';
// Users contracts
export * from './lib/api/contracts/users-contracts';

/* ##### MAIN CONTRACT ##### */
const c = initContract();
export const apiDocsContract = c.router(
	{
		test: testContract,
		auth: authContract,
		ec2: ec2Contract,
		user: userContract,
		users: usersContracts,
	},
);


/* ##### RESOURCES ##### */
export * from './lib/resources/types';


/* ##### MISC ##### */
// API error types
export * from './lib/api/types/error';
// Response Object Schemas
export * from './lib/api/schemas/response-objects';
