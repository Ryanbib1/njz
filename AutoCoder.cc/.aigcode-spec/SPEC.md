# Project SPEC
> 更新后内容为当前累计修正；初版内容保留首次生成结果。关键结论仍以源码和最新确定性 reference 为准。

## 更新后内容

### 累计更新

* **后台管理员 Google 登录集成**：
  * 当前在后台管理员登录页面 `page:B01` (AdminLogin) 与注册页面 `page:B02` (AdminRegister) 中集成了 Google 快捷登录入口。
  * 登录与注册视图均引入了第三方图标组件 `file:src/components/thirdparty/GoogleIcon.tsx`，并通过 `file:src/lib/utils.ts` 提供的外部链接处理方法（如 `openExternalLinkAsync`）来调起 Google OAuth 流程。
  * 认证流程由 `page:B01` 关联的两个接口支持：
    * `iface:getGoogleLoginUrl`：用于获取 Google 登录授权 URL。
    * `iface:handleGoogleCallback`：用于处理 Google 登录回调，该接口会读取 `model:member` 校验是否存在对应的管理员账号，并在成功后返回管理员的账号、ID 及角色信息，建立 `ACTIVE` 会话。
  * 详细的认证交互与状态流转请参考 `read_spec(reference="flows")`。

* **在线订餐、自提与 Clink 支付流集成**：
  * 当前系统支持完整的餐饮在线下单、自提联系人录入与 Clink 支付对接流程。
  * **前端订餐与支付结果页**：
    * 导航栏提供 **Order Online** 入口，指向订餐页面 `route:FoodOrder`（对应文件 `src/frontend/actions/FoodOrder.ts`），支持通过 `iface:getMenu` 获取菜单。
    * 订餐与支付会话创建：通过 `iface:createFoodOrder` 与 `iface:createFoodOrderPaymentSession` 创建订单及 Clink 支付会话，并使用统一的 `buildPaymentResultUrl` 构建安全的支付结果返回链接。
    * 支付结果校验与对账：由 `route:OrderPaymentResult` 页面（对应文件 `src/frontend/actions/OrderPaymentResult.ts`）承接。通过 `iface:getPaymentOrderDetails`、`iface:verifyFoodOrderPayment` 和 `iface:reconcileFoodOrderPayment` 校验并同步支付状态。这些接口引入了 `resolveTrustedSessionId` 安全校验机制，确保只有通过验证的支付会话数据才能更新或同步订单支付状态，防止未知会话篡改订单。
  * **后台订单管理**：
    * 管理员可通过 `route:OrdersManagement` 页面（对应文件 `src/backend/actions/OrdersManagement.ts`）进行订单跟进，利用 `iface:getFoodOrdersList`、`iface:getFoodOrderDetail`、`iface:updateFoodOrderStatus` 和 `iface:exportFoodOrdersList` 实现订单列表查询、详情查看、状态更新（如制作、待取餐、完成等）及数据导出。其中 `iface:updateFoodOrderStatus` 修复并统一了对已支付、待支付、已取消等状态的流转处理。
  * **底层数据模型**：
    * 核心实体由 `model:foodOrder`（存储订单编号、自提联系信息、金额、支付状态 `enum:payment_status` 及订单状态 `enum:food_order_status`）与 `model:foodOrderItem`（存储具体菜品、数量及单价）承载。
    * 详细的业务状态流转与支付对账逻辑请参考 `read_spec(reference="flows")`，模型定义请参考 `read_spec(reference="domain-model")`。

## 初版内容

### Project Summary
本项目是一个单餐厅站点系统（PROJ_43bb5105），包含面向普通访客的前台展示端（`GUEST`）和面向管理员的后台管理端（`ADMIN`）。系统围绕唯一的 canonical 餐厅实体 `Tavola Italian Dining` 运行，提供商业身份、照片槽位、精选评论及营业时间的展示与专项管理。

### Start Here For Updates
如果你是负责定位并修改代码的 update agent，请遵循以下读取决策树：
1. **已知页面/文件/表的小改动**：优先使用 `page card`、`read_page_info`、`search_code` 等局部工具直接定位。
2. **业务域入口不清**：先读取 `read_spec(reference="update-playbooks")`。
3. **结构变更（Schema/共享组件/页面生命周期/角色/第三方集成）**：先读取 `read_spec(reference="change-recipes")`。
   - 涉及并发写目标读 `Global Write Targets`。
   - 复杂 DAG 骨架读 `Planning Shortcuts`。
   - 评估 SPEC 置信度读 `Freshness And Confidence`。
4. **复杂业务规则/流程/风险**：按需读取 `read_spec(reference="domain-model")`、`read_spec(reference="flows")` 或 `read_spec(reference="risks")`。
5. **跨模块源码坐标仍不清**：最后读取 `read_spec(reference="implementation-map")`。

