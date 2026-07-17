export type platform_role = 'GUEST' | 'ADMIN';

export type weekday_key = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export type member_uniqueKey = {
  id: string; // Unique Key
};

export type member_without_PKs = {
  account: string;
  password: string;
  email: string;
  role: platform_role;
  createdAt: Date;
  updatedAt: Date;
};

export type member = member_uniqueKey & member_without_PKs;



export type restaurant_uniqueKey = {
  id: string; // Unique Key
};

export type restaurant_without_PKs = {
  name: string;
  address: string;
  phone: string;
  website: string;
  rating: number; // 评分（X分）
  reviewCount: number; // 评论数（X条）
  brandStory: string;
  highlights: any; // 亮点列表，格式: ["prefix lunch menu","pizza","sparkling juice"]
  createdAt: Date;
  updatedAt: Date;
};

export type restaurant = restaurant_uniqueKey & restaurant_without_PKs;



export type restaurantphoto_uniqueKey = {
  id: string; // Unique Key
};

export type restaurantphoto_without_PKs = {
  restaurantId: string; // Foreign Key to restaurant.id
  photoKey: string;
  sortOrder: number; // 排序（第X位）
  alt: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export type restaurantphoto = restaurantphoto_uniqueKey & restaurantphoto_without_PKs;



export type restaurantreview_uniqueKey = {
  id: string; // Unique Key
};

export type restaurantreview_without_PKs = {
  restaurantId: string; // Foreign Key to restaurant.id
  reviewSlot: number; // 固定评论槽位（第X条）
  authorName: string;
  rating: number; // 评分（X分）
  relativeTime: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type restaurantreview = restaurantreview_uniqueKey & restaurantreview_without_PKs;



export type restauranthour_uniqueKey = {
  id: string; // Unique Key
};

export type restauranthour_without_PKs = {
  restaurantId: string; // Foreign Key to restaurant.id
  weekday: weekday_key;
  sortOrder: number; // 排序（第X位）
  fullLine: string;
  createdAt: Date;
  updatedAt: Date;
};

export type restauranthour = restauranthour_uniqueKey & restauranthour_without_PKs;




export type StringFilter = {
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  equals?: string;
  in?: string[];
  notIn?: string[];
  not?: string | StringFilter;
};

export type NumberFilter = {
  equals?: number;
  in?: number[];
  notIn?: number[];
  not?: number | NumberFilter;
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
};

export type DateFilter = {
  equals?: Date;
  in?: Date[];
  notIn?: Date[];
  not?: Date | DateFilter;
  lt?: Date;
  lte?: Date;
  gt?: Date;
  gte?: Date;
};

export type platformRoleFilter = {
  equals?: platform_role;
  in?: platform_role[];
  notIn?: platform_role[];
  not?: platform_role | platformRoleFilter;
};

export type weekdayKeyFilter = {
  equals?: weekday_key;
  in?: weekday_key[];
  notIn?: weekday_key[];
  not?: weekday_key | weekdayKeyFilter;
};

export type filtered_member = {
  id?: string | StringFilter | null;
  account?: string | StringFilter | null;
  password?: string | StringFilter | null;
  email?: string | StringFilter | null;
  role?: platform_role | platformRoleFilter | null;
  createdAt?: Date | DateFilter | null;
  updatedAt?: Date | DateFilter | null;
};

export type filtered_restaurant = {
  id?: string | StringFilter | null;
  name?: string | StringFilter | null;
  address?: string | StringFilter | null;
  phone?: string | StringFilter | null;
  website?: string | StringFilter | null;
  rating?: number | NumberFilter | null; // 评分（X分）
  reviewCount?: number | NumberFilter | null; // 评论数（X条）
  brandStory?: string | StringFilter | null;
  highlights?: any | null; // 亮点列表，格式: ["prefix lunch menu","pizza","sparkling juice"]
  createdAt?: Date | DateFilter | null;
  updatedAt?: Date | DateFilter | null;
};

export type filtered_restaurantphoto = {
  id?: string | StringFilter | null;
  restaurantId?: string | StringFilter | null; // Foreign Key to restaurant.id
  photoKey?: string | StringFilter | null;
  sortOrder?: number | NumberFilter | null; // 排序（第X位）
  alt?: string | StringFilter | null;
  description?: string | StringFilter | null;
  imageUrl?: string | StringFilter | null;
  createdAt?: Date | DateFilter | null;
  updatedAt?: Date | DateFilter | null;
};

export type filtered_restaurantreview = {
  id?: string | StringFilter | null;
  restaurantId?: string | StringFilter | null; // Foreign Key to restaurant.id
  reviewSlot?: number | NumberFilter | null; // 固定评论槽位（第X条）
  authorName?: string | StringFilter | null;
  rating?: number | NumberFilter | null; // 评分（X分）
  relativeTime?: string | StringFilter | null;
  content?: string | StringFilter | null;
  createdAt?: Date | DateFilter | null;
  updatedAt?: Date | DateFilter | null;
};

export type filtered_restauranthour = {
  id?: string | StringFilter | null;
  restaurantId?: string | StringFilter | null; // Foreign Key to restaurant.id
  weekday?: weekday_key | weekdayKeyFilter | null;
  sortOrder?: number | NumberFilter | null; // 排序（第X位）
  fullLine?: string | StringFilter | null;
  createdAt?: Date | DateFilter | null;
  updatedAt?: Date | DateFilter | null;
};

export type Entities = {
  member: {
    Create(data: member): Promise<member | null>;
    Get(args: member_uniqueKey): Promise<member | null>;
    GetAll(args?: filtered_member): Promise<member[]>;
    GetPage(pageNumber?: number, pageSize?: number, args?: filtered_member): Promise<member[]>;
    Count(args?: filtered_member): Promise<number>;
    Update(args: { where: member_uniqueKey; data: member_without_PKs }): Promise<member | null>;
    Delete(args: member_uniqueKey): Promise<member | null>;
  };
  restaurant: {
    Create(data: restaurant): Promise<restaurant | null>;
    Get(args: restaurant_uniqueKey): Promise<restaurant | null>;
    GetAll(args?: filtered_restaurant): Promise<restaurant[]>;
    GetPage(pageNumber?: number, pageSize?: number, args?: filtered_restaurant): Promise<restaurant[]>;
    Count(args?: filtered_restaurant): Promise<number>;
    Update(args: { where: restaurant_uniqueKey; data: restaurant_without_PKs }): Promise<restaurant | null>;
    Delete(args: restaurant_uniqueKey): Promise<restaurant | null>;
  };
  restaurantphoto: {
    Create(data: restaurantphoto): Promise<restaurantphoto | null>;
    Get(args: restaurantphoto_uniqueKey): Promise<restaurantphoto | null>;
    GetAll(args?: filtered_restaurantphoto): Promise<restaurantphoto[]>;
    GetPage(pageNumber?: number, pageSize?: number, args?: filtered_restaurantphoto): Promise<restaurantphoto[]>;
    Count(args?: filtered_restaurantphoto): Promise<number>;
    Update(args: { where: restaurantphoto_uniqueKey; data: restaurantphoto_without_PKs }): Promise<restaurantphoto | null>;
    Delete(args: restaurantphoto_uniqueKey): Promise<restaurantphoto | null>;
  };
  restaurantreview: {
    Create(data: restaurantreview): Promise<restaurantreview | null>;
    Get(args: restaurantreview_uniqueKey): Promise<restaurantreview | null>;
    GetAll(args?: filtered_restaurantreview): Promise<restaurantreview[]>;
    GetPage(pageNumber?: number, pageSize?: number, args?: filtered_restaurantreview): Promise<restaurantreview[]>;
    Count(args?: filtered_restaurantreview): Promise<number>;
    Update(args: { where: restaurantreview_uniqueKey; data: restaurantreview_without_PKs }): Promise<restaurantreview | null>;
    Delete(args: restaurantreview_uniqueKey): Promise<restaurantreview | null>;
  };
  restauranthour: {
    Create(data: restauranthour): Promise<restauranthour | null>;
    Get(args: restauranthour_uniqueKey): Promise<restauranthour | null>;
    GetAll(args?: filtered_restauranthour): Promise<restauranthour[]>;
    GetPage(pageNumber?: number, pageSize?: number, args?: filtered_restauranthour): Promise<restauranthour[]>;
    Count(args?: filtered_restauranthour): Promise<number>;
    Update(args: { where: restauranthour_uniqueKey; data: restauranthour_without_PKs }): Promise<restauranthour | null>;
    Delete(args: restauranthour_uniqueKey): Promise<restauranthour | null>;
  };
};

