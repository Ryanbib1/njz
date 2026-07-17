/**
 * 前端路由参数工具文件 route-params.ts
 * 
 * 核心目标：统一所有页面的 URL 参数解析和跳转方法，标注参数的数据库来源，防止跨页面传错 ID。
 */

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
// F01 Home — 无入参
// ================================================================
export const Home = {
  id: 'F01',
  path: '/',
  paramsMeta: {} as Record<string, ParamMeta>,
  getParams: (_sp: URLSearchParams) => ({}),
  navigateTo: (router: AppRouterInstance) => router.push(Home.path)
}

// ================================================================
// F02 Food Order Page — 无入参
// ================================================================
export const FoodOrder = {
  id: 'F02',
  path: '/foodorder',
  paramsMeta: {} as Record<string, ParamMeta>,
  getParams: (_sp: URLSearchParams) => ({}),
  navigateTo: (router: AppRouterInstance) => router.push(FoodOrder.path),
};

// ================================================================
// F03 Order Payment Result Page — 入参: orderId, status, sessionId
// ================================================================
export const OrderPaymentResult = {
  id: 'F03',
  path: '/orderpaymentresult',
  paramsMeta: {
    orderId: {
      source_table: 'food_order',
      source_column: 'id',
      description: 'Source is the food_order primary key id for resolving the order shown on the payment result page.',
    },
    status: {
      source_table: 'food_order',
      source_column: 'paymentStatus',
      description: 'Source is the payment status used to branch the payment result state after CLINK redirect.',
    },
    sessionId: {
      source_table: 'food_order',
      source_column: 'paymentSessionId',
      description: 'Source is the CLINK payment session identifier used to reconcile redirect result details.',
    },
  } as Record<string, ParamMeta>,
  getParams: (() => {
    const cache = new WeakMap<URLSearchParams, { orderId: string; status: string; sessionId: string }>();
    return (sp: URLSearchParams) => {
      if (cache.has(sp)) return cache.get(sp)!;
      const result = {
        orderId: sp.get('orderId') || '',
        status: sp.get('status') || '',
        sessionId: sp.get('sessionId') || '',
      };
      cache.set(sp, result);
      return result;
    };
  })(),
  navigateToStandard: (router: AppRouterInstance) =>
    router.push(OrderPaymentResult.path),
  navigateToWithParams: (router: AppRouterInstance, params: { orderId: string; status: string; sessionId: string }) =>
    router.push(buildUrl(OrderPaymentResult.path, params)),
};

// ================================================================


// ================================================================


// ================================================================
// end
// ================================================================

export const FrontendRoutes = {
  Home,
  FoodOrder,
  OrderPaymentResult,
};

export const NAVIGATION_MAP: Record<string, string[]> = {
  F01: [], // 只有当前页面内部锚点跳转，无其他路由跳转,
  'F02': ['F03'], // FoodOrder
};

export const PAGE_ID_MAP: Record<string, string> = {
  F01: 'Home',
  'F02': 'FoodOrder',
  'F03': 'OrderPaymentResult',
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
