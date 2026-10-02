import type { INodeProperties } from 'n8n-workflow';
import { customerCreateDescription } from './create';
import { customerGetManyDescription } from './getAll';
import { customerSearchDescription } from './search';
import { customerUpdateDescription } from './update';
import { extractData } from '../../shared/descriptions';

const showOnlyForCustomers = {
	resource: ['customer'],
};

const operationsNeedingCustomerId = [
	'get',
	'update',
	'delete',
	'archive',
	'unarchive',
	'getTransactions',
];

export const customerDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForCustomers },
		options: [
			{
				name: 'Archive',
				value: 'archive',
				action: 'Archive a customer',
				description: 'Archive a customer so they stop earning',
				routing: {
					request: {
						method: 'POST',
						url: '=/customers/{{ $parameter.customerId }}/archive',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a customer',
				description: 'Record a referred sign-up so the referral relationship exists',
				routing: { request: { method: 'POST', url: '/customers' }, output: extractData },
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a customer',
				description: 'Permanently delete a customer',
				routing: {
					request: { method: 'DELETE', url: '=/customers/{{ $parameter.customerId }}' },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a customer',
				description: 'Get a single customer by key, ID or email',
				routing: {
					request: { method: 'GET', url: '=/customers/{{ $parameter.customerId }}' },
					output: extractData,
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many customers',
				description: 'List customers in the program',
				routing: { request: { method: 'GET', url: '/customers' }, output: extractData },
			},
			{
				name: 'Get Transactions',
				value: 'getTransactions',
				action: 'Get transactions for a customer',
				description: 'List every transaction recorded against one customer',
				routing: {
					request: {
						method: 'GET',
						url: '=/customers/{{ $parameter.customerId }}/transactions',
					},
					output: extractData,
				},
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search customers',
				description: 'Find customers by email, key or ID',
				routing: { request: { method: 'GET', url: '/customers:search' }, output: extractData },
			},
			{
				name: 'Unarchive',
				value: 'unarchive',
				action: 'Unarchive a customer',
				description: 'Restore a previously archived customer',
				routing: {
					request: {
						method: 'POST',
						url: '=/customers/{{ $parameter.customerId }}/revoke-archive',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a customer',
				description: 'Change a customer’s details',
				routing: {
					request: { method: 'PUT', url: '=/customers/{{ $parameter.customerId }}' },
					output: extractData,
				},
			},
		],
		default: 'create',
	},
	{
		displayName: 'Customer',
		name: 'customerId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { ...showOnlyForCustomers, operation: operationsNeedingCustomerId },
		},
		description: 'The customer’s key, ID or email address',
	},
	...customerCreateDescription,
	...customerGetManyDescription,
	...customerSearchDescription,
	...customerUpdateDescription,
];
