import type { INodeProperties } from 'n8n-workflow';
import { extractData, limitField, returnAllField, sortField } from '../../shared/descriptions';

const showOnlyForLeads = {
	resource: ['lead'],
};

const showOnlyForLeadCreate = {
	operation: ['create'],
	resource: ['lead'],
};

const showOnlyForLeadGetMany = {
	operation: ['getAll'],
	resource: ['lead'],
};

export const leadDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForLeads },
		options: [
			{
				name: 'Convert',
				value: 'convert',
				action: 'Convert a lead',
				description: 'Mark a lead as converted and record the commissionable amount',
				routing: { request: { method: 'POST', url: '/leads/convert' }, output: extractData },
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a lead',
				description: 'Submit a lead on behalf of a partner',
				routing: { request: { method: 'POST', url: '/leads' }, output: extractData },
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a lead',
				description: 'Permanently delete a lead',
				routing: {
					request: { method: 'DELETE', url: '=/leads/{{ $parameter.leadId }}' },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a lead',
				description: 'Get a single lead',
				routing: {
					request: { method: 'GET', url: '=/leads/{{ $parameter.leadId }}' },
					output: extractData,
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many leads',
				description: 'List leads in the program',
				routing: { request: { method: 'GET', url: '/leads' }, output: extractData },
			},
			{
				name: 'Reject',
				value: 'reject',
				action: 'Reject a lead',
				description: 'Mark a lead as rejected',
				routing: { request: { method: 'POST', url: '/leads/reject' }, output: extractData },
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Lead ID',
		name: 'leadId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { ...showOnlyForLeads, operation: ['get', 'delete'] },
		},
		description: 'Numeric ID of the lead',
	},
	{
		displayName: 'Lead ID',
		name: 'id',
		type: 'number',
		default: 0,
		required: true,
		displayOptions: {
			show: { ...showOnlyForLeads, operation: ['convert', 'reject'] },
		},
		description: 'Numeric ID of the lead',
		routing: { send: { type: 'body', property: 'id' } },
	},
	{
		displayName: 'Commission Transaction Amount',
		name: 'commission_transaction_amount',
		type: 'number',
		typeOptions: { numberPrecision: 2 },
		default: 0,
		required: true,
		displayOptions: {
			show: { ...showOnlyForLeads, operation: ['convert'] },
		},
		description: 'Amount the commission is calculated from when the lead converts',
		routing: { send: { type: 'body', property: 'commission_transaction_amount' } },
	},
	{
		displayName: 'Identify Partner By',
		name: 'partnerIdentifier',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForLeadCreate },
		options: [
			{ name: 'Partner Key', value: 'key' },
			{ name: 'Partner Email', value: 'email' },
			{ name: 'Partner ID', value: 'id' },
		],
		default: 'key',
		description: 'Which partner field the value below refers to',
	},
	{
		displayName: 'Partner',
		name: 'partnerValue',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showOnlyForLeadCreate },
		description: 'The partner who submitted this lead. Leads always belong to a partner.',
		routing: {
			send: {
				type: 'body',
				property: '={{ "partner." + $parameter.partnerIdentifier }}',
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showOnlyForLeadCreate },
		description: 'Name of the lead',
		routing: { send: { type: 'body', property: 'name' } },
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		required: true,
		displayOptions: { show: showOnlyForLeadCreate },
		description: 'Email address of the lead',
		routing: { send: { type: 'body', property: 'email' } },
	},
	{
		...returnAllField,
		displayOptions: { show: showOnlyForLeadGetMany },
	},
	{
		...limitField,
		displayOptions: { show: { ...showOnlyForLeadGetMany, returnAll: [false] } },
	},
	{
		...sortField,
		displayOptions: { show: showOnlyForLeadGetMany },
	},
];
