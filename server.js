const express = require('express');
const { request } = require('graphql-request');
const { generateReport } = require('.');

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(500).send('No Url Found');
  }

  const report = await generateReport(url);

  const mutation = `
    mutation createReport($html: String!) {
      insert_report(objects: { html: $html }) {
        returning {
          id
          html
        }
      }
    }
  `;

  // const mutation = `
  //   mutation {
  //     insert_report(objects: { html: "test", json: "data" }) {
  //       returning {
  //         id
  //         html
  //       }
  //     }
  //   }
  // `;

  try {
    const data = await request(
      'https://hasura-server-test.herokuapp.com/v1/graphql',
      mutation,
      {
        html: report.html,
      }
    );
  } catch (error) {
    console.error(error);
  }

  return res.json(report);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
