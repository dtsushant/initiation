import { toast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.dismiss();
    toast.success(message, {
      ...defaultOptions,
      ...options,
      theme: 'colored',
      className: 'bg-emeraldgreen-5',
    });
  },
  error: (message: string, options?: ToastOptions) => {
    toast.dismiss();
    toast.error(message, {
      ...defaultOptions,
      ...options,
      theme: 'colored',
      className: 'bg-ferrarired-5',
    });
  },
  info: (message: string, options?: ToastOptions) => {
    toast.dismiss();
    toast.info(message, { ...defaultOptions, ...options });
  },
  warning: (message: string, options?: ToastOptions) => {
    toast.dismiss();
    toast.warning(message, { ...defaultOptions, ...options });
  },
};
