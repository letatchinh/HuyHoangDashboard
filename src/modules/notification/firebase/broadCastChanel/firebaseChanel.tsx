import { Button, notification } from "antd";
import { get } from "lodash";
import { useEffect, useMemo } from "react";

export const postMessageNewWhBillFirebase = (payload: any) => {
  const bc_firebase_chanel = new BroadcastChannel("bc_firebase_chanel");
    bc_firebase_chanel.postMessage(payload);
    bc_firebase_chanel.close();
}
export const useOnMessageNewWhBillFirebase = (callback: any) => {
  useEffect(() => {
    const bc_firebase_chanel_listen = new BroadcastChannel("bc_firebase_chanel");
    bc_firebase_chanel_listen.onmessage = (ev) => {
        notification.destroy();
        const data = ev?.data;
        notification.info({
          message: get(data,'title',''),
          description:get(data,'body',''),
          placement:'bottomLeft',
          duration : 5000,
          onClick: () => {
            console.log(data,'data')
            window.open(get(data,'data.url'));
            notification.destroy();
          },
          className : 'custom-notification'
        });
        setTimeout(() => {
           notification.destroy();
        }, 10000);
        if(callback && typeof callback === 'function'){
          callback()
        }
    }
    bc_firebase_chanel_listen.onmessageerror = (ev) => {
    }
    },[])
};


