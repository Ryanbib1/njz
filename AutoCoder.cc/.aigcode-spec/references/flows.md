# Flows Reference
> Fact layer - grounded expansion. Verify against code before editing.
> 更新后内容为当前累计修正；初版内容保留首次生成结果。关键结论仍以源码和最新确定性 reference 为准。

## 更新后内容

### 管理员 Google 快捷登录流程补充

当前工程事实中，管理员登录与注册流程已接入 Google 第三方快捷登录支持。该流程作为现有账号密码登录体系的补充，仅适用于管理员角色，不会自动为非管理员用户创建账号。

#### 1. 流程接入与交互
* **登录页接入**：在 `page:B01` (Admin Login) 中，用户可通过 "Sign in with Google" 按钮触发快捷登录。
  * 页面通过 `l2:import.B01.to.src.components.thirdparty.GoogleIcon.tsx` 引入 Google 图标，并通过 `l2:import.B01.to.src.lib.utils.ts` 导入的 `openExternalLinkAsync`、`isExternalLinkPopup`、`closeExternalLinkPopup` 和 `onExternalLinkMessage` 等工具方法处理第三方授权弹窗及跨窗口消息通信。
* **注册页接入**：在 `page:B02` (Admin Register) 中，同样提供了 \"Sign in with Google\" 入口。
  * 页面通过 `l2:import.B02.to.src.components.thirdparty.GoogleIcon.tsx` 引入图标，并利用 `l2:import.B02.to.src.lib.utils.ts` 导入的 `openExternalLinkAsync` 将用户引导至相同的管理员 Google 登录流程。

#### 2. 接口与数据流转
* **获取授权链接**：触发 Google 登录时，调用 `iface:getGoogleLoginUrl` 接口。该接口内部调用 `getAuthProvider` 与 `getAuthUrl` 获取第三方 OAuth 授权地址。
* **回调与会话建立**：
  * 授权成功后，回调触发 `iface:handleGoogleCallback` 接口。
  * 该接口通过 `l1:handleGoogleCallback.reads.member` 读取 `model:member` 校验对应的管理员账号是否存在。
  * 内部调用 `getAuthProvider`、`getAuthUser` 获取用户信息，并使用 `signToken` 签发令牌。
  * 接口执行成功后返回 `field:member.id`、`field:member.account` 和 `field:member.role`，建立活跃的管理员会话，并遵循常规登录流程重定向至后台仪表盘 `page:B03`。

---

### 餐饮在线订餐、自提与 Clink 支付流程

当前工程事实中，系统已建立完整的餐饮在线订餐、自提（Pickup）与 Clink 支付流程，打通了从前端顾客选购下单到后端管理员订单管理的闭环。

#### 1. 顾客在线订餐与下单流程
* **菜单获取与展示**：顾客进入 `route:FoodOrder` 页面，系统通过 `iface:getMenu` 接口加载菜单数据。
* **订单创建与支付会话初始化**：顾客选择菜品并填写自提联系信息后提交。
  * 触发 `iface:createFoodOrder` 接口，在数据库中持久化 `model:foodOrder` 与 `model:foodOrderItem` 记录。该接口内部通过 `buildPaymentResultUrl` 构建安全的支付结果返回链接，并调用 `createPaymentSession` 初始化支付。
  * 订单初始状态 `field:foodOrder.orderStatus` 设为 `PENDING_PAYMENT`，支付状态 `field:foodOrder.paymentStatus` 设为 `PENDING`。
  * 若需重新发起支付，可通过 `iface:createFoodOrderPaymentSession` 接口调用 Clink 支付服务。该接口同样使用 `buildPaymentResultUrl` 生成安全的支付结果返回链接，并更新订单的支付会话信息。

