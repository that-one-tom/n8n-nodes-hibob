import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class HiBobApi implements ICredentialType {
	// eslint-disable-next-line n8n-nodes-base/cred-class-field-name-uppercase-first-char
	name = 'HiBobApi';
	displayName = 'HiBob API';
	documentationUrl =
		'https://apidocs.hibob.com/docs/api-service-users';
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
			typeOptions: { password: true },
			default: '',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{$credentials.userId}}',
				password: '={{$credentials.token}}',
			},
		},
	};
	test = {
		request: {
			baseURL: 'https://api.hibob.com',
			url: '/v1/company/people/fields',
			method: 'GET',
		},
	} as ICredentialTestRequest;
}
