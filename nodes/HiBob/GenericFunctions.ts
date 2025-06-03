import {
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IDataObject,
	IRequestOptions,
	NodeApiError,
	JsonObject,
	IHookFunctions,
	IExecuteFunctions,
} from 'n8n-workflow';

export async function hiBobApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
	dataKey?: string,
): Promise<any> {
	const baseUrl = 'https://api.hibob.com';

	const options: IRequestOptions = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		method,
		qs: query,
		uri: `${baseUrl}${endpoint}`,
		json: true,
	};

	if (body && Object.keys(body).length !== 0) {
		options.body = body;
	}

            	try {
		const responseData = await this.helpers.requestWithAuthentication.call(
			this,
			'HiBobApi',
			options,
		);

		if (responseData.success === false) {
			throw new NodeApiError(this.getNode(), responseData as JsonObject);
		}

		if (dataKey === undefined) {
            return responseData;
		} else {
            return responseData[dataKey] as IDataObject;
		}
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