#### 2. 支付结果校验与安全对账流程
顾客在 Clink 完成支付后，会被重定向回 `route:OrderPaymentResult` 页面。该页面通过以下接口确保支付状态的安全校验与同步：
* **获取订单详情**：页面加载时调用 `iface:getPaymentOrderDetails` 接口。该接口内部通过 `resolveTrustedSessionId` 校验并解析可信的支付会话，随后通过 `fetchOrderWithItems` 获取订单及菜品详情，避免使用不可信的会话数据覆盖订单。
* **支付状态验证**：触发 `iface:verifyFoodOrderPayment` 接口向 Clink 验证支付状态。该接口通过 `resolveTrustedSessionId` 确保会话安全，利用 `fetchOrderWithItems` 获取订单，调用 `getPaymentSession` 查询第三方状态，并通过 `normalizeProviderPaymentStatus` 与 `persistResolvedPaymentStatus` 安全地将验证结果持久化到数据库。
* **手动对账同步**：若自动校验未及时同步，用户可触发手动对账，调用 `iface:reconcileFoodOrderPayment` 接口。该接口同样依赖 `resolveTrustedSessionId` 和 `fetchOrderWithItems` 确保数据安全，强制与 Clink 支付网关同步最新状态并更新本地订单及支付状态。

#### 3. 后端订单管理与履约流程
管理员在后台通过 `route:OrdersManagement` 页面对所有自提订单进行集中管理：
* **列表与详情查询**：
  * 页面通过 `iface:getFoodOrdersList` 接口分页加载并展示 `model:foodOrder` 列表（对应数据读取关系 `l1:getFoodOrdersList.reads.foodOrder`）。
  * 点击特定订单时，通过 `iface:getFoodOrderDetail` 接口获取该订单的详细字段（对应数据读取关系 `l1:getFoodOrderDetail.reads.foodOrder`）。
* **状态更新与履约**：管理员可根据备餐进度，调用 `iface:updateFoodOrderStatus` 接口修改 `field:foodOrder.orderStatus`（如变更为 `PREPARING`、`READY_FOR_PICKUP` 或 `COMPLETED`）。该接口内部会校验传入的状态值，并向数据库写入最新的订单状态（对应数据读写关系 `l1:updateFoodOrderStatus.reads.foodOrder` 与 `l1:updateFoodOrderStatus.writes.foodOrder`）。
* **数据导出**：管理员可通过 `iface:exportFoodOrdersList` 接口将筛选后的订单列表导出为报表（对应数据读取关系 `l1:exportFoodOrdersList.reads.foodOrder`）。

## 初版内容

### Main Flows

#### 1. 后台管理员注册与登录流程 (Admin Registration & Login)
* **流程描述**：
  未登录的访客（`GUEST`）可以通过注册页面创建管理员账号，并在登录页面通过凭证校验建立 `ADMIN` 会话。
* **步骤分解**：
  1. **访问注册页**：访客进入 `page:B02`，填写 `field:member.account`、`field:member.password` 和 `field:member.email` 提交注册 `iface:registerAdmin`。
  2. **注册校验与创建**：系统执行前置检查，要求所有字段非空，且 `field:member.account` 与 `field:member.email` 在数据库中必须唯一。校验通过后创建 `model:member` 记录，其 `field:member.role` 显式设为 `ADMIN`。注册成功后不自动登录，而是重定向回登录页 `page:B01`（`l2:B02.to.B01.navigateTo`） `evidence:rule.014.B01.AdminLogin`。
  3. **访问登录页**：访客进入 `page:B01`。如果当前已存在活跃的 `ADMIN` 会话，则直接重定向至后台仪表盘 `page:B03`（`l2:B01.to.B03.navigateTo`） `evidence:rule.015.B01.AdminLogin`。
  4. **登录校验**：用户在 `page:B01` 提交账号密码，触发 `iface:adminLogin`。系统校验账号存在性、密码正确性以及 `field:member.role` 是否为 `ADMIN`。
  5. **会话建立**：校验成功后，建立逻辑 `ADMIN` 会话（状态变为 `ACTIVE`），并跳转至 `page:B03`（`l2:B01.to.B03.navigateTo.2`） `evidence:rule.015.B01.AdminLogin`。若校验失败，会话状态保持 `NONE`，停留在当前页并显示错误反馈 `evidence:flow.003.B01.AdminLogin`。

