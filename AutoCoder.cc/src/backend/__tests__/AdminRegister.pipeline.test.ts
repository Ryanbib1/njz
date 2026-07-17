// [Pipeline Test DB Isolation]
import { beforeAll as _injectedBeforeAll, afterAll as _injectedAfterAll } from 'vitest';
_injectedBeforeAll(() => { process.env.VITEST_PIPELINE_PAGE = 'AdminRegister'; });
_injectedAfterAll(() => { delete process.env.VITEST_PIPELINE_PAGE; });

import { describe, it, expect } from 'vitest'

// ===== 导入被测 Action（从 action_types 提取）=====
import { registerAdmin } from '@/backend/actions/AdminRegister'

// ===== 导入 Session Store 和登录函数（从 login_context 提取，用于标准结构参考）=====
// 注：registerAdmin 为 PUBLIC Action，本测试直接调用，无需在 beforeAll 中登录。
// 如果后续增加需鉴权的 Action，需使用 useAdminSession 和 adminLogin。

describe('AdminRegister Action 测试', () => {

  /**
   * 测试目标：registerAdmin
   * 逻辑：验证入参 -> 检查唯一性 -> 哈希密码 -> 创建 Member -> 返回 MemberInfo
   * 类型：PUBLIC (GUEST access)
   */
  it('registerAdmin：成功注册新的管理员账号', async () => {
    // 1. 准备测试数据：使用唯一后缀避免与 seed_data 冲突
    const timestamp = Date.now()
    const input = {
      member_account: `new_admin_${timestamp}`,
      member_password: 'password123',
      member_email: `admin_${timestamp}@tavola.com`
    }

    // 2. 直接调用 Action
    // withResult 包装后，成功直接返回 RegisterAdminOutput，失败则 throw Error
    const result = await registerAdmin(input)

    // 3. 断言返回值字段
    expect(result.member.member_id).toBeDefined()
    expect(result.member.member_account).toBe(input.member_account)
    expect(result.member.member_email).toBe(input.member_email)

    // 4. 验证数据一致性
    // 由于 Action 返回的是数据库真实创建后的对象，此处 member_id 的存在即证明了写入成功
    expect(typeof result.member.member_id).toBe('string')
  })

  it('registerAdmin：重复账号注册应抛出错误', async () => {
    // 使用 seed_data 中已存在的账号：jason_bourne
    const input = {
      member_account: 'jason_bourne',
      member_password: 'password123',
      member_email: 'new_unique_email@test.com'
    }

    // withResult 包装后，逻辑内的 throw Error 会被测试捕获
    await expect(registerAdmin(input)).rejects.toThrow('Account username already exists')
  })

  it('registerAdmin：重复邮箱注册应抛出错误', async () => {
    // 使用 seed_data 中已存在的邮箱：jbourne@tavola.com
    const input = {
      member_account: `unique_acc_${Date.now()}`,
      member_password: 'password123',
      member_email: 'jbourne@tavola.com'
    }

    await expect(registerAdmin(input)).rejects.toThrow('Email address already exists')
  })
})
