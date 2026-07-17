// [Pipeline Test DB Isolation]
import { beforeAll as _injectedBeforeAll, afterAll as _injectedAfterAll } from 'vitest';
_injectedBeforeAll(() => { process.env.VITEST_PIPELINE_PAGE = 'BusinessInfoManagement'; });
_injectedAfterAll(() => { delete process.env.VITEST_PIPELINE_PAGE; });

import { describe, it, expect, beforeAll } from 'vitest'
// ===== 导入登录函数 =====
import { adminLogin } from '@/backend/actions/AdminLogin'
// ===== 导入 Session Store =====
import { useAdminSession } from '@/tools/BackendSession'
// ===== 导入被测 Action =====
import {
  getBusinessProfile,
  updateBusinessIdentity,
  createHourRecord,
  updateHourRecord,
  deleteHourRecord
} from '@/backend/actions/BusinessInfoManagement'

// ===== 测试常量（基于 seed_data）=====
const TEST_ADMIN = {
  account: 'jason_bourne',
  password: '123456' // 默认明文
}

const SEED = {
  RESTAURANT_ID: '8cb4d996-14e9-4386-9aa6-b569699c5a38',
  MONDAY_HOUR_ID: 'd81132e8-2ba6-48d5-b841-5abe8d453562',
}

describe('BusinessInfoManagement Action 数据管道测试', () => {

  beforeAll(async () => {
    // 1. 登录获取 Token (使用 seed_data 中的 ADMIN 用户)
    const loginResult = await adminLogin({
      member_account: TEST_ADMIN.account,
      member_password: TEST_ADMIN.password,
    })

    // 2. 将鉴权信息存入 Session Store
    useAdminSession.getState().set({
      token: loginResult.token,
      user_id: loginResult.member_id,
      username: loginResult.member_account,
    })
  })

  it('getBusinessProfile：能够获取完整的业务档案和验证状态', async () => {
    const data = await getBusinessProfile()

    // 断言基本身份信息
    expect(data.identity_info.restaurant_id).toBe(SEED.RESTAURANT_ID)
    expect(data.identity_info.restaurant_name).toBe('Tavola Italian Dining')
    
    // 断言营业时间记录（Monday-Sunday 应有 7 条）
    expect(data.hours_records).toHaveLength(7)
    const monday = data.hours_records.find(h => h.hour_weekday === 'MONDAY')
    expect(monday?.hour_recordStatus).toBe('PRESENT')
    
    // 断言数据集完整性（seed 数据中 7 天都有记录）
    expect(data.is_dataset_complete).toBe(true)
  })

  it('updateBusinessIdentity：更新基础身份信息并验证', async () => {
    const newPhone = `010-TEST-${Date.now()}`
    
    // 1. 执行更新
    const updateResult = await updateBusinessIdentity({
      restaurant_id: SEED.RESTAURANT_ID,
      restaurant_name: 'Tavola Italian Dining',
      restaurant_address: 'China, Bei Jing Shi, Chao Yang Qu, Dong Fang Dong Lu, 19号',
      restaurant_phone: newPhone,
      restaurant_website: 'https://www.tavola.com.cn',
      restaurant_rating: 4.9,
      restaurant_reviewCount: 100
    })
    expect(updateResult.success).toBe(true)

    // 2. 通过查询 Action 验证更新结果
    const profile = await getBusinessProfile()
    expect(profile.identity_info.restaurant_phone).toBe(newPhone)
    expect(profile.identity_info.restaurant_rating).toBe(4.9)
  })

  it('营业时间 CRUD 闭环：删除 -> 创建 -> 更新 -> 验证', async () => {
    // 注意：seed_data 已经填满了 7 天，为了测试 create，先删除周一的记录
    
    // 1. 删除周一记录
    const deleteResult = await deleteHourRecord({ hour_id: SEED.MONDAY_HOUR_ID })
    expect(deleteResult.success).toBe(true)

    // 验证删除后状态
    const profileAfterDelete = await getBusinessProfile()
    const mondayAfterDelete = profileAfterDelete.hours_records.find(h => h.hour_weekday === 'MONDAY')
    expect(mondayAfterDelete?.hour_recordStatus).toBe('MISSING')
    expect(mondayAfterDelete?.hour_id).toBeNull()

    // 2. 重新创建周一记录
    const createInput = {
      restaurant_id: SEED.RESTAURANT_ID,
      hour_weekday: 'MONDAY',
      hour_fullLine: 'Monday: 9:00 AM - 9:00 PM'
    }
    const createResult = await createHourRecord(createInput)
    expect(createResult.hour_id).toBeDefined()

    // 3. 更新该记录
    const updatedLine = 'Monday: 10:00 AM - 10:00 PM (Updated)'
    const updateResult = await updateHourRecord({
      hour_id: createResult.hour_id,
      hour_fullLine: updatedLine
    })
    expect(updateResult.success).toBe(true)

    // 4. 最终验证
    const finalProfile = await getBusinessProfile()
    const finalMonday = finalProfile.hours_records.find(h => h.hour_weekday === 'MONDAY')
    expect(finalMonday?.hour_id).toBe(createResult.hour_id)
    expect(finalMonday?.hour_fullLine).toBe(updatedLine)
    expect(finalMonday?.hour_recordStatus).toBe('PRESENT')
  })
})
