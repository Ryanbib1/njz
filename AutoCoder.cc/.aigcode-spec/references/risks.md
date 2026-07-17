# Known Risks
> Derived guidance - verify against code.
> 更新后内容为当前累计修正；初版内容保留首次生成结果。关键结论仍以源码和最新确定性 reference 为准。

## 更新后内容

### 认证与第三方集成风险补充

当前工程事实表明，系统在管理员登录与注册流程中集成了 Google 第三方登录。以下为相关的隐藏耦合与修改风险：

#### 1. 第三方 OAuth 依赖与配置风险
* **环境配置耦合**：`iface:getGoogleLoginUrl` 与 `iface:handleGoogleCallback` 强依赖于第三方 Google OAuth 服务的可用性及配置。在未正确配置生产环境 Google App 凭证或重定向域名时，调用这些接口将直接导致登录流程中断。
* **回调域限制**：Google 登录成功后的回调处理依赖于 `iface:handleGoogleCallback`。若在不同环境（如本地开发、测试、生产）部署，需确保 Google 控制台的回调白名单与实际部署域名严格一致，否则将引发 OAuth 校验失败。

#### 2. 账号匹配与角色越权风险
* **仅限已有管理员账号**：当前 Google 登录流程仅适用于已存在的管理员账号。`iface:handleGoogleCallback` 在读取 `model:member` 时，若 Google 账号对应的用户不存在，系统不会自动创建新的管理员账号。
* **写入侧与角色锁定安全**：当前未发现 Google 登录接口存在自动提权或自动注册新管理员的写入侧风险。修改此处的登录逻辑时，必须确保不会绕过初版中定义的“注册角色锁定”等安全限制。

### 在线订餐与 Clink 支付流程风险补充

当前工程事实引入了基于 `model:foodOrder` 和 `model:foodOrderItem` 的在线订餐与 Clink 支付集成。以下为相关的隐藏耦合与修改风险：

#### 1. 支付状态与订单状态的强耦合约束
* **状态机流转依赖**：订单状态与支付状态存在业务逻辑上的强耦合。例如，`iface:verifyFoodOrderPayment` 和 `iface:reconcileFoodOrderPayment` 在校验或对账成功后，会同时更新支付状态与订单状态。修改任何一方的状态枚举或流转逻辑，必须同步适配支付校验与对账接口，否则会导致订单状态不一致。
* **管理员手动覆盖风险**：后台管理接口 `iface:updateFoodOrderStatus` 允许管理员（`ADMIN` 角色）直接修改订单状态。若在订单未实际支付成功时强行将状态修改为已支付或后续状态，系统在数据库层面未设硬性级联约束，需在业务逻辑侧确保此类操作的合规性。

#### 2. 第三方支付通道（Clink）集成与对账依赖
* **会话与外部单号耦合**：系统通过订单中的支付会话标识和外部交易单号建立与 Clink 支付平台的关联。`iface:createFoodOrder` 和 `iface:createFoodOrderPaymentSession` 依赖于外部支付通道的可用性。若外部会话创建失败，订单将滞留在待支付状态。
* **对账与校验接口的幂等性**：`iface:verifyFoodOrderPayment` 和 `iface:reconcileFoodOrderPayment` 涉及对同一订单支付状态的多次查询与更新。在修改这些接口时，需注意防范重复回调或并发对账导致的重复更新风险。

#### 3. 支付会话安全校验与可信数据依赖
* **会话劫持与覆盖风险**：在支付结果处理流程中，`iface:getPaymentOrderDetails`、`iface:verifyFoodOrderPayment` 和 `iface:reconcileFoodOrderPayment` 强依赖于可信会话解析机制。若未通过可信会话校验，未知的外部会话或伪造的会话标识将无法通过校验，系统不会更新订单状态。修改此处的会话解析与校验逻辑时，必须确保校验规则的严密性，防止未授权的会话数据覆盖或篡改订单支付状态。

## 初版内容

在对本项目进行代码修改和定位时，必须特别注意以下隐藏的跨页耦合、不变量约束及状态机风险。

#### 1. 核心实体状态流转与跨页联动风险

整站围绕唯一的 `model:restaurant` 运行（单餐厅站点模式 `evidence:rule.003.restaurant`）。后台的任何写操作都会直接影响前台 `page:F01` 的渲染。

