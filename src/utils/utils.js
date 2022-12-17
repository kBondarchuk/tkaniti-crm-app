export function renderCsv(headers, data) {
  let rows = [headers];

  data.forEach((item) => {
    let row = [];
    for (var name in item) {
      row.push(item[name] || 0);
    }
    rows.push(row);
  });

  let csvContent = "";

  rows.forEach(function (rowArray) {
    let row = rowArray.join(",");
    csvContent += row + "\r\n";
  });
  return csvContent;
}

export function exportCsv(filename, data, headers) {
  var blob = new Blob([renderCsv(headers, data)], { type: "text/csv" });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    var elem = window.document.createElement("a");
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
}

export function getCurrentDate() {
  return new Date().toISOString().slice(0, 10);
}

export function getCurrentMonthFirstDate() {
  var date = new Date();
  const month = date.getMonth() + 1;
  return date.getFullYear() + "-" + month + "-" + "01";
}

export function getFirstMonthOfYearDate() {
  var date = new Date();
  return date.getFullYear() + "-01-01";
}

export function arrayEquals(a, b) {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index]);
}

export function bitCount(n) {
  n = n - ((n >> 1) & 0x55555555);
  n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
  return (((n + (n >> 4)) & 0xf0f0f0f) * 0x1010101) >> 24;
}
