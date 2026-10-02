import type { INodeProperties } from 'n8n-workflow';
import { limitField, returnAllField, sortField } from '../../shared/descriptions';

const showOnlyForPayoutRequestGetMany = {
	operation: ['getAll'],
	resource: ['payoutRequest'],
};

const showOnlyForPayoutRequestSearch = {
	operation: ['search'],
	resource: ['payoutRequest'],
};

export const payoutRequestGetManyDescription: INodeProperties[] = [
	{
		...returnAllField,
		displayOptions: { show: showOnlyForPayoutRequestGetMany },
	},
	{
		...limitField,
		displayOptions: { show: { ...showOnlyForPayoutRequestGetMany, returnAll: [false] } },
	},
	{
		...sortField,
		displayOptions: { show: showOnlyForPayoutRequestGetMany },
	},
];

export const payoutRequestSearchDescription: INodeProperties[] = [
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: { show: showOnlyForPayoutRequestSearch },
		default: {},
		description: 'Narrow the results. Combining filters requires a payout to match all of them.',
		options: [
			{
				displayName: 'Currency',
				name: 'amount_units',
				type: 'string',
				default: '',
				placeholder: 'usd',
				description: 'Return only payouts in this currency',
				routing: { request: { qs: { amount_units: '={{ $value }}' } } },
			},
			{
				displayName: 'Partner Email',
				name: 'partner_email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Return only payouts belonging to the partner with this email',
				routing: { request: { qs: { partner_email: '={{ $value }}' } } },
			},
			{
				displayName: 'Partner ID',
				name: 'partner_id',
				type: 'string',
				default: '',
				description: 'Return only payouts belonging to the partner with this ID',
				routing: { request: { qs: { partner_id: '={{ $value }}' } } },
			},
			{
				displayName: 'Partner Key',
				name: 'partner_key',
				type: 'string',
				default: '',
				description: 'Return only payouts belonging to the partner with this referral key',
				routing: { request: { qs: { partner_key: '={{ $value }}' } } },
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'requested',
				description:
					'Return only payouts in this state. Use Requested to find payouts waiting on you.',
				options: [
					{ name: 'Approved', value: 'approved' },
					{ name: 'Finished', value: 'finished' },
					{ name: 'Rejected', value: 'rejected' },
					{ name: 'Requested', value: 'requested' },
					{ name: 'Resubmit Requested', value: 'resubmit_requested' },
					{ name: 'Resubmitted', value: 'resubmitted' },
				],
				routing: { request: { qs: { status: '={{ $value }}' } } },
			},
		],
	},
	{
		...returnAllField,
		displayOptions: { show: showOnlyForPayoutRequestSearch },
	},
	{
		...limitField,
		displayOptions: { show: { ...showOnlyForPayoutRequestSearch, returnAll: [false] } },
	},
	{
		...sortField,
		displayOptions: { show: showOnlyForPayoutRequestSearch },
	},
];