#### 2. 仪表盘数据加载与校验流程 (Dashboard Overview & Verification)
* **流程描述**：
  管理员登录后，在后台仪表盘查看整站数据的实时统计以及与固定源的比对摘要。
* **步骤分解**：
  1. **权限拦截**：访问 `page:B03` 时，系统首先通过 `iface:checkCurrentSession` 校验当前会话是否为 `ACTIVE` 且角色为 `ADMIN` `evidence:rule.016.pages.B03-B06`。
  2. **数据读取**：调用 `iface:getAdminDashboardData` 读取唯一的 `model:restaurant` 记录，并统计关联的 `model:restaurantphoto`、`model:restaurantreview` 和 `model:restauranthour` 记录总数 `evidence:rule.018.B03.AdminDashboard`。
  3. **实时比对**：将数据库中的当前值与系统内置的固定源（10个照片槽位、5个评论槽位、7个营业时间星期）进行逐字段比对，派生出 `MATCHED` 或 `MISMATCHED` 状态 `evidence:rule.018.B03.AdminDashboard`。
  4. **渲染展示**：在 `page:B03` 展示数据总量及比对结果摘要，并提供跳转至各管理模块的入口（如 `l2:B03.to.B04.navigateToMain`、`l2:B03.to.B05.navigateToMain`、`l2:B03.to.B06.navigateTo`） `evidence:flow.004.B02.AdminRegister`。

#### 3. 照片槽位管理流程 (Photos Slot Management)
* **流程描述**：
  管理员对 10 个固定照片槽位（`photo_01` 到 `photo_10`）进行状态核对、创建、编辑或物理删除。
* **步骤分解**：
  1. **加载与派生**：进入 `page:B04`，调用 `iface:getPhotosList`。系统以固定槽位 `photoKey` 列表为主轴，与数据库中 `model:restaurantphoto` 的 `field:restaurantphoto.photoKey` 进行匹配。存在记录的标记为 `PRESENT`，缺失的标记为 `MISSING`。对于 `PRESENT` 记录，比对 `alt`、`description`、`imageUrl` 是否与固定源一致，派生出 `MATCHED` 或 `MISMATCHED` `evidence:rule.019.B04.PhotosManagement`。
  2. **创建缺失记录**：对于状态为 `MISSING` 的槽位，管理员可调用 `iface:createPhoto` 进行恢复。系统限制只能为固定槽位列表内且当前缺失的 `photoKey` 创建记录，且所有字段必填。创建成功后，状态转为 `PRESENT`，并更新 `updatedAt` 字段 `evidence:rule.020` `evidence:rule.006`。
  3. **编辑照片信息**：管理员选择某张照片，通过 `l2:B03.to.B04.navigateToDetail` 携带 `field:restaurantphoto.id` 进入编辑，调用 `iface:updatePhoto` 修改内容。保存后重新计算 `MATCHED` / `MISMATCHED` 状态，并更新 `updatedAt` `evidence:rule.021` `evidence:rule.006`。
  4. **物理删除照片**：管理员调用 `iface:deletePhoto` 删除指定记录。删除后，该槽位状态变回 `MISSING`，前台首页对应照片立即消失，后台保留该槽位作为缺失项以供后续恢复 `evidence:rule.022`。

#### 4. 评论槽位管理流程 (Reviews Slot Management)
* **流程描述**：
  管理员对 5 个固定评论槽位（`reviewSlot` 1 到 5）进行管理，确保前台展示的精选评论内容准确。
