/**
 * @file openai-compat.ts
 * @description OpenAI-compatible AI provider implementation.
 * Works with OpenAI, Claude (via proxy), Azure OpenAI, 通义千问, GLM, OneAPI, etc.
 * All accessed via the standard /v1/chat/completions and /v1/images/generations endpoints.
 */
import { AI_API_KEY, AI_BASE_URL, AI_DEFAULT_MODEL, AI_IMAGE_API_KEY, AI_IMAGE_BASE_URL, AI_IMAGE_DEFAULT_MODEL } from '../common';
import { ThirdPartyAIProvider, ChatCompletionParams, ChatCompletionResult, ImageGenerationParams, ImageGenerationResult } from '../ai-definitions';

export const provider: ThirdPartyAIProvider = {
    chatCompletion,
    imageGeneration,
};

export function getAIProvider(): ThirdPartyAIProvider {
    return provider;
}

/**
 * Chat completion via OpenAI-compatible API.
 */
export async function chatCompletion(params: ChatCompletionParams): Promise<ChatCompletionResult> {
    const {
        messages,
        model = AI_DEFAULT_MODEL,
        temperature = 0.7,
        maxTokens,
        stream = false,
    } = params;

    if (!AI_API_KEY) {
        throw new Error('AI_API_KEY is not configured. Please set it in server/thirdparty/common.ts');
    }

    const url = `${AI_BASE_URL}/chat/completions`;

    const body: any = {
        model,
        messages,
        temperature,
        stream,
    };
    if (maxTokens) {
        body.max_tokens = maxTokens;
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    const choice = data.choices?.[0];
    if (!choice) {
        throw new Error('AI API returned no choices');
    }

    return {
        content: choice.message?.content || '',
        model: data.model || model,
        usage: data.usage ? {
            promptTokens: data.usage.prompt_tokens || 0,
            completionTokens: data.usage.completion_tokens || 0,
            totalTokens: data.usage.total_tokens || 0,
        } : undefined,
    };
}

/**
 * Image generation via OpenAI-compatible API.
 * 
 * Uses separate AI_IMAGE_* config from common.ts (may point to a different
 * provider than chat, e.g., 火山引擎/Volcengine for image generation).
 * Falls back to the chat AI config if image-specific config is not set.
 * 
 * Supports standard OpenAI format and Volcengine extensions (watermark, size presets like "2K").
 */
export async function imageGeneration(params: ImageGenerationParams): Promise<ImageGenerationResult> {
    const {
        prompt,
        model,
        size = '1024x1024',
        n = 1,
        responseFormat = 'url',
        watermark,
    } = params;

    // Use image-specific config, fall back to chat config
    const apiKey = AI_IMAGE_API_KEY || AI_API_KEY;
    const baseUrl = AI_IMAGE_BASE_URL || AI_BASE_URL;
    const defaultModel = AI_IMAGE_DEFAULT_MODEL || 'dall-e-3';

    if (!apiKey) {
        throw new Error('AI Image API key is not configured. Please set AI_IMAGE_API_KEY or AI_API_KEY in server/thirdparty/common.ts');
    }

    const url = `${baseUrl}/images/generations`;

    const body: Record<string, unknown> = {
        model: model || defaultModel,
        prompt,
        size,
        n,
        response_format: responseFormat,
    };

    // Volcengine-specific: watermark support
    if (watermark !== undefined) {
        body.watermark = watermark;
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI Image API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    const image = data.data?.[0];
    if (!image) {
        throw new Error('AI Image API returned no images');
    }

    return {
        url: image.url || '',
        b64Json: image.b64_json,
        revisedPrompt: image.revised_prompt,
    };
}
