import type { INodeProperties } from 'n8n-workflow';
import { limitField, returnAllField, sortField } from '../../shared/descriptions';

const showOnlyForTransactionGetMany = {
	operation: ['getAll'],
	resource: ['transaction'],
};

export const transactionGetManyDescription: INodeProperties[] = [
	{
		...returnAllField,
		displayOptions: { show: showOnlyForTransactionGetMany },
	},
	{
		...limitField,
		displayOptions: { show: { ...showOnlyForTransactionGetMany, returnAll: [false] } },
	},
	{
		...sortField,
		displayOptions: { show: showOnlyForTransactionGetMany },
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: { show: showOnlyForTransactionGetMany },
		default: {},
		options: [
			{
				displayName: 'Partner Email',
				name: 'partner_email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Return only transactions credited to the partner with this email',
				routing: { request: { qs: { partner_email: '={{ $value }}' } } },
			},
			{
				displayName: 'Partner Key',
				name: 'partner_key',
				type: 'string',
				default: '',
				description: 'Return only transactions credited to the partner with this key',
				routing: { request: { qs: { partner_key: '={{ $value }}' } } },
			},
			{
				displayName: 'Transaction Key',
				name: 'key',
				type: 'string',
				default: '',
				description: 'Return only transactions with this order or invoice ID',
				routing: { request: { qs: { key: '={{ $value }}' } } },
			},
		],
	},
];
