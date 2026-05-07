export const fetchAgentData = async (orgId: string) => {
  // Retrieve the key the user entered in the CommandBar
  const userKey = localStorage.getItem('user_gemini_key');

  const response = await fetch(`/api?org_id=${orgId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // This header allows our Vercel function to use the user's billing
      'x-gemini-api-key': userKey || ''
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Network response was not ok');
  }

  return response.json();
};

/**
 * Helper to fetch unique filter options (Agents, Users, etc.) directly from the DB
 */
export const fetchFilterOptions = async (type: string) => {
  const response = await fetch(`/api/filters?type=${type}`);
  if (!response.ok) return [];
  return response.json();
};
