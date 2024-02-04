import { generateOpenApi } from "@ts-rest/open-api";
import { writeFile } from "fs";
import path from "path";
import { apiDocsContract } from "@deisi25/types/index";
import { buildDocsFromTSRestOAS } from "./docs";
import { OpenAPIObject } from "openapi3-ts/oas31";

const docs = generateOpenApi(apiDocsContract,
	{
		info: {
			title: 'Backend API Docs',
			description: 'API documentation for AWS Management Portal backend API.',
			version: '1.0.0',
		},
	},
	{
		jsonQuery: true,
		setOperationId: true
	}
);

const docsOAS = buildDocsFromTSRestOAS(docs as OpenAPIObject);
const docsJson = JSON.stringify(docsOAS, null, 2);

writeFile(path.resolve(__dirname, './oas-schema.json'), docsJson, 'utf8', (err) => {
	if (err) {
		console.error('Error while writing API Docs file (JSON): ', err);
		return;
	}
	console.log("API Docs JSON file successfully created ('oas-schema.json')");
});
