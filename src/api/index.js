// 将四个模块请求的接口函数统一暴露
import  * as trademark from './product/trademark'
import * as attr from './product/attr'
import * as sku from './product/sku'
import * as spu from './product/spu'

// 对外暴露
export default {
    attr,
    trademark,
    sku,
    spu
}