import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

const baseUrl = 'https://api.partnero.com/v1';

export class PartneroTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Partnero Trigger',
		name: 'partneroTrigger',
		icon: { light: 'file:../../icons/partnero.svg', dark: 'file:../../icons/partnero.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{ $parameter["events"].join(", ") }}',
		description: 'Starts the workflow when something happens in your Partnero program',
		defaults: {
			name: 'Partnero Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'partneroApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName:
					'Which events exist depends on your program type. Affiliate programs have partner, customer, transaction and lead events; referral programs have customer and transaction events; newsletter programs have subscriber events. Partnero rejects events its program does not support, and you will see that as an error when you activate the workflow.',
				name: 'eventsNotice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				description: 'The events that should start this workflow',
				options: [
					{ name: 'Customer Created', value: 'customer.created' },
					{ name: 'Customer Credited', value: 'customer.credited' },
					{ name: 'Customer Deleted', value: 'customer.deleted' },
					{ name: 'Customer Rewarded', value: 'customer.rewarded' },
					{ name: 'Customer Updated', value: 'customer.updated' },
					{ name: 'Lead Converted', value: 'lead.converted' },
					{ name: 'Lead Rejected', value: 'lead.rejected' },
					{ name: 'Lead Submitted', value: 'lead.submitted' },
					{ name: 'Partner Approved', value: 'partner.approved' },
					{ name: 'Partner Archived', value: 'partner.archived' },
					{ name: 'Partner Created', value: 'partner.created' },
					{ name: 'Partner Deleted', value: 'partner.deleted' },
					{ name: 'Partner Rejected', value: 'partner.rejected' },
					{ name: 'Partner Updated', value: 'partner.updated' },
					{ name: 'Subscriber Created', value: 'subscriber.created' },
					{ name: 'Subscriber Deleted', value: 'subscriber.deleted' },
					{ name: 'Subscriber Rewarded', value: 'subscriber.rewarded' },
					{ name: 'Subscriber Updated', value: 'subscriber.updated' },
					{ name: 'Transaction Created', value: 'transaction.created' },
					{ name: 'Transaction Deleted', value: 'transaction.deleted' },
				],
			},
			{
				displayName: 'Verify Signature',
				name: 'verifySignature',
				type: 'boolean',
				default: true,
				description:
					'Whether to reject deliveries whose Signature header does not match the secret Partnero issued for this webhook. Leave this on unless you are debugging.',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const nodeData = this.getWorkflowStaticData('node');

				if (!nodeData.webhookKey) {
					return false;
				}

				try {
					await this.helpers.httpRequestWithAuthentication.call(this, 'partneroApi', {
						method: 'GET',
						url: `${baseUrl}/webhooks/${nodeData.webhookKey}`,
						json: true,
					});
				} catch {
					delete nodeData.webhookKey;
					delete nodeData.signature;
					return false;
				}

				return true;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const events = this.getNodeParameter('events') as string[];

				if (!events.length) {
					throw new NodeOperationError(this.getNode(), 'Select at least one event');
				}

				const response = (await this.helpers.httpRequestWithAuthentication.call(
					this,
					'partneroApi',
					{
						method: 'POST',
						url: `${baseUrl}/webhooks`,
						body: {
							name: `n8n – ${this.getWorkflow().name ?? 'workflow'}`.slice(0, 100),
							url: webhookUrl,
							events,
							is_active: true,
						},
						json: true,
					},
				)) as IDataObject;

				const webhook = (response.data ?? response) as IDataObject;

				if (!webhook.key) {
					throw new NodeOperationError(
						this.getNode(),
						'Partnero did not return a webhook key, so the webhook could not be registered',
					);
				}

				const nodeData = this.getWorkflowStaticData('node');
				nodeData.webhookKey = webhook.key;
				nodeData.signature = webhook.signature;

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const nodeData = this.getWorkflowStaticData('node');

				if (!nodeData.webhookKey) {
					return true;
				}

				try {
					await this.helpers.httpRequestWithAuthentication.call(this, 'partneroApi', {
						method: 'DELETE',
						url: `${baseUrl}/webhooks/${nodeData.webhookKey}`,
						json: true,
					});
				} catch (error) {
					this.logger.error('Partnero Trigger could not delete its webhook', {
						webhookKey: nodeData.webhookKey,
						error,
					});
					return false;
				}

				delete nodeData.webhookKey;
				delete nodeData.signature;

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const request = this.getRequestObject();
		const verifySignature = this.getNodeParameter('verifySignature', true) as boolean;

		if (verifySignature) {
			const secret = this.getWorkflowStaticData('node').signature as string | undefined;

			if (!secret) {
				throw new NodeOperationError(
					this.getNode(),
					'No signing secret is stored for this webhook. Deactivate and reactivate the workflow so Partnero issues a new one.',
				);
			}

			if (request.rawBody === undefined && typeof request.readRawBody === 'function') {
				await request.readRawBody();
			}

			if (!request.rawBody) {
				throw new NodeOperationError(
					this.getNode(),
					'The raw request body is not available, so the signature cannot be checked',
				);
			}

			const received = request.headers.signature;
			const expected = createHmac('sha256', secret).update(request.rawBody).digest('hex');

			if (typeof received !== 'string' || !safeCompare(received, expected)) {
				throw new NodeOperationError(this.getNode(), 'Signature does not match', {
					description:
						'The delivery was not signed with the secret Partnero issued for this webhook, so it was discarded.',
				});
			}
		}

		return {
			workflowData: [this.helpers.returnJsonArray(this.getBodyData())],
		};
	}
}

function safeCompare(received: string, expected: string): boolean {
	const receivedBuffer = Buffer.from(received);
	const expectedBuffer = Buffer.from(expected);

	if (receivedBuffer.length !== expectedBuffer.length) {
		return false;
	}

	return timingSafeEqual(receivedBuffer, expectedBuffer);
}
