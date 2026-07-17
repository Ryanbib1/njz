# Implementation Map
> Fact layer - deterministic engineering extraction. Verify against code before editing.

# IMPLEMENTATION_MAP v1
用途:供 SPEC 生成的代码侧地图。需求/领域事实单独在 REQUIREMENTS_BRIEF 里。
Ref 还原:PAGE_MAP.page=>page:<id>; ACTION_MAP.action=>iface:<name>; MODEL_MAP.model=>model:<name>; ROUTE_PARAM_MAP.route=>route:<name>; model.field=>field:<model>.<field>。
PROJECT id=PROJ_43bb5105_snap_20260716_073319_373|platforms=backend,frontend|language=zh-CN|chain=
COUNTS pages=7|actions=35|models=7|routes=10|edges=111
读法:每一列都是代码当前**已实现**内容的生成时快照,不是 TODO——判断某能力是否实现请打开文件;本地图给坐标,不给运行时状态。roles/legal_state_changes/reads/writes 是 best-effort 提取、不完整:空单元格表示 'not extracted',绝不表示 'none / public / no state change'。roles 是 call-site label,不是鉴权 source of truth(空 ≠ public;AUTHENTICATED = 需登录,角色未指定)。PAGE_MAP.reads/writes 是该页所有 action 的并集;要反查哪些页面碰某个模型,扫 ACTION_MAP 行,不要只看 PAGE_MAP。带 .N 后缀的 action 名(如 login.2)是同名 action 在不同文件中的去重索引(通常是同一逻辑 action 在不同 platform/页面上),不是 base 的子变体——改跨切面行为时,每个 .N sibling 都要改,不只裸名。
源码坐标:ACTION_MAP 末尾有 file|calls 列;FILE_MAP 列出逐页源文件。calls 是原始调用图符号——把某个符号(如 auth/session/transaction helper)在 ACTION_MAP.calls 里 grep 一下,就能找到所有碰这个跨切面关注点的 action。INFRA_MAP 列出 update agent 要编辑或调用的跨页 auth/session/route-guard/nav 入口,engine 维护的文件带 read_only 标记。上面 roles 列的鉴权事实以 INFRA_MAP 的 auth-guard-* 加源码为准,不以本地图为准。

# MODEL_MAP  model: 仅关键字段(id/fk/enum);完整字段表+类型在 indexes/full_index.json#/models;* id, ? optional, [] list, -> relation, {enum}
foodOrder: id:String*, paymentProvider:payment_provider{CLINK}, paymentSessionId:String?, paymentStatus:payment_status{PENDING|SUCCESS|FAILED|CANCELLED}, orderStatus:food_order_status{PENDING_PAYMENT|PAID|PREPARING|READY_FOR_PICKUP|COMPLETED|CANCELLED}
foodOrderItem: id:String*, orderId:String->foodOrder
member: id:String*, role:platform_role{GUEST|ADMIN}
restaurant: id:String*
restauranthour: id:String*, restaurantId:String->restaurant, weekday:weekday_key{MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY}
restaurantphoto: id:String*, restaurantId:String->restaurant
restaurantreview: id:String*, restaurantId:String->restaurant

# PAGE_MAP  page|name|route|role/auth|reads|writes
F01|Home|/|GUEST|restaurant|
B01|AdminLogin|/adminlogin|GUEST|member|
B02|AdminRegister|/adminregister|GUEST|member|member
B03|AdminDashboard|/|ADMIN|restaurant,restauranthour,restaurantphoto,restaurantreview|restaurant,restaurantphoto,restaurantreview
B04|PhotosManagement|/photosmanagement|ADMIN|restaurant,restaurantphoto|restaurantphoto
B05|ReviewsManagement|/reviewsmanagement|ADMIN|restaurantreview|restaurantreview
B06|BusinessInfoManagement|/businessinfomanagement|ADMIN|restaurant,restauranthour|restaurant,restauranthour

