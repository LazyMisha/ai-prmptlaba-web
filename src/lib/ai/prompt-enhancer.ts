import { callOpenAI } from '@/lib/openai'
import { generateCacheKey, promptEnhancementCache } from '@/lib/utils/cache'
import {
  TOOL_CATEGORIES,
  resolveToolCategory,
  type ToolCategory,
} from '@/constants/tool-categories'

/**
 * Configuration for prompt enhancement
 */
const CONFIG = {
  minPromptLength: 3,
  maxPromptLength: 2000,
  maxTargetLength: 50,
} as const

/**
 * Custom error for validation failures
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

/**
 * Validate input parameters
 */
function validateInput(target: string, prompt: string): void {
  // Validate target
  if (!target || typeof target !== 'string') {
    throw new ValidationError('Target must be a non-empty string')
  }

  if (target.trim().length === 0) {
    throw new ValidationError('Target cannot be empty or whitespace only')
  }

  if (target.length > CONFIG.maxTargetLength) {
    throw new ValidationError(
      `Target must not exceed ${CONFIG.maxTargetLength} characters`,
    )
  }

  // Validate prompt
  if (!prompt || typeof prompt !== 'string') {
    throw new ValidationError('Prompt must be a non-empty string')
  }

  const trimmedPrompt = prompt.trim()

  if (trimmedPrompt.length < CONFIG.minPromptLength) {
    throw new ValidationError(
      `Prompt must be at least ${CONFIG.minPromptLength} characters long`,
    )
  }

  if (trimmedPrompt.length > CONFIG.maxPromptLength) {
    throw new ValidationError(
      `Prompt must not exceed ${CONFIG.maxPromptLength} characters`,
    )
  }
}

/**
 * Generate system prompt based on target platform
 */
