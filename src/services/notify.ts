export type NotifyTone = "success" | "error" | "warning" | "info";

export type NotifyInput = {
  tone?: NotifyTone;
  title?: string;
  autoClose?: number | false;
  id?: string;
};

export type TNotification = {
  id: string;
  tone: NotifyTone;
  message: string;
  title?: string;
  autoClose: number | false;
};

const DEFAULT_AUTO_CLOSE = 3000;

let notifications: TNotification[] = [];
let counter = 0;

const listeners = new Set<() => void>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

const emit = () => {
  listeners.forEach((listener) => listener());
};

const startTimer = (id: string, autoClose: number | false) => {
  const activeTimer = timers.get(id);

  if (activeTimer) {
    clearTimeout(activeTimer);
    timers.delete(id);
  }

  if (autoClose === false) {
    return;
  }

  timers.set(
    id,
    setTimeout(() => {
      timers.delete(id);
      hideNotification(id);
    }, autoClose),
  );
};

const showNotification = (message: string, input: NotifyInput = {}) => {
  counter += 1;

  const id = input.id ?? `notification-${counter}`;
  const autoClose = input.autoClose ?? DEFAULT_AUTO_CLOSE;
  const notification: TNotification = {
    id,
    message,
    tone: input.tone ?? "info",
    autoClose,
  };

  if (input.title !== undefined) {
    notification.title = input.title;
  }

  const isUpdate = notifications.some((item) => item.id === id);

  notifications = isUpdate
    ? notifications.map((item) => (item.id === id ? notification : item))
    : [...notifications, notification];

  startTimer(id, autoClose);
  emit();

  return id;
};

const hideNotification = (id: string) => {
  const activeTimer = timers.get(id);

  if (activeTimer) {
    clearTimeout(activeTimer);
    timers.delete(id);
  }

  notifications = notifications.filter((item) => item.id !== id);
  emit();
};

const cleanNotifications = () => {
  timers.forEach((timer) => clearTimeout(timer));
  timers.clear();
  notifications = [];
  emit();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const getNotifications = () => notifications;

export const notify = {
  show: showNotification,
  hide: hideNotification,
  clean: cleanNotifications,
  subscribe,
  getNotifications,
  success: (message: string, input: NotifyInput = {}) =>
    showNotification(message, { ...input, tone: "success" }),
  error: (message: string, input: NotifyInput = {}) =>
    showNotification(message, { ...input, tone: "error" }),
  warning: (message: string, input: NotifyInput = {}) =>
    showNotification(message, { ...input, tone: "warning" }),
  info: (message: string, input: NotifyInput = {}) =>
    showNotification(message, { ...input, tone: "info" }),
};
