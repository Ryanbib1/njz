// [Pipeline Test DB Isolation]
import { beforeAll as _injectedBeforeAll, afterAll as _injectedAfterAll } from 'vitest';
_injectedBeforeAll(() => { process.env.VITEST_PIPELINE_PAGE = 'AdminLogin'; });
_injectedAfterAll(() => { delete process.env.VITEST_PIPELINE_PAGE; });

import { describe, it, expect } from 'vitest'
// ===== 导入被测 Action 和相关类型（从 action_types 提取）=====
import { adminLogin, checkCurrentSession } from '@/backend/actions/AdminLogin'
// ===== 导入 Session Store（从 login_context 提取）=====
import { useAdminSession } from '@/tools/BackendSession'

/**
 * AdminLogin Action 数据管道测试
 * 验证逻辑：入参 -> 鉴权 -> 数据库操作 -> 返回值
 * 
 * 核心原则：
 * 1. 直接调 Action，断言返回值（Action 已由 withResult 包装，成功直接返回数据，失败 throw Error）
 * 2. 真实数据库环境，数据源自 seed_data
 * 3. 鉴权通过 Session Store 模拟
 */

// ===== 测试数据（源自 seed_data）=====
const SEED_ADMIN = {
  account: 'jason_bourne',
  password: '123456', // 默认测试密码
  id: '2b62598a-3715-4610-806a-9dd5028aa37c',
  role: 'ADMIN'
}

describe('AdminLogin Action 数据管道测试', () => {

  // --- Action: adminLogin ---
  it('adminLogin：使用正确的管理员凭据登录应返回 token 和用户信息', async () => {
    // 调用登录 Action
    const data = await adminLogin({
      member_account: SEED_ADMIN.account,
      member_password: SEED_ADMIN.password
    })

    // 断言返回值字段（withResult 包装后直接返回 AdminLoginOutput）
    expect(data.token).toBeDefined()
    expect(data.member_id).toBe(SEED_ADMIN.id)
    expect(data.member_account).toBe(SEED_ADMIN.account)
    expect(data.member_role).toBe(SEED_ADMIN.role)

    // 将登录成功的 Token 和用户信息存入 Session Store
    // 模拟前端 rpc-client 行为：后续 Action 调用会自动从 store 读取并携带 Authorization 头
    useAdminSession.getState().set({
      token: data.token,
      user_id: data.member_id,
      username: data.member_account
    })
  })

  // --- Action: checkCurrentSession ---
  it('checkCurrentSession：在 Session Store 存在有效 Token 时应返回登录状态', async () => {
    // 注意：此测试依赖上一个 it 执行后存入 Store 的 token
    // 服务端 tryGetAuthContext 会识别出当前登录上下文
    const data = await checkCurrentSession()

    // 断言返回结构与字段
    expect(data.is_logged_in).toBe(true)
    expect(data.member_role).toBe(SEED_ADMIN.role)
  })

})
