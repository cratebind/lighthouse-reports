const { request } = require('graphql-request');

const getReport = `
  query getReport($id: Int!) {
    report(where: {id: { _eq: $id }}) {
      id
      html
      json
      url
    }
  }
`;

export default async (req, res) => {
  const { id } = req.query;

  try {
    const data = await request(
      'https://hasura-server-test.herokuapp.com/v1/graphql',
      getReport,
      {
        // html: report.html,
        id,
      }
    );

    // TODO: Figure out an easier way to display the report, possibly using a component
    // we're storing the entire HTML report, so we can send that directly to the client
    return res.send(data.report[0].html);
    // return res.json(data);
  } catch (error) {
    console.error(error);
    return res.json({ error: error.message });
  }
};
