//用户登录状态
// 10002 用户不存在-注册
// 10003 参数不正确-退出app
// 10004 未付费用户 -付费
// 10005 服务已经到期-付费
// 10006 未授权登陆-退出app
export const login_status_notExist ='10002'
export const login_status_errParams ='10003'
export const login_status_pendingPay ='10004'
export const login_status_outOfDate ='10005'
export const login_status_unAuthorize ='10006'