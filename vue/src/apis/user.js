import request from './request'
//用户列表
export function getUserlist(query) {
  return request({
    url: '/findUserList',
    method: 'get',
    params: query
  })
}
//用户登录
export function userLogin(data) {
  return request({
    url: '/login',
    method: 'post',
    data: data
  })
}

//用户列表
export function getuserInfo() {
  return request({
    url: '/userInfo',
    method: 'get',
  })
}
// 发送验证码
export function sendValidCode(data) {
  return request({
    url: '/sendValidCode',
    method: 'post',
    data: data
  })
}

// 注册用户
export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data: data
  })
}




//退出登录
export function loginOut() {
  return request({
    url: "/loginOut",
    method: "get",
  });
}