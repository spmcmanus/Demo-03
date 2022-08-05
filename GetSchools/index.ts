import { CosmosClient } from "@azure/cosmos";
import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const config = {
    endpoint: "https://spm-db-account.documents.azure.com:443/",
    key: "Y47Qb6s5ra7qavcbm6MxXmGcsT1c7GzqitIY4TsW0Yj1y5qRXWxSZql8FY4R1NofHHrNcchXprJXbgohXTwyew==",
    databaseId: "D1Schools",
    containerId: "Schools",
    partitionKey: { kind: "Hash", paths: ["/category"] }
};

const getSchools: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function to access Azure COSMOS DB');
    const conf = (req.query.conf || (req.body && req.body.conf));

    // Connect to db
    const { endpoint, key, databaseId, containerId } = config;
    const client = new CosmosClient({ endpoint, key });
    const database = client.database(databaseId);
    const container = database.container(containerId);
    
    // query to return all items
    const querySpec = { query: "SELECT * from c" };
  
    // read all items in the Items container
    const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll();
  
    items.forEach(item => {
        console.log(`${item.id} - ${item.School}`);
    });
    
    context.res = {
        status: 200, /* Defaults to 200 */
        body: items
    };

};

export default getSchools;