import type { INodeProperties } from 'n8n-workflow';
import { limitField, returnAllField, sortField } from '../../shared/descriptions';

const showOnlyForCustomerGetMany = {
	operation: ['getAll'],
	resource: ['customer'],
};

export const customerGetManyDescription: INodeProperties[] = [
	{
		...returnAllField,
		displayOptions: { show: showOnlyForCustomerGetMany },
	},
	{
		...limitField,
		displayOptions: { show: { ...showOnlyForCustomerGetMany, returnAll: [false] } },
	},
	{
		...sortField,
		displayOptions: { show: showOnlyForCustomerGetMany },
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		typeOptions: { multipleValueButtonText: 'Add Filter' },
		displayOptions: { show: showOnlyForCustomerGetMany },
		default: {},
		options: [
			{
				displayName: 'Partner Key',
				name: 'partner_key',
				type: 'string',
				default: '',
				description: 'Return only customers referred by the partner with this key',
				routing: { request: { qs: { partner_key: '={{ $value }}' } } },
			},
			{
				displayName: 'Partner Email',
				name: 'partner_email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Return only customers referred by the partner with this email',
				routing: { request: { qs: { partner_email: '={{ $value }}' } } },
			},
		],
	},
];
