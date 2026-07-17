# Change Recipes
> Derived guidance - project-specific coordinates. Use skills for HOW. Verify against code.

本文件只给当前项目的结构变更影响面。通用执行流程仍读取 `major-update` / `code-modification` / `thirdparty-integration` 等 Skill。
本文件由确定性工程抽取生成；空列表只表示抽取层未发现证据，不等于能力不存在或无需回源码验证。

## Schema Change Impact
- 改表/字段前先用本节确定影响面，再按需加载 `code-modification` 或 `major-update` 获取 HOW。
- 读法: pages_* 是源码侧页面读写; req_* 是需求清单 page_data_from/page_data_write; actions_* 是 action 读写; status_writes 是确定性状态写入; routes 是该 model 字段作为 route param 的入口。

### Table Impact Cards
- model:foodOrder: pages_read=-; pages_write=-; req_from=-; req_write=-; actions_read=iface:getFoodOrdersList,iface:getFoodOrderDetail,iface:updateFoodOrderStatus,iface:exportFoodOrdersList; actions_write=iface:updateFoodOrderStatus; status_writes=-; routes=-; domain=-; linked_fields=field:foodOrder.food_order_item(foodOrderItem),model:foodOrderItem
- model:foodOrderItem: pages_read=-; pages_write=-; req_from=-; req_write=-; actions_read=-; actions_write=-; status_writes=-; routes=-; domain=-; linked_fields=field:foodOrderItem.orderId(foodOrder),field:foodOrderItem.order(foodOrder),model:foodOrder
- model:member: pages_read=page:B01,page:B02; pages_write=page:B02; req_from=page:B01,page:B02; req_write=-; actions_read=iface:adminLogin,iface:handleGoogleCallback,iface:registerAdmin; actions_write=iface:registerAdmin; status_writes=-; routes=-; domain=evidence:rule.005.pages.B01-B06,evidence:rule.014.B01.AdminLogin,evidence:rule.015.B01.AdminLogin,evidence:rule.016.pages.B03-B06,evidence:rule.039.member; linked_fields=-
- model:restaurant: pages_read=page:F01,page:B03,page:B04,page:B06; pages_write=page:B03,page:B06; req_from=page:F01,page:B03,page:B06; req_write=-; actions_read=iface:getRestaurantProfile,iface:getAdminDashboardData,iface:updateRestaurantProfile,iface:getBusinessProfile,iface:getPhotosList,iface:createPhoto; actions_write=iface:updateRestaurantProfile,iface:updateBusinessIdentity; status_writes=-; routes=-; domain=evidence:flow.004.B02.AdminRegister,evidence:flow.007.B06.BusinessInfoManagement,evidence:rule.003.restaurant,evidence:rule.007.restaurant,evidence:rule.017.F01.Home,evidence:rule.018.B03.AdminDashboard,evidence:rule.025.restaurant,evidence:rule.026.restaurant,+5; linked_fields=field:restaurant.photos(restaurantphoto),field:restaurant.reviews(restaurantreview),field:restaurant.hours(restauranthour),model:restauranthour,model:restaurantphoto,model:restaurantreview
- model:restauranthour: pages_read=page:B03,page:B06; pages_write=page:B06; req_from=page:F01,page:B03,page:B06; req_write=-; actions_read=iface:getAdminDashboardData,iface:createHourRecord; actions_write=iface:createHourRecord,iface:updateHourRecord,iface:deleteHourRecord; status_writes=-; routes=-; domain=evidence:rule.037.restauranthour,evidence:rule.043.restauranthour; linked_fields=field:restauranthour.restaurantId(restaurant),field:restauranthour.restaurant(restaurant),model:restaurant
- model:restaurantphoto: pages_read=page:B03,page:B04; pages_write=page:B03,page:B04; req_from=page:F01,page:B03,page:B04; req_write=-; actions_read=iface:getAdminDashboardData,iface:removeDashboardPhoto,iface:getPhotosList,iface:getPhotoDetail,iface:createPhoto,iface:updatePhoto,iface:deletePhoto; actions_write=iface:removeDashboardPhoto,iface:createPhoto,iface:updatePhoto,iface:deletePhoto; status_writes=-; routes=route:PhotosManagement; domain=evidence:rule.004.restaurantphoto,evidence:rule.019.B04.PhotosManagement,evidence:rule.035.restaurantphoto,evidence:rule.041.restaurantphoto; linked_fields=field:restaurantphoto.restaurantId(restaurant),field:restaurantphoto.restaurant(restaurant),model:restaurant
- model:restaurantreview: pages_read=page:B03,page:B05; pages_write=page:B03,page:B05; req_from=page:F01,page:B03,page:B05; req_write=-; actions_read=iface:getAdminDashboardData,iface:removeDashboardReview,iface:getReviewsList,iface:getReviewDetail,iface:createReview,iface:updateReview,iface:deleteReview; actions_write=iface:removeDashboardReview,iface:createReview,iface:updateReview,iface:deleteReview; status_writes=-; routes=route:ReviewsManagement; domain=evidence:rule.023.B05.ReviewsManagement,evidence:rule.028.restaurant,evidence:rule.033.restaurant,evidence:rule.036.restaurantreview,evidence:rule.040.restaurant,evidence:rule.042.restaurant; linked_fields=field:restaurantreview.restaurantId(restaurant),field:restaurantreview.restaurant(restaurant),model:restaurant

