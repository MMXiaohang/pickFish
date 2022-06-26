const {getCommentList} = require("./api");
const {commentSet} = require("./commentSet");
const CronJob = require('cron').CronJob;

const createJob = (socket) => {
    // 创建定时任务
    const job = new CronJob(
        // cron表达式
        '0/5 * * * * * ',
        async function() {
            const data = await getCommentList(1);
            // 没发送过的数据
            const canSendDataList = [];
            console.log(data);
            for(const reply of data.dataList){
                // 已经发送过了，不处理
                if(!commentSet[reply.rpid]){
                    canSendDataList.push(reply);
                    commentSet[reply.rpid] = reply;
                }
            }
            socket.broadcast.emit('sendData', {
                ...data,  // 之前的
                dataList:canSendDataList  // 这一次请求新添加的
            }); // 触发sendData事件
        },
        null,
        true,
        'America/Los_Angeles'
    );
    job.start()
}

module.exports = {
    createJob
}