import { notification } from "antd";
import { createContext, useContext, useCallback } from "react";
import { ArgsProps } from "antd/es/notification/interface";
type NotificationType = "success" | "info" | "warning" | "error";

type onNotifyType = {
  success : (message?: string,options? : ArgsProps) => void
  error : (message?: string,options? : ArgsProps) => void
  warning : (message?: string,options? : ArgsProps) => void
  info : (message?: string,options? : ArgsProps) => void
}
export type GlobalNotification = {
  onNotify: onNotifyType | null;
};

const Notification = createContext<GlobalNotification>({
  onNotify: null,
});

export function NotificationProvider({
  children,
}: {
  children: React.JSX.Element;
}): React.JSX.Element {
  const [msg, contextHolder] = notification.useNotification();


  const success : any  = useCallback((message?: string,moreOptions? : ArgsProps) => {
    const options : ArgsProps = {
      message,
      ...moreOptions,
    }
    return msg.success(options);
  },[notification])
  const error : any = useCallback((message?: string,moreOptions? : ArgsProps) => {
    const options : ArgsProps = {
      message,
      ...moreOptions,
    }
    msg.error(options);
  },[notification])
  const warning : any = useCallback((message?: string,moreOptions? : ArgsProps) => {
    const options : ArgsProps = {
      message,
      ...moreOptions,
    }
    msg.warning(options);
  },[notification])
  const info : any = useCallback((message?: string,moreOptions? : ArgsProps) => {
    const options : ArgsProps = {
      message,
      ...moreOptions,
    }
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
