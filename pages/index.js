import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import axios from 'axios';

import { useState } from 'react';
import { withApollo } from '../lib/apollo';

export const ALL_REPORTS_QUERY = gql`
  query allReports {
    report {
      id
      url
      created_at
    }
  }
`;

const HomePage = () => {
  const [url, setUrl] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const { loading, error, data } = useQuery(ALL_REPORTS_QUERY);

  if (error) return <div>Error</div>;
  if (loading || !data) return <div>Loading</div>;

  async function handleSubmit(e) {
    e.preventDefault();
    setReportLoading(true);
    const res = await axios.get(`/api/report/new?url=${url}`);
    setReportLoading(false);
    console.log(res);
  }

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          disabled={reportLoading}
          onChange={e => setUrl(e.target.value)}
        />
        {reportLoading && <div>Generating your report...</div>}
      </form>
      {/* TODO: Show more data here to get information at a glance */}
      {/* TODO: Group by URL */}
      {data.report.map(report => (
        <div key={report.id}>
          <a href={`/api/report/${report.id}`}>
            {new Date(report.created_at).toLocaleString('en-US', {
              weekday: 'short',
              month: 'long',
              day: '2-digit',
              year: 'numeric',
            })}
            : {report.url}
          </a>
        </div>
      ))}
    </main>
  );
};

export default withApollo(HomePage);
