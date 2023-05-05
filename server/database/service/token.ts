import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

export function getTokenInfo(e: H3Event) {
  let info

  const token = getCookie(e, 'token')

  // 令牌不存在
  if (!token) {
    return createError({
      statusCode: 401,
      statusMessage: 'token不存在!',
    })
  }

  try {
    // 解析token
    info = jwt.verify(token, process.env.JSON_SECRET!) as jwt.JwtPayload
    const currentTime = Date.now() / 1000

    if (!info.exp || info.exp < currentTime) {
      return createError({
        statusCode: 401,
        statusMessage: 'token过期!',
      })
    }

    return info
  }
  catch (error) {
    return createError({
      statusCode: 401,
      statusMessage: 'token不合法!',
    })
  }
}
