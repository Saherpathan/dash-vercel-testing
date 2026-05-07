export const fetchAgentData = async (orgId: string) => {
  const userKey = localStorage.getItem('user_gemini_key');
  const userProject = localStorage.getItem('user_gcp_project');

  const response = await fetch(`/api?org_id=${orgId}`, {
    headers: {
      'x-gemini-api-key': userKey || '',
      'x-gcp-project-id': userProject || ''
    }
  });
  
  if (!response.ok) throw new Error('Unauthorized or Project Not Found');
  return response.json();
};
