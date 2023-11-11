// 平台属性管理模块的请求文件
import request from '@/utils/request'

// 获取一级分类数据的接口  /admin/product/getCategory1 get
export const reqCategory1List = ()=> request({url:'/admin/product/getCategory1',method:'get'})

// 获取二级分类数据的接口  /admin/product/getCategory2/{category1Id}  get
export const reqCategory2List = (category1Id)=> request({url:`/admin/product/getCategory2/${category1Id}`,method:'get'})

// 获取三级分类数据的接口  /admin/product/getCategory3/{category2Id} get
export const reqCategory3List = (category2Id)=> request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'})

// 获取平台数据的接口  /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} get
export const reqAttrList = (category1Id,category2Id,category3Id)=> request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

// 添加属性与属性值或者修改属性与属性值的接口  /admin/product/saveAttrInfo post
export const reqAddAttrorUpdateAttr = (data)=> request({url:'/admin/product/saveAttrInfo',method:'post',data})
/* 
{
  "attrName": "string",  属性名
  "attrValueList": [     属性名对应所有的属性值，属性值可以是多个，因此需要的是数组
    {
      "attrId": 0,       属性的id
      "valueName": "string"     属性值
    }
  ],
  "categoryId": 0,       category3id
  "categoryLevel": 3,    区分几级id
}
*/

// 删除商品平台属性接口   /admin/product/deleteAttr/{attrId} delete
export const reqDeleteAttr = (attrId)=>request({url:`/admin/product/deleteAttr/${attrId}`,method:'delete'})