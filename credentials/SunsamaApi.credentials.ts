import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class SunsamaApi implements ICredentialType {
	name = 'sunsamaApi';

	displayName = 'Sunsama API';

	documentationUrl = 'https://github.com/robertn702/sunsama-api';

	properties: INodeProperties[] = [
		{
			displayName: 'Authentication Method',
			name: 'authMethod',
			type: 'options',
			default: 'sessionToken',
			options: [
				{
					name: 'Session Token',
					value: 'sessionToken',
					description: 'Use an existing Sunsama session token',
				},
				{
					name: 'Email + Password',
					value: 'emailPassword',
					description: 'Authenticate directly against Sunsama',
				},
			],
		},
		{
			displayName: 'Session Token',
			name: 'sessionToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			placeholder: 'sess_...',
			displayOptions: {
				show: {
					authMethod: ['sessionToken'],
				},
			},
			description: 'Sunsama session token',
		},
		{
			displayName: 'Email',
			name: 'email',
			type: 'string',
			default: '',
			placeholder: 'you@example.com',
			displayOptions: {
				show: {
					authMethod: ['emailPassword'],
				},
			},
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			displayOptions: {
				show: {
					authMethod: ['emailPassword'],
				},
			},
		},
	];
}
