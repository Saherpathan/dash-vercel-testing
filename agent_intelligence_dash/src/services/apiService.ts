export async function fetchBQData(filters: any) {
  const response = await fetch('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectId: filters.projectId,
      datasetId: filters.datasetId,
      tableId: filters.tableId,
      startDate: filters.startDate,
      endDate: filters.endDate,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch BQ data');
  }

  return response.json();
}
