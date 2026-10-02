import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPartnerAddReward = {
	operation: ['addReward'],
	resource: ['partner'],
};

export const partnerAddRewardDescription: INodeProperties[] = [
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		typeOptions: { minValue: 0.01, numberPrecision: 2 },
		default: 0,
		required: true,
		displayOptions: { show: showOnlyForPartnerAddReward },
		description: 'Bonus amount to credit to the partner, in the program’s currency',
		routing: { send: { type: 'body', property: 'amount' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: { show: showOnlyForPartnerAddReward },
		default: {},
		options: [
			{
				displayName: 'Date',
				name: 'date',
				type: 'dateTime',
				default: '',
				description: 'Date to record the reward against. Defaults to now.',
				routing: { send: { type: 'body', property: 'date' } },
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				default: '',
				description: 'Why the bonus was given. Visible when reviewing the reward.',
				routing: { send: { type: 'body', property: 'note' } },
			},
		],
	},
];