| 风险场景 | 触发接口 / 写入字段 | 跨页联动与不变量约束 | 潜在破坏后果 |
| :--- | :--- | :--- | :--- |
| **照片槽位物理删除** | `iface:deletePhoto`<br>`field:restaurantphoto.photoKey` | 物理删除后，前台 `page:F01` 对应照片必须立即消失，后台保留该槽位作为 `MISSING` 状态以供后续恢复。前台禁止使用任何占位图或备用图 `evidence:rule.017.F01.Home` `evidence:rule.022`。 | 误在前端加入默认占位图，或在后台执行了软删除导致状态未转为 `MISSING`。 |
| **评论槽位物理删除** | `iface:deleteReview`<br>`field:restaurantreview.reviewSlot` | 物理删除后，前台 `page:F01` 对应评论必须立即消失。此时**禁止**自动递减或重算 `field:restaurant.reviewCount`，该字段必须保持原存储值 `evidence:rule.017.F01.Home` `evidence:rule.026.restaurant`。 | 触发级联更新导致 `field:restaurant.reviewCount` 被自动重算覆盖。 |
| **营业时间物理删除** | `iface:deleteHourRecord`<br>`field:restauranthour.weekday` | 物理删除后，前台 `page:F01` 对应星期行必须立即消失，整体营业时间数据集在后台标记为 `INCOMPLETE`。前台禁止自动补齐缺失的星期 `evidence:rule.017.F01.Home` `evidence:rule.032`。 | 前台在渲染时使用固定源自动补齐了缺失的星期记录。 |
| **商业身份编辑** | `iface:updateBusinessIdentity`<br>`field:restaurant.rating`<br>`field:restaurant.reviewCount` | `field:restaurant.rating` 和 `field:restaurant.reviewCount` 是完全独立的展示字段，**绝对禁止**根据 `model:restaurantreview` 表中的记录数或评分自动计算覆盖 `evidence:rule.028.brandStory`。 | 写入逻辑中加入了自动聚合计算，覆盖了管理员手动设定的展示值。 |

#### 2. 营业时间固定排序与格式不变量风险

* **排序规则风险**：营业时间在 `page:F01` 和 `page:B06` 的展示顺序必须严格固定为 `MONDAY` → `TUESDAY` → `WEDNESDAY` → `THURSDAY` → `FRIDAY` → `SATURDAY` → `SUNDAY` `evidence:rule.029`。
  * **开发陷阱**：绝对不能依赖数据库的默认返回顺序，也绝对不能按字母序（如 Friday -> Monday）进行排序 `evidence:rule.043.restauranthour`。
* **文本完整性风险**：`field:restauranthour.fullLine` 必须作为完整展示文本存储。
  * **开发陷阱**：禁止在应用层将其拆分为结构化的开门和关门时间，也禁止用当前系统时间去解析该字段来判断餐厅是否正在营业 `evidence:rule.031`。

#### 3. 评论正文逐字符保留不变量风险

* **格式化风险**：评论正文 `field:restaurantreview.content` 的保存、比对和展示必须逐字符保留原文 `evidence:rule.042.restaurant`。
  * **开发陷阱**：在 `iface:createReview` 和 `iface:updateReview` 的应用层或数据库写入管道中，**禁止**进行任何形式的 `trim()`、`normalize()`、标点替换、空白压缩、引号归一化或拼写修正 `evidence:rule.025.restaurant` `evidence:rule.033.restaurant`。任何微小的字符改动都会导致后台比对状态错误地派生为 `MISMATCHED`。

#### 4. 后台写操作更新时间不变量风险

* **时间戳丢失风险**：在执行所有后台编辑、创建、删除操作（涉及 `model:restaurant`、`model:restaurantphoto`、`model:restaurantreview`、`model:restauranthour`）成功后，涉及被改动记录的 `updatedAt` 字段必须由应用层显式更新为当前完整时间戳 `evidence:rule.006`。
  * **开发陷阱**：Prisma Schema 中的 `updatedAt` 只有默认值，Prisma 在执行 `update` 或自定义写操作时不会自动维护该时间戳，必须在代码中显式传入 `new Date()`。

#### 5. 权限与会话状态机跳转风险

* **登录态主动拦截与跳转**：
  * 访问后台页面 `page:B03`、`page:B04`、`page:B05`、`page:B06` 必须存在 `ACTIVE` 的 `ADMIN` 会话，否则必须拦截并禁止加载数据 `evidence:rule.016.pages.B03-B06`。
  * 已存在 `ACTIVE` 会话的用户访问登录页 `page:B01` 时，**必须直接重定向**至后台仪表盘 `page:B03`，保持登录状态 `evidence:rule.009.B01.AdminLogin` `evidence:rule.015.B01.AdminLogin`。
* **注册角色锁定**：
  * 仅未登录的 `GUEST` 可访问注册页 `page:B02`。通过 `iface:registerAdmin` 注册创建的 `model:member` 记录，其 `field:member.role` 必须强制设为 `ADMIN` `evidence:rule.005.pages.B01-B06` `evidence:rule.014.B01.AdminLogin`。

#### 6. 外部链接与媒体渲染风险

* **协议降级风险**：官网链接必须按存储值直接打开。业务要求的官网固定值为 `http://www.tavola.cn/`，**禁止**在代码中自动将其升级或重定向为 `https://` `evidence:rule.033.restaurant` `evidence:rule.040.restaurant`。
* **图片加载失败表现**：前台图片 URL 按存储值直接渲染，当图片加载失败时，必须保留浏览器的 broken image 默认显示，**禁止**在前端替换为任何占位图或备用图 `evidence:rule.007.restaurant` `evidence:rule.041.restaurantphoto`。
