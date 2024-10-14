// download.js
import { useUiStore } from "@/stores/uiStore";

export function useDownload(options) {
  /// SETUP

  const { urlDownloadBase } = useUiStore();

  /// FUNCTIONS

  function startDownload(filename, token) {
    // Make URL
    let fileUrl = urlDownloadBase + "?file=" + filename + "&jwt=" + token + "&saving=yes";

    // Start Download
    window.location = fileUrl;
  }

  function openFile(filename, token) {
    // Make URL
    let fileUrl = urlDownloadBase + "?file=" + filename + "&jwt=" + token + "&saving=0";

    // Open in new tab
    window.open(fileUrl, "_blank");
  }

  /// RUN

  // expose managed state as return value
  return { startDownload, openFile };
}
