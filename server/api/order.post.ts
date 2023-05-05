import type { Order } from '@prisma/client'
import { OrderStatus } from '@prisma/client'
import { isNuxtError } from 'nuxt/app'
import type { JwtPayload } from 'jsonwebtoken'
import { getTokenInfo } from '../database/service/token'
import { createOrder } from '../database/repositories/orderRepositor'

export default defineEventHandler(async (e) => {
  // 课程id
  const { courseId } = await readBody(e)

  // 用户id
  const result = getTokenInfo(e)
  if (isNuxtError(result))
    return sendError(e, result)

  // 构建订单实体
  const order = {
    courseId: Number(courseId),
    userId: (result as JwtPayload).id,
    createdAt: new Date(),
    status: OrderStatus.WAIT_CONFIRM,
  } as Order

  const o = await createOrder(order)

  return { ok: true, data: { orderId: o.id } }
})
