// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD // только на сервере

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (password === ADMIN_PASSWORD) {
    return NextResponse.json({ success: true, token: 'admin-token' }) // можно подписать JWT
  } else {
    return NextResponse.json({ success: false }, { status: 401 })
  }
}