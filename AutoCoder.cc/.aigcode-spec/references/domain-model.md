# Domain Model Reference
> Fact layer - grounded expansion. Verify against code before editing.
> 更新后内容为当前累计修正；初版内容保留首次生成结果。关键结论仍以源码和最新确定性 reference 为准。

## 更新后内容

### 身份认证与访问控制规则补充

#### 1. 后台管理员 Google 联合登录流 (Google Sign-In)
当前工程事实中，针对管理员后台（Backend Admin Context）的身份验证流程，引入了基于 Google OAuth 的第三方联合登录支持。该机制与原有的管理员会话生命周期及角色校验规则保持一致：

*   **接口绑定与模型读取**：
    *   通过 `iface:getGoogleLoginUrl` 获取 Google OAuth 授权跳转链接。
    *   通过 `iface:handleGoogleCallback` 处理 Google 回调。该接口会读取 `model:member` 实体，通过 Google 账号关联信息匹配已存在的管理员记录（读取 `field:member.id`、`field:member.account`、`field:member.role`），验证通过后签发管理员会话 Token。
*   **不变量与限制条件**：
    *   **仅限已有管理员账号**：此 Google 登录流仅适用于系统中已存在的 `ADMIN` 账号，**不会**在未匹配到记录时自动创建新的管理员账户。
    *   **范围限制**：此第三方联合登录流仅作用于管理员登录页及注册页引导的后台管理员登录流程，不适用于前台普通访客或非管理员页面。

### 餐饮在线订餐与支付领域模型补充

当前工程事实中，系统引入了餐饮在线订餐、自提与 Clink 支付流程，并建立了相应的领域模型、状态机及不变量规则。

#### 1. 核心实体与关系
*   **订单聚合根 `model:foodOrder`**：
    *   代表一次在线订餐记录。包含唯一的订单号 `field:foodOrder.orderNumber`、履约方式 `field:foodOrder.fulfillmentMethod`（如自提）、联系人信息（`field:foodOrder.pickupContactName`、`field:foodOrder.pickupPhone`、`field:foodOrder.customerEmail`）以及金额明细（`field:foodOrder.subtotalAmount`、`field:foodOrder.totalAmount`、`field:foodOrder.currency`）。
    *   与订单项 `model:foodOrderItem` 存在一对多级联关系（通过 `field:foodOrder.food_order_item` 关联）。
*   **订单明细 `model:foodOrderItem`**：
    *   记录具体菜品、单价、数量、行总价及备注（`field:foodOrderItem.itemName`、`field:foodOrderItem.unitPrice`、`field:foodOrderItem.quantity`、`field:foodOrderItem.lineTotal`、`field:foodOrderItem.notes`）。通过外键 `field:foodOrderItem.orderId` 归属于 `model:foodOrder`。

#### 2. 状态机与不变量规则
系统通过两个核心枚举控制订单生命周期与支付状态：

*   **订单状态 `enum:food_order_status`**：
    *   包含状态：`PENDING_PAYMENT`（待支付）、`PAID`（已支付）、`PREPARING`（制作中）、`READY_FOR_PICKUP`（待自提）、`COMPLETED`（已完成）、`CANCELLED`（已取消）。
*   **支付状态 `enum:payment_status`**：
    *   包含状态：`PENDING`（支付中）、`SUCCESS`（支付成功）、`FAILED`（支付失败）、`CANCELLED`（已取消）。
*   **支付渠道 `enum:payment_provider`**：
    *   当前支持的支付渠道为 `CLINK`。

##### 状态流转与不变量约束：
*   **支付与订单状态联动**：
    *   当创建订单（通过 `iface:createFoodOrder`）时，初始订单状态设为 `PENDING_PAYMENT`，支付状态设为 `PENDING`。
    *   当支付渠道确认支付成功（通过 `iface:verifyFoodOrderPayment` 或 `iface:reconcileFoodOrderPayment` 校验）后，`field:foodOrder.paymentStatus` 更新为 `SUCCESS`，同时 `field:foodOrder.orderStatus` 必须联动变更为 `PAID`，并记录支付时间 `field:foodOrder.paidAt`。
    *   后台管理员（角色 `ADMIN`）可通过 `iface:updateFoodOrderStatus` 手动推进已支付订单的后续履约状态（如从 `PAID` -> `PREPARING` -> `READY_FOR_PICKUP` -> `COMPLETED`）。
