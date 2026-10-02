import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCustomerCreate = {
	operation: ['create'],
	resource: ['customer'],
};

export const customerCreateDescription: INodeProperties[] = [
	{
		displayName: 'Customer Key',
		name: 'key',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showOnlyForCustomerCreate },
		description:
			'Your own identifier for this customer, such as a user ID or email. Use the same value when reporting transactions, otherwise the sale cannot be matched back to this customer.',
		routing: { send: { type: 'body', property: 'key' } },
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		displayOptions: { show: showOnlyForCustomerCreate },
		description: 'Email address of the customer',
		routing: { send: { type: 'body', property: 'email' } },
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: { show: showOnlyForCustomerCreate },
		description: 'First name of the customer',
		routing: { send: { type: 'body', property: 'name' } },
	},
	{
		displayName: 'Surname',
		name: 'surname',
		type: 'string',
		default: '',
		displayOptions: { show: showOnlyForCustomerCreate },
		description: 'Last name of the customer',
		routing: { send: { type: 'body', property: 'surname' } },
	},
	{
		displayName: 'Attribute To',
		name: 'attributionType',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForCustomerCreate },
		options: [
			{
				name: 'Partner',
				value: 'partner',
				description: 'For affiliate programs, where a partner referred this customer',
			},
			{
				name: 'Referring Customer',
				value: 'referringCustomer',
				description: 'For refer-a-friend programs, where another customer referred this one',
			},
			{
				name: 'Nobody',
				value: 'none',
				description:
					'Create an unattributed customer. Refer-a-friend programs accept this; affiliate programs reject it.',
			},
		],
		default: 'partner',
		description:
			'How this customer is attributed. An affiliate program requires a partner and rejects the request without one, while a refer-a-friend program treats the referrer as optional.',
	},
	{
		displayName: 'Identify Partner By',
		name: 'partnerIdentifier',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { ...showOnlyForCustomerCreate, attributionType: ['partner'] },
		},
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
		displayOptions: {
			show: { ...showOnlyForCustomerCreate, attributionType: ['partner'] },
		},
		description:
			'The referring partner. Usually the referral key read from the partnero_partner cookie at sign-up. An unknown partner causes the request to fail rather than being ignored.',
		routing: {
			send: {
				type: 'body',
				property: '={{ "partner." + $parameter.partnerIdentifier }}',
			},
		},
	},
	{
		displayName: 'Identify Referring Customer By',
		name: 'referringCustomerIdentifier',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { ...showOnlyForCustomerCreate, attributionType: ['referringCustomer'] },
		},
		options: [
			{ name: 'Customer Key', value: 'key' },
			{ name: 'Customer ID', value: 'id' },
		],
		default: 'key',
		description: 'Which referring customer field the value below refers to',
	},
	{
		displayName: 'Referring Customer',
		name: 'referringCustomerValue',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { ...showOnlyForCustomerCreate, attributionType: ['referringCustomer'] },
		},
		description:
			'The customer who referred this one, usually the referral key read from the partnero_referral cookie at sign-up',
		routing: {
			send: {
				type: 'body',
				property: '={{ "referring_customer." + $parameter.referringCustomerIdentifier }}',
			},
		},
	},
];
