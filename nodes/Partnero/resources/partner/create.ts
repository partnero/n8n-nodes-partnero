import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPartnerCreate = {
	operation: ['create'],
	resource: ['partner'],
};

export const partnerCreateDescription: INodeProperties[] = [
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		required: true,
		displayOptions: { show: showOnlyForPartnerCreate },
		description: 'Email address of the partner. This is how they sign in to the partner portal.',
		routing: { send: { type: 'body', property: 'email' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: { show: showOnlyForPartnerCreate },
		default: {},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'name' } },
			},
			{
				displayName: 'Partner Key',
				name: 'key',
				type: 'string',
				default: '',
				description:
					'The referral key this partner’s links will use. Partnero generates one when omitted.',
				routing: { send: { type: 'body', property: 'key' } },
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description:
					'Optional portal password. Leave empty to let the partner set their own on first sign-in.',
				routing: { send: { type: 'body', property: 'password' } },
			},
			{
				displayName: 'Surname',
				name: 'surname',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'surname' } },
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags to apply to the partner',
				routing: {
					send: {
						type: 'body',
						property: 'tags',
						value: '={{ $value.split(",").map((tag) => tag.trim()).filter((tag) => tag) }}',
					},
				},
			},
		],
	},
];
