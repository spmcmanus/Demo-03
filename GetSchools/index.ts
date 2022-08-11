import { CosmosClient } from "@azure/cosmos";
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { SourceMap } from "module";

const config = {
    endpoint: "https://spm-db-account.documents.azure.com:443/",
    key: "Y47Qb6s5ra7qavcbm6MxXmGcsT1c7GzqitIY4TsW0Yj1y5qRXWxSZql8FY4R1NofHHrNcchXprJXbgohXTwyew==",
    databaseId: "D1Schools",
    containerId: "Schools",
    partitionKey: { kind: "Hash", paths: ["/category"] }
};

function contains(arr, key, val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][key] === val) return true;
    }
    return false;
}

const getSchools: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    console.log("query",req.query);
    const conf = (req.query.conf || (req.body && req.body.conf));

    // Connect to db
    const { endpoint, key, databaseId, containerId } = config;
    const client = new CosmosClient({ endpoint, key });
    const database = client.database(databaseId);
    const container = database.container(containerId);
    
    // query to return all items
    const querySpec = { query: "SELECT * from Schools" };
  
    // read all items in the Items container
    const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll();
  


    // Filter Items on Stuff
    let thisYear = new Date().getFullYear();
    console.log("thisYear is ",thisYear)
    let filteredItems = items.filter(item => {
        if (req.query.conf) {
            return item.Conferences.some(conf => {
                return conf.name === req.query.conf && conf.status === "Active"     
            });
        } else {
            return item;
        } 
    });
    

    filteredItems.forEach(item => {
        console.log(`${item.id} - ${item.School}`);
    });

    
    context.res = {
        status: 200, /* Defaults to 200 */
        body: filteredItems
    };

};

export default getSchools;