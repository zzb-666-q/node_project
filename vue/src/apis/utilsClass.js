import request from "./request";

//获取所有图片
export function getImageName() {
    return request({
        url: "/getImageName",
        method: "get",
    });
}

// 上传图片
export function uploadImages(data) {
    return request({
        url: '/uploadImages',
        method: 'post',
        data: data
    })
}