function generateSystemPrompt(target: string): string {
  const category = resolveToolCategory(target)

  // Category-specific instructions
  const categoryInstructions: Record<ToolCategory, string> = {
    [TOOL_CATEGORIES.IMAGE_GENERATOR]: `You are a professional prompt engineer specializing in AI image generation tools.

Your task is to REWRITE and IMPROVE the user's prompt (not execute it) so it becomes more effective for AI image generation platforms like Midjourney, DALL-E, Stable Diffusion, and similar tools.

Transform the prompt to be:
- Visually descriptive with specific details about composition, lighting, and style
- Clear about artistic style, medium, and aesthetic references (e.g., photorealistic, oil painting, digital art)
- Explicit about subject matter, mood, and atmosphere
- Detailed about colors, textures, and spatial relationships
- Structured with relevant technical parameters when applicable (aspect ratios, quality settings)
- Include relevant keywords like camera angles, art movements, or famous artists when appropriate
- Optimized for generating coherent, high-quality images with clear visual intent
- Specific about perspective, depth of field, and focal points`,

    [TOOL_CATEGORIES.VIDEO_GENERATOR]: `You are a professional prompt engineer specializing in AI video generation tools.

Your task is to REWRITE and IMPROVE the user's prompt (not execute it) so it becomes more effective for AI video generation platforms like Sora, Runway, and similar tools.

Transform the prompt to be:
- Descriptive about motion, camera movement, and temporal progression
- Clear about scene composition, lighting, and visual style throughout the sequence
- Specific about subjects, actions, and their evolution over time
- Explicit about video duration, pacing, and key moments or transitions
- Detailed about atmosphere, mood, and cinematography techniques
- Structured to describe a coherent narrative or visual sequence
- Focused on realistic physics, fluid motion, and temporal consistency
- Include details about camera work (panning, zooming, tracking shots)
- Optimized for creating compelling video content with clear storytelling`,

    [TOOL_CATEGORIES.TEXT_GENERATOR]: `You are a professional prompt engineer specializing in AI text generation and conversational AI tools.

Your task is to REWRITE and IMPROVE the user's prompt (not execute it) so it becomes more effective for advanced language models like Claude, ChatGPT, and similar AI assistants.

Transform the prompt to be:
- Clear and well-structured with explicit instructions
- Specific about the desired output format and level of detail
- Explicit about tone, style, and any constraints or requirements
- Detailed with relevant context and background information
- Structured to leverage AI strengths: reasoning, analysis, creative writing, and problem-solving
- Optimized for nuanced understanding and thoughtful responses
- Focused on extracting maximum value from the AI's capabilities

IMPORTANT: Preserve any specific constraints from the user's original prompt:
- If they specify word count, length, or format requirements, maintain those exact specifications
- If they mention tone, style, or structural preferences, keep those requirements
- Add clarity where needed, but never override user-specified constraints`,

    [TOOL_CATEGORIES.SOFTWARE_DEVELOPMENT_ASSISTANT]: `You are a professional prompt engineer specializing in AI coding assistants and development tools.

Your task is to REWRITE and IMPROVE the user's prompt (not execute it) so it becomes more effective for AI-powered development tools like GitHub Copilot, Cursor, and similar coding assistants.

Transform the prompt to be:
- Technically precise with clear specifications and requirements
- Explicit about programming languages, frameworks, libraries, and dependencies
- Clear about code functionality, structure, and architecture patterns
- Specific about input/output expectations, edge cases, and error handling
- Detailed with relevant context about the existing codebase and constraints
- Structured with best practices, coding standards, and design patterns in mind
- Focused on code quality, maintainability, and performance
- Optimized for generating production-ready, well-documented code
- Include requirements for tests, documentation, or specific implementation approaches`,

    [TOOL_CATEGORIES.LINKEDIN_POST_GENERATOR]: `You are a professional prompt engineer specializing in LinkedIn content creation.

Your task is to REWRITE and IMPROVE the user's prompt (not execute it) so it becomes more effective for generating LinkedIn posts and professional content.

Transform the prompt to be:
- Professional yet engaging and authentic in tone
- Focused on business networking, career achievements, and professional insights
- Clear about the desired LinkedIn post format (announcement, thought leadership, milestone, etc.)
- Specific about target audience (industry peers, recruiters, team members)
- Explicit about key points, calls-to-action, and engagement goals
- Structured for optimal LinkedIn algorithm performance and professional credibility
- Focused on value delivery, relationship building, and personal brand

IMPORTANT: Preserve any specific constraints from the user's original prompt:
- If they specify word count, character limit, or length requirements, maintain those exact specifications
- If they mention specific formatting, tone, or style preferences, keep those requirements
- Do not add generic length suggestions if the user has already specified their own`,

    [TOOL_CATEGORIES.FACEBOOK_POST_CREATOR]: `You are a professional prompt engineer specializing in Facebook content creation.

Your task is to REWRITE and IMPROVE the user's prompt (not execute it) so it becomes more effective for generating Facebook posts and social content.

Transform the prompt to be:
- Friendly, conversational, and authentic in tone
- Clear about the desired Facebook post format (personal update, event, story)
- Specific about engagement goals and target audience (friends, family, community)
- Personal and relatable in approach while maintaining appropriate boundaries
- Structured for optimal social media engagement and sharing
- Explicit about content type (text, photo caption, video description)
- Focused on storytelling, emotional connection, and community building

IMPORTANT: Preserve any specific constraints from the user's original prompt:
- If they specify word count, character limit, or length requirements, maintain those exact specifications
- If they mention formatting preferences (paragraphs, emojis, hashtags), keep those requirements
- Do not override user-specified constraints with generic suggestions`,

    [TOOL_CATEGORIES.TWITTER_POST_CREATOR]: `You are a professional prompt engineer specializing in Twitter (X) content creation.

Your task is to REWRITE and IMPROVE the user's prompt (not execute it) so it becomes more effective for generating Twitter/X posts and threads.

Transform the prompt to be:
- Concise and impactful, optimized for Twitter's format and culture
- Clear about content type (single tweet, thread, reply, quote tweet)
- Explicit about tone (witty, informative, thought-provoking, conversational)
- Structured for maximum engagement (retweets, likes, replies)
- Detailed about hashtag usage, mentions, and call-to-action
- Focused on timely, shareable content that resonates with Twitter audience

IMPORTANT: Preserve any specific constraints from the user's original prompt:
- If they specify character limits, word count, or length requirements, maintain those exact specifications
- If not specified, mention the 280 character limit per tweet as a guideline
- If they mention thread structure or specific formatting, keep those requirements`,

    [TOOL_CATEGORIES.INSTAGRAM_POST_GENERATOR]: `You are a professional prompt engineer specializing in Instagram content creation.

Your task is to REWRITE and IMPROVE the user's prompt (not execute it) so it becomes more effective for generating Instagram captions and visual content descriptions.

Transform the prompt to be:
- Visually-focused with emphasis on aesthetic appeal and storytelling
- Clear about content type (feed post, carousel, Reel caption, Story)
- Specific about target audience, brand voice, and engagement goals
- Explicit about caption structure (hook, story, call-to-action)
- Structured for Instagram's visual-first platform and algorithm
- Focused on authenticity, lifestyle content, and community engagement

IMPORTANT: Preserve any specific constraints from the user's original prompt:
- If they specify word count, character limit, or length requirements, maintain those exact specifications
- If they mention hashtag strategy, emoji usage, or formatting preferences, keep those requirements
- Do not add generic suggestions that conflict with user-specified constraints`,

    [TOOL_CATEGORIES.GENERAL]: `You are a professional prompt engineer.

Your task is to REWRITE and IMPROVE the user's prompt (not execute it) so it becomes more effective for AI processing.

Transform the prompt to be:
- Clear and specific with no ambiguity
- Well-structured with explicit requirements and expectations
- Detailed with relevant context and constraints
- Focused on a specific, achievable objective
- Optimized for AI comprehension and accurate execution
- Structured to maximize the quality and relevance of AI-generated content

IMPORTANT: Preserve any specific constraints from the user's original prompt:
- If they specify output format, length, word count, or style requirements, maintain those exact specifications
- Add helpful details and structure, but never override user-specified constraints
- Make the prompt clearer while respecting all original requirements`,
  }

  const instruction =
    categoryInstructions[category] ||
    categoryInstructions[TOOL_CATEGORIES.GENERAL] ||
    "You are a prompt engineer. Rewrite and improve the user's prompt to make it clearer and more effective."

  return `${instruction}

CRITICAL INSTRUCTIONS:
- DO NOT execute or answer the user's prompt
- DO NOT generate the content the prompt is asking for
- ONLY rewrite and improve the prompt itself
- Return the enhanced version of the prompt as a single, ready-to-use text
- Do not add explanations, meta-commentary, or formatting markers
- The output should be a prompt that someone can copy and paste directly into another AI tool
- ALWAYS preserve user-specified constraints (word count, length, format, style) from the original prompt
- Add clarity and detail, but NEVER override or contradict the user's explicit requirements

Examples of preserving user constraints:
- If user says "max 10 words" → enhanced prompt MUST include "maximum 10 words"
- If user says "150 words" → enhanced prompt MUST include "exactly 150 words"
- If user says "3 sentences" → enhanced prompt MUST include "3 sentences"
- If user says "casual tone" → enhanced prompt MUST include "casual tone"

Examples:
User prompt: "write linkedin post about promotion"
Your output: "Create a professional LinkedIn post announcing my recent promotion to Senior Software Engineer. The post should express gratitude to my team, highlight key achievements that led to this promotion, and maintain an authentic yet professional tone. Keep it concise (150-200 words) and include a call-to-action encouraging connections to reach out."

User prompt: "Create a post about my raise max 10 words"
Your output: "Write a concise LinkedIn post announcing your recent salary raise. Keep the message professional and grateful. Maximum length: 10 words exactly. Focus on positivity and appreciation without revealing specific numbers."

Now, improve this user's prompt:`
}

