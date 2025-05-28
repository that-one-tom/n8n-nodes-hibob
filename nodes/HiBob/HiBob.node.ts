import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class HiBob implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'HiBob',
        name: 'HiBob',
        icon: 'file:hibob.png',
        group: ['output'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
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
                    }
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
                        resource: [
                            'metadata',
                        ],
                    },
                },
                options: [
                    {
                        name: 'Get all employee fields',
                        value: 'getAllEmployeeFields',
                        description: 'This endpoint retrieves only metadata about the employee fields and includes all employee fields. Calling this endpoint does not require any permissions for the service user performing this action.',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '/v1/company/people/fields',
                            },
                        },
                    },
                ],
                default: 'getAllEmployeeFields',
            },
        ]
    };
}