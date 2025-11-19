const { app, BrowserWindow, Menu, shell, session } = require('electron');
const path = require('path');

let mainWindow;
let accounts = []; // 存储账户会话

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      partition: 'persist:instagram', // 持久化 session
    },
    backgroundColor: '#fafafa',
    show: false,
    titleBarStyle: 'default',
    frame: true
  });

  // 直接加载 Instagram DM
  mainWindow.loadURL('https://www.instagram.com/direct/inbox/');

  // 设置用户代理为桌面版
  mainWindow.webContents.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // 处理外部链接
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Instagram 内部链接在当前窗口打开
    if (url.includes('instagram.com')) {
      return { action: 'allow' };
    }
    // 其他链接在浏览器打开
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // 开发模式打开 DevTools
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  createMenu();

  // 监听页面标题变化（新消息通知）
  mainWindow.on('page-title-updated', (event, title) => {
    // Instagram 会在标题中显示未读消息数量
    if (title.includes('(') && title.includes(')')) {
      const match = title.match(/\((\d+)\)/);
      if (match) {
        const count = match[1];
        // 在任务栏显示未读数量
        mainWindow.setTitle(`IGDM Universal (${count})`);
      }
    }
  });
}

function createMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '新建账户窗口',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            createAccountWindow();
          }
        },
        { type: 'separator' },
        {
          label: '重新加载',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            if (mainWindow) {
              mainWindow.reload();
            }
          }
        },
        { type: 'separator' },
        { 
          role: 'quit', 
          label: '退出',
          accelerator: 'CmdOrCtrl+Q'
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        { role: 'delete', label: '删除' },
        { type: 'separator' },
        { role: 'selectAll', label: '全选' }
      ]
    },
    {
      label: '查看',
      submenu: [
        { role: 'reload', label: '刷新' },
        { role: 'forceReload', label: '强制刷新' },
        { role: 'toggleDevTools', label: '开发者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '实际大小' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '全屏' }
      ]
    },
    {
      label: '账户',
      submenu: [
        {
          label: '账户 1（默认）',
          click: () => switchAccount('default')
        },
        {
          label: '账户 2',
          click: () => switchAccount('account2')
        },
        {
          label: '账户 3',
          click: () => switchAccount('account3')
        },
        { type: 'separator' },
        {
          label: '新增账户窗口',
          click: () => createAccountWindow()
        },
        { type: 'separator' },
        {
          label: '清除当前账户数据',
          click: () => clearCurrentSession()
        }
      ]
    },
    {
      label: '窗口',
      submenu: [
        { role: 'minimize', label: '最小化' },
        { role: 'close', label: '关闭' }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于 IGDM Universal',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: '关于 IGDM Universal',
              message: 'IGDM Universal',
              detail: 'Version 1.0.0\n\n跨平台 Instagram Direct Message 管理工具\n\n使用 Ctrl/Cmd+N 创建新账户窗口'
            });
          }
        },
        { type: 'separator' },
        {
          label: '快捷键说明',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: '快捷键',
              message: '常用快捷键',
              detail: 'Ctrl/Cmd+N - 新建账户窗口\nCtrl/Cmd+R - 刷新\nCtrl/Cmd+Q - 退出\nF11 - 全屏\nF12 - 开发者工具'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// 创建新账户窗口
function createAccountWindow() {
  const accountWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      partition: `persist:instagram-${Date.now()}`, // 每个窗口独立 session
    }
  });

  accountWindow.loadURL('https://www.instagram.com/direct/inbox/');
  
  accountWindow.webContents.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  accountWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes('instagram.com')) {
      return { action: 'allow' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// 切换账户
function switchAccount(accountName) {
  const ses = session.fromPartition(`persist:instagram-${accountName}`);
  
  const newWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      partition: `persist:instagram-${accountName}`,
      session: ses
    }
  });

  newWindow.loadURL('https://www.instagram.com/direct/inbox/');
  
  newWindow.webContents.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  newWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes('instagram.com')) {
      return { action: 'allow' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// 清除当前会话
function clearCurrentSession() {
  const { dialog } = require('electron');
  
  dialog.showMessageBox(mainWindow, {
    type: 'warning',
    title: '清除会话',
    message: '确定要清除当前账户的登录信息吗？',
    detail: '这将退出当前账户，您需要重新登录。',
    buttons: ['取消', '确定'],
    defaultId: 0,
    cancelId: 0
  }).then(result => {
    if (result.response === 1) {
      const ses = mainWindow.webContents.session;
      ses.clearStorageData().then(() => {
        mainWindow.reload();
      });
    }
  });
}

// 应用准备就绪
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 所有窗口关闭时退出应用（macOS 除外）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

console.log('IGDM Universal - Direct Instagram Loading');
