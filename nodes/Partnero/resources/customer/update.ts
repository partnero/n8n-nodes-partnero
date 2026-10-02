import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCustomerUpdate = {
	operation: ['update'],
	resource: ['customer'],
};

export const customerUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		typeOptions: { multipleValueButtonText: 'Add Field' },
		displayOptions: { show: showOnlyForCustomerUpdate },
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
		],
	},
];
