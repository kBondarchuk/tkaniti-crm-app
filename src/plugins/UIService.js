const UIService = {
  app_name: "ЮМ.авто CRM",

  log(str) {
    return console.log(str);
  },
  setHtmlTitle(str, addTemplate = true) {
    const defaultTitle = UIService.app_name;
    if (str) {
      document.title = str + (addTemplate ? " | " + defaultTitle : "");
    } else {
      document.title = defaultTitle;
    }
  },
  showMessage(title, message) {
    $("body").toast({
      title: title,
      message: message,
      showProgress: "bottom",
    });
  },
  showInfo(title, message) {
    $("body").toast({
      class: "info",
      showIcon: "info",
      title: title,
      message: message,
      showProgress: "bottom",
    });
  },
  showSuccess(title, message) {
    $("body").toast({
      class: "success",
      showIcon: "big check",
      // displayTime: 6000,
      showProgress: "bottom",
      transition: {
        showMethod: "fly left",
        hideMethod: "fly down",
      },
      title: title,
      message: message,
    });
  },
  showWarning(title, message) {
    $("body").toast({
      class: "exclamation",
      title: title,
      message: message,
      showProgress: "bottom",
    });
  },
  showError(title, message) {
    $("body").toast({
      class: "red",
      showIcon: "big exclamation ", // exclamation
      // displayTime: 6000,
      showProgress: "bottom",
      transition: {
        showMethod: "browse",
        showDuration: 200,
      },
      title: title,
      message: message,
    });
  },
  showNetworkError(error) {
    // Do not show if request is cancelled
    if (error.code == "ERR_CANCELED") return;
    //
    if (Object.prototype.hasOwnProperty.call(error, "response") && error.response) {
      console.warn("[UIService]: ", JSON.stringify(error.response.data));
      if (error.hide && error.hide === true) return;
      if (error.config && error.config.url) {
        var error_url = error.config.url;
      }

      this.showError(
        error.response.data.message ? error.response.data.message : error_url ?? "ОШИБКА",
        error.response.data.error + "<br/>" + error
      );
    } else if (error instanceof DOMException) {
      console.error(error);
      this.showError(error.name, error.message);
    } else {
      console.error(error);
      this.showError("Ошибка", error);
    }
  },
};

const UIPlugin = {
  install(app, options) {
    // vue.UIService = UIService;
    app.config.globalProperties.$UIService = UIService;
    console.log("[UIService]: Installed.", options);
    UIService.app_name = options.app_name;
  },
};

export default UIPlugin;
