import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class HiBob implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HiBob',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-name-miscased
		name: 'HiBob',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:hibob.png',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"]', // '": " + $parameter["resource"]}}',
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
		requestDefaults: {
			baseURL: 'https://api.hibob.com',
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
						routing: {
							request: {
								method: 'GET',
								url: '/v1/company/people/fields',
							},
						},
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
						routing: {
							request: {
								method: 'POST',
								url: '/v1/people/search',
								body: {
									fields: '={{$parameter["fields"]}}',
									showInactive: '={{false}}',
								},
							},
						},
						action: 'Search for employees',
					},
				],
				default: 'searchForEmployees',
			},
			{
				displayName: 'Fields',
				description:
					'An optional list of fields to be returned in the response. When not specified, a default set of fields and categories are returned.',
				name: 'fields',
				type: 'multiOptions',
				default: [],
				options: [
					{
						name: 'Email',
						value: 'root.email'
					}
				],
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['people'],
						operation: ['searchForEmployees'],
					},
				},
			},
		],
	};
}
