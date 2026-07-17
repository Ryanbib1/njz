import prisma from '@/tools/prisma'

/**
 * 本项目无登录页，不需要用户鉴权
 * 仅保留 withResult 包装器
 */

import { withResult } from '@/@base/BaseActionFun'

export { withResult }