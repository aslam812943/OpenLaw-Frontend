// src/utils/showToast.ts
import Toastify from 'toastify-js';


export function showToast(type: 'success' | 'error' | 'warning', message: string) {
  let sign = '';

  switch(type) {
    case 'success':
      sign = '✔️';
      break;
    case 'error':
      sign = '✖️';
      break;
    case 'warning':
      sign = '❕❕';
      break;
  }

  Toastify({
    text: `${sign} ${message}`,
    duration: 3000,
    close: true,
    gravity: 'bottom',
    position: 'center',
    stopOnFocus: true,
    style: {
      background: "rgba(0, 0, 0, 0.9)",
      color: "#fff",
      borderRadius: "10px",
      border: "1px solid #fff",
      boxShadow: "0px 4px 12px rgba(255, 255, 255, 0.2)",
      fontSize: "14px",
      padding: "12px 15px"
    }
  }).showToast();
}
