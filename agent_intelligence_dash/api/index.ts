import { BigQuery } from '@google-cloud/bigquery';

const bqClient = new BigQuery({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

export default async function handler(req: any, res: any) {
  const userProject = req.headers['x-gcp-project-id'];
  const userDataset = req.headers['x-bq-dataset'];
  const userTable = req.headers['x-bq-table'];
  
  // Capture org_id and timespan from the URL
  const { org_id, timespan } = req.query;

  if (!userProject || !userDataset || !userTable) {
    return res.status(400).json({ 
      error: "Missing Configuration: Please enter Project, Dataset, and Table IDs." 
    });
  }

  // --- Timespan Logic ---
  let interval = '24 HOUR'; // Default fallback
  const map: Record<string, string> = {
    '1h': '1 HOUR',
    '24h': '24 HOUR',
    '7d': '7 DAY',
    '30d': '30 DAY',
    '90d': '90 DAY',
    '1y': '1 YEAR'
  };
  
  if (timespan && map[timespan as string]) {
    interval = map[timespan as string];
  }

  const tablePath = `\`${userProject}.${userDataset}.${userTable}\``;

  const query = `
    SELECT 
      agent, 
      SUM(CAST(JSON_VALUE(attributes, '$.usage_metadata.total_token_count') AS INT64)) as total_tokens
    FROM ${tablePath}
    WHERE org_id = @org_id
    AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL ${interval})
    GROUP BY agent
  `;

  try {
    const [rows] = await bqClient.query({ 
      query, 
      params: { org_id: org_id || 'default_org' } 
    });
    res.status(200).json(rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
