import { BigQuery } from '@google-cloud/bigquery';

// Initialize BigQuery using your MASTER credentials from Vercel Environment Variables
const bqClient = new BigQuery({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

export default async function handler(req: any, res: any) {
  // Capture coordinates from headers provided by the user via the CommandBar
  const userProject = req.headers['x-gcp-project-id'];
  const userDataset = req.headers['x-bq-dataset'];
  const userTable = req.headers['x-bq-table'];
  const { org_id } = req.query;

  // Validate that we have what we need
  if (!userProject || !userDataset || !userTable) {
    return res.status(400).json({ 
      error: "Missing Configuration: Please enter Project, Dataset, and Table IDs in the dashboard." 
    });
  }

  // Construct the dynamic table path
  const tablePath = `\`${userProject}.${userDataset}.${userTable}\``;

  const query = `
    SELECT 
      agent, 
      SUM(CAST(JSON_VALUE(attributes, '$.usage_metadata.total_token_count') AS INT64)) as total_tokens
    FROM ${tablePath}
    WHERE org_id = @org_id
    GROUP BY agent
  `;

  try {
    const [rows] = await bqClient.query({ 
      query, 
      params: { org_id: org_id || 'default_org' } 
    });
    res.status(200).json(rows);
  } catch (error: any) {
    console.error("BQ Error:", error);
    res.status(500).json({ error: error.message });
  }
}
