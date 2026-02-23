export interface EstimateSubmission {
  service: 'flooring' | 'cleaning';
  type: 'estimate' | 'schedule';
  contact: { name: string; email: string; phone: string };
  address: string;
  zipCode: string;
  totalSqFt?: number;
  coverage?: 'whole' | 'specific';
  material?: string;
  cleaningType?: string;
  frequency?: string;
  price?: number;
}

export async function submitEstimate(data: EstimateSubmission): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/submit-estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit estimate');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting estimate:', error);
    throw error;
  }
}
