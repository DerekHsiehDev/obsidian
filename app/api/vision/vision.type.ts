export type VisionRequest = {
    model: string
    messages: {
        role: string
        content: {
            type: string
            text?: string
            image_url?: {
                url: string
            }
        }[]
    }[]
    max_tokens: number
}

export const notesVisionRequest = (imageUrl: string): VisionRequest => {
    return {
        model: 'gpt-4-vision-preview',
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: 'Transcribe this handwritten note into markdown. Noting that if there are any scientific equations, please use LaTeX.',
                    },
                    {
                        type: 'image',
                        image_url: {
                            url: imageUrl,
                        },
                    },
                ],
            },
        ],
        max_tokens: 500,
    }
}


export type OpenAIVisionResponse = {
    id: string
    object: string
    created: number
    model: string
    usage: {
        prompt_tokens: number
        completion_tokens: number
        total_tokens: number
    }
    choices: [
        {
            message: {
                role: string
                content: string
            }
            finish_details: {
                type: string
                stop: string
            }
            index: number
        },
    ]
}

export type VisionResponse = {
    message: string
}