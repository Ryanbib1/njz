import { PrismaClient, Prisma } from '../prisma-generated/client';
import {
  filtered_member, 
  filtered_restaurant, 
  filtered_restauranthour, 
  filtered_restaurantphoto, 
  filtered_restaurantreview, 
  member, 
  member_uniqueKey, 
  member_without_PKs, 
  restaurant, 
  restaurant_uniqueKey, 
  restaurant_without_PKs, 
  restauranthour, 
  restauranthour_uniqueKey, 
  restauranthour_without_PKs, 
  restaurantphoto, 
  restaurantphoto_uniqueKey, 
  restaurantphoto_without_PKs, 
  restaurantreview, 
  restaurantreview_uniqueKey, 
  restaurantreview_without_PKs,
  Entities
} from './entities.type';

export const prisma = new PrismaClient();

export const default_entities: Entities = {
  member: {
    /**
        * 创建member记录
        * @param data 包含所有字段的数据 (包括手动设置的主键)
        * @returns 创建的记录或null
        */
        Create: async (data: member): Promise<member | null> => {
            try {
                return await prisma.member.create({
                    data: data 
                });
            } catch (error) {
                console.error(`Error creating member:`, error);
                return null;
            }
        },

    /**
        * 根据主键获取记录
        * @param args 主键参数
        * @returns 记录或null
        */
        Get: async (args: member_uniqueKey): Promise<member | null> => {
            try {
                return await prisma.member.findUnique({
                    where: { id: args.id },
                });
            } catch (error) {
                console.error(`Error getting member:`, error);
                return null;
            }
        },

    /**
        * 获取所有记录
        * @param args 可选筛选条件 (类型: filtered_member)
        * @returns 记录数组
        */
        GetAll: async (args?: filtered_member): Promise<member[]> => {
            try {
                return await prisma.member.findMany({
                    where: args as any, 
                });
            } catch (error) {
                console.error(`Error getting all member:`, error);
                return [];
            }
        },

    /**
        * 分页获取记录
        * @param pageNumber 页码 (默认 1)
        * @param pageSize 每页大小 (默认 10)
        * @param args 可选筛选条件 (类型: filtered_member)
        * @returns 分页记录数组
        */
        GetPage: async (
            pageNumber: number = 1,
            pageSize: number = 10,
            args?: filtered_member
        ): Promise<member[]> => {
            try {
                const skip = (pageNumber - 1) * pageSize;
                return await prisma.member.findMany({
                    where: args as any, 
                    skip,
                    take: pageSize,
                });
            } catch (error) {
                console.error(`Error getting paged member:`, error);
                return [];
            }
        },

    /**
        * 统计记录数
        * @param args 可选筛选条件 (类型: filtered_member)
        * @returns 记录数量
        */
        Count: async (args?: filtered_member): Promise<number> => {
            try {
                return await prisma.member.count({
                    where: args as any, 
                });
            } catch (error) {
                console.error(`Error counting member:`, error);
                return 0;
            }
        },

    /**
        * 更新记录
        * @param args 包含主键 (where) 和更新数据 (data)
        * @returns 更新后的记录或null
        */
        Update: async (args: { where: member_uniqueKey; data: member_without_PKs }): Promise<member | null> => {
            try {
                return await prisma.member.update({
                    where: { id: args.where.id },
                    data: args.data 
                });
            } catch (error) {
                console.error(`Error updating member:`, error);
                return null;
            }
        },

    /**
        * 删除记录
        * @param args 主键参数
        * @returns 删除的记录或null
        */
        Delete: async (args: member_uniqueKey): Promise<member | null> => {
            try {
                return await prisma.member.delete({
                    where: { id: args.id },
                });
            } catch (error) {
                console.error(`Error deleting member:`, error);
                return null;
            }
        },  },
  restaurant: {
    /**
        * 创建restaurant记录
        * @param data 包含所有字段的数据 (包括手动设置的主键)
        * @returns 创建的记录或null
        */
        Create: async (data: restaurant): Promise<restaurant | null> => {
            try {
                return await prisma.restaurant.create({
                    data: data 
                });
            } catch (error) {
                console.error(`Error creating restaurant:`, error);
                return null;
            }
        },

    /**
        * 根据主键获取记录
        * @param args 主键参数
        * @returns 记录或null
        */
        Get: async (args: restaurant_uniqueKey): Promise<restaurant | null> => {
            try {
                return await prisma.restaurant.findUnique({
                    where: { id: args.id },
                });
            } catch (error) {
                console.error(`Error getting restaurant:`, error);
                return null;
            }
        },

    /**
        * 获取所有记录
        * @param args 可选筛选条件 (类型: filtered_restaurant)
        * @returns 记录数组
        */
        GetAll: async (args?: filtered_restaurant): Promise<restaurant[]> => {
            try {
                return await prisma.restaurant.findMany({
                    where: args as any, 
                });
            } catch (error) {
                console.error(`Error getting all restaurant:`, error);
                return [];
            }
        },

    /**
        * 分页获取记录
        * @param pageNumber 页码 (默认 1)
        * @param pageSize 每页大小 (默认 10)
        * @param args 可选筛选条件 (类型: filtered_restaurant)
        * @returns 分页记录数组
        */
        GetPage: async (
            pageNumber: number = 1,
            pageSize: number = 10,
            args?: filtered_restaurant
        ): Promise<restaurant[]> => {
            try {
                const skip = (pageNumber - 1) * pageSize;
                return await prisma.restaurant.findMany({
                    where: args as any, 
                    skip,
                    take: pageSize,
                });
            } catch (error) {
                console.error(`Error getting paged restaurant:`, error);
                return [];
            }
        },

    /**
        * 统计记录数
        * @param args 可选筛选条件 (类型: filtered_restaurant)
        * @returns 记录数量
        */
        Count: async (args?: filtered_restaurant): Promise<number> => {
            try {
                return await prisma.restaurant.count({
                    where: args as any, 
                });
            } catch (error) {
                console.error(`Error counting restaurant:`, error);
                return 0;
            }
        },

    /**
        * 更新记录
        * @param args 包含主键 (where) 和更新数据 (data)
        * @returns 更新后的记录或null
        */
        Update: async (args: { where: restaurant_uniqueKey; data: restaurant_without_PKs }): Promise<restaurant | null> => {
            try {
                return await prisma.restaurant.update({
                    where: { id: args.where.id },
                    data: args.data 
                });
            } catch (error) {
                console.error(`Error updating restaurant:`, error);
                return null;
            }
        },

    /**
        * 删除记录
        * @param args 主键参数
        * @returns 删除的记录或null
        */
        Delete: async (args: restaurant_uniqueKey): Promise<restaurant | null> => {
            try {
                return await prisma.restaurant.delete({
                    where: { id: args.id },
                });
            } catch (error) {
                console.error(`Error deleting restaurant:`, error);
                return null;
            }
        },  },
  restaurantphoto: {
    /**
        * 创建restaurantphoto记录
        * @param data 包含所有字段的数据 (包括手动设置的主键)
        * @returns 创建的记录或null
        */
        Create: async (data: restaurantphoto): Promise<restaurantphoto | null> => {
            try {
                return await prisma.restaurantphoto.create({
                    data: data 
                });
            } catch (error) {
                console.error(`Error creating restaurantphoto:`, error);
                return null;
            }
        },

    /**
        * 根据主键获取记录
        * @param args 主键参数
        * @returns 记录或null
        */
        Get: async (args: restaurantphoto_uniqueKey): Promise<restaurantphoto | null> => {
            try {
                return await prisma.restaurantphoto.findUnique({
                    where: { id: args.id },
                });
            } catch (error) {
                console.error(`Error getting restaurantphoto:`, error);
                return null;
            }
        },

    /**
        * 获取所有记录
        * @param args 可选筛选条件 (类型: filtered_restaurantphoto)
        * @returns 记录数组
        */
        GetAll: async (args?: filtered_restaurantphoto): Promise<restaurantphoto[]> => {
            try {
                return await prisma.restaurantphoto.findMany({
                    where: args as any, 
                });
            } catch (error) {
                console.error(`Error getting all restaurantphoto:`, error);
                return [];
            }
        },

    /**
        * 分页获取记录
        * @param pageNumber 页码 (默认 1)
        * @param pageSize 每页大小 (默认 10)
        * @param args 可选筛选条件 (类型: filtered_restaurantphoto)
        * @returns 分页记录数组
        */
        GetPage: async (
            pageNumber: number = 1,
            pageSize: number = 10,
            args?: filtered_restaurantphoto
        ): Promise<restaurantphoto[]> => {
            try {
                const skip = (pageNumber - 1) * pageSize;
                return await prisma.restaurantphoto.findMany({
                    where: args as any, 
                    skip,
                    take: pageSize,
                });
            } catch (error) {
                console.error(`Error getting paged restaurantphoto:`, error);
                return [];
            }
        },

    /**
        * 统计记录数
        * @param args 可选筛选条件 (类型: filtered_restaurantphoto)
        * @returns 记录数量
        */
        Count: async (args?: filtered_restaurantphoto): Promise<number> => {
            try {
                return await prisma.restaurantphoto.count({
                    where: args as any, 
                });
            } catch (error) {
                console.error(`Error counting restaurantphoto:`, error);
                return 0;
            }
        },

    /**
        * 更新记录
        * @param args 包含主键 (where) 和更新数据 (data)
        * @returns 更新后的记录或null
        */
        Update: async (args: { where: restaurantphoto_uniqueKey; data: restaurantphoto_without_PKs }): Promise<restaurantphoto | null> => {
            try {
                return await prisma.restaurantphoto.update({
                    where: { id: args.where.id },
                    data: args.data 
                });
            } catch (error) {
                console.error(`Error updating restaurantphoto:`, error);
                return null;
            }
        },

    /**
        * 删除记录
        * @param args 主键参数
        * @returns 删除的记录或null
        */
        Delete: async (args: restaurantphoto_uniqueKey): Promise<restaurantphoto | null> => {
            try {
                return await prisma.restaurantphoto.delete({
                    where: { id: args.id },
                });
            } catch (error) {
                console.error(`Error deleting restaurantphoto:`, error);
                return null;
            }
        },  },
  restaurantreview: {
    /**
        * 创建restaurantreview记录
        * @param data 包含所有字段的数据 (包括手动设置的主键)
        * @returns 创建的记录或null
        */
        Create: async (data: restaurantreview): Promise<restaurantreview | null> => {
            try {
                return await prisma.restaurantreview.create({
                    data: data 
                });
            } catch (error) {
                console.error(`Error creating restaurantreview:`, error);
                return null;
            }
        },

    /**
        * 根据主键获取记录
        * @param args 主键参数
        * @returns 记录或null
        */
        Get: async (args: restaurantreview_uniqueKey): Promise<restaurantreview | null> => {
            try {
                return await prisma.restaurantreview.findUnique({
                    where: { id: args.id },
                });
            } catch (error) {
                console.error(`Error getting restaurantreview:`, error);
                return null;
            }
        },

    /**
        * 获取所有记录
        * @param args 可选筛选条件 (类型: filtered_restaurantreview)
        * @returns 记录数组
        */
        GetAll: async (args?: filtered_restaurantreview): Promise<restaurantreview[]> => {
            try {
                return await prisma.restaurantreview.findMany({
                    where: args as any, 
                });
            } catch (error) {
                console.error(`Error getting all restaurantreview:`, error);
                return [];
            }
        },

    /**
        * 分页获取记录
        * @param pageNumber 页码 (默认 1)
        * @param pageSize 每页大小 (默认 10)
        * @param args 可选筛选条件 (类型: filtered_restaurantreview)
        * @returns 分页记录数组
        */
        GetPage: async (
            pageNumber: number = 1,
            pageSize: number = 10,
            args?: filtered_restaurantreview
        ): Promise<restaurantreview[]> => {
            try {
                const skip = (pageNumber - 1) * pageSize;
                return await prisma.restaurantreview.findMany({
                    where: args as any, 
                    skip,
                    take: pageSize,
                });
            } catch (error) {
                console.error(`Error getting paged restaurantreview:`, error);
                return [];
            }
        },

    /**
        * 统计记录数
        * @param args 可选筛选条件 (类型: filtered_restaurantreview)
        * @returns 记录数量
        */
        Count: async (args?: filtered_restaurantreview): Promise<number> => {
            try {
                return await prisma.restaurantreview.count({
                    where: args as any, 
                });
            } catch (error) {
                console.error(`Error counting restaurantreview:`, error);
                return 0;
            }
        },

    /**
        * 更新记录
        * @param args 包含主键 (where) 和更新数据 (data)
        * @returns 更新后的记录或null
        */
        Update: async (args: { where: restaurantreview_uniqueKey; data: restaurantreview_without_PKs }): Promise<restaurantreview | null> => {
            try {
                return await prisma.restaurantreview.update({
                    where: { id: args.where.id },
                    data: args.data 
                });
            } catch (error) {
                console.error(`Error updating restaurantreview:`, error);
                return null;
            }
        },

    /**
        * 删除记录
        * @param args 主键参数
        * @returns 删除的记录或null
        */
        Delete: async (args: restaurantreview_uniqueKey): Promise<restaurantreview | null> => {
            try {
                return await prisma.restaurantreview.delete({
                    where: { id: args.id },
                });
            } catch (error) {
                console.error(`Error deleting restaurantreview:`, error);
                return null;
            }
        },  },
  restauranthour: {
    /**
        * 创建restauranthour记录
        * @param data 包含所有字段的数据 (包括手动设置的主键)
        * @returns 创建的记录或null
        */
        Create: async (data: restauranthour): Promise<restauranthour | null> => {
            try {
                return await prisma.restauranthour.create({
                    data: data 
                });
            } catch (error) {
                console.error(`Error creating restauranthour:`, error);
                return null;
            }
        },

    /**
        * 根据主键获取记录
        * @param args 主键参数
        * @returns 记录或null
        */
        Get: async (args: restauranthour_uniqueKey): Promise<restauranthour | null> => {
            try {
                return await prisma.restauranthour.findUnique({
                    where: { id: args.id },
                });
            } catch (error) {
                console.error(`Error getting restauranthour:`, error);
                return null;
            }
        },

    /**
        * 获取所有记录
        * @param args 可选筛选条件 (类型: filtered_restauranthour)
        * @returns 记录数组
        */
        GetAll: async (args?: filtered_restauranthour): Promise<restauranthour[]> => {
            try {
                return await prisma.restauranthour.findMany({
                    where: args as any, 
                });
            } catch (error) {
                console.error(`Error getting all restauranthour:`, error);
                return [];
            }
        },

    /**
        * 分页获取记录
        * @param pageNumber 页码 (默认 1)
        * @param pageSize 每页大小 (默认 10)
        * @param args 可选筛选条件 (类型: filtered_restauranthour)
        * @returns 分页记录数组
        */
        GetPage: async (
            pageNumber: number = 1,
            pageSize: number = 10,
            args?: filtered_restauranthour
        ): Promise<restauranthour[]> => {
            try {
                const skip = (pageNumber - 1) * pageSize;
                return await prisma.restauranthour.findMany({
                    where: args as any, 
                    skip,
                    take: pageSize,
                });
            } catch (error) {
                console.error(`Error getting paged restauranthour:`, error);
                return [];
            }
        },

    /**
        * 统计记录数
        * @param args 可选筛选条件 (类型: filtered_restauranthour)
        * @returns 记录数量
        */
        Count: async (args?: filtered_restauranthour): Promise<number> => {
            try {
                return await prisma.restauranthour.count({
                    where: args as any, 
                });
            } catch (error) {
                console.error(`Error counting restauranthour:`, error);
                return 0;
            }
        },

    /**
        * 更新记录
        * @param args 包含主键 (where) 和更新数据 (data)
        * @returns 更新后的记录或null
        */
        Update: async (args: { where: restauranthour_uniqueKey; data: restauranthour_without_PKs }): Promise<restauranthour | null> => {
            try {
                return await prisma.restauranthour.update({
                    where: { id: args.where.id },
                    data: args.data 
                });
            } catch (error) {
                console.error(`Error updating restauranthour:`, error);
                return null;
            }
        },

    /**
        * 删除记录
        * @param args 主键参数
        * @returns 删除的记录或null
        */
        Delete: async (args: restauranthour_uniqueKey): Promise<restauranthour | null> => {
            try {
                return await prisma.restauranthour.delete({
                    where: { id: args.id },
                });
            } catch (error) {
                console.error(`Error deleting restauranthour:`, error);
                return null;
            }
        },  },
};