### Scope & Limitations
* **导航辅助**：本 SPEC 仅作为代码库的导航辅助，不作为 auth、加密、并发或 i18n 正确性的数学证明，亦不预测未来改动的后果。
* **已实现快照**：本 SPEC 记录的一切（角色、规则、状态转换）均为项目**已实现**内容的快照，而非 TODO。判断某能力是否真正实现必须阅读源码。
* **生成层禁改**：`GENERATED_LAYER`（如自动生成的 RPC 或 Prisma 客户端代码）是自动产物，**绝对禁止手动修改**。
* **挂载陷阱**：文件存在（如 `INFRA_MAP` 中列出的 auth guard）并不代表它已实际挂载进 layout，须在源码中核实挂载状态。

### Core Flows
1. **后台管理员注册与登录**：访客在 `page:B02` 注册（`iface:registerAdmin`），成功后重定向至 `page:B01`（`l2:B02.to.B01.navigateTo`） `evidence:rule.014.B01.AdminLogin`。在 `page:B01` 登录（`iface:adminLogin`），成功后建立 `ACTIVE` 会话并跳转至 `page:B03`（`l2:B01.to.B03.navigateTo.2`） `evidence:rule.015.B01.AdminLogin`。
2. **仪表盘数据加载与校验**：管理员访问 `page:B03` 时，通过 `iface:checkCurrentSession` 校验 `ADMIN` 权限 `evidence:rule.016.pages.B03-B06`。调用 `iface:getAdminDashboardData` 读取 `model:restaurant` 并统计关联子实体，与固定源比对派生出 `MATCHED` 或 `MISMATCHED` 状态 `evidence:rule.018.B03.AdminDashboard`。
3. **照片槽位管理**：在 `page:B04` 调用 `iface:getPhotosList`，以 10 个固定槽位 `photoKey` 为主轴比对 `model:restaurantphoto` 派生 `PRESENT`/`MISSING` 及 `MATCHED`/`MISMATCHED` 状态 `evidence:rule.019.B04.PhotosManagement`。支持通过 `iface:createPhoto`、`iface:updatePhoto` 和 `iface:deletePhoto` 进行增删改 `evidence:rule.020` `evidence:rule.021` `evidence:rule.022`。
4. **评论槽位管理**：在 `page:B05` 调用 `iface:getReviewsList`，以 5 个固定 `reviewSlot` 为主轴比对 `model:restaurantreview` 派生状态 `evidence:rule.023.B05.ReviewsManagement`。支持通过 `iface:createReview`、`iface:updateReview` 和 `iface:deleteReview` 管理精选评论 `evidence:rule.024` `evidence:rule.025.restaurant` `evidence:rule.026.restaurant`。
5. **商业信息与营业时间管理**：在 `page:B06` 调用 `iface:getBusinessProfile` 读取 `model:restaurant` 及 7 天的 `model:restauranthour` 记录 `evidence:rule.027.B06.BusinessInfoManagement`。支持通过 `iface:updateBusinessIdentity` 修改商业身份 `evidence:rule.028.brandStory`，通过 `iface:createHourRecord`、`iface:updateHourRecord` 和 `iface:deleteHourRecord` 维护营业时间 `evidence:rule.030` `evidence:rule.031` `evidence:rule.032`。

### Domain Rules
* **单餐厅不变量**：整站围绕唯一 canonical `restaurant` 运行，业务名称为 `Tavola Italian Dining` `evidence:rule.003.restaurant`。前台首页 `page:F01` 必须直接渲染数据库当前值，禁止使用固定源静态数据兜底 `evidence:rule.007.restaurant`。
* **固定槽位派生状态**：照片（10个槽位 `field:restaurantphoto.photoKey`）、评论（5个槽位 `field:restaurantreview.reviewSlot`）、营业时间（7个星期 `field:restauranthour.weekday`）在应用层与固定源比对，实时派生出 `PRESENT`/`MISSING` 和 `MATCHED`/`MISMATCHED` 状态 `evidence:rule.011` `evidence:rule.012`。
* **营业时间排序与格式**：展示顺序必须严格固定为 `MONDAY` 至 `SUNDAY`，禁止依赖数据库默认顺序或字母序 `evidence:rule.029`。`field:restauranthour.fullLine` 必须作为完整文本存储，禁止拆分为结构化时间 `evidence:rule.031`。
* **评论与评分独立性**：展示用的总评论数 `field:restaurant.reviewCount` 和整体评分 `field:restaurant.rating` 均为独立展示字段，禁止随 `model:restaurantreview` 表的增删改而自动重算或覆盖 `evidence:rule.025.restaurant` `evidence:rule.028.brandStory`。
* **评论正文逐字符保留**：评论正文 `field:restaurantreview.content` 必须逐字符保留原文，禁止进行任何形式的 `trim`、`normalize` 或标点替换 `evidence:rule.025.restaurant`。
* **显式更新时间**：所有后台写操作成功后，涉及记录的 `updatedAt` 字段必须由应用层显式更新为当前时间戳 `evidence:rule.006`。
* **权限与会话规则**：访问后台页面（`page:B03`、`page:B04`、`page:B05`、`page:B06`）必须存在 `ACTIVE` 的 `ADMIN` 会话 `evidence:rule.016.pages.B03-B06`。已登录用户访问 `page:B01` 必须重定向至 `page:B03` `evidence:rule.015.B01.AdminLogin`。