# ACTION_MAP  action|page|roles|reads|writes|legal_state_changes|returns|file|calls
getMenu|||||||src/frontend/actions/FoodOrder.ts|Set,async,from,getMenuCatalog,map
createFoodOrder|||||||src/frontend/actions/FoodOrder.ts|Map,Number,async,buildOrderNumber,buildPaymentResultUrl,create,createPaymentSession,entries,from,get,getMenuCatalog,getPaymentProvider,has,includes,isInteger,map,normalizePhone,reduce,set,toFixed,toLowerCase,trim,update
createFoodOrderPaymentSession|||||||src/frontend/actions/FoodOrder.ts|Number,async,buildPaymentResultUrl,createPaymentSession,findUnique,getPaymentProvider,mapPaymentStatus,toLowerCase,update
getRestaurantProfile|F01||restaurant||||src/frontend/actions/Home.ts|async,findFirst,isArray,map,sort,toNumber
getPaymentOrderDetails|||||||src/frontend/actions/OrderPaymentResult.ts|async,fetchOrderWithItems,mapOrderDetails,resolveTrustedSessionId
verifyFoodOrderPayment|||||||src/frontend/actions/OrderPaymentResult.ts|String,async,delay,fetchOrderWithItems,getPaymentProvider,getPaymentSession,mapOrderDetails,normalizeProviderPaymentStatus,persistResolvedPaymentStatus,resolveTrustedSessionId,toLowerCase,toPaymentStatus
reconcileFoodOrderPayment|||||||src/frontend/actions/OrderPaymentResult.ts|Date,String,async,fetchOrderWithItems,mapOrderDetails,resolveTrustedSessionId,toFoodOrderStatus,toPaymentStatus,toUpperCase,update,verifyFoodOrderPayment
getAdminDashboardData|B03|ADMIN|restaurant,restauranthour,restaurantphoto,restaurantreview||||src/backend/actions/AdminDashboard.ts|all,async,count,findFirst,findMany,map,sort,toNumber,toUpperCase
updateRestaurantProfile|B03|ADMIN|restaurant|restaurant|||src/backend/actions/AdminDashboard.ts|Date,async,findFirst,trim,update
removeDashboardPhoto|B03|ADMIN|restaurantphoto|restaurantphoto|||src/backend/actions/AdminDashboard.ts|async,delete,findUnique
removeDashboardReview|B03|ADMIN|restaurantreview|restaurantreview|||src/backend/actions/AdminDashboard.ts|async,delete,findUnique
adminLogin|B01||member|||field:member.id,field:member.role|src/backend/actions/AdminLogin.ts|async,findUnique,hashPassword,signToken
getGoogleLoginUrl|B01||||||src/backend/actions/AdminLogin.ts|async,getAuthProvider,getAuthUrl
handleGoogleCallback|B01||member|||field:member.id,field:member.role|src/backend/actions/AdminLogin.ts|async,findUnique,getAuthProvider,getAuthUser,signToken
checkCurrentSession|B01|||||field:member.role|src/backend/actions/AdminLogin.ts|async,tryGetAuthContext
registerAdmin|B02||member|member|||src/backend/actions/AdminRegister.ts|Date,Member,async,create,findUnique,hashPassword,trim
getBusinessProfile|B06|ADMIN|restaurant||||src/backend/actions/BusinessInfoManagement.ts|Date,Records,async,every,find,findFirst,getTime,map,max,toISOString,toNumber,toUpperCase
updateBusinessIdentity|B06|ADMIN||restaurant|||src/backend/actions/BusinessInfoManagement.ts|Date,async,update
createHourRecord|B06|ADMIN|restauranthour|restauranthour|||src/backend/actions/BusinessInfoManagement.ts|Date,async,create,findFirst,includes,indexOf,toUpperCase
updateHourRecord|B06|ADMIN||restauranthour|||src/backend/actions/BusinessInfoManagement.ts|Date,async,update
deleteHourRecord|B06|ADMIN||restauranthour|||src/backend/actions/BusinessInfoManagement.ts|async,delete
getFoodOrdersList||ADMIN|foodOrder||||src/backend/actions/OrdersManagement.ts|Date,all,async,count,findMany,map,setHours,toISOString,toNumber
getFoodOrderDetail||ADMIN|foodOrder|||field:foodOrder.id,field:foodOrder.orderStatus,field:foodOrder.paymentProvider,field:foodOrder.paymentSessionId,field:foodOrder.paymentStatus|src/backend/actions/OrdersManagement.ts|async,findUnique,map,toISOString,toNumber
updateFoodOrderStatus||ADMIN|foodOrder|foodOrder|||src/backend/actions/OrdersManagement.ts|Date,async,findUnique,includes,update
exportFoodOrdersList||ADMIN|foodOrder||||src/backend/actions/OrdersManagement.ts|Date,async,findMany,map,toISOString,toNumber
getPhotosList|B04|ADMIN|restaurant,restaurantphoto||||src/backend/actions/PhotosManagement.ts|Map,async,findFirst,findMany,get,map,padStart,push,toString
getPhotoDetail|B04|ADMIN|restaurantphoto||||src/backend/actions/PhotosManagement.ts|async,findUnique
createPhoto|B04|ADMIN|restaurant,restaurantphoto|restaurantphoto|||src/backend/actions/PhotosManagement.ts|Date,async,create,findFirst,findUnique
updatePhoto|B04|ADMIN|restaurantphoto|restaurantphoto|||src/backend/actions/PhotosManagement.ts|Date,async,findUnique,update
deletePhoto|B04|ADMIN|restaurantphoto|restaurantphoto|||src/backend/actions/PhotosManagement.ts|async,delete,findUnique
getReviewsList|B05|ADMIN|restaurantreview||||src/backend/actions/ReviewsManagement.ts|async,checkMatchStatus,find,findMany,getCanonicalRestaurantId,push
getReviewDetail|B05|ADMIN|restaurantreview||||src/backend/actions/ReviewsManagement.ts|async,checkMatchStatus,findUnique,getCanonicalRestaurantId
createReview|B05|ADMIN|restaurantreview|restaurantreview|||src/backend/actions/ReviewsManagement.ts|Date,async,create,fields,findUnique,getCanonicalRestaurantId
updateReview|B05|ADMIN|restaurantreview|restaurantreview|||src/backend/actions/ReviewsManagement.ts|Date,async,fields,findUnique,update
deleteReview|B05|ADMIN|restaurantreview|restaurantreview|||src/backend/actions/ReviewsManagement.ts|async,delete,findUnique

