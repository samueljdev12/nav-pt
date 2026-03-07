import Toast from 'react-native-toast-message';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  duration?: number;
  position?: 'top' | 'bottom';
}

class ToastService {
  private static instance: ToastService;

  private constructor() {}

  public static getInstance(): ToastService {
    if (!ToastService.instance) {
      ToastService.instance = new ToastService();
    }
    return ToastService.instance;
  }

  /**
   * Show success toast
   */
  public success(message: string, options?: ToastOptions): void {
    Toast.show({
      type: 'success',
      text1: message,
      duration: options?.duration || 3000,
      position: options?.position || 'bottom',
      visibilityTime: options?.duration || 3000,
    });
  }

  /**
   * Show error toast
   */
  public error(message: string, options?: ToastOptions): void {
    Toast.show({
      type: 'error',
      text1: message,
      duration: options?.duration || 3000,
      position: options?.position || 'bottom',
      visibilityTime: options?.duration || 3000,
    });
  }

  /**
   * Show info toast
   */
  public info(message: string, options?: ToastOptions): void {
    Toast.show({
      type: 'info',
      text1: message,
      duration: options?.duration || 3000,
      position: options?.position || 'bottom',
      visibilityTime: options?.duration || 3000,
    });
  }

  /**
   * Show warning toast
   */
  public warning(message: string, options?: ToastOptions): void {
    Toast.show({
      type: 'warning',
      text1: message,
      duration: options?.duration || 3000,
      position: options?.position || 'bottom',
      visibilityTime: options?.duration || 3000,
    });
  }

  /**
   * Hide all toasts
   */
  public hide(): void {
    Toast.hide();
  }
}

export const toastService = ToastService.getInstance();
export default toastService;
