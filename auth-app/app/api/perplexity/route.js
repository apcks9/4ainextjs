import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { model, messages } = body;

    // Get API key from headers (sent by frontend) or use env variable as fallback
    const authHeader = request.headers.get('authorization');
    const apiKey = authHeader?.replace('Bearer ', '') || process.env.PERPLEXITY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: { message: 'API key is required' } },
        { status: 400 }
      );
    }

    // Call Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || { message: 'Perplexity API request failed' } },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Perplexity API Error:', error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}
