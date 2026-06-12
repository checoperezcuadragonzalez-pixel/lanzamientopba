import { kv } from '@vercel/kv'

const DEFAULT_STATE = {
  ventas: { men:0, anu:0, fun:0, m397:0, m497:0 },
  checklists: {},
  guiones: {},
  ba_done: {},
  ba_notes: {},
  ba_audit: {},
  leads: [],
  ads: [],
  stories: []
}

export async function GET() {
  try {
    const state = await kv.get('pba-v6-state') || DEFAULT_STATE
    return Response.json(state)
  } catch (e) {
    return Response.json(DEFAULT_STATE)
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const current = await kv.get('pba-v6-state') || DEFAULT_STATE
    const next = { ...current, ...body }
    await kv.set('pba-v6-state', next)
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
