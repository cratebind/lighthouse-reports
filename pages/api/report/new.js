const { request } = require('graphql-request');
const { generateReport } = require('../../../reports');

const mutation = `
    mutation createReport($html: String, $json: json, $url: String) {
      insert_report(objects: { html: $html, json: $json, url: $url}) {
        returning {
          id
          url
          json
          html
        }
      }
    }
  `;

export default async (req, res) => {
  const { url } = req.query;

  const results = await generateReport(url);

  try {
    await request(
      'https://hasura-server-test.herokuapp.com/v1/graphql',
      mutation,
      {
        html: results.report,
        // json: results.report,
        url: results.artifacts.URL.finalUrl,
      }
    );
  } catch (error) {
    console.error(error.message);
    return res.json(error);
  }

  return res.json(results);
};
