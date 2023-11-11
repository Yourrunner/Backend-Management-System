// 这个模块主要获取的是品牌管理数据
import request from '@/utils/request'
// 获取品牌列表的接口
// /admin/product/baseTrademark/{page}/{limit}
export const reqTrademark = (page,limit)=>request.get(`/admin/product/baseTrademark/${page}/${limit}`)

// 处理添加品牌的操作  /admin/product/baseTrademark/save  post 请求  携带两个参数:品牌名称,品牌logo
// 切记对于新增的品牌不需要给服务器传递ID 这个是由服务器生成的

// 修改品牌的操作 /admin/product/baseTrademark/update put请求  携带三个参数  品牌的id,品牌名称,品牌logo
// 切记对于修改某一个品牌的操作,前端携带的参数需要带上id,需要告诉服务器要修改的时哪一个品牌

export const reqAddOrUpdateTradeMark = (tradeMark)=> {
    // 带给服务器的数据里面有id 就是更新品牌
    if(tradeMark.id){
        return request({url:'/admin/product/baseTrademark/update',method:'put',data:tradeMark})
    }else{
        // 新增品牌
        return request({url:'/admin/product/baseTrademark/save',method:'post',data:tradeMark})
    }
}

// 删除品牌  /admin/product/baseTrademark/remove/{id}
export const reqDeletTradeMark = (id)=>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})