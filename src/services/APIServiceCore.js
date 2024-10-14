import axios from "axios";
import { jwtDecode as jwt_decode } from "jwt-decode";

export class APIServiceCore {
  // End points
  static REQUESTS = {
    LOGIN: "/login",
    TOKEN: "/token",
    LOGOUT: "/logout",
  };

  constructor() {
    console.log("[APIService]: Created.");

    let service = axios.create({
      baseURL: "",
      withCredentials: false,
      crossDomain: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    // Add a request interceptor
    service.interceptors.request.use(this.handleRequest, this.handleRequestError);

    // Add a response interceptor
    service.interceptors.response.use(this.handleResponseSuccess, this.handleResponseError);

    this.service = service;

    this.pendingRequests = {};

    // Callback
    this.loginCallback = null;
    this.logoutCallback = null;

    // Refresh call
    this.refreshingCall = null;
    // Remember url
    // this.repeatUrl = null;

    // API Client ID
    // this.apiClientId = null;
  }

  init(options) {
    console.log("[APIService]: Init with base URL: ", options.baseURL);
    this.service.defaults.baseURL = options.baseURL;
    this.loginCallback = options.loginCallback;
    this.logoutCallback = options.logoutCallback;
    // this.service.defaults.apiClientId = options.apiClientId;
    if (options.apiClientId) {
      this.service.defaults.headers.common["x-client-id"] = options.apiClientId;
    }
    // Token
    this.loadRefreshToken();
  }

  handleRequest = (config) => {
    // Check Auth token exist
    // if (!["/login", "/token"].includes(config.url) && !config.headers.common["Authorization"]) {
    //   console.log("[APIService]: ❌ Request:", "(" + config.method.toUpperCase() + ")", config.url, config.params);
    //   config.url = "";
    //   // return {
    //   //   ...config,
    //   //   // cancelToken: new axios.CancelToken((cancel) => cancel("Cancel repeated request")),
    //   // };
    //   return {
    //     headers: {},
    //     method: config.method,
    //     url: "",
    //   };
    // }
    // console.warn(this, config?.url);
    // Add to Pending
    // we only want to cancel requests if config.cancelPreviousRequests is true
    // if the config.url exists
    // if the config doesn't contain AbortController.signal already, in this case we let the developer handle it himself
    if (config?.cancelPreviousRequests && config?.url && !config.signal) {
      // remove request URL from pending requests and also abort ongoing call with same URL
      this.removePendingRequest(config.url, true);
      // console.warn(config.url);
      const abortController = new AbortController(); //create new AbortController
      config.signal = abortController.signal; // assign it's signal into request config
      this.pendingRequests[config.url] = abortController; // store AbortController in the pending requests map
      console.log("[APIService]: pendingRequests: ", this.pendingRequests);
    }

    // Do something before request is sent
    console.log(
      "[APIService]: ⬆️ Request:",
      "(" + config.method.toUpperCase() + ")",
      config.url,
      config.params,
      config.headers["Authorization"]?.slice(-10)
    );
    return config;
  };

  handleRequestError(error) {
    // Do something with request error
    console.error("[APIService]: Request Error: " + error);
    return error;
  }

  handleResponseSuccess = (response) => {
    console.log(
      "[APIService]: ✅ Response: " + response.status,
      response.statusText,
      "(" + response.config.method.toUpperCase() + ")",
      response.config.url,
      response.config.params
    );
    // remove pending request without aborting the call, call is finished
    this.removePendingRequest(response.config.url);
    return response;
  };

  handleResponseError = (error) => {
    // remove pending request without aborting the call, call is finished with error
    this.removePendingRequest(error.config?.url);

    if (
      !Object.prototype.hasOwnProperty.call(error, "response") ||
      (Object.prototype.hasOwnProperty.call(error, "response") && !error.response)
    ) {
      console.warn("[APIService]: ❌ Error (no response): " + error);
      return Promise.reject(error);
    }
    // console.log(this.callback);
    switch (error.response.status) {
      case 401:
        console.warn("[APIService]: 🚫 401 ", error.config.url);

        // If login ???
        // If Refresh Token broken then logoff
        if (error.config.url === APIServiceCore.REQUESTS.TOKEN || error.config.url === APIServiceCore.REQUESTS.LOGIN) {
          this.logoutCallback("token 401");
          return Promise.reject(error);
        }

        // Check retry
        if (error.config.__isRetry) {
          console.warn("[APIService]: Got 401 at retry: " + error.config.url);
          return Promise.reject(error);
        }

        // General request
        var self = this;
        return this.makeRefreshCall()
          .then((data) => {
            self.refreshingCall = null;
            error.config.headers["Authorization"] = "Bearer " + data.jwt;
            error.config.baseURL = undefined;
            error.config.__isRetry = true;
            console.info("[APIService]: 🔄", error.config.url, error.config.headers["Authorization"]?.slice(-10));
            return self.service.request(error.config);
          })
          .catch(function () {
            if (!error.config.__isRetry) {
              self.removeRefreshToken();
              self.removeAccessToken();
              self.logoutCallback("makeRefreshCall 401");
              error.hide = true;
            }
            return Promise.reject(error);
          });

      // break;
      // case 404:
      //   // Not found
      //   this.redirectTo("/404");
      //   break;
      default:
        // Internal server error
        if (error.response) {
          console.error(
            "[APIService]: Error response: " + error.response.status + " " + JSON.stringify(error.response.data)
          );
        }

        // this.redirectTo("/500");
        break;
    }
    return Promise.reject(error);
  };

  removePendingRequest = (url, abort = false) => {
    // check if pendingRequests contains our request URL
    if (url && this.pendingRequests[url]) {
      // if we want to abort ongoing call, abort it
      if (abort) {
        console.warn("[APIService]: Aborting request..");
        this.pendingRequests[url].abort();
      }
      // remove the request URL from pending requests
      console.log("[APIService]: Removing from pending..", url);
      delete this.pendingRequests[url];
    }
  };

  loadRefreshToken() {
    // Load refreshToken
    const refreshToken = sessionStorage.getItem("refresh_token");
    if (!refreshToken) {
      return;
    }
    console.log("[APIService]: Loaded Refresh token: " + refreshToken.slice(-10));
    // Set refreshToken
    this.refreshToken = refreshToken;
    // this.setRefreshToken(refreshToken);
    console.log("[APIService]: Refreshing...");
    this.refreshTokens(refreshToken).catch(() => {
      console.log("[APIService]: Ошибочка вышла со старым токеном, однако!");
      this.removeRefreshToken();
      this.removeAccessToken();
    });
  }

  setAccessToken(jwt) {
    if (jwt) {
      this.service.defaults.headers.common["Authorization"] = "Bearer " + jwt;
      console.log("[APIService]: Access token applied.");
    }
  }

  removeAccessToken() {
    delete this.service.defaults.headers.common["Authorization"];
    console.log("[APIService]: Access token removed.");
  }

  setRefreshToken(token, lifeTime, needSave) {
    // lifeTime gap?
    if (lifeTime > 120) {
      lifeTime = lifeTime - 60;
    } else {
      console.warn("[APIService]: Token lifeTime value is too low! ", lifeTime);
      lifeTime = lifeTime - 5;
    }
    if (token) {
      this.refreshToken = token;
      this.tokenLifeTime = lifeTime;

      if (needSave) {
        sessionStorage.setItem("refresh_token", token);
      }

      this.startRefreshing(lifeTime);

      console.log("[APIService]: Refresh token applied.");
    }
  }

  removeRefreshToken() {
    this.refreshToken = null;
    this.tokenLifeTime = 0;
    this.stopRefreshing();
    sessionStorage.removeItem("refresh_token");
    console.log("[APIService]: Refresh token removed.");
  }

  startRefreshing(interval) {
    clearInterval(this.refreshInterval);

    const doRefresh = async () => {
      console.log("[APIService]: Refreshing... after " + interval + " seconds.");
      try {
        await this.refreshTokens();
      } catch (error) {
        console.error("Ошибка при обновлении токена!", error);
        this.removeRefreshToken();
        this.removeAccessToken();
        return;
      }
    };

    // Start interval for refresh token
    this.refreshInterval = setInterval(doRefresh, interval * 1000);
  }

  stopRefreshing() {
    clearInterval(this.refreshInterval);
  }

  /**
   * Auth
   */

  async login(username, password) {
    const TOKEN = "Basic " + window.btoa(username + ":" + password);
    console.log("[APIService]: Basic token: " + TOKEN);

    let response = await this.service.get(APIServiceCore.REQUESTS.LOGIN, {
      crossDomain: true,
      headers: { Authorization: TOKEN },
    });

    // Processing
    const accessToken = response.data.data.jwt;
    const lifeTime = response.data.data.expires_in;
    const refreshToken = response.data.data.refresh_token;
    const authPayload = jwt_decode(response.data.data.jwt);
    // Apply Tokens
    console.log("[APIService]: Access token: " + accessToken.slice(-10));
    console.log("[APIService]: Refresh token: " + refreshToken.slice(-10));
    console.log("[APIService]: Token lifetime: " + lifeTime);

    // Set jwt
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken, lifeTime, true); // lifetime

    // Login callback
    // this.loginCallback(authPayload);

    return authPayload;
  }

  makeRefreshCall() {
    if (this.refreshingCall !== null) {
      console.log("[APIService]: *** return existing refresh call");
      return this.refreshingCall;
    }

    const call = this.refreshTokens();
    // .catch((error) => {
    //   console.log("[APIService]: " + error);
    // });

    this.refreshingCall = call;

    return call;
  }

  async refreshTokens() {
    if (!this.refreshToken) {
      console.log("[APIService]: Can't refresh token! No refresh token given!");
      // return Promise.reject("Can't refresh token! No refresh token given!");
      throw new Error("Can't refresh token! No refresh token given!");
    }

    const params = {
      refresh_token: this.refreshToken,
    };

    let response = await this.service.post(APIServiceCore.REQUESTS.TOKEN, params);

    // Processing
    const accessToken = response.data.data.jwt;
    const lifeTime = response.data.data.expires_in;
    const refreshToken = response.data.data.refresh_token;
    const authPayload = jwt_decode(response.data.data.jwt);

    // Apply Tokens
    console.log("[APIService]: Access token : " + accessToken?.slice(-10));
    console.log("[APIService]: Refresh token: " + refreshToken?.slice(-10));
    console.log("[APIService]: Token lifetime: " + lifeTime);

    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken, lifeTime, true); // lifetime

    // Login callback
    this.loginCallback(authPayload);

    return response.data.data;
  }

  async logout() {
    if (!this.refreshToken) {
      console.log("[APIService]: Can't logout! No refresh token given!");
      return;
    }

    const params = {
      refresh_token: this.refreshToken,
    };

    const response = await this.service.post(APIServiceCore.REQUESTS.LOGOUT, params);

    return response.data.data;
  }

  async logoff() {
    console.log("[APIService]: Signing out...");

    this.removeRefreshToken();
    this.removeAccessToken();

    return { data: { message: "Вы вышли из программы." } };
  }
}
