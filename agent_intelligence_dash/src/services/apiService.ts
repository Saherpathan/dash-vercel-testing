export const fetchAgentData = async (orgId: string) => {
  // Grab all 4 required credentials from the user's browser storage
  const credentials = {
    apiKey: localStorage.getItem('user_gemini_key') || '',
    projectId: localStorage.getItem('user_gcp_project') || '',
    datasetId: localStorage.getItem('user_bq_dataset') || '',
    tableId: localStorage.getItem('user_bq_table') || ''
  };

  // Construct the request with the credentials in the headers
  const response = await fetch(`/api?org_id=${orgId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-gemini-api-key': credentials.apiKey,
      'x-gcp-project-id': credentials.projectId,
      'x-bq-dataset': credentials.datasetId,
      'x-bq-table': credentials.tableId
    }
  });

  // Handle errors from the BigQuery backend
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch agent intelligence data');
  }

  return response.json();
};

/**
 * Helper to fetch filter options (distinct agents/users)
 */
export const fetchFilterOptions = async (type: string) => {
  const projectId = localStorage.getItem('user_gcp_project');
  
  const response = await fetch(`/api/filters?type=${type}`, {
    headers: { 'x-gcp-project-id': projectId || '' }
  });
  
  if (!response.ok) return [];
  return response.json();
};
