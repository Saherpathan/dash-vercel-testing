// src/services/apiService.ts
export const fetchAgentData = async (orgId: string) => {
  const response = await fetch(`/api?org_id=${orgId}`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};
