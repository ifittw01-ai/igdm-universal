import { useEffect } from 'react';

function NotificationManager() {
  useEffect(() => {
    // 请求通知权限
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }

    // 监听页面标题变化（新消息通知）
    let lastTitle = document.title;
    const observer = new MutationObserver(() => {
      if (document.title !== lastTitle) {
        lastTitle = document.title;
        
        // 检测是否有新消息（Instagram 会在标题中显示消息数量）
        const match = document.title.match(/\((\d+)\)/);
        if (match && Notification.permission === 'granted') {
          const count = parseInt(match[1]);
          if (count > 0) {
            new Notification('IGDM - 新消息', {
              body: `您有 ${count} 条新消息`,
              icon: '/icon.png',
              badge: '/icon.png',
              tag: 'igdm-notification'
            });
          }
        }
      }
    });

    observer.observe(document.querySelector('title'), {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => observer.disconnect();
  }, []);

  return null; // 这是一个无UI的后台组件
}

export default NotificationManager;

