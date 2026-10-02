import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTransactionCreate = {
	operation: ['create'],
	resource: ['transaction'],
};

export const transactionCreateDescription: INodeProperties[] = [
	{
		displayName: 'Identify Customer By',
		name: 'customerIdentifier',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForTransactionCreate },
		options: [
			{ name: 'Customer Key', value: 'key' },
			{ name: 'Customer Email', value: 'email' },
			{ name: 'Customer ID', value: 'id' },
		],
		default: 'key',
		description: 'Which customer field the value below refers to',
	},
	{
		displayName: 'Customer',
		name: 'customerValue',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showOnlyForTransactionCreate },
		description:
			'The customer who paid. Must be the same value used when the customer was created, otherwise the sale is recorded against nobody and no commission is generated.',
		routing: {
			send: {
				type: 'body',
				property: '={{ "customer." + $parameter.customerIdentifier }}',
			},
		},
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		typeOptions: { numberPrecision: 2 },
		default: 0,
		required: true,
		displayOptions: { show: showOnlyForTransactionCreate },
		description: 'Transaction amount that commission is calculated from',
		routing: { send: { type: 'body', property: 'amount' } },
	},
	{
		displayName: 'Transaction Key',
		name: 'key',
		type: 'string',
		default: '',
		displayOptions: { show: showOnlyForTransactionCreate },
		description:
			'Your order or invoice ID. Needed to reverse this transaction on refund. Note that keys are not unique, so sending the same payment twice records two transactions and pays commission twice.',
		routing: { send: { type: 'body', property: 'key' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: { show: showOnlyForTransactionCreate },
		default: {},
		options: [
			{
				displayName: 'Action',
				name: 'action',
				type: 'string',
				default: 'sale',
				description: 'What the transaction represents, for example "sale"',
				routing: { send: { type: 'body', property: 'action' } },
			},
			{
				displayName: 'Created At',
				name: 'created_at',
				type: 'dateTime',
				default: '',
				description: 'Record the transaction at a past date instead of now',
				routing: { send: { type: 'body', property: 'created_at' } },
			},
			{
				displayName: 'Currency',
				name: 'amount_units',
				type: 'string',
				default: '',
				placeholder: 'USD',
				description:
					'Currency code for the amount. The program’s own currency is assumed when omitted.',
				routing: { send: { type: 'body', property: 'amount_units' } },
			},
			{
				displayName: 'Discount Amount',
				name: 'discount_amount',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 0,
				routing: { send: { type: 'body', property: 'discount_amount' } },
			},
			{
				displayName: 'Discount Code',
				name: 'discount_code',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'discount_code' } },
			},
			{
				displayName: 'Gross Amount',
				name: 'gross_amount',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 0,
				description: 'Amount before discounts',
				routing: { send: { type: 'body', property: 'gross_amount' } },
			},
			{
				displayName: 'Product ID',
				name: 'product_id',
				type: 'string',
				default: '',
				description: 'Used by per-product commission rules',
				routing: { send: { type: 'body', property: 'product_id' } },
			},
			{
				displayName: 'Rewardable',
				name: 'rewardable',
				type: 'boolean',
				default: true,
				description: 'Whether this transaction should generate a commission at all',
				routing: { send: { type: 'body', property: 'rewardable' } },
			},
		],
	},
];
