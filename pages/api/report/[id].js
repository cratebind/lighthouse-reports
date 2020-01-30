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

  // const report = await generateReport(url);

  try {
    const data = await request(
      'https://hasura-server-test.herokuapp.com/v1/graphql',
      getReport,
      {
        // html: report.html,
        id,
      }
    );

    return res.send(data.report[0].html);
    // return res.json(data);
  } catch (error) {
    console.error(error);
    return res.json({ error: error.message });
  }
};
