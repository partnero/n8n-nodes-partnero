import type { INodeProperties } from 'n8n-workflow';
import { limitField, returnAllField, sortField } from '../../shared/descriptions';

const showOnlyForPartnerGetMany = {
	operation: ['getAll'],
	resource: ['partner'],
};

const showOnlyForPartnerSearch = {
	operation: ['search'],
	resource: ['partner'],
};

export const partnerGetManyDescription: INodeProperties[] = [
	{
		...returnAllField,
		displayOptions: { show: showOnlyForPartnerGetMany },
	},
	{
		...limitField,
		displayOptions: { show: { ...showOnlyForPartnerGetMany, returnAll: [false] } },
	},
	{
		...sortField,
		displayOptions: { show: showOnlyForPartnerGetMany },
	},
];

export const partnerSearchDescription: INodeProperties[] = [
	{
		displayName: 'Search By',
		name: 'searchBy',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForPartnerSearch },
		options: [
			{ name: 'Partner Key', value: 'key' },
			{ name: 'Partner ID', value: 'id' },
		],
		default: 'key',
		description: 'Which field to search on',
	},
	{
		displayName: 'Value',
		name: 'searchValue',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showOnlyForPartnerSearch },
		description: 'Value to search for. Partial values match.',
		routing: {
			send: {
				type: 'query',
				property: '={{ $parameter.searchBy }}',
			},
		},
	},
	{
		...returnAllField,
		displayOptions: { show: showOnlyForPartnerSearch },
	},
	{
		...limitField,
		displayOptions: { show: { ...showOnlyForPartnerSearch, returnAll: [false] } },
	},
];
