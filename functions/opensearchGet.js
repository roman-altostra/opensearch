const { Client } = require("@opensearch-project/opensearch");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const createAwsOpensearchConnector = require("aws-opensearch-connector");


module.exports.handler = async (event, context) => {
  var host = process.env.HOST // e.g. https://my-domain.region.es.amazonaws.com

  const getClient = async () => {
    const awsCredentials = await defaultProvider()();
    const connector = createAwsOpensearchConnector({
      credentials: awsCredentials,
      region: process.env.AWS_REGION ?? 'us-east-1',
      getCredentials: function (cb) {
        return cb();
      }
    });
    return new Client({
      ...connector,
      node: host,
    });
  }

  async function search() {

    // Initialize the client.
    var client = await getClient();

    // Create an index.
    var index_name = "test-index";
    var response = await client.indices.create({
      index: index_name,
    });

    console.log("Creating index:");
    console.log(response.body);

    // Add a document to the index.
    var document = {
      "title": "Moneyball",
      "director": "Bennett Miller",
      "year": "2011"
    };

    var response = await client.index({
      index: index_name,
      body: document
    });

    console.log(response.body);
  }

  search().catch(console.log);



  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: {},
    multiValueHeaders: {},
    body: ""
  }
}