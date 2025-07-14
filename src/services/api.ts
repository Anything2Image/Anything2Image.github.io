// API service for Anything2Image

export const generateMask = async (
  apiUrl: string,
  file: File,
  objectLabel: string
): Promise<{ mask_image_base64: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("object_label", objectLabel);

  const response = await fetch(`${apiUrl}/step1_upload_and_mask`, {
    method: "POST",
    body: formData,
    headers: { "ngrok-skip-browser-warning": "true" },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to generate mask.");
  return data;
};

export const refineMask = async (
  apiUrl: string,
  objectLabel: string
): Promise<{ mask_image_base64: string }> => {
  const response = await fetch(`${apiUrl}/step3_refine_mask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ object_label: objectLabel }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to refine mask.");
  return data;
};

export const getSuggestions = async (
  apiUrl: string
): Promise<{ animals: string[]; prompts: string[]; negative_prompts: string[] }> => {
  const response = await fetch(`${apiUrl}/step4_get_suggestions`, {
    method: "GET",
    headers: { "ngrok-skip-browser-warning": "true" },
  });
  if (!response.ok) {
    let errorMsg = response.statusText;
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorMsg;
    } catch (e) {}
    throw new Error(errorMsg);
  }
  return await response.json();
};

export const generateFinalImage = async (
  apiUrl: string,
  prompt: string,
  negative_prompt: string
): Promise<{ final_image_base64: string }> => {
  const response = await fetch(`${apiUrl}/step5_generate_final`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ prompt, negative_prompt }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to generate final image.");
  return data;
}; 