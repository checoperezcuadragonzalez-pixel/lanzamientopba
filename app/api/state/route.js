import { kv } from '@vercel/kv'

export async function GET() {
  try {
    const state = await kv.get('pba-state') || {
      ventas: { men: 0, anu: 0, fun: 0, m397: 0, m497: 0 },
      checklists: {},
      leads: [],
      ads: [],
      stories: []
    }
    return Response.json(state)
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const current = await kv.get('pba-state') || {}
    const next = { ...current, ...body }
    await kv.set('pba-state', next)
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