### Action Caller Shortcuts
- local_callers=iface:verifyFoodOrderPayment<-iface:reconcileFoodOrderPayment (best-effort local function calls; cross-file callers still need search_code)

## Global Write Targets
- 本节只列容易 last-write-wins 的全局/共享写目标，供 Architect 设置 depends_on 或 concurrency_key；不是执行 HOW。
- canonical keys: requirement_list / route_params_<platform> / nav_<platform> / shared_file:<path>。

### Canonical Locks
- requirement_list: target=WebArthitectureInfo/page registry/meta/style/layout; tools=modify_requirement_pages,update_requirement_meta,batch_update_page_prisma_needs,restyle_generate; concurrency_key=requirement_list
- route_params_backend: target=src/backend/route-params.ts; capability=route-registry; concurrency_key=route_params_backend
- route_params_frontend: target=src/frontend/route-params.ts; capability=route-registry; concurrency_key=route_params_frontend
- nav_backend: target=src/components/layout/backend/Sidebar.tsx; capability=navigation-shell; concurrency_key=nav_backend
- nav_frontend: target=src/components/layout/frontend/Footer.tsx; capability=navigation-shell; concurrency_key=nav_frontend
- nav_frontend: target=src/components/layout/frontend/Navigation.tsx; capability=navigation-shell; concurrency_key=nav_frontend
- shared_file:src/components/thirdparty/GoogleIcon.tsx: target=file:src/components/thirdparty/GoogleIcon.tsx; used_by_pages=page:B01,page:B02; concurrency_key=shared_file:src/components/thirdparty/GoogleIcon.tsx

## Shared/Component Impact
- 改公共组件/shared/layout 前先看 used_by_pages；这里来自源码 import 图，不来自命名约定。
- 读法: file 是被 import 的共享文件；used_by_pages 是直接或经 barrel 展开的页面引用；source_files 是页面内触发 import 的源码文件；本节隐藏 shadcn/ui、@base、session/tools 等 no-touch 底座文件。

### Shared/Component Impact Cards
- file:src/components/thirdparty/GoogleIcon.tsx: kind=component_import; used_by_pages=page:B01,page:B02; source_files=src/backend/components/AdminLoginView.tsx;src/backend/components/AdminRegisterView.tsx

## Page Lifecycle Changes
- 项目已有 platforms=backend,frontend；新增页面只能落在已有 platform，通用流程仍看 `major-update`。
- next_page_id_candidates=backend:B07;frontend:F02
- route/nav shared coords=src/components/layout/backend/Sidebar.tsx;src/components/layout/frontend/Footer.tsx;src/components/layout/frontend/Navigation.tsx;src/backend/route-params.ts;src/frontend/route-params.ts

### Add Page Preflight
- 新增页面前先确认 platform、page id、相似页面格式、数据表复用/新建、route/nav/shared layout 坐标；具体 FC 顺序仍看 `major-update` / `requirement-list-modification`。
- 数据型页面不要只加 view；先确认 page_data_from/page_data_write 与 schema/action 影响面。纯静态页面也要确认 route/nav/entry 是否需要挂载。
- similar_page_candidates=backend:page:B03(AdminDashboard),backend:page:B06(BusinessInfoManagement),backend:page:B04(PhotosManagement),frontend:page:F01(Home)

### Delete Or Restore Preflight
- 删除/恢复页面先看 upstream/downstream、route/nav shared coords、entry/layout 引用和页面文件；删除通常是清 reachability，不默认物理删除页面代码或 route 定义。
- 恢复页面优先确认旧页面文件是否仍存在，再恢复 requirement/flowchart/layout/navigation 引用；不要把恢复误当全新页面生成。

