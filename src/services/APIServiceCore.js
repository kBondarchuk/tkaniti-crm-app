import axios from "axios";
import jwt_decode from "jwt-decode";

export class APIServiceCore {
  // End points
  static REQUESTS = {
    LOGIN: "/login",
    TOKEN: "/token",
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

    const handleError = (error) => {
      if (
        !Object.prototype.hasOwnProperty.call(error, "response") ||
        (Object.prototype.hasOwnProperty.call(error, "response") && !error.response)
      ) {
        console.log("[APIService]: Error (no response): " + error);
        return Promise.reject(error);
      }
      // console.log(this.callback);
      switch (error.response.status) {
        case 401:
          console.warn("[APIService]: 🚫 401 ", error.config.url);

          // If login ???
          // If Refresh Token broken then logoff
          if (
            error.config.url === APIServiceCore.REQUESTS.TOKEN ||
            error.config.url === APIServiceCore.REQUESTS.LOGIN
          ) {
            // this.();
            this.logoutCallback("token 401");
            return Promise.reject(error);
          }

          // Check retry
          if (error.config.__isRetry) {
            // this.logoutCallback("Got 401 at retry: " + error.config.url);
            console.warn("[APIService]: Got 401 at retry: " + error.config.url);
            return Promise.reject(error);
          }

          // General request
          var self = this;
          return this.makeRefreshCall()
            .then((data) => {
              this.refreshingCall = null;
              console.log("[APIService]: 🔄", data);

              error.config.headers["Authorization"] = "Bearer " + data.jwt;
              error.config.baseURL = undefined;
              error.config.__isRetry = true;
              return this.service.request(error.config);
            })
            .catch(function () {
              if (!error.config.__isRetry) {
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
          console.error(
            "[APIService]: Error response: " + error.response.status + " " + JSON.stringify(error.response)
          );
          // this.redirectTo("/500");
          break;
      }
      return Promise.reject(error);
    };

    // Add a request interceptor
    service.interceptors.request.use(this.handleRequest, this.handleRequestError);

    // Add a response interceptor
    service.interceptors.response.use(this.handleSuccess, handleError);

    this.service = service;

    // Callback
    this.loginCallback = null;
    this.logoutCallback = null;

    // Refresh call
    this.refreshingCall = null;
    // Remember url
    this.repeatUrl = null;

    // API Client ID
    this.apiClientId = null;
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

  handleRequest(config) {
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
    // Do something before request is sent
    console.log("[APIService]: ⬆️ Request:", "(" + config.method.toUpperCase() + ")", config.url, config.params);
    return config;
  }

  handleRequestError(error) {
    // Do something with request error
    console.error("[APIService]: Request Error: " + error);
    return error;
  }

  handleSuccess(response) {
    console.log(
      "[APIService]: ✅ Response: " + response.status,
      response.statusText,
      "(" + response.config.method.toUpperCase() + ")",
      response.config.url,
      response.config.params
    );
    return response;
  }

  loadRefreshToken() {
    // Load refreshToken
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      return;
    }
    console.log("[APIService]: Loaded Refresh token: " + refreshToken.substr(0, 40));
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
    // localStorage.removeItem("JWT");
    console.log("[APIService]: Access token removed.");
    // Stop refreshing
    // this.stopRefreshing();
  }

  setRefreshToken(token, lifeTime, needSave) {
    if (token) {
      this.refreshToken = token;
      this.tokenLifeTime = lifeTime;

      if (needSave) {
        localStorage.setItem("refresh_token", token);
      }

      this.startRefreshing(lifeTime);

      console.log("[APIService]: Refresh token applied.");
    }
  }

  removeRefreshToken() {
    this.refreshToken = null;
    this.tokenLifeTime = 0;
    this.stopRefreshing();
    localStorage.removeItem("refresh_token");
    console.log("[APIService]: Refresh token removed.");
  }

  startRefreshing(interval) {
    clearInterval(this.refreshInterval);

    // Start interval for refresh token
    this.refreshInterval = setInterval(
      (function (self) {
        //Self-executing func which takes 'this' as self
        return function () {
          //Return a function in the context of 'self'
          console.log("[APIService]: Refreshing...");
          self.refreshTokens();
        };
      })(this),
      interval * 1000
    );
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
    console.log("[APIService]: Access token: " + accessToken.substr(0, 20));
    console.log("[APIService]: Refresh token: " + refreshToken.substr(0, 20));
    console.log("[APIService]: Token lifetime: " + lifeTime);

    // Set jwt
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken, lifeTime, true); // lifetime

    // Login callback
    this.loginCallback(authPayload);

    return authPayload;
  }

  makeRefreshCall() {
    if (this.refreshingCall !== null) {
      console.log("[APIService]: *** return existing call");
      return this.refreshingCall;
    }

    const call = this.refreshTokens();

    this.refreshingCall = call;

    return call;
  }

  async refreshTokens() {
    if (!this.refreshToken) {
      console.log("[APIService]: Can't refresh token! No refresh token given!");
      return Promise.reject("Can't refresh token! No refresh token given!");
    }

    const params = {
      refresh_token: this.refreshToken,
    };

    let response = await this.service.post(APIServiceCore.REQUESTS.TOKEN, params).catch(function (error) {
      console.log("[APIService]: Error. " + error);
      return Promise.reject(error);
    });

    // Processing
    const accessToken = response.data.data.jwt;
    const lifeTime = response.data.data.expires_in;
    const refreshToken = response.data.data.refresh_token;
    const authPayload = jwt_decode(response.data.data.jwt);

    // Apply Tokens
    console.log("[APIService]: Access token : " + accessToken.substr(0, 40));
    console.log("[APIService]: Refresh token: " + refreshToken.substr(0, 40));
    console.log("[APIService]: Token lifetime: " + lifeTime);

    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken, lifeTime, true); // lifetime

    // Login callback
    this.loginCallback(authPayload);

    return response.data.data;
  }

  async logoff() {
    console.log("[APIService]: Signing out...");

    this.removeRefreshToken();
    this.removeAccessToken();

    return { data: { message: "Вы вышли из программы." } };
  }
}
