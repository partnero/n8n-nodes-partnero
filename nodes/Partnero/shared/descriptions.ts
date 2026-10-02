import type { INodeProperties, INodeRequestOutput } from 'n8n-workflow';

/**
 * Every Partnero endpoint wraps its payload in an envelope alongside `status`,
 * `links` and `meta`. Lifting `data` out turns a list response into one n8n
 * item per record, instead of a single item holding the whole envelope.
 */
export const extractData: INodeRequestOutput = {
	postReceive: [
		{
			type: 'rootProperty',
			properties: {
				property: 'data',
			},
		},
	],
};

/**
 * Partnero list endpoints accept `limit` between 10 and 100 and expose the next
 * page as a full URL in `links.next`, which is null on the last page.
 */
export const returnAllField: INodeProperties = {
	displayName: 'Return All',
	name: 'returnAll',
	type: 'boolean',
	default: false,
	description: 'Whether to return all results or only up to a given limit',
	routing: {
		send: {
			paginate: '={{ $value }}',
			type: 'query',
			property: 'limit',
			value: '100',
		},
		operations: {
			pagination: {
				type: 'generic',
				properties: {
					continue: '={{ !!$response.body?.links?.next }}',
					request: {
						url: '={{ $response.body?.links?.next ?? $request.url }}',
					},
				},
			},
		},
	},
};

export const limitField: INodeProperties = {
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	typeOptions: {
		minValue: 10,
		maxValue: 100,
	},
	default: 50,
	description: 'Max number of results to return',
	routing: {
		send: {
			type: 'query',
			property: 'limit',
		},
		output: {
			maxResults: '={{ $value }}',
		},
	},
};

export const sortField: INodeProperties = {
	displayName: 'Sort',
	name: 'sort',
	type: 'options',
	options: [
		{ name: 'Newest First', value: 'desc' },
		{ name: 'Oldest First', value: 'asc' },
	],
	default: 'desc',
	description: 'Order to return results in',
	routing: {
		send: {
			type: 'query',
			property: 'sort',
		},
	},
};
