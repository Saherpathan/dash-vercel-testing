// src/services/apiService.ts

/**
 * Fetches agent intelligence data from the BigQuery proxy.
 * Uses credentials stored in localStorage from the CommandBar.
 * * @param timespan - Selected range (e.g., '1h', '24h', '7d', '30d', '90d', '1y')
 */
export const fetchAgentData = async (timespan: string = '24h') => {
  // Pull credentials saved by the CommandBar
  const credentials = {
    projectId: localStorage.getItem('user_gcp_project') || '',
    datasetId: localStorage.getItem('user_bq_dataset') || '',
    tableId: localStorage.getItem('user_bq_table') || '',
    apiKey: localStorage.getItem('user_gemini_key') || ''
  };

  // Build URL - org_id is removed as it's no longer used in the schema
  const url = `/api?timespan=${timespan}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-gcp-project-id': credentials.projectId,
      'x-bq-dataset': credentials.datasetId,
      'x-bq-table': credentials.tableId,
      'x-gemini-api-key': credentials.apiKey
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    // This will catch the "Missing Configuration" error from the backend
    throw new Error(errorData.error || 'Failed to fetch agent intelligence data');
  }

  return response.json();
};

/**
 * Fetches unique filter values (Agents, Users) from the dataset.
 */
export const fetchFilterOptions = async (type: string) => {
  const projectId = localStorage.getItem('user_gcp_project');
  
  const response = await fetch(`/api/filters?type=${type}`, {
    headers: { 
      'x-gcp-project-id': projectId || '',
      'x-bq-dataset': localStorage.getItem('user_bq_dataset') || '',
      'x-bq-table': localStorage.getItem('user_bq_table') || ''
    }
  });

  if (!response.ok) return [];
  return response.json();
};
