import type { INodeProperties } from 'n8n-workflow';
import { limitField, returnAllField } from '../../shared/descriptions';

const showOnlyForCustomerSearch = {
	operation: ['search'],
	resource: ['customer'],
};

export const customerSearchDescription: INodeProperties[] = [
	{
		displayName: 'Search By',
		name: 'searchBy',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForCustomerSearch },
		options: [
			{ name: 'Email', value: 'email' },
			{ name: 'Customer Key', value: 'key' },
			{ name: 'Customer ID', value: 'id' },
		],
		default: 'email',
		description:
			'Which field to search on. Searching by customer key is available in refer-a-friend programs only.',
	},
	{
		displayName: 'Value',
		name: 'searchValue',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showOnlyForCustomerSearch },
		description: 'Value to search for',
		routing: {
			send: {
				type: 'query',
				property: '={{ $parameter.searchBy }}',
			},
		},
	},
	{
		...returnAllField,
		displayOptions: { show: showOnlyForCustomerSearch },
	},
	{
		...limitField,
		displayOptions: { show: { ...showOnlyForCustomerSearch, returnAll: [false] } },
	},
];
