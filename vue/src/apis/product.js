import request from "./request";

//获取商品列表
export function getProductList(query) {
  return request({
    url: "/productList",
    method: "get",
    params: query,
  });
}

//获取所有用户创建的商品类型
export function getAlluserTypeList(query) {
  return request({
    url: "/getAlluserTypeList",
    method: "get",
    params: query,
  });
}

//获取所有用户创建的商品
export function getAlluserProductList(query) {
  return request({
    url: "/getAlluserProductList",
    method: "get",
    params: query,
  });
}

//获取类型列表
export function userTypeList(query) {
  return request({
    url: '/typeList',
    method: 'get',
    params: query
  })
}
//获取商品类型
export function getType(query) {
  return request({
    url: '/type',
    method: 'get',
    params: query
  })
}
//根据商品id查询商品数据
export function getProductById(query) {
  return request({
    url: '/product',
    method: 'get',
    params: query
  })
}

//创建商品
export function postProduct(data) {
  return request({
    url: '/postProduct',
    method: 'post',
    data: data
  })
}

//修改商品上下架状态
export function updateProductStatus(data) {
  return request({
    url: '/updateProductStatus',
    method: 'post',
    data: data
  })
}
//删除商品
export function removeProduct(data) {
  return request({
    url: '/removeProduct',
    method: 'post',
    data: data
  })
}


//创建商品类型
export function createType(data) {
  return request({
    url: '/createType',
    method: 'post',
    data: data
  })
}

// 上传图片
export function uploadImages(data) {
  return request({
    url: '/uploadImages',
    method: 'post',
    data: data
  })
}
