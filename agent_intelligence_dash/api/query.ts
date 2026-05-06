// Example Vercel Serverless Function (Node.js)
import { BigQuery } from '@google-cloud/bigquery';

export default async function handler(req, res) {
  const { projectId, datasetId, tableId, filters } = req.body;

  // Initialize BigQuery with your SECURE KEY from Environment Variables
  const bq = new BigQuery({
    projectId: projectId, // THIS is what ensures their billing is used
    credentials: JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY),
  });

  const query = `
    SELECT * FROM \`${projectId}.${datasetId}.${tableId}\`
    WHERE DATE(timestamp) BETWEEN @start AND @end
    ORDER BY timestamp DESC
    LIMIT 100`;

  const options = {
    query: query,
    params: { start: filters.start, end: filters.end },
  };

  try {
    const [rows] = await bq.query(options);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
