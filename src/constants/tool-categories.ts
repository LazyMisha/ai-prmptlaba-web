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
  [TOOL_CATEGORIES.TEXT_GENERATOR]: 'Text',
  [TOOL_CATEGORIES.SOFTWARE_DEVELOPMENT_ASSISTANT]:
    'Software Development Assistant',
  [TOOL_CATEGORIES.LINKEDIN_POST_GENERATOR]: 'LinkedIn Post',
  [TOOL_CATEGORIES.FACEBOOK_POST_CREATOR]: 'Facebook Post',
  [TOOL_CATEGORIES.TWITTER_POST_CREATOR]: 'Twitter (X) Post',
  [TOOL_CATEGORIES.INSTAGRAM_POST_GENERATOR]: 'Instagram Post',
  [TOOL_CATEGORIES.GENERAL]: 'General',
}

/**
 * Ordered list of tool categories for UI display
 */
export const TOOL_CATEGORY_LIST: Array<{ value: ToolCategory; label: string }> =
  [
    {
      value: TOOL_CATEGORIES.GENERAL,
      label: TOOL_CATEGORY_NAMES[TOOL_CATEGORIES.GENERAL],
    },
    {
      value: TOOL_CATEGORIES.IMAGE_GENERATOR,
      label: TOOL_CATEGORY_NAMES[TOOL_CATEGORIES.IMAGE_GENERATOR],
    },
    {
      value: TOOL_CATEGORIES.VIDEO_GENERATOR,
      label: TOOL_CATEGORY_NAMES[TOOL_CATEGORIES.VIDEO_GENERATOR],
    },
    {
      value: TOOL_CATEGORIES.TEXT_GENERATOR,
      label: TOOL_CATEGORY_NAMES[TOOL_CATEGORIES.TEXT_GENERATOR],
    },
    {
      value: TOOL_CATEGORIES.SOFTWARE_DEVELOPMENT_ASSISTANT,
      label:
        TOOL_CATEGORY_NAMES[TOOL_CATEGORIES.SOFTWARE_DEVELOPMENT_ASSISTANT],
    },
    {
      value: TOOL_CATEGORIES.LINKEDIN_POST_GENERATOR,
      label: TOOL_CATEGORY_NAMES[TOOL_CATEGORIES.LINKEDIN_POST_GENERATOR],
    },
    {
      value: TOOL_CATEGORIES.FACEBOOK_POST_CREATOR,
      label: TOOL_CATEGORY_NAMES[TOOL_CATEGORIES.FACEBOOK_POST_CREATOR],
    },
    {
      value: TOOL_CATEGORIES.TWITTER_POST_CREATOR,
      label: TOOL_CATEGORY_NAMES[TOOL_CATEGORIES.TWITTER_POST_CREATOR],
    },
    {
      value: TOOL_CATEGORIES.INSTAGRAM_POST_GENERATOR,
      label: TOOL_CATEGORY_NAMES[TOOL_CATEGORIES.INSTAGRAM_POST_GENERATOR],
    },
  ]

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
