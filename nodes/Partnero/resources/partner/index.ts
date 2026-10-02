import type { INodeProperties } from 'n8n-workflow';
import { partnerAddRewardDescription } from './addReward';
import { partnerCreateDescription } from './create';
import { partnerGetManyDescription, partnerSearchDescription } from './getAll';
import { partnerUpdateDescription } from './update';
import { extractData } from '../../shared/descriptions';

const showOnlyForPartners = {
	resource: ['partner'],
};

/**
 * These operations live on `/partners/{id}/...`, where Partnero matches the path
 * segment against the partner's ID only. A referral key will not resolve there,
 * which is why Get uses the `/partner` endpoint instead.
 */
const operationsNeedingPartnerId = [
	'addReward',
	'archive',
	'delete',
	'getReferralLinks',
	'unarchive',
	'update',
];

export const partnerDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForPartners },
		options: [
			{
				name: 'Add Reward',
				value: 'addReward',
				action: 'Add a reward to a partner',
				description: 'Credit a one-off bonus to a partner, outside the commission rules',
				routing: {
					request: { method: 'POST', url: '=/partners/{{ $parameter.partnerId }}/reward' },
					output: extractData,
				},
			},
			{
				name: 'Archive',
				value: 'archive',
				action: 'Archive a partner',
				description: 'Archive a partner so they stop earning',
				routing: {
					request: { method: 'POST', url: '=/partners/{{ $parameter.partnerId }}/archive' },
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a partner',
				description: 'Add a partner to the program',
				routing: { request: { method: 'POST', url: '/partners' }, output: extractData },
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a partner',
				description: 'Permanently delete a partner',
				routing: {
					request: { method: 'DELETE', url: '=/partners/{{ $parameter.partnerId }}' },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a partner',
				description: 'Get a single partner by referral key, ID or email',
				routing: {
					request: { method: 'GET', url: '/partner' },
					output: extractData,
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many partners',
				description: 'List partners in the program',
				routing: { request: { method: 'GET', url: '/partners' }, output: extractData },
			},
			{
				name: 'Get Referral Links',
				value: 'getReferralLinks',
				action: 'Get referral links for a partner',
				description: 'List every referral link belonging to one partner',
				routing: {
					request: {
						method: 'GET',
						url: '=/partners/{{ $parameter.partnerId }}/referral_links',
					},
					output: extractData,
				},
			},
			{
				name: 'Get Sign In URL',
				value: 'getSignInUrl',
				action: 'Get a sign in URL for a partner',
				description:
					'Create a one-time URL that signs the partner into their portal, for embedding in your own app',
				routing: {
					request: { method: 'POST', url: '/partners:sign-in-url' },
					output: extractData,
				},
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search partners',
				description: 'Find partners by referral key or ID',
				routing: { request: { method: 'GET', url: '/partners:search' }, output: extractData },
			},
			{
				name: 'Unarchive',
				value: 'unarchive',
				action: 'Unarchive a partner',
				description: 'Restore a previously archived partner',
				routing: {
					request: {
						method: 'POST',
						url: '=/partners/{{ $parameter.partnerId }}/revoke-archive',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a partner',
				description: 'Change a partner’s details',
				routing: {
					request: { method: 'PUT', url: '=/partners/{{ $parameter.partnerId }}' },
					output: extractData,
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Partner ID',
		name: 'partnerId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { ...showOnlyForPartners, operation: operationsNeedingPartnerId },
		},
		description:
			'The partner’s ID, as returned by Create, Get or Get Many. A referral key does not resolve on this operation — look the partner up with Get first if that is all you have.',
	},
	{
		displayName: 'Identify Partner By',
		name: 'getIdentifier',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { ...showOnlyForPartners, operation: ['get'] } },
		options: [
			{ name: 'Referral Key', value: 'key' },
			{ name: 'Email', value: 'email' },
			{ name: 'Partner ID', value: 'id' },
		],
		default: 'key',
		description: 'Which partner field the value below refers to',
	},
	{
		displayName: 'Partner',
		name: 'getValue',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showOnlyForPartners, operation: ['get'] } },
		description: 'The partner to fetch',
		routing: {
			send: {
				type: 'query',
				property: '={{ $parameter.getIdentifier }}',
			},
		},
	},
	{
		displayName: 'Identify Partner By',
		name: 'signInIdentifier',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { ...showOnlyForPartners, operation: ['getSignInUrl'] } },
		options: [
			{ name: 'Referral Key', value: 'key' },
			{ name: 'Email', value: 'email' },
		],
		default: 'key',
		description: 'Which partner field the value below refers to',
	},
	{
		displayName: 'Partner',
		name: 'signInValue',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showOnlyForPartners, operation: ['getSignInUrl'] } },
		description: 'The partner to sign in',
		routing: {
			send: {
				type: 'body',
				property: '={{ $parameter.signInIdentifier }}',
			},
		},
	},
	{
		displayName: 'Expires In (Seconds)',
		name: 'expires_in',
		type: 'number',
		typeOptions: { minValue: 30, maxValue: 900 },
		default: 120,
		displayOptions: {
			show: { ...showOnlyForPartners, operation: ['getSignInUrl'] },
		},
		description: 'How long the sign-in URL stays valid, between 30 and 900 seconds',
		routing: { send: { type: 'body', property: 'expires_in' } },
	},
	...partnerAddRewardDescription,
	...partnerCreateDescription,
	...partnerGetManyDescription,
	...partnerSearchDescription,
	...partnerUpdateDescription,
];
