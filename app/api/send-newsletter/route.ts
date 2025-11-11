import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const resendApiKey = process.env.RESEND_API_KEY

if (!resendApiKey) {
  console.warn('Missing RESEND_API_KEY environment variable')
}

const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')

  if (authHeader !== 'Bearer admin-token') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!resend) {
    return NextResponse.json(
      { error: 'Newsletter service not configured. Please set RESEND_API_KEY.' },
      { status: 500 }
    )
  }

  try {
    let payload
    try {
      payload = await request.json()
    } catch (parseError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
    }

    const { postTitle, postExcerpt, postUrl } = payload

    const { data: subscribers, error } = await supabase
      .from('newsletter_subscribers')
      .select('email')

    if (error) throw error
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: 'No subscribers found' })
    }

    const results = await Promise.all(
      subscribers.map(async (subscriber) => {
        try {
          const { data, error } = await resend.emails.send({
            from: 'Yuri <onboarding@resend.dev>',
            to: subscriber.email,
            subject: `✨ New post: ${postTitle}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #ff1493; font-size: 28px;">Hi! I posted something new 💫</h1>
                <h2 style="color: #333; margin-top: 30px;">${postTitle}</h2>
                <p style="color: #666; font-size: 16px; line-height: 1.6;">
                  ${postExcerpt}
                </p>
                <a href="${postUrl}" 
                   style="display: inline-block; background: #ff1493; color: white; 
                          padding: 12px 30px; text-decoration: none; border-radius: 25px; 
                          margin-top: 20px; font-weight: bold;">
                  Read More →
                </a>
                <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 12px;">
                  You're receiving this because you subscribed to my blog updates.<br>
                  <a href="${postUrl}" style="color: #ff1493;">Unsubscribe</a>
                </p>
              </div>
            `,
          })
          return { email: subscriber.email, success: !error, error }
        } catch (err) {
          return { email: subscriber.email, success: false, error: err }
        }
      })
    )

    const successCount = results.filter((r) => r.success).length
    return NextResponse.json({
      message: `Sent to ${successCount}/${subscribers.length} subscribers`,
      results,
    })
  } catch (error) {
    console.error('Newsletter send error:', error)
    return NextResponse.json({ error: 'Failed to send newsletter' }, { status: 500 })
  }
}
