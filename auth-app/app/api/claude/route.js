import { NextResponse } from 'next/server';

// Claude API Route
export async function POST(request) {
  try {
    const body = await request.json();
    const { message, messages, apiKey } = body;

    // Use provided API key or fall back to environment variable
    const claudeApiKey = apiKey || process.env.CLAUDE_API_KEY;

    if (!claudeApiKey) {
      return NextResponse.json(
        { error: { message: 'API key is required' } },
        { status: 400 }
      );
    }

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: messages || [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || { message: 'Claude API request failed' } },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Claude API Error:', error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}