### Implementation Entry Points
* **前台展示入口**：`page:F01` (Home) 负责只读渲染单餐厅的完整信息 `evidence:rule.017.F01.Home`。
* **后台认证入口**：`page:B01` (AdminLogin) 和 `page:B02` (AdminRegister) 负责管理员会话建立与注册 `evidence:rule.014.B01.AdminLogin` `evidence:rule.015.B01.AdminLogin`。
* **后台管理入口**：
  - `page:B03` (AdminDashboard)：后台数据统计与比对摘要 `evidence:rule.018.B03.AdminDashboard`。
  - `page:B04` (PhotosManagement)：10 个固定照片槽位管理 `evidence:rule.019.B04.PhotosManagement`。
  - `page:B05` (ReviewsManagement)：5 个固定评论槽位管理 `evidence:rule.023.B05.ReviewsManagement`。
  - `page:B06` (BusinessInfoManagement)：商业身份与 7 天营业时间管理 `evidence:rule.027.B06.BusinessInfoManagement`。

### Update Playbooks
* **修改照片管理逻辑**：检查 `page:B04`、`iface:getPhotosList`、`iface:createPhoto`、`iface:updatePhoto`、`iface:deletePhoto`，确保 `field:restaurantphoto.photoKey` 限制在 `photo_01` 到 `photo_10` 范围内，且写操作显式更新 `updatedAt` `evidence:rule.019.B04.PhotosManagement` `evidence:rule.006`。
* **修改评论管理逻辑**：检查 `page:B05`、`iface:getReviewsList`、`iface:createReview`、`iface:updateReview`、`iface:deleteReview`，确保 `field:restaurantreview.content` 逐字符保留，且不触发 `model:restaurant` 评分与评论数的自动重算 `evidence:rule.023.B05.ReviewsManagement` `evidence:rule.025.restaurant`。
* **修改营业时间逻辑**：检查 `page:B06`、`iface:getBusinessProfile`、`iface:createHourRecord`、`iface:updateHourRecord`、`iface:deleteHourRecord`，确保排序严格为 `MONDAY` 到 `SUNDAY`，且 `field:restauranthour.fullLine` 保持完整文本格式 `evidence:rule.029` `evidence:rule.031`。

### Known Risks
* **评分与评论数覆盖风险**：在修改 `model:restaurantreview` 的写操作（如创建或删除评论）时，可能会误触发自动重算并覆盖 `field:restaurant.rating` 或 `field:restaurant.reviewCount`，必须确保这两个字段保持独立 `evidence:rule.025.restaurant` `evidence:rule.026.restaurant`。
* **评论格式化风险**：在保存或比对评论时，任何对 `field:restaurantreview.content` 的 `trim` 或标点替换操作都会破坏逐字符保留不变量，导致比对状态异常 `evidence:rule.025.restaurant` `evidence:rule.033.restaurant`。
* **营业时间排序失效风险**：若在应用层或数据库查询中未强制指定 `MONDAY` 到 `SUNDAY` 的固定顺序，会导致前台展示或后台比对顺序错乱 `evidence:rule.029` `evidence:rule.043.restauranthour`。
* **更新时间丢失风险**：由于 Prisma 不会自动维护默认的 `updatedAt` 字段，任何后台写操作若未在应用层显式传入当前时间戳，会导致更新时间丢失 `evidence:rule.006`。
* **未登录拦截失效风险**：若在 `page:B03` 至 `page:B06` 的路由或接口中未正确挂载 `iface:checkCurrentSession` 校验，会导致越权访问风险 `evidence:rule.016.pages.B03-B06`。

### References
* `read_spec(reference="flows")`：深入了解核心业务流程和跨页 lineage。
* `read_spec(reference="domain-model")`：深入了解领域模型、聚合、不变量及状态规则。
* `read_spec(reference="update-playbooks")`：按业务功能域组织的改动入口导航。
* `read_spec(reference="change-recipes")`：Schema、共享组件、页面生命周期等结构变更的影响面与操作指南。
* `read_spec(reference="implementation-map")`：精确的 page/action/model/source 源码坐标地图（仅在局部工具和较短 reference 仍无法定位跨模块源码坐标时读取）。
* `read_spec(reference="risks")`：隐藏耦合与风险清单。
