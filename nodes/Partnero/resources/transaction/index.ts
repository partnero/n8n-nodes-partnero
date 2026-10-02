import type { INodeProperties } from 'n8n-workflow';
import { transactionCreateDescription } from './create';
import { transactionGetManyDescription } from './getAll';
import { extractData } from '../../shared/descriptions';

const showOnlyForTransactions = {
	resource: ['transaction'],
};

const operationsNeedingTransactionId = ['archive', 'delete', 'get', 'unarchive'];

export const transactionDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForTransactions },
		options: [
			{
				name: 'Archive',
				value: 'archive',
				action: 'Archive a transaction',
				description: 'Archive a transaction without deleting it',
				routing: {
					request: {
						method: 'POST',
						url: '=/transactions/{{ $parameter.transactionId }}/archive',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a transaction',
				description: 'Record a sale so commission is calculated',
				routing: { request: { method: 'POST', url: '/transactions' }, output: extractData },
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a transaction',
				description: 'Reverse a transaction and its commission, as you would on a refund',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/transactions/{{ $parameter.transactionId }}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a transaction',
				description: 'Get a single transaction, including any rewards it generated',
				routing: {
					request: { method: 'GET', url: '=/transactions/{{ $parameter.transactionId }}' },
					output: extractData,
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many transactions',
				description: 'List transactions in the program',
				routing: { request: { method: 'GET', url: '/transactions' }, output: extractData },
			},
			{
				name: 'Unarchive',
				value: 'unarchive',
				action: 'Unarchive a transaction',
				description: 'Restore a previously archived transaction',
				routing: {
					request: {
						method: 'POST',
						url: '=/transactions/{{ $parameter.transactionId }}/revoke-archive',
					},
				},
			},
		],
		default: 'create',
	},
	{
		displayName: 'Transaction Key',
		name: 'transactionId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { ...showOnlyForTransactions, operation: operationsNeedingTransactionId },
		},
		description: 'The transaction’s key — normally the order or invoice ID you recorded it with',
	},
	...transactionCreateDescription,
	...transactionGetManyDescription,
];
