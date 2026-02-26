import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

import { sunsamaNodeProperties } from './descriptions';
import { getAuthenticatedClient } from './helpers';
import { executeSunsamaOperation } from './operations';

export class Sunsama implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Sunsama',
		name: 'sunsama',
		icon: 'file:sunsama.svg',
		group: ['transform'],
		version: 1,
		description: 'Work with Sunsama tasks, subtasks, streams, and calendar events',
		defaults: {
			name: 'Sunsama',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'sunsamaApi',
				required: true,
			},
		],
		properties: sunsamaNodeProperties,
	};

	methods = {
		loadOptions: {
			async getStreams(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const client = await getAuthenticatedClient(this);
					const streams = await client.getStreamsByGroupId();

					return streams
						.map((stream) => ({
							name: stream.streamName,
							value: stream._id,
							description: stream.description || undefined,
						}))
						.sort((a, b) => a.name.localeCompare(b.name));
				} catch (error) {
					throw new NodeApiError(this.getNode(), {
						message: error instanceof Error ? error.message : 'Failed to load streams.',
					});
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const inputItems = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const client = await getAuthenticatedClient(this);

		for (let itemIndex = 0; itemIndex < inputItems.length; itemIndex++) {
			try {
				const result = await executeSunsamaOperation(this, client, itemIndex);

				if (Array.isArray(result)) {
					for (const item of result) {
						returnData.push({
							json: item,
							pairedItem: {
								item: itemIndex,
							},
						});
					}
				} else {
					returnData.push({
						json: result,
						pairedItem: {
							item: itemIndex,
						},
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : 'Unknown error',
						},
						pairedItem: {
							item: itemIndex,
						},
					});
					continue;
				}

				if (error instanceof NodeApiError || error instanceof NodeOperationError) {
					throw error;
				}

				const errorPayload: JsonObject = {
					message: error instanceof Error ? error.message : 'Sunsama operation failed.',
				};
				throw new NodeApiError(this.getNode(), errorPayload, { itemIndex });
			}
		}

		return [returnData];
	}
}

