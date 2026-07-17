import React, { CSSProperties, useState, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import get_image_url from '../../src/tools/tools';

// 并发控制：最多同时 3 个图片请求
const MAX_CONCURRENT = 3;
let activeCount = 0;
const waitQueue: Array<() => void> = [];

function acquireSlot(): Promise<void> {
    if (activeCount < MAX_CONCURRENT) {
        activeCount++;
        return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
        waitQueue.push(() => {
            activeCount++;
            resolve();
        });
    });
}

function releaseSlot(): void {
    activeCount--;
    if (waitQueue.length > 0) {
        const next = waitQueue.shift()!;
        next();
    }
}

// 内存缓存：避免相同 keywords 重复请求
const imageCache = new Map<string, string>();

function getCacheKey(keywords: string, orientation: string, propKey: string): string {
    return `${keywords}|${orientation}|${propKey}`;
}

interface EditableImgProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
    propKey: string;             // 必须传入的唯一标识符
    src?: string | null;         // 图片源，支持 null
    alt?: string | null;         // 图片描述，支持 null
    keywords?: string | null;    // 用于关键词获取图片
    description?: string | null; // 图片详细描述
    needLargeImage?: boolean;    // 是否需要大图
    orientation?: 'landscape' | 'portrait' | 'square'; // 图片方向
}

const defaultStyle: CSSProperties = {
    objectFit: 'cover',
    aspectRatio: '16 / 9', // 默认宽高比
    width: '100%', 
    height: '100%'
};

const extractProjectId = (): string => {
    if (typeof window === 'undefined') {
        return '';
    }
    try {
        const currentUrl = new URL(window.location.href);
        const queryProjectId =
            currentUrl.searchParams.get('PROJECTID') ||
            currentUrl.searchParams.get('project_id') ||
            currentUrl.searchParams.get('projectId');
        if (queryProjectId) {
            return decodeURIComponent(queryProjectId);
        }
        const pathMatch = currentUrl.pathname.match(/PROJ_[0-9a-zA-Z]+/);
        return pathMatch ? pathMatch[0] : '';
    } catch {
        return '';
    }
};

// 检测字符串是否为有效的网址
const isValidUrl = (string: string): boolean => {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'blob:';
    } catch (_) {
        return false;
    }
};

const EditableImg = ({ 
    src, 
    alt = '', 
    className, 
    propKey, 
    style,
    keywords,
    description,
    needLargeImage=false,
    orientation = 'landscape',
    ...imgProps
}: EditableImgProps) => {
    const [imageSrc, setImageSrc] = useState<string | null | undefined>(src);
    const [imageAlt, setImageAlt] = useState<string | null | undefined>(alt);
    const [loading, setLoading] = useState<boolean>(false);
    const [isFromKeywordSearch, setIsFromKeywordSearch] = useState<boolean>(false); // 新增状态
    const projectId = useMemo(() => extractProjectId(), []);

    useEffect(() => {
        setImageSrc(src);
        setIsFromKeywordSearch(false); // 来自 src prop 时,标记为非关键词搜索
    }, [src]);

    useEffect(() => {
        setImageAlt(alt);
    }, [alt]);

    // 新增：根据 keywords 获取图片（带并发控制）
    useEffect(() => {
        if (!src && keywords) {
            // 检查 keywords 是否为有效的网址
            if (isValidUrl(keywords)) {
                // 如果是网址，直接使用
                setImageSrc(keywords);
            } else {
                // 如果不是网址，排队获取图片
                const cacheKey = getCacheKey(keywords, orientation, propKey);
                const cached = imageCache.get(cacheKey);
                if (cached) {
                    setImageSrc(cached);
                    setIsFromKeywordSearch(true);
                    return;
                }

                const abortController = new AbortController();
                let cancelled = false;

                acquireSlot().then(() => {
                    if (cancelled) {
                        releaseSlot();
                        return;
                    }
                    // 拿到 slot 后才显示 loading，避免大量组件同时 spin
                    setLoading(true);
                    return get_image_url(keywords || description || '', orientation, propKey, projectId || '', description || '', needLargeImage, abortController.signal).then(url => {
                        if (!cancelled) {
                            imageCache.set(cacheKey, url);
                            setImageSrc(url);
                            setLoading(false);
                            setIsFromKeywordSearch(true);
                        }
                    }).catch((err) => {
                        if (!cancelled && err?.name !== 'AbortError') {
                            setLoading(false);
                        }
                    }).finally(() => {
                        releaseSlot();
                    });
                });

                return () => {
                    cancelled = true;
                    abortController.abort();
                };
            }
        }
    }, [keywords, src, orientation, propKey, projectId, description, needLargeImage]);

    const mergedStyle: CSSProperties = {
        ...defaultStyle,
        ...style,
    };

    if (loading) {
        return (
            <div style={{...mergedStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'}} key={propKey} className={className}>
                <Loader2 className="animate-spin" style={{ willChange: 'transform' }} />
            </div>
        );
    }

    return (
        <img
            {...imgProps}
            style={mergedStyle}
            key={propKey}
            src={imageSrc ?? undefined}
            alt={imageAlt ?? undefined}
            className={className}
            data-api-exclude-tracking={isFromKeywordSearch ? "true" : undefined}
        />
    );
};

export default EditableImg;
export { EditableImg };
