// api/index.ts
import { BigQuery } from '@google-cloud/bigquery';

const bq = new BigQuery({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

export default async function handler(req: any, res: any) {
  const { org_id } = req.query; // Capture from URL

  const query = `
    SELECT agent, SUM(CAST(JSON_VALUE(attributes, '$.usage_metadata.total_token_count') AS INT64)) as total_tokens
    FROM \`your-project.your_dataset.your_table\`
    WHERE org_id = @org_id
    GROUP BY agent
  `;

  try {
    const [rows] = await bq.query({ query, params: { org_id } });
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
