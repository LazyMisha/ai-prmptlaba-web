/**
 * Tool categories for prompt enhancement
 */
export const TOOL_CATEGORIES = {
  IMAGE_GENERATOR: 'image-generator',
  VIDEO_GENERATOR: 'video-generator',
  TEXT_GENERATOR: 'text-generator',
  SOFTWARE_DEVELOPMENT_ASSISTANT: 'software-development-assistant',
  LINKEDIN_POST_GENERATOR: 'linkedin-post-generator',
  FACEBOOK_POST_CREATOR: 'facebook-post-creator',
  TWITTER_POST_CREATOR: 'twitter-post-creator',
  INSTAGRAM_POST_GENERATOR: 'instagram-post-generator',
  GENERAL: 'general',
} as const

export type ToolCategory =
  (typeof TOOL_CATEGORIES)[keyof typeof TOOL_CATEGORIES]

/**
 * Human-readable names for tool categories
 */
export const TOOL_CATEGORY_NAMES: Record<ToolCategory, string> = {
  [TOOL_CATEGORIES.IMAGE_GENERATOR]: 'Image',
  [TOOL_CATEGORIES.VIDEO_GENERATOR]: 'Video',
  [TOOL_CATEGORIES.TEXT_GENERATOR]: 'Chat & Writing',
  [TOOL_CATEGORIES.SOFTWARE_DEVELOPMENT_ASSISTANT]: 'Code',
  [TOOL_CATEGORIES.LINKEDIN_POST_GENERATOR]: 'LinkedIn Post',
  [TOOL_CATEGORIES.FACEBOOK_POST_CREATOR]: 'Facebook Post',
  [TOOL_CATEGORIES.TWITTER_POST_CREATOR]: 'Twitter (X) Post',
  [TOOL_CATEGORIES.INSTAGRAM_POST_GENERATOR]: 'Instagram Post',
  [TOOL_CATEGORIES.GENERAL]: 'General',
}

/**
 * Detailed descriptions for tool categories with example tools
 */
export const TOOL_CATEGORY_DESCRIPTIONS: Record<ToolCategory, string> = {
  [TOOL_CATEGORIES.IMAGE_GENERATOR]:
    '(Nano Banana, Midjourney, Stable Diffusion, DALL·E 3, Flux, Leonardo AI, Ideogram, Niji, etc.)',
  [TOOL_CATEGORIES.VIDEO_GENERATOR]:
    '(Sora, Runway, Luma, Kling, Pika, Haiper, etc.)',
  [TOOL_CATEGORIES.TEXT_GENERATOR]: '(ChatGPT, Gemini, Claude, DeepSeek, etc.)',
  [TOOL_CATEGORIES.SOFTWARE_DEVELOPMENT_ASSISTANT]:
    '(GitHub Copilot, Cursor, Windsurf, Codeium, etc.)',
  [TOOL_CATEGORIES.LINKEDIN_POST_GENERATOR]: '(Professional LinkedIn post)',
  [TOOL_CATEGORIES.FACEBOOK_POST_CREATOR]: '(Create engaging Facebook post)',
  [TOOL_CATEGORIES.TWITTER_POST_CREATOR]: '(Compose catchy Twitter (X) tweet)',
  [TOOL_CATEGORIES.INSTAGRAM_POST_GENERATOR]:
    '(Write compelling Instagram captions with hashtags)',
  [TOOL_CATEGORIES.GENERAL]: '(ChatGPT, Gemini, Claude, etc.)',
}

/**
 * Ordered list of tool categories for UI display
 */
export const TOOL_CATEGORY_LIST: Array<{
  value: ToolCategory
  label: string
  description: string
}> = (Object.keys(TOOL_CATEGORIES) as Array<keyof typeof TOOL_CATEGORIES>).map(
  (key) => {
    const value = TOOL_CATEGORIES[key]

    return {
      value,
      label: TOOL_CATEGORY_NAMES[value],
      description: TOOL_CATEGORY_DESCRIPTIONS[value],
    }
  },
)

/**
 * Resolve a tool name to its category
 * Returns the input if it's a valid category, otherwise returns GENERAL
 */
export function resolveToolCategory(toolName: string): ToolCategory {
  const normalized = toolName.toLowerCase().trim() as ToolCategory

  // Check if the normalized input is a valid category
  const validCategories = Object.values(TOOL_CATEGORIES) as string[]

  if (validCategories.includes(normalized)) {
    return normalized
  }

  return TOOL_CATEGORIES.GENERAL
}
