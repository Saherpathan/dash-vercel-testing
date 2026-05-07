// src/services/apiService.ts

/**
 * Fetches agent analytics with dynamic timespan filtering
 * @param orgId - The organization ID from the URL
 * @param timespan - Selected range (e.g., '1h', '30d', '1y')
 */
export const fetchAgentData = async (orgId: string, timespan: string = '24h') => {
  const credentials = {
    projectId: localStorage.getItem('user_gcp_project') || '',
    datasetId: localStorage.getItem('user_bq_dataset') || '',
    tableId: localStorage.getItem('user_bq_table') || '',
    apiKey: localStorage.getItem('user_gemini_key') || ''
  };

  // Append timespan to the URL parameters
  const url = `/api?org_id=${orgId}&timespan=${timespan}`;

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
    throw new Error(errorData.error || 'Failed to fetch agent intelligence data');
  }

  return response.json();
};

export const fetchFilterOptions = async (type: string) => {
  const projectId = localStorage.getItem('user_gcp_project');
  const response = await fetch(`/api/filters?type=${type}`, {
    headers: { 'x-gcp-project-id': projectId || '' }
  });
  if (!response.ok) return [];
  return response.json();
};
