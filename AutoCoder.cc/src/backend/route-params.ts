// ================================================================
// route-params.ts
// 统一路由参数解析与跳转工具（Backend）
// 该文件由系统自动生成，用于统一管理页面间的 URL 参数传递与跳转关系
// 标注了所有路由参数的数据表来源，防止跨页面传错 ID
// ================================================================

export interface AppRouterInstance {
  push: (path: string) => void;
  replace: (path: string) => void;
  back: () => void;
}

export interface ParamMeta {
  source_table: string;
  source_column: string;
  description: string;
}

function buildUrl(path: string, params: Record<string, string>): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) sp.set(k, v);
  });
  const query = sp.toString();
  return query ? `${path}?${query}` : path;
}

// ================================================================
// B01 Admin Login — 无入参
// ================================================================
export const AdminLogin = {
  id: 'B01',
  path: '/adminlogin',
  paramsMeta: {} as Record<string, ParamMeta>,
  getParams: (_sp: URLSearchParams) => ({}),
  navigateTo: (router: AppRouterInstance) => router.push(AdminLogin.path)
};

// ================================================================
// B02 Admin Register — 无入参
// ================================================================
export const AdminRegister = {
  id: 'B02',
  path: '/adminregister',
  paramsMeta: {} as Record<string, ParamMeta>,
  getParams: (_sp: URLSearchParams) => ({}),
  navigateTo: (router: AppRouterInstance) => router.push(AdminRegister.path)
};

// ================================================================
// B03 Admin Dashboard — 无入参
// ================================================================
export const AdminDashboard = {
  id: 'B03',
  path: '/admindashboard',
  paramsMeta: {} as Record<string, ParamMeta>,
  getParams: (_sp: URLSearchParams) => ({}),
  navigateTo: (router: AppRouterInstance) => router.push(AdminDashboard.path)
};

// ================================================================
// B04 Photos Management — 入参: restaurantphotoId
// ================================================================
export const PhotosManagement = {
  id: 'B04',
  path: '/photosmanagement',
  paramsMeta: {
    restaurantphotoId: {
      source_table: 'restaurantphoto',
      source_column: 'id',
      description: '来源为 restaurantphoto 表的主键 id，用于定位要编辑的具体照片记录。',
    },
  },
  getParams: (() => {
    const cache = new WeakMap<URLSearchParams, { restaurantphotoId: string }>();
    return (sp: URLSearchParams) => {
      if (cache.has(sp)) return cache.get(sp)!;
      const result = {
        restaurantphotoId: sp.get('restaurantphotoId') || '',
      };
      cache.set(sp, result);
      return result;
    };
  })(),
  navigateToMain: (router: AppRouterInstance) =>
    router.push(PhotosManagement.path),
  navigateToDetail: (router: AppRouterInstance, params: { restaurantphotoId: string }) =>
    router.push(buildUrl(PhotosManagement.path, params)),
};

// ================================================================
// B05 Reviews Management — 入参: reviewSlot
// ================================================================
export const ReviewsManagement = {
  id: 'B05',
  path: '/reviewsmanagement',
  paramsMeta: {
    reviewSlot: {
      source_table: 'restaurantreview',
      source_column: 'reviewSlot',
      description: '来源为 restaurantreview 表的 reviewSlot，固定为 1-5，用于指定要编辑的具体评论槽位（此字段在数据表中为唯一标识）。',
    },
  },
  getParams: (() => {
    const cache = new WeakMap<URLSearchParams, { reviewSlot: string }>();
    return (sp: URLSearchParams) => {
      if (cache.has(sp)) return cache.get(sp)!;
      const result = {
        reviewSlot: sp.get('reviewSlot') || '',
      };
      cache.set(sp, result);
      return result;
    };
  })(),
  navigateToMain: (router: AppRouterInstance) =>
    router.push(ReviewsManagement.path),
  navigateToDetail: (router: AppRouterInstance, params: { reviewSlot: string }) =>
    router.push(buildUrl(ReviewsManagement.path, params)),
};

// ================================================================
// B06 Business Info Management — 无入参
// ================================================================
export const BusinessInfoManagement = {
  id: 'B06',
  path: '/businessinfomanagement',
  paramsMeta: {} as Record<string, ParamMeta>,
  getParams: (_sp: URLSearchParams) => ({}),
  navigateTo: (router: AppRouterInstance) => router.push(BusinessInfoManagement.path)
};

