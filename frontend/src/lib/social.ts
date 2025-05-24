export const socialLinks = {
  linkedin: import.meta.env.VITE_LINKEDIN_URL,
  instagram: import.meta.env.VITE_INSTAGRAM_URL,
} as const;

export type SocialPlatform = keyof typeof socialLinks;

export const getSocialUrl = (platform: SocialPlatform) => {
  return socialLinks[platform];
}; 