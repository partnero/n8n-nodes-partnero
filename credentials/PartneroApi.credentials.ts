import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PartneroApi implements ICredentialType {
	name = 'partneroApi';

	displayName = 'Partnero API';

	icon: Icon = { light: 'file:../icons/partnero.svg', dark: 'file:../icons/partnero.dark.svg' };

	documentationUrl = 'https://docs.partnero.com/api-reference/introduction';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Found in your Partnero dashboard under Integration → API. The key belongs to a single program, so add one credential per program.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials?.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.partnero.com/v1',
			url: '/test',
			method: 'GET',
		},
	};
}
