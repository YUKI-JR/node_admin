import request from "@/utils/request";
var token = sessionStorage.getItem("token");
require("fs")

// 根据Id查询单只鸽子
export function getOnePigeon(id) {
  return request({
    url: "/pigeonInfo/getOne",
    method: "get",
    params: {
      id: id,
    },
    headers: {
      token: token,
    },
  });
}

