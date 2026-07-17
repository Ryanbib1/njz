# Update Playbooks
> Derived guidance - verify against code.
> 更新后内容为当前累计修正；初版内容保留首次生成结果。关键结论仍以源码和最新确定性 reference 为准。

## 更新后内容

### 管理员身份验证与 Google 登录集成

当前工程事实已在管理员登录与注册流程中集成了 Google 第三方登录支持。

#### 1. 变更接口与页面导航
* **受影响页面**：
  * `page:B01` (Admin Login)：提供 Google 登录入口，支持通过 Google 账号直接登录。
  * `page:B02` (Admin Register)：提供 Google 注册/登录入口，引导至相同的 Google 登录流程。
* **相关接口**（定义于 `src/backend/actions/AdminLogin.ts`）：
  * `iface:getGoogleLoginUrl`：获取 Google OAuth 授权登录 URL。
  * `iface:handleGoogleCallback`：处理 Google 登录回调，读取 `model:member` 校验管理员身份，并返回登录态。
* **相关组件与依赖**：
  * 引入 `src/components/thirdparty/GoogleIcon.tsx` 图标组件（由 `page:B01` 与 `page:B02` 视图层导入）。
  * 依赖 `src/lib/utils.ts` 中的外部链接处理工具（如 `openExternalLinkAsync` 等）实现 OAuth 弹窗与消息监听。

#### 2. 业务规则与行为补充
* **仅限管理员流**：此 Google 登录集成仅适用于管理员登录流程（`page:B01`），不适用于非管理员页面，亦不会通过 Google 登录自动创建新的管理员账号。
* **会话流转**：Google 登录成功后，已存在的管理员用户将通过正常的管理员会话流程重定向至后台主页 `page:B03`。
* **相关检查**：在对接生产环境时，需在第三方配置中更新 Google OAuth 客户端凭据及回调域设置。

---

### 在线订餐、自提与 Clink 支付流导航

当前工程事实已补充并修复了完整的在线订餐、自提联系人录入、Clink 支付对接及后台订单管理流程，重点强化了支付会话的安全校验与状态同步。

#### 1. 核心变更接口与页面导航

##### 前端订餐与支付结果流
* **受影响页面与路由**：
  * `route:FoodOrder` (`/foodorder`)：前端在线订餐主页。提供菜单浏览、自提联系人信息录入、创建订单并拉起支付。
  * `route:OrderPaymentResult` (`/orderpaymentresult`)：支付结果承接页。接收 `orderId`、`status` (对应 `enum:payment_status`) 和 `sessionId` 参数，展示支付结果并支持重新发起支付。
* **核心交互接口**（定义于 `src/frontend/actions/FoodOrder.ts` 与 `src/frontend/actions/OrderPaymentResult.ts`）：
  * `iface:getMenu`：获取订餐菜单。
  * `iface:createFoodOrder`：提交自提信息与菜品明细，创建 `model:foodOrder` 记录并生成 Clink 支付会话。内部使用 `buildPaymentResultUrl` 构建安全的支付结果返回链接。
  * `iface:createFoodOrderPaymentSession`：为未支付订单重新创建或获取 Clink 支付会话，同样使用 `buildPaymentResultUrl` 确保返回路径一致。
  * `iface:getPaymentOrderDetails`：查询当前订单的支付与自提详情。内部通过 `resolveTrustedSessionId` 校验并解析可信的会话 ID，防止未知会话篡改订单。
  * `iface:verifyFoodOrderPayment`：主动向 Clink 渠道验证支付状态。通过 `resolveTrustedSessionId` 确保会话安全，并调用 `normalizeProviderPaymentStatus` 与 `persistResolvedPaymentStatus` 规范化并持久化支付状态。
  * `iface:reconcileFoodOrderPayment`：对账并同步更新本地订单状态。结合 `resolveTrustedSessionId` 校验，确保仅在可信会话下更新订单与支付状态。

##### 后端订单管理流
* **受影响页面与路由**：
  * `route:OrdersManagement` (`/ordersmanagement`)：后台管理员订单管理主页。
* **核心交互接口**（定义于 `src/backend/actions/OrdersManagement.ts`）：
  * `iface:getFoodOrdersList`：分页、按条件检索自提订单列表。
  * `iface:getFoodOrderDetail`：查询单笔自提订单的详细信息（包含菜品明细 `model:foodOrderItem`）。
  * `iface:updateFoodOrderStatus`：管理员手动更新订单状态（如标记为已接单、制作中、待自提、已完成或已取消），内部对状态流转合法性进行安全过滤。
  * `iface:exportFoodOrdersList`：导出订单列表数据。

#### 2. 核心数据模型与状态机
* **数据模型**：
  * `model:foodOrder`：存储订单主表信息，包含订单号、自提联系人、金额、支付渠道（`enum:payment_provider` 仅支持 `CLINK`）、支付状态（`enum:payment_status`）及订单状态（`enum:food_order_status`）。
  * `model:foodOrderItem`：存储订单菜品明细，通过外键关联 `model:foodOrder`。
* **状态流转规则**：
  * **订单状态** (`enum:food_order_status`)：`PENDING_PAYMENT` -> `PAID` -> `PREPARING` -> `READY_FOR_PICKUP` -> `COMPLETED`（或 `CANCELLED`）。
  * **支付状态** (`enum:payment_status`)：`PENDING` -> `SUCCESS` / `FAILED` / `CANCELLED`。

