export const allowedMethod = ['GET', 'HEAD', 'POST']

export interface Params {
  path: string
  id?: string
  server?: string
  zone?: string
  decode?: string
  [key: string]: string | undefined
}

export function getParams(inputUrl: string): Params {
  const url = new URL(inputUrl)
  const urlParams = url.searchParams
  const params: Params = { path: url.pathname }
  for (const [key, value] of urlParams.entries()) {
    params[key] = value
  }
  return params
}

export async function parseRequest(request: Request): Promise<string> {
  const url = new URL(request.url)
  if (request.method === 'POST') {
    const contentType = request.headers.get('content-type') || ''
    let data: { [key: string]: string } = {}
    try {
      if (contentType.includes('application/json')) {
        data = await request.json() as { [key: string]: string }
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData()
        for (const [key, value] of formData.entries()) {
          data[key] = value as string
        }
      } else {
        return url.href
      }
      for (const key in data) {
        url.searchParams.set(key, data[key])
      }
      return url.href
    } catch {
      return url.href
    }
  }
  return url.href
}

export function timeNow(): number {
  return Date.now()
}

export async function hitCoda(body: string): Promise<any> {
  const response = await fetch('https://order-sg.codashop.com/initPayment.action', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Origin': 'https://www.codashop.com',
      'Referer': 'https://www.codashop.com/',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
    },
    body
  })
  return await response.json()
}

export interface Result {
  success: boolean
  game?: string
  id?: number | string
  server?: string | number
  name?: string
  country?: string
  message?: string
}
