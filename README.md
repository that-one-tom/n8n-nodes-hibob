# n8n Community Node: HiBob

This is an n8n community node for interacting with the HiBob API. HiBob is a modern HR platform that helps fast-growing companies manage their people and culture.

This node allows you to automate HR workflows by connecting HiBob to other applications and services within your n8n workflows.

## Features

*   **Get Metadata**:
    *   Retrieve all employee fields.
*   *(More operations and resources can be added here as the node is developed)*

## Prerequisites

*   An active HiBob account.
*   A Service User ID and Token from your HiBob account with the necessary permissions for the API actions you intend to perform.

## Installation

Follow the [n8n community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) to install this node.

1.  Go to **Settings > Community Nodes**.
2.  Select **Install**.
3.  Enter `n8n-nodes-hibob` in the **Enter npm package name** field.
4.  Agree to the risks of using community nodes.
5.  Click **Install**.

After installing the node, you can use it in your n8n workflows.

## Configuration

To use this node, you need to configure HiBob API credentials in n8n:

1.  In your n8n workflow, add the "HiBob" node.
2.  In the node's properties panel, click on the "Credential" dropdown.
3.  Select "Create New".
4.  Enter a **Credential Name**.
5.  Fill in the **Service User ID** and **Service User Token** obtained from your HiBob account.
6.  Click **Save**.

## Usage

Once the node is configured, you can use it in your workflows:

1.  Add the HiBob node to your workflow.
2.  Select the desired **Resource** (e.g., "Metadata").
3.  Select the **Operation** you want to perform (e.g., "Get all employee fields").
4.  Connect other nodes to process the data returned by the HiBob API.

### Example: Get All Employee Fields

*   **Resource**: `Metadata`
*   **Operation**: `Get all employee fields`

This operation will retrieve a list of all available employee fields in your HiBob instance.

## Resources

*   [n8n Community Support Forum](https://community.n8n.io/)
*   [HiBob API Documentation](https://apidocs.hibob.com/) (Refer to the HiBob documentation for details on API endpoints and permissions)

## Compatibility

This node has been tested with n8n version `1.0.0` and later.

## Contributing

Contributions to this node are welcome! Please refer to the n8n [community node development guide](https://docs.n8n.io/integrations/creating-nodes/) for more information on how to contribute.

If you find any bugs or have a feature request, please open an issue on the GitHub repository.

## License

This n8n community node is [MIT Licensed](LICENSE.md).