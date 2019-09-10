import { getWindow } from "../window";

export const sendDownloadState(item) {
    item.on('updated', (event, state) => {
        if (state === 'interrupted') {
          console.log('Download is interrupted but can be resumed')
          getWindow().webContents.send("table", 'Download is interrupted but can be resumed');
        } else if (state === 'progressing') {
          if (item.isPaused()) {
            console.log('Download is paused')
            getWindow().webContents.send("table", 'Download is paused');
          } else {
            console.log(`Received bytes: ${item.getReceivedBytes()}`)
            getWindow().webContents.send("tableDownloadState", item.getReceivedBytes());
          }
        }
      })
}

export const sendDownloadDone(fileName) {
  var myString = fileName.replace(/\D/g,'');
  myString = myString + '-' + token;
  console.log("sending mystring downloadGood ", myString);
  getWindow().webContents.send('tableDownloadGood', myString);
}

export const sendDownloadError(state) {
  getWindow().webContents.send('tableDownloadError', "Une erreure est survenue pendant le téléchargement, veuillez recommencer s'il vous plait");
  console.log(`Download failed: ${state}`)
}
