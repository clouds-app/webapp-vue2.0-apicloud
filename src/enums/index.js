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


 //LineStatus 当前生成线状态 0：离线，1：待产，2：在产，3：停机
 export const line_status_offLine ='0'
 export const line_status_pendding ='1'
 export const line_status_working ='2'
 export const line_status_stop ='3'

//返回生产状态描述
 export const getLineStatus = (line_status_num) =>{
        switch(line_status_num){
            case line_status_offLine :
                return '离线'
            case line_status_pendding :
                return '待产'
            case line_status_working :
                return '在产'
            case line_status_stop :
                return '停机'
        }
 }