*   **金额一致性不变量**：
    *   订单总额 `field:foodOrder.totalAmount` 必须等于所有关联 `model:foodOrderItem` 的 `field:foodOrderItem.lineTotal` 之和。
    *   单项行总价 `field:foodOrderItem.lineTotal` 必须等于 `field:foodOrderItem.unitPrice` 乘以 `field:foodOrderItem.quantity`。

## 初版内容

### Bounded Contexts
- **Frontend Web Context**: 面向普通访客 `GUEST` 的前台展示上下文。核心页面为 `Home` (page:F01)，负责以只读方式渲染单餐厅的完整信息，包括基本身份、照片、精选评论和营业时间 (evidence:rule.017.F01.Home, evidence:flow.002.F01.Home)。
- **Backend Admin Context**: 面向管理员 `ADMIN` 的后台管理上下文。包含管理员注册 (page:B02)、登录 (page:B01)、仪表盘概览 (page:B03) 以及照片 (page:B04)、评论 (page:B05)、商业信息与营业时间 (page:B06) 的专项管理 (evidence:flow.001.pages.F01-B06)。

### Aggregates
#### 1. Restaurant Aggregate
以 `restaurant` (model:restaurant) 为聚合根，管理整站唯一的 canonical 餐厅实体及其关联的子实体。
- **Restaurant (聚合根)**: 存储餐厅的核心身份信息 (field:restaurant.name, field:restaurant.address, field:restaurant.phone, field:restaurant.website, field:restaurant.rating, field:restaurant.reviewCount, field:restaurant.brandStory, field:restaurant.highlights) (evidence:rule.040.restaurant)。
- **RestaurantPhoto (子实体)**: 关联的照片记录 (model:restaurantphoto)，通过逻辑键 `photoKey` 映射到 10 个固定照片槽位 (evidence:rule.035.restaurantphoto)。
- **RestaurantReview (子实体)**: 关联的精选评论记录 (model:restaurantreview)，通过逻辑键 `reviewSlot` 映射到 5 个固定评论槽位 (evidence:rule.036.restaurantreview)。
- **RestaurantHour (子实体)**: 关联的营业时间记录 (model:restauranthour)，通过逻辑键 `weekday` 映射到 7 个固定星期槽位 (evidence:rule.037.restauranthour)。

#### 2. Member Aggregate
管理后台管理员账户。
- **Member (聚合根)**: 存储管理员的登录凭证与角色 (model:member)，包含账号 (field:member.account)、密码 (field:member.password)、邮箱 (field:member.email) 及角色 (field:member.role) (evidence:rule.039.member)。

---

### Invariants And State Rules

#### 1. 单餐厅站点不变量 (Single Restaurant Invariant)
- 整站必须围绕唯一一个 canonical `restaurant` 记录运行，业务名称为 `Tavola Italian Dining` (evidence:rule.003.restaurant)。
- 前台首页 (page:F01) 必须直接渲染数据库当前存储的该餐厅及其关联数据，禁止使用固定源静态数据进行前台兜底或自动补齐 (evidence:rule.007.restaurant, evidence:rule.033.restaurant)。

#### 2. 固定槽位与派生状态规则 (Fixed Slots & Derived States)
照片、评论、营业时间在数据库中不使用硬编码的固定数量覆盖，而是通过应用层与固定源常量比对，实时派生出状态 (evidence:rule.004.restaurantphoto, evidence:rule.018.B03.AdminDashboard)：
- **存在状态 (Record Status)**:
  - `PRESENT`: 数据库中存在该槽位记录 (evidence:rule.011)。
  - `MISSING`: 数据库中不存在该槽位记录 (evidence:rule.011)。
- **匹配状态 (Match Status)**:
  - `MATCHED`: 数据库当前记录的各比对字段与固定源完全一致 (evidence:rule.012)。
  - `MISMATCHED`: 数据库当前记录与固定源存在任一字段不一致 (evidence:rule.012)。
  - `MISSING` 状态的记录绝对不能标记为 `MATCHED` (evidence:rule.019.B04.PhotosManagement, evidence:rule.023.B05.ReviewsManagement)。

