/**
 * Created by lixiwei on 2018/4/22.
 */
import React, { Component } from 'react';
import {Modal} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn', {
    meridiem : function (hour, minute, isLowercase) {
        if (hour < 9) {
            return "早上";
        } else if (hour < 11 && minute < 30) {
            return "上午";
        } else if (hour < 13 && minute < 30) {
            return "中午";
        } else if (hour < 18) {
            return "下午";
        } else {
            return "晚上";
        }
    }
});

export const dateFormat = "YYYY/MM/DD ahh:mm";

export function getTaskState(task) {
    const state = [(task.content ? 'notNull' : 'null'),task.stat,task.role,task.flag].join(";");
    switch (state) {
        case 'null;0;2;0':
            return '待安排';
        case 'null;0;2;1':
            return '待初审';
        case 'null;0;3;0':
            return '待初审';
        case 'null;0;3;1':
            return '初审通过';
        case 'null;2;3;1':
            return '不通过';
        case 'null;2;1;1':
            return '不通过';
        case 'null;4;3;0':
            return '缴费安排';
        case 'null;4;3;1':
            return '待缴审稿费';
        case 'null;6;1;0':
            return '待缴审稿费';
        case 'null;6;1;1':
            return '审稿费审核';
        case 'null;6;3;0':
            return '审稿费审核';
        case 'null;6;3;1':
            return '待分配';
        case 'null;1;3;0':
            return '待分配';
        case 'null;1;3;1':
            return '审阅中';
        case 'null;1;4;0':
            return '审阅中';
        case 'notNull;2;4;1':
            return '已审阅';
        case 'notNull;4;4;1':
            return '已审阅';
        case 'notNull;1;3;0':
            return '已审阅';
        case 'notNull;1;3;1':
            return '审阅通过';
        case 'notNull;2;3;1':
            return '不通过';
        case 'notNull;3;3;1':
            return '待修改';
        case 'notNull;3;1;0':
            return '待修改';
        case 'notNull;3;1;1':
            return '重审分配';
        case 'null;7;3;0':
            return '重审分配';
        case 'null;7;3;1':
            return '审阅中';
        case 'null;7;4;0':
            return '审阅中';
        case 'notNull;7;3;0':
            return '已审阅';
        case 'notNull;7;3;1':
            return '格式修改';
        case 'notNull;5;3;0':
            return '格式修改';
        case 'notNull;5;3;1':
            return '修改确认';
        case 'notNull;5;1;0':
            return '修改确认';
        case 'notNull;5;1;1':
            return '缴费安排';
        case 'notNull;2;1;1':
            return '格式修改';
        case 'notNull;4;3;0':
            return '缴费安排';
        case 'notNull;4;3;1':
            return '待缴版面费';
        case 'notNull;4;1;0':
            return '待缴版面费';
        case 'notNull;6;1;1':
            return '版面费审核';
        case 'notNull;6;3;0':
            return '版面费审核';
        case 'notNull;6;3;1':
            return '待排期';
        case 'notNull;6;2;0':
            return '待排期';
        case 'notNull;6;2;1':
            return '已排期发表';
        default:
            return '未知';
    }
}

export function getInvoiceState(task) {
    const state = [(task.content ? 'notNull' : 'null'),task.stat,task.role,task.flag].join(";");
    switch (state) {
        case 'null;0;2;0':
            return '待安排';
        case 'null;0;2;1':
            return '待初审';
        case 'null;0;3;0':
            return '待初审';
        case 'null;0;3;1':
            return '初审通过';
        case 'null;2;3;1':
            return '不通过';
        case 'null;2;1;1':
            return '不通过';
        case 'null;4;3;0':
            return '缴费安排';
        case 'null;4;3;1':
            return '待缴审稿费';
        case 'null;6;1;0':
            return '待缴审稿费';
        case 'null;6;1;1':
            return '审稿费审核';
        case 'null;6;3;0':
            return '审稿费审核';
        case 'notNull;5;1;1':
            return '缴费安排';
        case 'notNull;2;1;1':
            return '格式修改';
        case 'notNull;4;3;0':
            return '缴费安排';
        case 'notNull;4;3;1':
            return '待缴版面费';
        case 'notNull;4;1;0':
            return '待缴版面费';
        case 'notNull;6;1;1':
            return '版面费审核';
        case 'notNull;6;3;0':
            return '版面费审核';
        default:
            return '缴费通过';
    }
}

export function downloadFile(task,type) {
    switch (type){
        case 0:
            window.location.href = '/contribute/download/id='+task.id+'&type='+0;
            break;
        case 1:
            window.location.href = '/contribute/download/id='+task.id+'&type='+1;
            break;
        case 2:
            window.location.href = '/contribute/download/id='+task.id+'&type='+2;
            break;
        default:
            break;
    }
}

export function info(title,content,isDownload) {
    if(isDownload){
        Modal.info({
            title: title,
            content: (
                <ul>
                    <li><a onClick={() => downloadFile(content.task,0)}>稿件</a></li>
                    {content.article.format.split(";")[1].length > 1?<li><a onClick={() => downloadFile(content.task,1)}>附件</a></li>:null}
                </ul>
            ),
            okText: '关闭',
            onOk() {
            },
        });
    }else {
        Modal.info({
            title: title,
            content: (
                <div>
                    <p>{content}</p>
                </div>
            ),
            okText: '确定',
            onOk() {
            },
        });
    }
}

export function error(title,content) {
    Modal.error({
        okText: '确定',
        title: title,
        content:content
    });
}

export function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

export function toFixedTwo(time) {
    if(time<10){
        return parseInt("0"+time);
    }else{
        return time;
    }
}

export function setTimeFormat(date) {
    return date.getFullYear()+"-"+toFixedTwo(date.getMonth()+1)+"-"+toFixedTwo(date.getDate())+" "+toFixedTwo(date.getHours())+":"+toFixedTwo(date.getMinutes())+":"+toFixedTwo(date.getSeconds())
}

export function setDateFormat(date) {
    return moment(date).format(dateFormat);
}



