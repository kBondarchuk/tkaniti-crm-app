/*
    Input:

    * counts:
    [
        {"status":-1,"count":2},
        {"status":0,"count":40},
        {"status":1,"count":1},
        {"status":5,"count":1},
        {"status":null,"count":279}
    ]

    * menu:
    [
        { id: null, name: "Все", icon: "folder" },
        { id: 0, name: "Черновик", icon: "edit" },
        { id: 5, name: "Обслуживание", icon: "tools" },
        { id: 1, name: "В гараже", icon: "warehouse", label: "" },
    ]
*/

function combineMenu(counts, menu, idKey = "status_id") {
  menu
    .filter((item) => {
      return item.id >= 0;
    })
    .forEach((menuItem) => {
      var result = counts.find((obj) => {
        return obj[idKey] == menuItem.id;
      });
      if (result) {
        // Add Kilo formatter if > 10'000
        if (parseInt(result.count) > 10000) {
          let digit = Number((result.count / 1000).toFixed(1));
          result.count = digit.toString() + "K";
        }
        menuItem["label"] = result.count;
      } else {
        menuItem["label"] = 0;
      }
    });
}

export function combineLabels(menu, labels) {
  menu.forEach((menuItem) => {
    // var labelFound = labels.find((labelsItem) => {
    //   return labelsItem.id == menuItem.id;
    // });
    const value = labels[menuItem.id];
    if (value) {
      menuItem["label"] = value;
    } else {
      delete menuItem["label"];
    }
  });
}

export default combineMenu;
