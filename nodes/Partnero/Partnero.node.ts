import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { customerDescription } from './resources/customer';
import { leadDescription } from './resources/lead';
import { partnerDescription } from './resources/partner';
import { transactionDescription } from './resources/transaction';

export class Partnero implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Partnero',
		name: 'partnero',
		icon: { light: 'file:../../icons/partnero.svg', dark: 'file:../../icons/partnero.dark.svg' },
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage partners, customers, transactions, leads and rewards in Partnero',
		defaults: {
			name: 'Partnero',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'partneroApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.partnero.com/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Customer',
						value: 'customer',
					},
					{
						name: 'Lead',
						value: 'lead',
					},
					{
						name: 'Partner',
						value: 'partner',
					},
					{
						name: 'Transaction',
						value: 'transaction',
					},
				],
				default: 'customer',
			},
			...customerDescription,
			...leadDescription,
			...partnerDescription,
			...transactionDescription,
		],
	};
}
