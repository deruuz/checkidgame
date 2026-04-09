import express, { Request, Response } from 'express'
import path from 'path'
import * as router from './router'
import { Result } from './utils'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, POST',
  'Access-Control-Expose-Headers': '*',
  'Cache-Control': 'public, max-age=30, s-maxage=43200, immutable',
  'X-Powered-By': '@ihsangan/valid'
}

function getParam(req: Request, key: string): string | undefined {
  return (req.query[key] ?? req.body?.[key]) as string | undefined
}

function sendResult(res: Response, result: Result) {
  let status = 200
  if (result.message === 'Bad request') status = 400
  if (result.message === 'Not found') status = 404

  if (result.name) {
    const decode = undefined // decode param not used here, handled per-route
    result.name = decodeURIComponent(result.name)
  }

  res.set(headers).status(status).json(result)
}

// Mobile Legends
app.all('/ml', async (req: Request, res: Response) => {
  const id = getParam(req, 'id')
  const server = getParam(req, 'server') ?? getParam(req, 'zone')
  if (!id || !server) return res.status(400).json({ success: false, message: 'Bad request' })
  const result = await router.ml(Number(id), Number(server))
  sendResult(res, result)
})

// Free Fire
app.all('/ff', async (req: Request, res: Response) => {
  const id = getParam(req, 'id')
  if (!id) return res.status(400).json({ success: false, message: 'Bad request' })
  const result = await router.ff(Number(id))
  sendResult(res, result)
})

// Arena of Valor
app.all('/aov', async (req: Request, res: Response) => {
  const id = getParam(req, 'id')
  if (!id) return res.status(400).json({ success: false, message: 'Bad request' })
  const result = await router.aov(Number(id))
  sendResult(res, result)
})

// Call of Duty Mobile
app.all('/codm', async (req: Request, res: Response) => {
  const id = getParam(req, 'id')
  if (!id) return res.status(400).json({ success: false, message: 'Bad request' })
  const result = await router.codm(Number(id))
  sendResult(res, result)
})

// Genshin Impact
app.all('/gi', async (req: Request, res: Response) => {
  const id = getParam(req, 'id')
  if (!id) return res.status(400).json({ success: false, message: 'Bad request' })
  const result = await router.gi(Number(id))
  sendResult(res, result)
})

// Honkai: Star Rail
app.all('/hsr', async (req: Request, res: Response) => {
  const id = getParam(req, 'id')
  if (!id) return res.status(400).json({ success: false, message: 'Bad request' })
  const result = await router.hsr(Number(id))
  sendResult(res, result)
})

// Honkai Impact 3rd
app.all('/hi', async (req: Request, res: Response) => {
  const id = getParam(req, 'id')
  if (!id) return res.status(400).json({ success: false, message: 'Bad request' })
  const result = await router.hi(Number(id))
  sendResult(res, result)
})

// Zenless Zone Zero
app.all('/zzz', async (req: Request, res: Response) => {
  const id = getParam(req, 'id')
  if (!id) return res.status(400).json({ success: false, message: 'Bad request' })
  const result = await router.zzz(Number(id))
  sendResult(res, result)
})

// Valorant
app.all('/valo', async (req: Request, res: Response) => {
  const id = getParam(req, 'id')
  if (!id) return res.status(400).json({ success: false, message: 'Bad request' })
  const result = await router.valo(id as any)
  sendResult(res, result)
})

// Point Blank
app.all('/pb', async (req: Request, res: Response) => {
  const id = getParam(req, 'id')
  if (!id) return res.status(400).json({ success: false, message: 'Bad request' })
  const result = await router.pb(id)
  sendResult(res, result)
})

// Punishing: Gray Raven
app.all('/pgr', async (req: Request, res: Response) => {
  const id = getParam(req, 'id')
  const server = getParam(req, 'server') ?? getParam(req, 'zone')
  if (!id || !server) return res.status(400).json({ success: false, message: 'Bad request' })
  const result = await router.pgr(Number(id), server)
  sendResult(res, result)
})

// LifeAfter
app.all('/la', async (req: Request, res: Response) => {
  const id = getParam(req, 'id')
  const server = getParam(req, 'server') ?? getParam(req, 'zone')
  if (!id || !server) return res.status(400).json({ success: false, message: 'Bad request' })
  const result = await router.la(Number(id), server)
  sendResult(res, result)
})

// Love and Deepspace
app.all('/ld', async (req: Request, res: Response) => {
  const id = getParam(req, 'id')
  if (!id) return res.status(400).json({ success: false, message: 'Bad request' })
  const result = await router.lad(Number(id))
  sendResult(res, result)
})

// Magic Chess: Go Go
app.all('/mcgg', async (req: Request, res: Response) => {
  const id = getParam(req, 'id')
  const server = getParam(req, 'server') ?? getParam(req, 'zone')
  if (!id || !server) return res.status(400).json({ success: false, message: 'Bad request' })
  const result = await router.mcgg(Number(id), Number(server))
  sendResult(res, result)
})

// Sausage Man
app.all('/sm', async (req: Request, res: Response) => {
  const id = getParam(req, 'id')
  if (!id) return res.status(400).json({ success: false, message: 'Bad request' })
  const result = await router.sm(id)
  sendResult(res, result)
})

// Super Sus
app.all('/sus', async (req: Request, res: Response) => {
  const id = getParam(req, 'id')
  if (!id) return res.status(400).json({ success: false, message: 'Bad request' })
  const result = await router.sus(Number(id))
  sendResult(res, result)
})

app.use((_req: Request, res: Response) => {
  res.status(400).json({ success: false, message: 'Bad request' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
