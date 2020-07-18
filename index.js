#!/usr/bin/env node

const {
  LiveWS,
  LiveTCP,
  KeepLiveWS,
  KeepLiveTCP,
} = require("bilibili-live-ws");

const notifier = require("node-notifier");

let roomid = Number(process.argv[2]);

const live = new LiveWS(roomid);

live.on("open", () => console.log("已经连接上直播间" + roomid));

live.on("live", () => {
  live.on("heartbeat", (online) => {
    console.log("当前人气值为：" + online);
  });

  live.on("msg", (data) => {
    switch (data.cmd) {
      case "DANMU_MSG":
        userName = data.info[2][1];
        danmu = data.info[1];
        console.log(`${userName}: ${danmu}`);
        notifier.notify({
          title: "弹幕",
          message: `${userName}: ${danmu}`,
        });
        break;
      case "SEND_GIFT":
        giftName = data.data.giftName;
        userName = data.data.uname;
        giftNum = data.data.num;
        userAction = data.data.action;
        let prtStr = `${userName} ${userAction} ${giftNum} 个 ${giftName}`;
        console.log(prtStr);
        notifier.notify({
          title: "礼物",
          message: prtStr,
        });
        break;
      case "WELCOME":
        console.log(`欢迎 ${data.data.uname}`);
        break;
      default:
      //console.log(data);
    }
  });
});
