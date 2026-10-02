import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPartnerUpdate = {
	operation: ['update'],
	resource: ['partner'],
};

export const partnerUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: { show: showOnlyForPartnerUpdate },
		default: {},
		options: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				routing: { send: { type: 'body', property: 'email' } },
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'name' } },
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