# ROUTE_PARAM_MAP  route|path|params(name=token)  token: field:<model>.<f> 绑定到模型字段, param:<name> 自由参数, 裸名未消歧
AdminDashboard|/admindashboard|
AdminLogin|/adminlogin|
AdminRegister|/adminregister|
BusinessInfoManagement|/businessinfomanagement|
OrdersManagement|/ordersmanagement|
PhotosManagement|/photosmanagement|restaurantphotoId=field:restaurantphoto.id
ReviewsManagement|/reviewsmanagement|reviewSlot=field:restaurantreview.reviewSlot
FoodOrder|/foodorder|
Home|/|
OrderPaymentResult|/orderpaymentresult|orderId,status,sessionId

# NAVIGATION_MAP  engine_ref|from>to|carries  (仅显式跨页 L2;L1/自环/declared 边留在 engine_edges.json;carries 为空 = 未提取到参数,不保证没有传参)
l2:B01.to.B02.navigateTo|B01>B02|
l2:B01.to.B03.navigateTo|B01>B03|
l2:B01.to.B03.navigateTo.2|B01>B03|
l2:B02.to.B01.navigateTo|B02>B01|
l2:B03.to.B04.navigateToDetail|B03>B04|field:restaurantphoto.id
l2:B03.to.B04.navigateToMain|B03>B04|
l2:B03.to.B05.navigateToDetail|B03>B05|field:restaurantreview.reviewSlot
l2:B03.to.B05.navigateToMain|B03>B05|
l2:B03.to.B06.navigateTo|B03>B06|

