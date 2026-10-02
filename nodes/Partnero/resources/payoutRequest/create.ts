import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPayoutRequestCreate = {
	operation: ['create'],
	resource: ['payoutRequest'],
};

const showForGateway = (gateway: string) => ({
	...showOnlyForPayoutRequestCreate,
	gateway: [gateway],
});

export const payoutRequestCreateDescription: INodeProperties[] = [
	{
		displayName: 'Identify Partner By',
		name: 'partnerIdentifier',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForPayoutRequestCreate },
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
		displayOptions: { show: showOnlyForPayoutRequestCreate },
		description: 'The partner being paid. They must be active, or the request is refused.',
		routing: {
			send: {
				type: 'body',
				property: '={{ "partner." + $parameter.partnerIdentifier }}',
			},
		},
	},
	{
		displayName: 'Currency',
		name: 'amount_units',
		type: 'string',
		default: 'usd',
		required: true,
		displayOptions: { show: showOnlyForPayoutRequestCreate },
		description:
			'Currency of the balance to pay out, such as usd or eur. A partner can hold a balance in several currencies and each is paid out separately. The payout covers their whole unpaid balance in this currency.',
		routing: { send: { type: 'body', property: 'amount_units' } },
	},
	{
		displayName: 'Payout Method',
		name: 'gateway',
		type: 'options',
		displayOptions: { show: showOnlyForPayoutRequestCreate },
		options: [
			{
				name: 'Automatic (Partner’s Choice)',
				value: '',
				description: 'Use the method and details the partner saved in their portal',
			},
			{ name: 'Crypto', value: 'crypto' },
			{ name: 'PayPal', value: 'paypal' },
			{ name: 'Venmo', value: 'venmo' },
			{ name: 'Wise', value: 'wise' },
		],
		default: '',
		description:
			'How the partner should be paid. Whichever method you pick, Partnero needs payout details to go with it — either saved by the partner or filled in below. The request fails if there are none.',
		routing: { send: { type: 'body', property: 'gateway', value: '={{ $value || undefined }}' } },
	},
	{
		displayName:
			'Bank details cannot be sent through the API. The partner must save them in their portal first.',
		name: 'wiseNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showForGateway('wise') },
	},
	{
		displayName: 'PayPal Email',
		name: 'paypalUsername',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		required: true,
		displayOptions: { show: showForGateway('paypal') },
		description: 'PayPal account to send the money to',
		routing: { send: { type: 'body', property: 'payout_settings.username' } },
	},
	{
		displayName: 'Wallet Address',
		name: 'walletAddress',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showForGateway('crypto') },
		description: 'Wallet to send the money to',
		routing: { send: { type: 'body', property: 'payout_settings.wallet_address' } },
	},
	{
		displayName: 'Send To',
		name: 'venmoRecipientType',
		type: 'options',
		displayOptions: { show: showForGateway('venmo') },
		options: [
			{ name: 'Username', value: 'USER_HANDLE' },
			{ name: 'Email', value: 'EMAIL' },
			{ name: 'Phone', value: 'PHONE' },
		],
		default: 'USER_HANDLE',
		description: 'Which Venmo identifier to pay',
		routing: { send: { type: 'body', property: 'payout_settings.recipient_type' } },
	},
	{
		displayName: 'Venmo Username',
		name: 'venmoUserHandle',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { ...showForGateway('venmo'), venmoRecipientType: ['USER_HANDLE'] },
		},
		description: 'Venmo username to pay',
		routing: { send: { type: 'body', property: 'payout_settings.user_handle' } },
	},
	{
		displayName: 'Venmo Email',
		name: 'venmoEmail',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		required: true,
		displayOptions: { show: { ...showForGateway('venmo'), venmoRecipientType: ['EMAIL'] } },
		description: 'Venmo email address to pay',
		routing: { send: { type: 'body', property: 'payout_settings.email' } },
	},
	{
		displayName: 'Venmo Phone',
		name: 'venmoPhone',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showForGateway('venmo'), venmoRecipientType: ['PHONE'] } },
		description: 'Venmo phone number to pay',
		routing: { send: { type: 'body', property: 'payout_settings.phone' } },
	},
	{
		displayName: 'Recipient Name',
		name: 'venmoName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showForGateway('venmo') },
		description: 'Name on the Venmo account',
		routing: { send: { type: 'body', property: 'payout_settings.name' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: { show: showOnlyForPayoutRequestCreate },
		default: {},
		options: [
			{
				displayName: 'Crypto Currency',
				name: 'type',
				type: 'string',
				default: '',
				placeholder: 'USDT',
				description:
					'Which coin to pay in, when paying by crypto. Must be one of the currencies your program supports.',
				routing: { send: { type: 'body', property: 'payout_settings.type' } },
			},
			{
				displayName: 'Recipient Address',
				name: 'address',
				type: 'string',
				default: '',
				description: 'Postal address to record on the payout, when paying by PayPal',
				routing: { send: { type: 'body', property: 'payout_settings.address' } },
			},
			{
				displayName: 'Recipient Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name to record on the payout, when paying by PayPal or crypto',
				routing: { send: { type: 'body', property: 'payout_settings.name' } },
			},
			{
				displayName: 'Reward IDs',
				name: 'reward_ids',
				type: 'string',
				default: '',
				placeholder: '101,102',
				description:
					'Comma-separated reward IDs to pay out, instead of the partner’s whole unpaid balance. Only works if your program lets partners choose which commissions to cash out.',
				routing: {
					send: {
						type: 'body',
						property: 'reward_ids',
						value:
							'={{ $value.split(",").map((id) => Number(id.trim())).filter((id) => id) }}',
					},
				},
			},
			{
				displayName: 'Tax ID',
				name: 'tax_id',
				type: 'string',
				default: '',
				description: 'Tax ID to record on the payout, when paying by PayPal',
				routing: { send: { type: 'body', property: 'payout_settings.tax_id' } },
			},
		],
	},
];