* **步骤分解**：
  1. **加载与逐字比对**：进入 `page:B05`，调用 `iface:getReviewsList`。系统以 `reviewSlot` 1..5 为主轴，查询 `model:restaurantreview`。存在记录的标记为 `PRESENT`，缺失的标记为 `MISSING`。对于 `PRESENT` 记录，将其 `authorName`、`rating`、`relativeTime`、`content` 与固定源进行逐字符（包括标点、空格、弯引号等）精确比对，派生出 `MATCHED` 或 `MISMATCHED` `evidence:rule.023.B05.ReviewsManagement`。
  2. **创建缺失评论**：管理员可调用 `iface:createReview` 为当前 `MISSING` 的槽位创建评论。禁止创建 1..5 之外的槽位，且所有字段必填，`rating` 必须为整数。创建成功后状态转为 `PRESENT`，并更新 `updatedAt` `evidence:rule.024` `evidence:rule.006`。
  3. **编辑评论内容**：管理员通过 `l2:B03.to.B05.navigateToDetail` 携带 `field:restaurantreview.reviewSlot` 进入编辑，调用 `iface:updateReview`。保存时，系统禁止对 `field:restaurantreview.content` 进行任何 trim、标点替换或空白压缩，必须逐字符保留原文。保存后重新计算匹配状态，且**禁止**自动重算或覆盖 `model:restaurant` 的整体评分和总评论数 `evidence:rule.025.restaurant`。
  4. **物理删除评论**：调用 `iface:deleteReview` 物理删除记录。删除后该槽位状态变回 `MISSING`，前台首页立即移除该评论，且 `field:restaurant.reviewCount` 保持原样，不得自动递减 `evidence:rule.026.restaurant`。

#### 5. 商业信息与营业时间管理流程 (Business Info & Hours Management)
* **流程描述**：
  管理员维护单餐厅的全局商业身份信息，并按周一至周日的固定顺序管理 7 天的营业时间。
* **步骤分解**：
  1. **加载与比对**：进入 `page:B06`，调用 `iface:getBusinessProfile` 读取唯一的 `model:restaurant` 记录，以及 `MONDAY` 到 `SUNDAY` 7 个固定星期的 `model:restauranthour` 记录。系统将各项数据与固定源进行比对，派生出匹配状态 `evidence:rule.027.B06.BusinessInfoManagement`。
  2. **编辑商业身份**：管理员调用 `iface:updateBusinessIdentity` 修改餐厅的名称、地址、电话、官网、展示评分及展示评论数。保存后，前台对应区域同步更新，后台重新计算匹配结果。其中 `field:restaurant.reviewCount` 和 `field:restaurant.rating` 均为独立展示字段，禁止由系统根据评论表自动计算覆盖 `evidence:rule.028.brandStory`。
  3. **营业时间维护**：
     - **排序规则**：展示顺序必须严格固定为 `MONDAY` → `TUESDAY` → `WEDNESDAY` → `THURSDAY` → `FRIDAY` → `SATURDAY` → `SUNDAY`，禁止依赖数据库默认顺序或按字母序排序 `evidence:rule.029`。
     - **创建**：调用 `iface:createHourRecord` 为当前缺失的星期创建营业时间，`field:restauranthour.fullLine` 为整行文本，不得拆分为结构化时间 `evidence:rule.030`。
     - **编辑**：调用 `iface:updateHourRecord` 修改某星期的 `fullLine`，保存后重新计算匹配状态 `evidence:rule.031`。
     - **删除**：调用 `iface:deleteHourRecord` 物理删除某星期记录。删除后该星期状态变为 `MISSING`，整体营业时间数据集标记为 `INCOMPLETE`，前台立即移除该行 `evidence:rule.032`。

---

### Cross-Page Lineage

#### 1. 核心实体状态流转与跨页联动
整站围绕唯一的 `model:restaurant` 运行（单餐厅站点模式 `evidence:rule.003.restaurant`）。后台的任何写操作都会直接影响前台 `page:F01` 的渲染。