### Cross-Page Hotspots
- cross_page_pages=page:B03(AdminDashboard;up=3;down=8;rules=8),page:B01(AdminLogin;up=2;down=5;rules=7),page:B04(PhotosManagement;up=3;down=0;rules=6),page:B05(ReviewsManagement;up=3;down=0;rules=6),page:B02(AdminRegister;up=2;down=2;rules=4),page:B06(BusinessInfoManagement;up=2;down=0;rules=6),page:F01(Home;up=0;down=0;rules=3)

### Page Coordinates And Rules
- page:F01 frontend/Home: auth=GUEST; models=restaurant,restauranthour,restaurantphoto,restaurantreview; rules=evidence:flow.001.pages.F01-B06,evidence:flow.002.F01.Home,evidence:rule.017.F01.Home; route=route:Home; upstream=-; downstream=-; files=source_action=src/frontend/actions/Home.ts;hook=src/frontend/hooks/useHome.ts;view=src/frontend/components/HomeView.tsx;types=src/frontend/types/Home.ts
- page:B01 backend/AdminLogin: auth=GUEST; models=member; rules=evidence:flow.001.pages.F01-B06,evidence:flow.003.B01.AdminLogin,evidence:flow.004.B02.AdminRegister,evidence:rule.005.pages.B01-B06,evidence:rule.009.B01.AdminLogin,evidence:rule.014.B01.AdminLogin,+1; route=route:AdminLogin; upstream=page:B02; downstream=page:B02,page:B03; files=source_action=src/backend/actions/AdminLogin.ts;hook=src/backend/hooks/useAdminLogin.ts;view=src/backend/components/AdminLoginView.tsx;page_entry=app/(backend)/adminlogin/page.tsx;types=src/backend/types/AdminLogin.ts;co_located_action=app/(backend)/adminlogin/AdminLogin.actions.ts;co_located_hook=app/(backend)/adminlogin/useAdminLogin.ts;co_located_view=app/(backend)/adminlogin/AdminLoginView.tsx
- page:B02 backend/AdminRegister: auth=GUEST; models=member; rules=evidence:flow.001.pages.F01-B06,evidence:flow.003.B01.AdminLogin,evidence:flow.004.B02.AdminRegister,evidence:rule.005.pages.B01-B06; route=route:AdminRegister; upstream=page:B01; downstream=page:B01; files=source_action=src/backend/actions/AdminRegister.ts;hook=src/backend/hooks/useAdminRegister.ts;view=src/backend/components/AdminRegisterView.tsx;page_entry=app/(backend)/adminregister/page.tsx;types=src/backend/types/AdminRegister.ts;co_located_action=app/(backend)/adminregister/AdminRegister.actions.ts;co_located_hook=app/(backend)/adminregister/useAdminRegister.ts;co_located_view=app/(backend)/adminregister/AdminRegisterView.tsx
- page:B03 backend/AdminDashboard: auth=ADMIN; models=restaurant,restauranthour,restaurantphoto,restaurantreview; rules=evidence:flow.001.pages.F01-B06,evidence:flow.003.B01.AdminLogin,evidence:flow.004.B02.AdminRegister,evidence:rule.005.pages.B01-B06,evidence:rule.009.B01.AdminLogin,evidence:rule.015.B01.AdminLogin,+2; route=route:AdminDashboard; upstream=page:B01; downstream=page:B04,page:B05,page:B06; files=source_action=src/backend/actions/AdminDashboard.ts;hook=src/backend/hooks/useAdminDashboard.ts;view=src/backend/components/AdminDashboardView.tsx;page_entry=app/(backend)/admindashboard/page.tsx;types=src/backend/types/AdminDashboard.ts
- page:B04 backend/PhotosManagement: auth=ADMIN; models=restaurantphoto,restaurant; rules=evidence:flow.001.pages.F01-B06,evidence:flow.004.B02.AdminRegister,evidence:flow.005.B04.PhotosManagement,evidence:rule.005.pages.B01-B06,evidence:rule.016.pages.B03-B06,evidence:rule.019.B04.PhotosManagement; route=route:PhotosManagement; upstream=page:B03; downstream=-; files=source_action=src/backend/actions/PhotosManagement.ts;hook=src/backend/hooks/usePhotosManagement.ts;view=src/backend/components/PhotosManagementView.tsx;page_entry=app/(backend)/photosmanagement/page.tsx;types=src/backend/types/PhotosManagement.ts;co_located_action=app/(backend)/photosmanagement/PhotosManagement.actions.ts;co_located_hook=app/(backend)/photosmanagement/usePhotosManagement.ts;co_located_view=app/(backend)/photosmanagement/PhotosManagementView.tsx
- page:B05 backend/ReviewsManagement: auth=ADMIN; models=restaurantreview; rules=evidence:flow.001.pages.F01-B06,evidence:flow.004.B02.AdminRegister,evidence:flow.006.B05.ReviewsManagement,evidence:rule.005.pages.B01-B06,evidence:rule.016.pages.B03-B06,evidence:rule.023.B05.ReviewsManagement; route=route:ReviewsManagement; upstream=page:B03; downstream=-; files=source_action=src/backend/actions/ReviewsManagement.ts;hook=src/backend/hooks/useReviewsManagement.ts;view=src/backend/components/ReviewsManagementView.tsx;page_entry=app/(backend)/reviewsmanagement/page.tsx;types=src/backend/types/ReviewsManagement.ts;co_located_action=app/(backend)/reviewsmanagement/ReviewsManagement.actions.ts;co_located_hook=app/(backend)/reviewsmanagement/useReviewsManagement.ts;co_located_view=app/(backend)/reviewsmanagement/ReviewsManagementView.tsx
- page:B06 backend/BusinessInfoManagement: auth=ADMIN; models=restaurant,restauranthour; rules=evidence:flow.001.pages.F01-B06,evidence:flow.004.B02.AdminRegister,evidence:flow.007.B06.BusinessInfoManagement,evidence:rule.005.pages.B01-B06,evidence:rule.016.pages.B03-B06,evidence:rule.027.B06.BusinessInfoManagement; route=route:BusinessInfoManagement; upstream=page:B03; downstream=-; files=source_action=src/backend/actions/BusinessInfoManagement.ts;hook=src/backend/hooks/useBusinessInfoManagement.ts;view=src/backend/components/BusinessInfoManagementView.tsx;page_entry=app/(backend)/businessinfomanagement/page.tsx;types=src/backend/types/BusinessInfoManagement.ts;co_located_action=app/(backend)/businessinfomanagement/BusinessInfoManagement.actions.ts;co_located_hook=app/(backend)/businessinfomanagement/useBusinessInfoManagement.ts;co_located_view=app/(backend)/businessinfomanagement/BusinessInfoManagementView.tsx

