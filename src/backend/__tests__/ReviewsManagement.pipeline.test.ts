// [Pipeline Test DB Isolation]
import { beforeAll as _injectedBeforeAll, afterAll as _injectedAfterAll } from 'vitest';
_injectedBeforeAll(() => { process.env.VITEST_PIPELINE_PAGE = 'ReviewsManagement'; });
_injectedAfterAll(() => { delete process.env.VITEST_PIPELINE_PAGE; });

import { describe, it, expect, beforeAll } from 'vitest'
// ===== 导入登录函数 =====
import { adminLogin } from '@/backend/actions/AdminLogin'
// ===== 导入 Session Store =====
import { useAdminSession } from '@/tools/BackendSession'
// ===== 导入被测 Action =====
import {
  getReviewsList,
  getReviewDetail,
  createReview,
  updateReview,
  deleteReview,
} from '@/backend/actions/ReviewsManagement'

// ===== 测试常量（从 seed_data 取值）=====
const TEST_ADMIN = {
  account: 'jason_bourne',
  password: '123456' // 默认密码
}

const SEED_REVIEW_SLOT_1 = {
  id: '4ee51eac-86d9-44b0-a2d7-decdf598bb41',
  author_name: 'Kae Anchalee'
}

const SEED_REVIEW_SLOT_2 = {
  id: '72735ff6-c276-4927-ac24-0f42c87858bd'
}

const SEED_REVIEW_SLOT_5 = {
  id: 'be0d3edb-c802-4a83-8482-b7ad19ababcd'
}

describe('ReviewsManagement Action 数据管道测试', () => {

  beforeAll(async () => {
    // 1. 登录获取 Token (使用 jason_bourne ADMIN 账号)
    const loginResult = await adminLogin({
      member_account: TEST_ADMIN.account,
      member_password: TEST_ADMIN.password,
    })

    // 2. 将 token 和用户信息存入 Admin Session Store
    useAdminSession.getState().set({
      token: loginResult.token,
      user_id: loginResult.member_id,
      username: loginResult.member_account,
    })
  })

  it('getReviewsList：获取所有 5 个插槽的状态', async () => {
    const data = await getReviewsList({})
    
    // 断言结构与 seed_data 初始状态
    expect(data.total_slots).toBe(5)
    expect(data.present_count).toBe(5)
    expect(data.list.length).toBe(5)
    
    // 检查具体某一条
    const slot1 = data.list.find(i => i.review_slot === 1)
    expect(slot1?.author_name).toBe(SEED_REVIEW_SLOT_1.author_name)
    expect(slot1?.match_status).toBeDefined()
  })

  it('getReviewDetail：获取指定插槽详情', async () => {
    const data = await getReviewDetail({ review_slot: 1 })
    
    expect(data.review.review_id).toBe(SEED_REVIEW_SLOT_1.id)
    expect(data.review.author_name).toBe(SEED_REVIEW_SLOT_1.author_name)
    expect(data.review.is_present).toBe(true)
  })

  it('updateReview：修改现有评价内容并验证', async () => {
    const updatedName = `测试编辑_${Date.now()}`
    
    // 针对插槽 2 进行更新
    const result = await updateReview({
      review_id: SEED_REVIEW_SLOT_2.id,
      author_name: updatedName,
      rating: 4,
      relative_time: '2 days ago',
      content: 'Updated content for testing'
    })
    
    expect(result.success).toBe(true)

    // 验证更新是否落库
    const detail = await getReviewDetail({ review_slot: 2 })
    expect(detail.review.author_name).toBe(updatedName)
    expect(detail.review.rating).toBe(4)
  })

  it('deleteReview & createReview 闭环：删除 slot 5 后重新创建', async () => {
    // 1. 先删除插槽 5 (seed 数据)
    const delResult = await deleteReview({ review_id: SEED_REVIEW_SLOT_5.id })
    expect(delResult.success).toBe(true)

    // 2. 验证已删除
    const detailAfterDel = await getReviewDetail({ review_slot: 5 })
    expect(detailAfterDel.review.is_present).toBe(false)
    expect(detailAfterDel.review.match_status).toBe('MISSING')

    // 3. 重新创建该插槽的数据
    const createInput = {
      review_slot: 5,
      author_name: 'New Tester',
      rating: 5,
      relative_time: 'Just now',
      content: 'Freshly created review content'
    }
    
    const createResult = await createReview(createInput)
    expect(createResult.review_id).toBeDefined()

    // 4. 验证创建成功
    const detailAfterCreate = await getReviewDetail({ review_slot: 5 })
    expect(detailAfterCreate.review.author_name).toBe(createInput.author_name)
    expect(detailAfterCreate.review.review_id).toBe(createResult.review_id)
  })

  it('deleteReview：删除刚刚创建的测试数据（完成创建->删除闭环）', async () => {
    // 为了符合测试准则：删除测试需先创建再删除
    // 我们使用上一个 it 中刚创建的 slot 5 进行删除验证
    const currentSlot5 = await getReviewDetail({ review_slot: 5 })
    const targetId = currentSlot5.review.review_id!

    const result = await deleteReview({ review_id: targetId })
    expect(result.success).toBe(true)

    // 验证最终不存在
    const finalDetail = await getReviewDetail({ review_slot: 5 })
    expect(finalDetail.review.is_present).toBe(false)
  })
})