##### 槽位定义与比对字段：
| 关联实体 | 固定槽位范围 | 逻辑关联键 | 比对字段 |
| :--- | :--- | :--- | :--- |
| `restaurantphoto` | `photo_01` 到 `photo_10` (共10个) | field:restaurantphoto.photoKey | `alt`, `description`, `imageUrl` (evidence:rule.041.restaurantphoto) |
| `restaurantreview` | `1` 到 `5` (共5个) | field:restaurantreview.reviewSlot | `authorName`, `rating`, `relativeTime`, `content` (evidence:rule.042.restaurant) |
| `restauranthour` | `MONDAY` 到 `SUNDAY` (共7个) | field:restauranthour.weekday | `fullLine` (evidence:rule.043.restauranthour) |

#### 3. 营业时间排序与格式不变量 (Hours Ordering & Format Invariant)
- **固定排序**: 营业时间展示顺序必须严格固定为 `Monday` → `Tuesday` → `Wednesday` → `Thursday` → `Friday` → `Saturday` → `Sunday` (evidence:rule.029)。禁止依赖数据库返回顺序，禁止按字母序排序 (evidence:rule.043.restauranthour)。
- **文本完整性**: `fullLine` (field:restauranthour.fullLine) 必须作为完整展示文本存储，禁止拆分为结构化的开门和关门时间 (evidence:rule.031)。

#### 4. 评论与评分独立性不变量 (Review & Rating Independence Invariant)
- `restaurant.reviewCount` (field:restaurant.reviewCount) 是展示用的总评论数（业务固定值为 59），独立于 `restaurantreview` 表中的精选评论数量，禁止随精选评论的增删改而自动重算或覆盖 (evidence:rule.025.restaurant, evidence:rule.026.restaurant, evidence:rule.028.restaurant)。
- `restaurant.rating` (field:restaurant.rating) 是展示用的整体评分（业务固定值为 4.6），独立于 `restaurantreview.rating` (field:restaurantreview.rating) 的平均值，禁止自动计算覆盖 (evidence:rule.025.restaurant, evidence:rule.028.restaurant)。

#### 5. 评论正文逐字符保留不变量 (Verbatim Review Content Invariant)
- 评论正文 `content` (field:restaurantreview.content) 的保存、比对和展示必须逐字符保留原文，包括标点、拼写、大小写、空格、换行、弯引号。禁止进行任何形式的 `trim`、`normalize`、`replace` 或拼写修正 (evidence:rule.025.restaurant, evidence:rule.033.restaurant)。

#### 6. 后台写操作更新时间不变量 (Explicit updatedAt Invariant)
- 所有后台编辑、创建、删除成功后，涉及被改动记录的 `updatedAt` 字段必须由应用层显式更新为当前完整时间戳，Prisma 不会自动维护此默认值 (evidence:rule.006)。

#### 7. 权限与会话状态机规则 (Auth & Session State Rules)
- **后台访问控制**: 访问后台页面 (page:B03, page:B04, page:B05, page:B06) 必须存在 `ACTIVE` 的 `ADMIN` 会话 (evidence:rule.016.pages.B03-B06)。
- **登录跳转**: 已存在 `ACTIVE` 会话的用户访问登录页 (page:B01) 时，必须直接重定向至后台仪表盘 (page:B03) (evidence:rule.009.B01.AdminLogin, evidence:rule.015.B01.AdminLogin)。
- **注册限制**: 仅未登录的 `GUEST` 可访问注册页 (page:B02)，且注册创建的 `member` 记录其角色必须为 `ADMIN` (field:member.role) (evidence:rule.005.pages.B01-B06, evidence:rule.014.B01.AdminLogin)。

---

### Unknowns
- 数据库中 canonical restaurant 记录的初始创建机制（如是通过 Seed 脚本预置，还是在系统首次启动时自动检测并创建）。
- 当图片 URL 加载失败时，前端具体的 broken image 样式表现或占位高度要求。
