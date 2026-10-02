import type { INodeProperties } from 'n8n-workflow';
import { payoutRequestCreateDescription } from './create';
import {
	payoutRequestGetManyDescription,
	payoutRequestSearchDescription,
} from './getAll';
import { extractData } from '../../shared/descriptions';

const showOnlyForPayoutRequests = {
	resource: ['payoutRequest'],
};

const operationsNeedingPayoutRequestId = ['approve', 'get', 'markAsPaid'];

export const payoutRequestDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForPayoutRequests },
		options: [
			{
				name: 'Approve',
				value: 'approve',
				action: 'Approve a payout request',
				description:
					'Approve a payout a partner has requested. Only works while it is still awaiting a decision.',
				routing: {
					request: {
						method: 'POST',
						url: '=/payout_requests/{{ $parameter.payoutRequestId }}/approve',
					},
					output: extractData,
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a payout request',
				description: 'Raise a payout for a partner yourself, without waiting for them to ask',
				routing: { request: { method: 'POST', url: '/payout_requests' }, output: extractData },
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a payout request',
				description: 'Get a single payout request, including its status and amount',
				routing: {
					request: {
						method: 'GET',
						url: '=/payout_requests/{{ $parameter.payoutRequestId }}',
					},
					output: extractData,
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many payout requests',
				description: 'List payout requests in the program',
				routing: { request: { method: 'GET', url: '/payout_requests' }, output: extractData },
			},
			{
				name: 'Mark as Paid',
				value: 'markAsPaid',
				action: 'Mark a payout request as paid',
				description:
					'Record that you have sent the money, which closes the payout and clears the balance. Only works once the payout is approved.',
				routing: {
					request: {
						method: 'POST',
						url: '=/payout_requests/{{ $parameter.payoutRequestId }}/mark_as_paid',
					},
					output: extractData,
				},
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search payout requests',
				description: 'Find payout requests by partner, status or currency',
				routing: {
					request: { method: 'GET', url: '/payout_requests:search' },
					output: extractData,
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Payout Request ID',
		name: 'payoutRequestId',
		type: 'number',
		default: 0,
		required: true,
		displayOptions: {
			show: { ...showOnlyForPayoutRequests, operation: operationsNeedingPayoutRequestId },
		},
		description: 'Numeric ID of the payout request, as returned by Get Many or Search',
	},
	...payoutRequestCreateDescription,
	...payoutRequestGetManyDescription,
	...payoutRequestSearchDescription,
];