// ================================================================
// B07 Orders Management Page — 无入参
// ================================================================
export const OrdersManagement = {
  id: 'B07',
  path: '/ordersmanagement',
  paramsMeta: {} as Record<string, ParamMeta>,
  getParams: (_sp: URLSearchParams) => ({}),
  navigateTo: (router: AppRouterInstance) => router.push(OrdersManagement.path),
};

// ================================================================


// ================================================================
// end
// ================================================================

export const BackendRoutes = {
  AdminLogin,
  AdminRegister,
  AdminDashboard,
  PhotosManagement,
  ReviewsManagement,
  BusinessInfoManagement,
  OrdersManagement,
};

export const NAVIGATION_MAP: Record<string, string[]> = {
  'B01': ['B03', 'B02'],
  'B02': ['B01'],
  'B03': ['B04', 'B05', 'B06', 'B07'],
  'B04': [],
  'B05': [],
  'B06': [],
  'B07': [], // OrdersManagement
};

export const PAGE_ID_MAP: Record<string, string> = {
  'B01': 'AdminLogin',
  'B02': 'AdminRegister',
  'B03': 'AdminDashboard',
  'B04': 'PhotosManagement',
  'B05': 'ReviewsManagement',
  'B06': 'BusinessInfoManagement',
  'B07': 'OrdersManagement',
};

/**
 * 传入页面 ID 或名称，从 route-params.ts 源文件中提取：
 *   1. 当前页面的 export const 代码块
 *   2. 当前页面所有跳转目标的 export const 代码块
 *
 * 返回的字符串可直接作为下游 AI prompt 的入参。
 * 支持 ID（F10）或名称（PaperCompose / papercompose），大小写不敏感。
 *
 * @example
 *   const text = getRouteContextText('F10', fileContent)
 *   const text = getRouteContextText('papercompose', fileContent)
 *   // 返回：PaperCompose + PaperList
 */
export function getRouteContextText(
  pageIdOrName: string,
  fileContent: string
): string {
  // 支持 ID（F10）或名称（PaperCompose），大小写不敏感
  let pageId = pageIdOrName
  let currentName = PAGE_ID_MAP[pageId]


  if (!currentName) {
    // 按名称查找（大小写不敏感）
    const lowerInput = pageIdOrName.toLowerCase()
    const entry = Object.entries(PAGE_ID_MAP).find(
      ([, name]) => name.toLowerCase() === lowerInput
    )
    if (entry) {
      pageId = entry[0]
      currentName = entry[1]
    }
  }


  if (!currentName) return `// 错误：未找到页面 ${pageIdOrName}`


  const targetIds = NAVIGATION_MAP[pageId] || []
  const targetNames = targetIds.map((id) => PAGE_ID_MAP[id]).filter(Boolean)


  // 按 "// ====" 分隔符切分文件为代码块
  const lines = fileContent.split('\n')
  const blocks: Record<string, string> = {}
  let currentBlock: string[] = []
  let currentBlockName = ''


  for (const line of lines) {
    if (line.startsWith('// ====')) {
      if (currentBlockName && currentBlock.length > 0) {
        blocks[currentBlockName] = currentBlock.join('\n').trim()
      }
      currentBlock = [line]
      currentBlockName = ''
      continue
    }
    const exportMatch = line.match(/^export const (\w+)\s*=/)
    if (exportMatch && !currentBlockName) {
      currentBlockName = exportMatch[1]
    }
    currentBlock.push(line)
  }
  if (currentBlockName && currentBlock.length > 0) {
    blocks[currentBlockName] = currentBlock.join('\n').trim()
  }


  function getBlock(name: string): string {
    return blocks[name] || `// 未找到 ${name} 的定义`
  }


  const parts: string[] = []
  parts.push('// ★★★ 当前页面 ★★★')
  parts.push(getBlock(currentName))
  if (targetNames.length > 0) {
    parts.push('// ★★★ 跳转目标页面（当前页面会 navigateTo 以下页面）★★★')
    for (const name of targetNames) {
      parts.push(getBlock(name))
    }
  }
  return parts.join('\n\n')
}
