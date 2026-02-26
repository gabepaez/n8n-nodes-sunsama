import type { IDataObject, IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { SunsamaClient } from 'sunsama-api';

type CredentialContext = Pick<IExecuteFunctions, 'getCredentials'> | Pick<ILoadOptionsFunctions, 'getCredentials'>;

type AuthMethod = 'sessionToken' | 'emailPassword';

interface SunsamaCredentials extends IDataObject {
	authMethod?: AuthMethod;
	sessionToken?: string;
	email?: string;
	password?: string;
}

export async function getAuthenticatedClient(context: CredentialContext): Promise<SunsamaClient> {
	const credentials = (await context.getCredentials('sunsamaApi')) as unknown as SunsamaCredentials;
	const authMethod = (credentials.authMethod ?? 'sessionToken') as AuthMethod;

	if (authMethod === 'sessionToken') {
		const sessionToken = credentials.sessionToken?.toString().trim();
		if (!sessionToken) {
			throw new Error('Sunsama credentials are missing a session token.');
		}

		return new SunsamaClient({ sessionToken });
	}

	const email = credentials.email?.toString().trim();
	const password = credentials.password?.toString();

	if (!email || !password) {
		throw new Error('Sunsama credentials are missing email/password.');
	}

	const client = new SunsamaClient();
	await client.login(email, password);
	return client;
}

export function getOptionalString(
	context: IExecuteFunctions,
	name: string,
	itemIndex: number,
): string | undefined {
	const raw = context.getNodeParameter(name, itemIndex, '') as unknown;
	if (typeof raw !== 'string') {
		return undefined;
	}
	const value = raw.trim();
	return value.length > 0 ? value : undefined;
}

export function getStringList(
	context: IExecuteFunctions,
	name: string,
	itemIndex: number,
): string[] | undefined {
	const raw = context.getNodeParameter(name, itemIndex, []) as string[] | string;

	if (Array.isArray(raw)) {
		const cleaned = raw.map((value) => value.trim()).filter((value) => value.length > 0);
		return cleaned.length > 0 ? cleaned : undefined;
	}

	const values = raw
		.split(',')
		.map((value) => value.trim())
		.filter((value) => value.length > 0);

	return values.length > 0 ? values : undefined;
}

export function parseJsonParameter<T>(
	context: IExecuteFunctions,
	name: string,
	itemIndex: number,
	label: string,
): T {
	const raw = context.getNodeParameter(name, itemIndex, '') as unknown;

	if (typeof raw === 'string') {
		const value = raw.trim();
		if (!value) {
			throw new NodeOperationError(context.getNode(), `${label} is required.`, { itemIndex });
		}

		try {
			return JSON.parse(value) as T;
		} catch (error) {
			throw new NodeOperationError(context.getNode(), `${label} must be valid JSON.`, {
				itemIndex,
				description: error instanceof Error ? error.message : undefined,
			});
		}
	}

	if (raw && typeof raw === 'object') {
		return raw as T;
	}

	throw new NodeOperationError(context.getNode(), `${label} is required.`, { itemIndex });
}

export function ensureValue(
	context: IExecuteFunctions,
	itemIndex: number,
	value: string | undefined,
	label: string,
): string {
	if (!value) {
		throw new NodeOperationError(context.getNode(), `${label} is required.`, { itemIndex });
	}

	return value;
}

export function normalizeDateString(dateValue: string): string {
	return new Date(dateValue).toISOString();
}

