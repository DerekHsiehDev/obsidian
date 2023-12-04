import { NextRequest, NextResponse } from 'next/server'
import {
    OpenAIVisionResponse,
    VisionRequest,
    VisionResponse,
} from './vision.type'
import z from 'zod'

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions"

const requestSchema = z.object({
    model: z.string(),
    messages: z.array(
        z.object({
            role: z.string(),
            content: z.array(
                z.object({
                    type: z.string(),
                    text: z.string().optional(),
                    image_url: z
                        .object({
                            url: z.string(),
                        })
                        .optional(),
                })
            ),
        })
    ),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const completionRequestBody: VisionRequest = body.requestBody

        try {
            requestSchema.parse(completionRequestBody)
        } catch (error) {
            console.error(error)
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            )
        }

        const headers = {
            Authorization: `Bearer ${process.env.OPENAI_KEY}`,
            'Content-type': 'application/json',
        }

        let response
        try {
            response = await fetch(OPENAI_ENDPOINT, {
                method: 'POST',
                headers,
                body: JSON.stringify(completionRequestBody),
            })
        } catch (error) {
            console.error(error)
            return NextResponse.json(
                { error: 'Error occurred while making the request' },
                { status: 500 }
            )
        }

        if (!response.ok) {
            const errorData = await response.json()
            return NextResponse.json(
                {
                    error: 'An error occurred processing your request',
                    serverError: errorData,
                },
                { status: response.status }
            )
        }

        const data: OpenAIVisionResponse = await response.json()

        const responseMessage: VisionResponse = {
            message: data.choices[0].message.content,
        }

        return NextResponse.json(responseMessage, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 })
    }
}

// vercel serverless functions have a limit for ALL tiers that doesn't allow
// for proxied requests (calling multiple different endpoints within one) to take longer than 10 seconds. This is a workaround
export async function processVisionRequest(
    completionRequestBody: VisionRequest
): Promise<NextResponse> {
    try {
        try {
            requestSchema.parse(completionRequestBody)
        } catch (error) {
            console.error(error)
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            )
        }

        const headers = {
            Authorization: `Bearer ${process.env.OPENAI_KEY}`,
            'Content-type': 'application/json',
        }

        let response
        try {
            response = await fetch(OPENAI_ENDPOINT, {
                method: 'POST',
                headers,
                body: JSON.stringify(completionRequestBody),
            })
        } catch (error) {
            console.error(error)
            return NextResponse.json(
                { error: 'Error occurred while making the request' },
                { status: 500 }
            )
        }

        if (!response.ok) {
            const errorData = await response.json()
            return NextResponse.json(
                {
                    error: 'An error occurred processing your request',
                    serverError: errorData,
                },
                { status: response.status }
            )
        }

        const data: OpenAIVisionResponse = await response.json()

        const message = data.choices[0].message.content

        const matchResult = message.match(/```markdown([\s\S]*?)```/)
        // If this isnt matched, check for the first half and add the second half (Possibly could be a better way to do this)
        // Probably have aiden or derek check the enhance request since sometimes it returns without ``` at the end, this is a temp fix.
        if (!matchResult) {
            const firstMatch = message.match(/```markdown([\s\S]*)/)
            const secondMatch = message.match(/([\s\S]*?)```/)
            if (firstMatch && secondMatch) {
                const markdownContent = firstMatch[1] + secondMatch[1]
                return NextResponse.json(
                    { enhancedMarkdown: markdownContent },
                    { status: 200 }
                )
            } else if (firstMatch) {
                const markdownContent = firstMatch[1] + '```'
                return NextResponse.json(
                    { enhancedMarkdown: markdownContent },
                    { status: 200 }
                )
            }
        }

        const markdownContent = matchResult ? matchResult[1] : null

        return NextResponse.json(
            { enhancedMarkdown: markdownContent },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 })
    }
}