# FILE_MAP  page|role=path;role=path  (逐页源文件;生成时快照——co_located_* 是按约定推断的路径,不一定都存在;rpc_stub 是 GENERATED,改 source_action 而不是 stub;编辑前先核对)
F01|source_action=src/frontend/actions/Home.ts;hook=src/frontend/hooks/useHome.ts;view=src/frontend/components/HomeView.tsx;types=src/frontend/types/Home.ts
B01|source_action=src/backend/actions/AdminLogin.ts;hook=src/backend/hooks/useAdminLogin.ts;view=src/backend/components/AdminLoginView.tsx;types=src/backend/types/AdminLogin.ts;page_entry=app/(backend)/adminlogin/page.tsx;co_located_action=app/(backend)/adminlogin/AdminLogin.actions.ts;co_located_hook=app/(backend)/adminlogin/useAdminLogin.ts;co_located_view=app/(backend)/adminlogin/AdminLoginView.tsx;co_located_types=app/(backend)/adminlogin/AdminLogin.types.ts;rpc_stub=lib/rpc-generated/src/backend/actions/AdminLogin.ts (generated)
B02|source_action=src/backend/actions/AdminRegister.ts;hook=src/backend/hooks/useAdminRegister.ts;view=src/backend/components/AdminRegisterView.tsx;types=src/backend/types/AdminRegister.ts;page_entry=app/(backend)/adminregister/page.tsx;co_located_action=app/(backend)/adminregister/AdminRegister.actions.ts;co_located_hook=app/(backend)/adminregister/useAdminRegister.ts;co_located_view=app/(backend)/adminregister/AdminRegisterView.tsx;co_located_types=app/(backend)/adminregister/AdminRegister.types.ts;rpc_stub=lib/rpc-generated/src/backend/actions/AdminRegister.ts (generated)
B03|source_action=src/backend/actions/AdminDashboard.ts;hook=src/backend/hooks/useAdminDashboard.ts;view=src/backend/components/AdminDashboardView.tsx;types=src/backend/types/AdminDashboard.ts;page_entry=app/(backend)/admindashboard/page.tsx
B04|source_action=src/backend/actions/PhotosManagement.ts;hook=src/backend/hooks/usePhotosManagement.ts;view=src/backend/components/PhotosManagementView.tsx;types=src/backend/types/PhotosManagement.ts;page_entry=app/(backend)/photosmanagement/page.tsx;co_located_action=app/(backend)/photosmanagement/PhotosManagement.actions.ts;co_located_hook=app/(backend)/photosmanagement/usePhotosManagement.ts;co_located_view=app/(backend)/photosmanagement/PhotosManagementView.tsx;co_located_types=app/(backend)/photosmanagement/PhotosManagement.types.ts;rpc_stub=lib/rpc-generated/src/backend/actions/PhotosManagement.ts (generated)
B05|source_action=src/backend/actions/ReviewsManagement.ts;hook=src/backend/hooks/useReviewsManagement.ts;view=src/backend/components/ReviewsManagementView.tsx;types=src/backend/types/ReviewsManagement.ts;page_entry=app/(backend)/reviewsmanagement/page.tsx;co_located_action=app/(backend)/reviewsmanagement/ReviewsManagement.actions.ts;co_located_hook=app/(backend)/reviewsmanagement/useReviewsManagement.ts;co_located_view=app/(backend)/reviewsmanagement/ReviewsManagementView.tsx;co_located_types=app/(backend)/reviewsmanagement/ReviewsManagement.types.ts;rpc_stub=lib/rpc-generated/src/backend/actions/ReviewsManagement.ts (generated)
B06|source_action=src/backend/actions/BusinessInfoManagement.ts;hook=src/backend/hooks/useBusinessInfoManagement.ts;view=src/backend/components/BusinessInfoManagementView.tsx;types=src/backend/types/BusinessInfoManagement.ts;page_entry=app/(backend)/businessinfomanagement/page.tsx;co_located_action=app/(backend)/businessinfomanagement/BusinessInfoManagement.actions.ts;co_located_hook=app/(backend)/businessinfomanagement/useBusinessInfoManagement.ts;co_located_view=app/(backend)/businessinfomanagement/BusinessInfoManagementView.tsx;co_located_types=app/(backend)/businessinfomanagement/BusinessInfoManagement.types.ts;rpc_stub=lib/rpc-generated/src/backend/actions/BusinessInfoManagement.ts (generated)