## Role And Auth Changes
- 新增/修改角色时，本节只给项目坐标；enum 追加、Session、默认账号等 HOW 仍看 `major-update` / `auth-initialization`。
- role_fields=field:member.role=GUEST,ADMIN
- auth_pages=page:F01(GUEST),page:B01(GUEST),page:B02(GUEST),page:B03(ADMIN),page:B04(ADMIN),page:B05(ADMIN),page:B06(ADMIN)
- auth_infra=auth-guard-action=src/app/action_utils.ts;auth-guard-action=src/backend/action_utils.ts;auth-guard-action=src/frontend/action_utils.ts;auth-guard-route=src/tools/AppAuthGuard.tsx;auth-guard-route=src/tools/BackendAuthGuard.tsx;auth-guard-route=src/tools/FrontendAuthGuard.tsx;auth-ui=src/app/auth/rpc-auth.tsx;auth-ui=src/backend/auth/rpc-auth.tsx;auth-ui=src/frontend/auth/rpc-auth.tsx;session=src/tools/AppSession.tsx;session=src/tools/BackendSession.tsx;session=src/tools/FrontendSession.tsx
- role ADMIN: actions=iface:getAdminDashboardData,iface:updateRestaurantProfile,iface:removeDashboardPhoto,iface:removeDashboardReview,iface:getBusinessProfile,iface:updateBusinessIdentity,iface:createHourRecord,iface:updateHourRecord,iface:deleteHourRecord,iface:getFoodOrdersList,iface:getFoodOrderDetail,iface:updateFoodOrderStatus,iface:exportFoodOrdersList,iface:getPhotosList,iface:getPhotoDetail,iface:createPhoto,iface:updatePhoto,iface:deletePhoto,iface:getReviewsList,iface:getReviewDetail,+3

## Thirdparty Integration Touchpoints
- 第三方真实接入/关闭的 HOW 仍看 `thirdparty-integration` 及 provider 子 Skill；本节只列当前项目触点。

### Provider Capability Boundary
- 本卡是平台官方支持的真实接入白名单；项目里存在 `server/thirdparty` 目录不等于任意 provider 都能真实接入。
- supported.auth: 仅 Google OAuth；其它 OAuth provider 按 unsupported 处理，不要手搓真实接入。
- supported.payment: 仅 Stripe / Clink，且同一项目同一时间只能有 1 个 active payment provider；替换前按 `thirdparty-payment` Skill 做用户确认。
- unsupported.*: 不在白名单的 provider 不能因为 `server/thirdparty` 存在就规划真实接入；非支付类可拆 UI/表单/数据存储并用模拟实现且在交付里标注，支付类按 Skill 追问或等待平台支持决策，禁止默认回退 Stripe/Clink。

