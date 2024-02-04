import { initContract } from '@ts-rest/core';
import { testContract } from './lib/api/contracts/test-contract';
import { authContract } from './lib/api/contracts/auth-contract';
import { protectedContract } from './lib/api/contracts/protected-contract';
import { ec2Contract } from './lib/api/contracts/resources/ec2-contract';
import { userContract } from './lib/api/contracts/user-contract';


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

/* ##### MAIN CONTRACT ##### */
const c = initContract();
export const apiDocsContract = c.router(
	{
		test: testContract,
		auth: authContract,
		ec2: ec2Contract,
		user: userContract,
	},
);

/* ##### MISC ##### */
// API error types
export * from './lib/api/types/error';
// Response Object Schemas
export * from './lib/api/schemas/response-objects';