# INFRA_MAP  capability|platform|path|flags  (跨页基础设施,不属于任何单页;列出某路径只表示文件存在,不表示它已挂载/生效——请在 layout/源码里核对)
auth-guard-action|app|src/app/action_utils.ts|
auth-guard-action|backend|src/backend/action_utils.ts|read_only
auth-guard-action|frontend|src/frontend/action_utils.ts|
auth-guard-route|app|src/tools/AppAuthGuard.tsx|
auth-guard-route|backend|src/tools/BackendAuthGuard.tsx|
auth-guard-route|frontend|src/tools/FrontendAuthGuard.tsx|
auth-ui|app|src/app/auth/rpc-auth.tsx|
auth-ui|backend|src/backend/auth/rpc-auth.tsx|
auth-ui|frontend|src/frontend/auth/rpc-auth.tsx|
navigation-shell|backend|src/components/layout/backend/Sidebar.tsx|
navigation-shell|frontend|src/components/layout/frontend/Footer.tsx|
navigation-shell|frontend|src/components/layout/frontend/Navigation.tsx|
route-registry|backend|src/backend/route-params.ts|
route-registry|frontend|src/frontend/route-params.ts|
session|app|src/tools/AppSession.tsx|
session|backend|src/tools/BackendSession.tsx|
session|frontend|src/tools/FrontendSession.tsx|
thirdparty-infra|*|server/thirdparty/ai-definitions.ts|
thirdparty-infra|*|server/thirdparty/ai/openai-compat.ts|
thirdparty-infra|*|server/thirdparty/auth-definitions.ts|
thirdparty-infra|*|server/thirdparty/auth/AuthState.ts|
thirdparty-infra|*|server/thirdparty/auth/google.route.ts|
thirdparty-infra|*|server/thirdparty/auth/google.ts|
thirdparty-infra|*|server/thirdparty/auth/index.ts|
thirdparty-infra|*|server/thirdparty/common.ts|
thirdparty-infra|*|server/thirdparty/context.ts|
thirdparty-infra|*|server/thirdparty/index.ts|
thirdparty-infra|*|server/thirdparty/payment-definitions.ts|
thirdparty-infra|*|server/thirdparty/payment/alipay.ts|
thirdparty-infra|*|server/thirdparty/payment/clink.ts|
thirdparty-infra|*|server/thirdparty/payment/stripe.ts|
thirdparty-infra|*|server/thirdparty/secret-resolver.ts|
thirdparty-types|*|src/types/thirdparty.d.ts|

# GENERATED_LAYER  path|regenerated_from  (禁止手改:会被重新生成或仅用于构建,不是 source of truth;@/{platform}/actions/* 解析到这里——请改 src/{platform}/actions/* 而不是这里)
lib/rpc-generated/|gen_rpc, from src/{platform}/actions/*
server-action-generated/|build/migration artifact
prisma-generated/|prisma generate
src/shared-enums.ts|scripts/generate-schema-meta.ts, from prisma/schema.prisma
rsbuild-migration-files/|build/migration artifact
# NOTE  README.md / AGENTS.md 可能残留当前构建已不再使用的过时引用(例如 src/App.generated.tsx、scripts/gen-rpc-fast.mjs)——以源码为准,不要轻信文档。
