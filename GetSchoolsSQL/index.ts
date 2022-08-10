import { CosmosClient } from "@azure/cosmos";
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
const { Connection, Request } = require("tedious");

/*
const config = {
    endpoint: "https://spm-db-account.documents.azure.com:443/",
    key: "Y47Qb6s5ra7qavcbm6MxXmGcsT1c7GzqitIY4TsW0Yj1y5qRXWxSZql8FY4R1NofHHrNcchXprJXbgohXTwyew==",
    databaseId: "D1Schools",
    containerId: "Schools",
    partitionKey: { kind: "Hash", paths: ["/category"] }
};
*/

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "shean@smcmanus.onmicrosoft.com",
      password: "map2022Flag",
      //clientSecret: "pSJ8Q~.YPt.BVwvr2yZ.J.p75CpGPwZjrnlwGdji",
      clientId: "12814b6b-2469-4f78-89a2-0324ae8faf5b",
      tenantId: "5b11a30d-89c3-447b-ad9a-482c2188155c"
    },
    type: "azure-active-directory-password"
    //type: "azure-active-directory-service-principal-secret"
  },
  server: "spm-sandbox.database.windows.net", 
  options: {
    database: "NCAA",
    encrypt: true
  }
};

const connection = new Connection(config);


const getSchoolsSQL: AzureFunction = async function(context:Context,req:HttpRequest): Promise<void> {

    console.log("begin getSchoolsQL");
    const connection = new Connection(config);
    // Attempt to connect and execute queries if connection goes through
    connection.on("connect", e => {
        if (e) {
           console.log(e)
            console.log(e.message);                   // "All Promises rejected"
            console.log(e.name);                      // "AggregateError"
            console.log(e.errors);                    // [ Error: "some error" ]
        } else {
            console.log("query")
            queryDatabase();
        }
    });
  
    connection.connect();
}


function queryDatabase() {
    console.log("Reading rows from the Table...");
  
    // Read all rows from table
    const qry = `SELECT * FROM [dbo].[Schools]`;
    const request = new Request(qry, (err, rowCount) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`${rowCount} row(s) returned`);
        }
      }
    );
  
    request.on("row", columns => {
      columns.forEach(column => {
        console.log("%s\t%s", column.metadata.colName, column.value);
      });
    });
  
    connection.execSql(request);
}

export default getSchoolsSQL;