| 源页面 (写操作) | 触发接口 | 影响的模型与字段 | 派生状态 (后台) | 目标页面 (读操作) | 跨页联动表现 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `page:B04` (照片管理) | `iface:createPhoto`<br>`iface:deletePhoto` | `model:restaurantphoto`<br>• `field:restaurantphoto.photoKey` | `PRESENT` / `MISSING` | `page:F01` (前台首页) | 物理删除后，首页对应照片立即消失；重新创建后，首页对应照片重新出现。不进行任何占位图替换 `evidence:rule.017.F01.Home`。 |
| `page:B05` (评论管理) | `iface:createReview`<br>`iface:deleteReview` | `model:restaurantreview`<br>• `field:restaurantreview.reviewSlot` | `PRESENT` / `MISSING` | `page:F01` (前台首页) | 物理删除后，首页对应评论立即消失；重新创建后，首页对应评论重新出现 `evidence:rule.017.F01.Home`。 |
| `page:B06` (营业信息) | `iface:createHourRecord`<br>`iface:deleteHourRecord` | `model:restauranthour`<br>• `field:restauranthour.weekday` | `PRESENT` / `MISSING`<br>`INCOMPLETE` | `page:F01` (前台首页) | 营业时间行按周一至周日固定顺序渲染，缺失的星期行在首页直接不显示，不进行自动补齐 `evidence:rule.017.F01.Home`。 |
| `page:B06` (营业信息) | `iface:updateBusinessIdentity` | `model:restaurant`<br>• `field:restaurant.rating`<br>• `field:restaurant.reviewCount` | `MATCHED` / `MISMATCHED` | `page:F01` (前台首页) | 首页 Hero 区域和 About 区域展示更新后的数据库值。展示评分与总评论数完全独立，不随评论表的增删改而自动重算 `evidence:rule.028.brandStory`。 |

#### 2. 导航与上下文传参
后台管理模块之间的跳转以及从仪表盘到明细编辑页的上下文传递关系如下：

```
[page:B01 AdminLogin] 
       │ (登录成功)
       ▼
[page:B03 AdminDashboard] ──(l2:B03.to.B06.navigateTo)──> [page:B06 BusinessInfoManagement]
       │
       ├─(l2:B03.to.B04.navigateToMain)─────────────────> [page:B04 PhotosManagement]
       ├─(l2:B03.to.B04.navigateToDetail) ──(携带 id)───> [page:B04 PhotosManagement] (编辑态)
       │
       ├─(l2:B03.to.B05.navigateToMain)─────────────────> [page:B05 ReviewsManagement]
       └─(l2:B03.to.B05.navigateToDetail) ──(携带 slot)─> [page:B05 ReviewsManagement] (编辑态)
```

* **照片管理跳转**：
  - 从 `page:B03` 导航至 `page:B04` 主页时使用 `l2:B03.to.B04.navigateToMain`。
  - 若要直接编辑特定照片，通过 `l2:B03.to.B04.navigateToDetail` 传递 `field:restaurantphoto.id` 参数。
* **评论管理跳转**：
  - 从 `page:B03` 导航至 `page:B05` 主页时使用 `l2:B03.to.B05.navigateToMain`。
  - 若要直接编辑特定评论，通过 `l2:B03.to.B05.navigateToDetail` 传递 `field:restaurantreview.reviewSlot` 参数。

---

### Unknowns

> [!WARNING]
> 以下内容在输入数据中未明确定义，在修改或编写相关代码时需保持警惕：
> 1. **密码加密机制**：输入中提到 `field:member.password` 是后台登录凭证校验字段且页面禁止展示原值 `evidence:rule.039.member`，但未说明在应用层或数据库中是否使用特定的加密算法（如 bcrypt、scrypt）进行哈希存储。
> 2. **会话持久化实现**：提到 `ACTIVE` 和 `NONE` 的逻辑会话状态 `evidence:rule.009.B01.AdminLogin`，但未明确说明会话是通过 JWT、Cookie-Session 还是 Redis 缓存进行具体实现与生命周期管理。
> 3. **图片存储与上传**：后台照片管理 `page:B04` 允许编辑和创建 `imageUrl` `evidence:rule.021`，但未提及系统是否支持物理图片上传（如 OSS、S3），还是仅支持管理员手动填写外部图片 URL 文本。
