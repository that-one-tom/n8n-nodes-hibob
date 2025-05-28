import {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class HiBobApi implements ICredentialType {
    name = 'HiBobApi';
    displayName = 'HiBob API';
    documentationUrl = 'https://docs.n8n.io/integrations/creating-nodes/build/declarative-style-node/';
    properties: INodeProperties[] = [
        {
            displayName: 'Service User ID',
            name: 'userId',
            type: 'string',
            default: '',
        },
        {
            displayName: 'Service User Token',
            name: 'token',
            type: 'string',
            default: '',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            auth: {
                username: '={{$credentials.userId}}',
                password: '={{$credentials.token}}',
            },
        },
    } as IAuthenticateGeneric;
    test = {
        request: {
            baseURL: 'https://api.hibob.com',
            url: '/v1/company/people/fields',
            method: 'GET',
        },
    } as ICredentialTestRequest;
}