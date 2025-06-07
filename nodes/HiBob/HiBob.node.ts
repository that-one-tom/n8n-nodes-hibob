import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	ILoadOptionsFunctions, // Added for programmatic options loading
	INodePropertyOptions,
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject, // Added for programmatic options loading
} from 'n8n-workflow';

import { hiBobApiRequest } from './GenericFunctions';

export class HiBob implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HiBob',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-name-miscased
		name: 'HiBob',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:hibob.png',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"]',
		description: 'Exchange data with the HiBob API',
		defaults: {
			name: 'HiBob',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'HiBobApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Metadata',
						value: 'metadata',
					},
					{
						name: 'People',
						value: 'people',
					},
				],
				default: 'metadata',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['metadata'],
					},
				},
				options: [
					{
						name: 'Get All Employee Fields',
						value: 'getAllEmployeeFields',
						description:
							'This endpoint retrieves only metadata about the employee fields and includes all employee fields. Calling this endpoint does not require any permissions for the service user performing this action.',
						action: 'Get metadata for all employee fields',
					},
				],
				default: 'getAllEmployeeFields',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['people'],
					},
				},
				options: [
					{
						name: 'Search for Employees',
						value: 'searchForEmployees',
						description:
							'This endpoint allows you to retrieve employee data based on specified criteria. Note that only employee fields are supported. Table entries cannot be retrieved via this endpoint. If no specific fields are requested, a default set of fields will be returned.',
						action: 'Search for employees',
					},
				],
				default: 'searchForEmployees',
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
				displayName: 'Fields',
				description:
					'An optional list of fields to be returned in the response. When not specified, a default set of fields and categories are returned. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				name: 'fields',
				type: 'multiOptions',
				default: [],
				typeOptions: {
					loadOptionsMethod: 'loadPeopleFields',
				},
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['people'],
						operation: ['searchForEmployees'],
					},
				},
			},
			{
				displayName: 'Additional Settings',
				name: 'additionalSettings',
				type: 'collection',
				default: {},
				placeholder: 'Add Setting',
				displayOptions: {
					show: {
						resource: ['people'],
						operation: ['searchForEmployees'],
					},
				},
				options: [
					{
						// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
						displayName: 'Human Readable',
						description:
							'A flag that determines the data format to be returned in the response payload',
						name: 'humanReadable',
						type: 'options',
						options: [
							{
								name: 'Append',
								value: 'APPEND',
								description: 'Append the human readable data to the response',
							},
							{
								name: 'Replace',
								value: 'REPLACE',
								description:
									'Supply only humanReadable values in the JSON response instead of machine-readable values',
							},
						],
						default: 'APPEND',
					},
					{
						displayName: 'Show Inactive',
						// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
						description: 'Defines whether response should include inactive employees',
						name: 'showInactive',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Filter',
						description:
							'An optional filter based on a field and a condition to filter the results. Use this to filter which employees to return. If not provided, will return data of all the employees that can be accessed by this service user. More information on this parameter is available <a href="https://apidocs.hibob.com/reference/post_people-search">in the HiBob API reference</a>',
						name: 'filter',
						type: 'json',
						default: `{
  "fieldPath": "root.email",
  "operator": "equals",
  "values": [
    "tom@n8n.io"
  ]
}`,					}
				],
			},
		],
	};

	methods = {
		loadOptions: {
			async loadPeopleFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				let responseData;
				responseData = await hiBobApiRequest.call(this, 'GET', '/v1/company/people/fields');
				if (Array.isArray(responseData)) {
					return responseData.map((field: { id: string; name: string }) => ({
						name: field.name,
						value: field.id,
					}));
				}
				return []; // Return empty array if data is not in the expected format
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		let returnData: IDataObject[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let responseData;

				const additionalSettings = this.getNodeParameter('additionalSettings', i, {}) as { humanReadable?: string };
				this.logger.debug(`Additional Settings: ${JSON.stringify(additionalSettings)}`);

				if (resource === 'metadata' && operation === 'getAllEmployeeFields') {
					// --------------------------------
					// metadata: getAllEmployeeFields
					// --------------------------------
					responseData = await hiBobApiRequest.call(this, 'GET', '/v1/company/people/fields');
				} else if (resource === 'people' && operation === 'searchForEmployees') {
					// --------------------------------
					// people: searchForEmployees
					// --------------------------------
					const fields = this.getNodeParameter('fields', i) as string[];
					const humanReadable = this.getNodeParameter('additionalSettings.humanReadable', i, null) as string;
					const showInactive = this.getNodeParameter('additionalSettings.showInactive', i, false) as boolean;
					const filterString = this.getNodeParameter('additionalSettings.filter', i, null) as string | null;
					const filter = filterString ? JSON.parse(filterString) : null;
					responseData = await hiBobApiRequest.call(
						this,
						'POST',
						'/v1/people/search',
						{
							fields: fields,
							showInactive: showInactive,
							humanReadable: humanReadable,
							filters: filter ? [filter] : null,
						},
						undefined,
						'employees',
					);
				}

				if (responseData !== undefined && responseData !== null) {
					if (Array.isArray(responseData)) {
						// If responseData is an array, create an item for each element
						for (const singleResult of responseData) {
							returnData.push({
								json: singleResult as IDataObject,
								pairedItem: { item: i },
							});
						}
					} else {
						// If responseData is not an array, push it as a single item
						returnData.push({
							json: responseData as IDataObject,
							pairedItem: { item: i },
						});
					}
				}
			} catch (error) {
				// If an error occurs, rethrow it to be caught by n8n
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
