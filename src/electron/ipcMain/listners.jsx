import { ipcMain, IpcMessageEvent } from "electron";
const install = require('./src/utils/install')
import { getWindow } from "../window";
import { sendDownloadState, sendDownloadDone, sendDownloadError } from "../senders.jsx"


getWindow().webContents.session.on('will-download', (event, item, webContents) => {
    const storagePath = install.getStoragePath() + item.getFileName();
    constole.log("STORAGE PATH ", storagePath);

    item.setSavePath(storagePath);

    sendDownloadState(item);

    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Downloaded successfully, starting Install ', install);
        install.installPackage(storagePath, item.getFileName());
        sendDownloadDone(fullPath)
      } else {
        sendDownloadError(state)
      }
    });
})