/**
 * Enhances a user prompt based on the target platform or context.
 *
 * This function implements:
 * - Strict input validation
 * - In-memory TTL caching (12 hours)
 * - OpenAI API integration with retries
 * - Automatic tool categorization
 *
 * Supported categories:
 * - Image Generator (for Midjourney, DALL-E, Stable Diffusion, etc.)
 * - Video Generator (for Sora, Runway, etc.)
 * - Text Generator (for Claude, ChatGPT, etc.)
 * - Software Development Assistant (for GitHub Copilot, Cursor, etc.)
 * - LinkedIn Post Generator
 * - Facebook Post Creator
 * - Twitter (X) Post Creator
 * - Instagram Post Generator
 * - General (fallback category)
 *
 * @param target - The target tool or platform name (automatically resolved to appropriate category)
 * @param prompt - The user's raw prompt to enhance
 * @param signal - Optional AbortSignal for request cancellation
 * @returns Enhanced, professional version of the prompt
 * @throws ValidationError for invalid input
 * @throws OpenAIError for API failures
 *
 * @example
 * const enhanced = await enhancePrompt('LinkedIn', 'write post about my promotion');
 * // Returns: "Create a professional LinkedIn post announcing my recent promotion..."
 *
 * @example
 * const enhanced = await enhancePrompt('Midjourney', 'cat in space');
 * // Returns: "Generate a highly detailed image of a cat floating in outer space..."
 */
export async function enhancePrompt(
  target: string,
  prompt: string,
  signal?: AbortSignal,
): Promise<string> {
  // Step 1: Validate input
  validateInput(target, prompt)

  const trimmedPrompt = prompt.trim()
  const trimmedTarget = target.trim()

  // Step 2: Check cache
  // Generate cache key from target and prompt hash
  const cacheKey = generateCacheKey(trimmedTarget.toLowerCase(), trimmedPrompt)
  const cachedResult = promptEnhancementCache.get(cacheKey)

  if (cachedResult) {
    return cachedResult
  }

  // Step 3: Generate system prompt based on target
  const systemPrompt = generateSystemPrompt(trimmedTarget)

  // Step 4: Call OpenAI API
  try {
    const enhanced = await callOpenAI(systemPrompt, trimmedPrompt, signal)

    // Step 5: Cache the result for 12 hours
    // TODO: Replace with Redis for distributed caching in production
    promptEnhancementCache.set(cacheKey, enhanced)

    return enhanced
  } catch (error) {
    // Re-throw known errors as-is
    if (
      error instanceof ValidationError ||
      (error as Error).name === 'OpenAIError'
    ) {
      throw error
    }

    // Wrap unexpected errors
    throw new Error(`Failed to enhance prompt: ${(error as Error).message}`)
  }
}
