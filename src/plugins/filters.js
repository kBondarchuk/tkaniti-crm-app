const _filters = {
  // 2019-12-31 -> 31-12-2019
  date(value, showTime = true) {
    if (value === undefined) return "--.--.----";
    if (value === null) return "";

    // Split Date / Time
    const datetime = String(value).split(" ");
    const date = datetime[0];
    const time = datetime[1] && showTime ? datetime[1].split(".")[0] : "";

    return date.split("-")[2] + "." + date.split("-")[1] + "." + date.split("-")[0] + " " + time;
  },

  // 2019-12-31 -> Декабрь
  month(value) {
    if (value === undefined) return "-";
    if (value === null) return "";

    // Split Date / Time
    const datetime = String(value).split(" ");
    const date = datetime[0];

    const monthes = [
      "",
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];
    const monthNumber = parseInt(date.split("-")[1]);
    return monthes[monthNumber];
  },

  // 2019-12-31 -> 31-12
  date_no_year(value) {
    if (value === undefined) return "--.--.----";
    if (value === null) return "";

    // Split Date / Time
    const datetime = String(value).split(" ");
    const date = datetime[0];
    // const time = datetime[1] && showTime ? datetime[1] : "";

    return date.split("-")[2] + "." + date.split("-")[1];
  },

  // 1250000 -> 1 250 000
  money(value, nbsp, nokop = false) {
    if (value === undefined) return "-.--";
    if (value === null) return "";
    if (value === 0) {
      value = "0.00";
    }
    // console.log(value);
    const d = String(value).split(".")[0];
    let c = String(value).split(".")[1];
    if (c == undefined) {
      c = "00";
    } else if (c.length == 1) {
      c = c + "0";
    } else if (c.length > 2) {
      c = c.slice(0, 2);
    }

    let separator = " ";

    let terminator = "." + c;
    if (nokop) {
      terminator = "";
    }

    if (nbsp) {
      separator = "&nbsp;";
    } else {
      separator = " ";
    }
    return (
      d.slice(-12, -9) +
      separator +
      d.slice(-9, -6) +
      separator +
      d.slice(-6, -3) +
      separator +
      d.slice(-3) +
      terminator
    );
  },

  // 1250000 -> 1 250 000
  money2(value, nbsp, nokop = false) {
    if (value === undefined) return "-.--";
    if (value === null) return "";
    if (value === 0) {
      value = "0.00";
    }
    // console.log(value);
    let d = String(Math.abs(value)).split(".")[0];
    let c = String(value).split(".")[1];
    if (c == undefined) {
      c = "00";
    } else if (c.length == 1) {
      c = c + "0";
    } else if (c.length > 2) {
      c = c.slice(0, 2);
    }

    let separator = " ";
    let prefix = "";

    let terminator = "." + c;
    if (nokop) {
      terminator = "";
    }

    if (nbsp) {
      separator = "&nbsp;";

      if (value < 0) {
        prefix = "&ndash;";
      }
    }

    let part1 = "";
    let part2 = "";
    let part3 = d.slice(-3);

    if (d.length > 6) {
      part1 = d.slice(-9, -6) + separator;
    }

    if (d.length > 3) {
      part2 = d.slice(-6, -3) + separator;
    }

    return prefix + part1 + part2 + part3 + terminator;
  },

  // +79625551122 -> +7 (962) 555-11-22
  phone(value) {
    if (value === undefined) return "---";
    if (value === null) return "";
    if (value === "") {
      return "";
    }
    const d = String(value).split("+")[1];
    if (d === undefined) {
      return value;
    }

    return (
      "+" +
      d.slice(-11, -10) +
      " (" +
      d.slice(-10, -7) +
      ") " +
      d.slice(-7, -4) +
      "-" +
      d.slice(-4, -2) +
      "-" +
      d.slice(-2)
    );
  },

  // 120000 -> 120 000
  number(value) {
    if (value === undefined) return "---";
    if (value === null) return "";
    if (value === 0) {
      value = "0";
    }
    // console.log(value);
    const d = String(value).split(".")[0];
    // const c = String(value).split(".")[1];

    let separator = " ";
    let part1 = "";
    let part2 = "";
    let part3 = d.slice(-3);

    if (d.length > 6) {
      part1 = d.slice(-9, -6) + separator;
    }

    if (d.length > 3) {
      part2 = d.slice(-6, -3) + separator;
    }

    return part1 + part2 + part3;
  },

  // УУ333T27 -> УУ333T 27
  plate(value, spec = false) {
    if (value === undefined) return spec ? "&mdash;" : "";
    if (value === null) return spec ? "&mdash;" : "";

    const separator = " ";

    return value.slice(0, 6) + separator + value.slice(6, 9);
  },

  // 1122333444 -> 11 22 333444
  ctc(value, spec = false) {
    if (value === undefined) return spec ? "&mdash;" : "";
    if (value === null) return spec ? "&mdash;" : "";

    const separator = " ";

    return value.slice(0, 2) + separator + value.slice(2, 4) + separator + value.slice(4, 10);
  },

  // 11УУ333444 -> 11 УУ 333444
  pts(value, spec = false) {
    if (value === undefined) return spec ? "&mdash;" : "";
    if (value === null) return spec ? "&mdash;" : "";

    const separator = " ";

    if (value.length > 10) {
      // Electro
      return value;
    } else {
      // Paper
      return value.slice(0, 2) + separator + value.slice(2, 4) + separator + value.slice(4, 15);
    }
  },

  // null -> отсутствует
  vin(value) {
    if (value === null) return "Отсутствует";

    return value;
  },

  // 10 -> "Закрыт"
  contract_status(value) {
    const statuses = [
      "Удалён",
      "Ожидание",
      "Активен",
      "Завершён",
      "Выплачен",
      "В архиве",
      "Неизвестный5",
      "Неизвестный6",
      "Неизвестный7",
      "Неизвестный8",
      "Неизвестный9",
      "Возврат",
      "Обмен",
    ];

    if (!value && !value === 0) return "—";

    return statuses[value + 1];
  },

  // Rent contracts
  contract_rent_status(value) {
    const statuses = [
      "Удалён",
      "Ожидание",
      "Активен",
      "Просрочен",
      "Завершён",
      "Залог",
      "Неизвестный5",
      "Неизвестный6",
      "Неизвестный7",
      "Неизвестный8",
      "Неизвестный9",
      "Закрыт",
    ];

    if (!value && !value === 0) return "—";

    return statuses[value + 1];
  },

  truncate(str, n) {
    return str && str.length > n ? str.substr(0, n - 1) + "&hellip;" : str;
  },

  //
};

const UIFilters = {
  install(app, options) {
    // vue.UIService = UIService;
    app.config.globalProperties.$filters = _filters;
    //
    console.log("[UIFilters]: Installed.");
  },
};

export default UIFilters;
