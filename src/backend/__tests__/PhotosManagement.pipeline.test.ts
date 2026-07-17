// [Pipeline Test DB Isolation]
import { beforeAll as _injectedBeforeAll, afterAll as _injectedAfterAll } from 'vitest';
_injectedBeforeAll(() => { process.env.VITEST_PIPELINE_PAGE = 'PhotosManagement'; });
_injectedAfterAll(() => { delete process.env.VITEST_PIPELINE_PAGE; });

import { describe, it, expect, beforeAll } from 'vitest'
// ===== 导入登录函数（从 login_context 提取）=====
import { adminLogin } from '@/backend/actions/AdminLogin'
// ===== 导入 Session Store（从 login_context 提取）=====
import { useAdminSession } from '@/tools/BackendSession'

// ===== 导入被测 Action（从 action_types 提取）=====
import {
  getPhotosList,
  getPhotoDetail,
  createPhoto,
  updatePhoto,
  deletePhoto,
} from '@/backend/actions/PhotosManagement'

// ===== 测试常量（从 seed_data 取值）=====
const TEST_ADMIN = {
  account: 'jason_bourne',
  password: '123456', // 默认密码
}

const SEED_PHOTO = {
  id: '06ccafd2-15bd-4aa6-abb9-e4076817767d', // 表中第 0 行数据
  photoKey: 'img-05',
}

describe('PhotosManagement Server Action 数据管道测试', () => {
  beforeAll(async () => {
    // 1. 登录获取 Token (ADMIN 角色)
    const loginResult = await adminLogin({
      member_account: TEST_ADMIN.account,
      member_password: TEST_ADMIN.password,
    })

    // 2. 将 token 和用户信息存入 Admin Session Store
    // 后续 rpc-client 调用会自动从 store 读取并放入 Authorization Header
    useAdminSession.getState().set({
      token: loginResult.token,
      user_id: loginResult.member_id,
      username: loginResult.member_account,
    })
  })

  // --- 查询类测试 ---

  it('getPhotosList：验证照片位列表聚合逻辑', async () => {
    const data = await getPhotosList()

    // 断言返回结构
    expect(data.totalSlots).toBe(10)
    expect(data.items.length).toBe(10)
    
    // 验证 items 中的固定插槽逻辑 (photo_01 到 photo_10)
    const firstSlot = data.items.find(i => i.photoKey === 'photo_01')
    expect(firstSlot).toBeDefined()
    expect(firstSlot?.targetAlt).toBe('Tavola Italian Dining')
  })

  it('getPhotoDetail：获取指定照片详情', async () => {
    // 使用 seed_data 中存在的 ID
    const detail = await getPhotoDetail({ id: SEED_PHOTO.id })

    expect(detail.id).toBe(SEED_PHOTO.id)
    expect(detail.photoKey).toBe(SEED_PHOTO.photoKey)
    expect(detail.imageUrl).toContain('googleusercontent.com')
  })

  // --- 写操作闭环：创建 -> 更新 -> 删除 ---

  it('Photo 完整生命周期验证：创建 -> 更新 -> 删除', async () => {
    // 1. 创建 (由于 seed_data 使用的是 img-xx，photo_01 插槽目前应该是 MISSING 状态)
    const createInput = {
      photoKey: 'photo_01',
      alt: `测试Alt_${Date.now()}`,
      description: '测试描述',
      imageUrl: '/images/test_create.jpg'
    }

    const created = await createPhoto(createInput)
    expect(created.id).toBeDefined()

    // 2. 验证创建结果并执行更新
    const detailBeforeUpdate = await getPhotoDetail({ id: created.id })
    expect(detailBeforeUpdate.alt).toBe(createInput.alt)

    const updateInput = {
      id: created.id,
      alt: `更新后的Alt_${Date.now()}`,
      description: '更新后的描述',
      imageUrl: '/images/test_update.jpg'
    }

    const updateResult = await updatePhoto(updateInput)
    expect(updateResult.success).toBe(true)

    // 3. 验证更新结果
    const detailAfterUpdate = await getPhotoDetail({ id: created.id })
    expect(detailAfterUpdate.alt).toBe(updateInput.alt)
    expect(detailAfterUpdate.description).toBe(updateInput.description)

    // 4. 删除
    const deleteResult = await deletePhoto({ id: created.id })
    expect(deleteResult.success).toBe(true)

    // 5. 验证已不存在 (Action 内部会 throw Error)
    await expect(getPhotoDetail({ id: created.id })).rejects.toThrow('Photo record not found.')
  })

  it('createPhoto：验证非法插槽 key 的限制', async () => {
    // 验证逻辑：FIXED_PHOTOS 中不包含的 key 应该报错
    const invalidInput = {
      photoKey: 'invalid_key',
      alt: 'test',
      description: 'test',
      imageUrl: 'test.jpg'
    }

    await expect(createPhoto(invalidInput)).rejects.toThrow('Invalid photo slot')
  })
})
