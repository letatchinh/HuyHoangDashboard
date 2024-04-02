import { notification } from "antd";
import { createContext, useContext, useCallback } from "react";
import { ArgsProps } from "antd/es/notification/interface";
type NotificationType = "success" | "info" | "warning" | "error";

interface OptionsNotification extends Omit<ArgsProps,"message">{

}

type onNotifyType = {
  success : (message?: string,options? : OptionsNotification) => void
  error : (message?: string,options? : OptionsNotification) => void
  warning : (message?: string,options? : OptionsNotification) => void
  info : (message?: string,options? : OptionsNotification) => void
}

export type GlobalNotification = {
  onNotify: onNotifyType | null;
};

const Notification = createContext<GlobalNotification>({
  onNotify: null,
});

const defaultOptions : OptionsNotification = {
  placement : 'bottomRight'
};


export function NotificationProvider({
  children,
}: {
  children: React.JSX.Element;
}): React.JSX.Element {
  const [msg, contextHolder] = notification.useNotification();


  const success : any  = useCallback((message?: string,moreOptions? : OptionsNotification) => {
    const options : ArgsProps = {
      message,
      ...defaultOptions,
      ...moreOptions,
    };
    // Destroy Before Call to Notification To Prevent MultiNotification
    msg.destroy();
    return msg.success(options);
  },[notification])
  const error : any = useCallback((message?: string,moreOptions? : OptionsNotification) => {
    const options : ArgsProps = {
      message,
      ...defaultOptions,
      ...moreOptions,
    }
    // Destroy Before Call to Notification To Prevent MultiNotification
    msg.destroy();
    msg.error(options);
  },[notification])
  const warning : any = useCallback((message?: string,moreOptions? : OptionsNotification) => {
    const options : ArgsProps = {
      message,
      ...defaultOptions,
      ...moreOptions,
    }
    // Destroy Before Call to Notification To Prevent MultiNotification
    msg.destroy();
    msg.warning(options);
  },[notification])
  const info : any = useCallback((message?: string,moreOptions? : OptionsNotification) => {
    const options : ArgsProps = {
      message,
      ...defaultOptions,
      ...moreOptions,
    }
    // Destroy Before Call to Notification To Prevent MultiNotification
    msg.destroy();
    msg.info(options);
  },[notification])
  const onNotify : onNotifyType = {
      success,
      error,
      warning,
      info,
    }
  
  return (
    <Notification.Provider value={{ onNotify }}>
      {children}
      {contextHolder}
    </Notification.Provider>
  );
}

const useNotificationStore = (): GlobalNotification => useContext(Notification);

export default useNotificationStore;
