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
): Promise<{
  animals: string[];
  prompts: string[];
  negative_prompts: string[];
}> => {
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

export async function generateCustomPrompt(
  apiUrl: string,
  animal_name: string
) {
  const response = await fetch(`${apiUrl}/step5_generate_custom_prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ animal_name }),
  });
  if (!response.ok) {
    throw new Error("Failed to generate custom prompt");
  }
  return response.json();
}

export async function generateFinalImageStep6(
  apiUrl: string,
  prompt: string,
  negative_prompt: string
) {
  const response = await fetch(`${apiUrl}/step6_generate_final`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, negative_prompt }),
  });
  if (!response.ok) {
    throw new Error("Failed to generate final image");
  }
  return response.json();
}

const USER_BACKEND = "http://127.0.0.1:8000"

export async function loginAPI(email: string, password: string) {
  const response = await fetch(`${USER_BACKEND}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Login failed");
  }

  return response;
}

export async function signupAPI(email: string, password: string, full_name: string) {
  const response = await fetch(`${USER_BACKEND}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password, full_name }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Signup failed");
  }

  return response;
}

export async function saveToGalleryAPI(
  uid: string,
  artName: string,
  description: string, 
  prompt: string,
  animal: string, 
  originalImageUrl: string, 
  maskedImageUrl: string, 
  finalImageUrl: string
) {
  const response = await fetch(`${USER_BACKEND}/user/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      user_id: uid,
      art_name: artName,
      description,
      prompt,
      animal,
      original_image_url: originalImageUrl,
      masked_image_url: maskedImageUrl,
      final_image_url: finalImageUrl,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to save to gallery");
  }
  return response;
}

export async function getAllGalleryAPI(uid: string) {
  const response = await fetch(`${USER_BACKEND}/user/gallery/${uid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch gallery");
  }
  return response.json();
}

export async function generateStory(
  apiUrl: string,
  prompt: string,
  animalName: string
): Promise<string> {
  const response = await fetch(`${apiUrl}/step7_generate_story`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ prompt, animal_name: animalName }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to generate story.");
  return data.story;
}

/**
 * CẬP NHẬT: Hàm này giờ đây gửi cả ảnh gốc và ảnh mask
 * để khớp với yêu cầu mới của backend.
 */
export async function convertToSketch(
  apiUrl: string,
  imageBase64: string,
): Promise<string> {
  const response = await fetch(`${apiUrl}/step7_generate_ai_sketch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    // CẬP NHẬT: Gửi cả image_base64 và mask_image_base64
    body: JSON.stringify({
      image_base64: imageBase64,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to convert to AI sketch.");
  }

  return data.sketch_image_base64;
}

export async function upscaleImage(
  apiUrl: string,
  imageBase64: string,
  targetResolution: string
): Promise<string> {
  const response = await fetch(`${apiUrl}/step7_upscale_image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({
      image_base64: imageBase64,
      target_resolution: targetResolution,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to upscale image.");
  return data.enhanced_image_base64;
}

export async function removeBackground(
  apiUrl: string,
  imageBase64: string
): Promise<string> {
  const response = await fetch(`${apiUrl}/step7_remove_background`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ image_base64: imageBase64 }),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error || "Failed to remove background.");
  return data.enhanced_image_base64;
}
