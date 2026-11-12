import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a file buffer to Cloudinary
 * For sensitive ID documents, upload with type: "authenticated"
 */
export async function uploadToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "nazrul_festival_2026",
        resource_type: "auto",
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Generate a signed expiring URL for private authenticated documents (valid for 10 minutes)
 */
export function getSignedDocumentUrl(publicId, resourceType = "image", expiresInSeconds = 600) {
  if (!publicId) return null;
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
  
  return cloudinary.utils.private_download_url(publicId, "pdf", {
    resource_type: resourceType,
    type: "authenticated",
    expires_at: expiresAt,
  });
}

/**
 * Generate an authenticated image URL with sign_url
 */
export function getAuthenticatedImageUrl(publicId, resourceType = "image", expiresInSeconds = 600) {
  if (!publicId) return null;
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
  
  return cloudinary.url(publicId, {
    resource_type: resourceType,
    type: "authenticated",
    sign_url: true,
    expires_at: expiresAt,
  });
}

/**
 * Delete a file from Cloudinary by publicId
 */
export async function deleteFromCloudinary(publicId, resourceType = "image", type = "upload") {
  if (!publicId) return null;
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      type: type,
    });
  } catch (error) {
    console.error("Cloudinary file deletion error:", error);
    return null;
  }
}

export default cloudinary;