### Project Touchpoints
- configured_pages=-
- thirdparty_infra=thirdparty-infra=server/thirdparty/ai-definitions.ts;thirdparty-infra=server/thirdparty/ai/openai-compat.ts;thirdparty-infra=server/thirdparty/auth-definitions.ts;thirdparty-infra=server/thirdparty/auth/AuthState.ts;thirdparty-infra=server/thirdparty/auth/google.route.ts;thirdparty-infra=server/thirdparty/auth/google.ts;thirdparty-infra=server/thirdparty/auth/index.ts;thirdparty-infra=server/thirdparty/common.ts;thirdparty-infra=server/thirdparty/context.ts;thirdparty-infra=server/thirdparty/index.ts;thirdparty-infra=server/thirdparty/payment-definitions.ts;thirdparty-infra=server/thirdparty/payment/alipay.ts;thirdparty-infra=server/thirdparty/payment/clink.ts;thirdparty-infra=server/thirdparty/payment/stripe.ts;thirdparty-infra=server/thirdparty/secret-resolver.ts;thirdparty-types=src/types/thirdparty.d.ts
- candidate_payment_objects=model:foodOrder,model:foodOrderItem,page:F01,page:B06

## Planning Shortcuts
- 本节给 Architect 拆 DAG 的骨架，具体工具顺序、patch 规范、provider 接入仍读 Skill。

### Common DAG Skeletons
- schema_or_field_change: requirement_list/meta -> schema/action owner -> impacted pages from Schema Change Impact -> seed/mock if needed -> QA.
- add_page_or_restore_page: requirement_list -> route_params/nav target -> page implementation -> source page linkages -> QA.
- role_or_auth_change: role enum/session/default account/auth guard -> gated pages/actions -> login/redirect behavior -> QA.
- thirdparty_change: product/provider decision -> project integration touchpoints -> target page/action wiring -> secrets/runtime verification -> QA.
- shared_or_layout_change: shared/layout file task -> imported pages from Shared/Component Impact -> targeted QA; pages not importing the file stay parallel.

### Project Signals
- platforms=backend;frontend
- models=7; pages=7; actions=35; routes=10
- route_targets=src/backend/route-params.ts;src/frontend/route-params.ts
- nav_targets=src/components/layout/backend/Sidebar.tsx;src/components/layout/frontend/Footer.tsx;src/components/layout/frontend/Navigation.tsx
- thirdparty_targets=server/thirdparty/ai-definitions.ts;server/thirdparty/ai/openai-compat.ts;server/thirdparty/auth-definitions.ts;server/thirdparty/auth/AuthState.ts;server/thirdparty/auth/google.route.ts;server/thirdparty/auth/google.ts;server/thirdparty/auth/index.ts;server/thirdparty/common.ts;server/thirdparty/context.ts;server/thirdparty/index.ts;server/thirdparty/payment-definitions.ts;server/thirdparty/payment/alipay.ts,+4
- shared_file_targets=1

## Freshness And Confidence
- change-recipes / implementation-map / indexes 是确定性工程抽取；flows/domain/playbooks/risks/SPEC 入口含 AI 语义层。
- 空的 pages/actions/routes/infra 列表只表示抽取未发现证据，不是能力不存在的证明；仍需回源码验证。
- extraction_warnings=-

## Unknowns
- active payment/OAuth/AI provider、secret 配置和平台集成状态不在 EvidencePack 内；以 warm context 的项目集成状态和平台记录为准。
- 默认账号、密码哈希策略、登录是否允许新角色不在静态抽取内；新增角色前必须读登录 action 与默认账号工具返回。
- 本文件是生成时快照，结构变更前后都要回源码确认。

### Engineering Risk Shortcuts
- generated_layers=lib/rpc-generated/;server-action-generated/;prisma-generated/;src/shared-enums.ts;rsbuild-migration-files/；这些是生成/构建产物或会被重生成的层，默认不要手改。
- read_only_infra=auth-guard-action=src/backend/action_utils.ts
- state_transition_hotspots=-
- page_rule_hotspots=page:F01(Home;auth=GUEST;rules=3),page:B01(AdminLogin;auth=GUEST;rules=7),page:B02(AdminRegister;auth=GUEST;rules=4),page:B03(AdminDashboard;auth=ADMIN;rules=8),page:B04(PhotosManagement;auth=ADMIN;rules=6),page:B05(ReviewsManagement;auth=ADMIN;rules=6),page:B06(BusinessInfoManagement;auth=ADMIN;rules=6)
