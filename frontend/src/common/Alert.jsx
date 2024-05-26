import { toast } from 'react-toastify';

const showToast = (type, message, id,pos='BOTTOM_RIGHT') => {
  const isActive = toast.isActive(message);

  if (!isActive) {
  toast[type](message, {
      position: toast.POSITION[pos],
      toastId: id,
    });
  }
};

export { showToast };