#### 3. 相关检查
* **支付安全校验**：在调试与测试时，需重点验证 `route:OrderPaymentResult` 页面在无有效 `sessionId` 或传入伪造 `sessionId` 时的拦截表现，确保系统不会在未通过可信会话校验的情况下将订单错误标记为已支付。
* **端到端联调**：调试端到端支付流程时，需确保环境中已正确配置 **Clink** 支付网关的密钥与回调地址，并手动测试从 `route:FoodOrder` 提交订单、跳转至 Clink 托管支付页、再安全重定向回 `route:OrderPaymentResult` 的完整闭环。

## 初版内容

本指南为开发人员和 Update Agent 提供在修改本项目代码时的入口导航与规则核对。在进行任何代码变更前，请务必对照下表及规则进行安全检查。

### 常见改动类型入口导航

当需要修改或扩展系统功能时，请根据改动类型定位到对应的页面、接口、模型及规则约束：

| 改动类型 | 涉及页面 (Pages) | 核心接口 (Interfaces) | 核心模型与字段 (Models & Fields) | 核心规则与不变量约束 |
| :--- | :--- | :--- | :--- | :--- |
| **管理员注册与登录** | `page:B01`<br>`page:B02` | `iface:registerAdmin`<br>`iface:adminLogin`<br>`iface:checkCurrentSession` | `model:member`<br>• `field:member.account`<br>• `field:member.password`<br>• `field:member.role` | 1. 注册成功后不自动登录，重定向至 `page:B01` `evidence:rule.014.B01.AdminLogin`。<br>2. 已登录用户访问 `page:B01` 须重定向至 `page:B03` `evidence:rule.015.B01.AdminLogin`。<br>3. 注册账号的角色必须显式设为 `ADMIN` `evidence:rule.014.B01.AdminLogin`。 |
| **照片槽位管理** | `page:B04`<br>`page:B03` | `iface:getPhotosList`<br>`iface:createPhoto`<br>`iface:updatePhoto`<br>`iface:deletePhoto` | `model:restaurantphoto`<br>• `field:restaurantphoto.photoKey` | 1. 槽位范围固定为 `photo_01` 到 `photo_10` `evidence:rule.041.restaurantphoto`。<br>2. 实时派生 `PRESENT`/`MISSING` 及 `MATCHED`/`MISMATCHED` 状态 `evidence:rule.019.B04.PhotosManagement`。<br>3. 物理删除后，前台 `page:F01` 对应照片立即消失，不使用占位图 `evidence:rule.017.F01.Home`。 |
| **精选评论管理** | `page:B05`<br>`page:B03` | `iface:getReviewsList`<br>`iface:createReview`<br>`iface:updateReview`<br>`iface:deleteReview` | `model:restaurantreview`<br>• `field:restaurantreview.reviewSlot`<br>`model:restaurant`<br>• `field:restaurant.rating`<br>• `field:restaurant.reviewCount` | 1. 槽位范围固定为 `1` 到 `5` `evidence:rule.042.restaurant`。<br>2. 评论正文 `content` 必须逐字符保留，禁止任何 `trim` 或格式化 `evidence:rule.025.restaurant`。<br>3. 评论的增删改**绝对禁止**自动重算或覆盖 `model:restaurant` 的整体评分和总评论数 `evidence:rule.025.restaurant` `evidence:rule.026.restaurant`。 |
| **商业信息与营业时间** | `page:B06`<br>`page:B03` | `iface:getBusinessProfile`<br>`iface:updateBusinessIdentity`<br>`iface:createHourRecord`<br>`iface:updateHourRecord`<br>`iface:deleteHourRecord` | `model:restaurant`<br>`model:restauranthour`<br>• `field:restauranthour.weekday`<br>• `field:restauranthour.fullLine` | 1. 营业时间展示顺序必须严格固定为 `MONDAY` 到 `SUNDAY` `evidence:rule.029`。<br>2. `fullLine` 必须作为完整文本存储，禁止拆分 `evidence:rule.031`。<br>3. 缺失的星期行在前台 `page:F01` 直接不显示，不自动补齐 `evidence:rule.017.F01.Home`。 |

### 核心不变量与安全守则

在修改任何后端逻辑或前端渲染时，必须严格遵守以下不变量，否则会导致系统状态失真或校验失败：

1. **单餐厅运行模式**：整站必须围绕唯一一个 canonical `restaurant` 记录运行（业务名称 `Tavola Italian Dining`） `evidence:rule.003.restaurant`。前台 `page:F01` 必须直接渲染数据库当前值，禁止使用静态数据兜底 `evidence:rule.007.restaurant`。
2. **显式更新时间戳**：所有后台写操作成功后，涉及记录的 `updatedAt` 字段必须由应用层显式更新为当前时间戳 `evidence:rule.006`。
3. **权限拦截**：访问后台管理页面 `page:B03`、`page:B04`、`page:B05`、`page:B06` 必须校验当前会话为 `ACTIVE` 且角色为 `ADMIN` `evidence:rule.016.pages.B03-B06`。

### 未知风险提示 (Unknowns)

在修改相关模块时，请注意以下未明确定义的系统行为，并保持警惕：
* **密码加密**：`field:member.password` 的具体哈希加密算法未指定，修改登录注册时需确认现有代码的加密实现。
* **会话持久化**：`ACTIVE` 会话的具体实现媒介（JWT / Cookie / Redis）未指定，修改会话校验时需参考现有 session 拦截器。
* **图片存储**：系统是否支持物理图片上传或仅支持外部 URL 文本未指定 `evidence:rule.021`。
