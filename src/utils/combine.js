/*
    Input:

    * counts:
    [
        {"status_id":-1,"count":2},
        {"status_id":0,"count":40},
        {"status_id":1,"count":1},
        {"status_id":5,"count":1},
        {"status_id":null,"count":279}
    ]

    * menu:
    [
        { id: null, name: "Все", icon: "folder" },
        { id: 0, name: "Черновик", icon: "edit" },
        { id: 5, name: "Обслуживание", icon: "tools" },
        { id: 1, name: "В гараже", icon: "warehouse", label: "" },
    ]
*/

function combineMenu(counts, menu) {
  menu
    .filter((item) => {
      return item.id >= 0;
    })
    .forEach((menuItem) => {
      var result = counts.find((obj) => {
        return obj.status_id == menuItem.id;
      });
      if (result) {
        menuItem["label"] = result.count;
      } else {
        menuItem["label"] = 0;
      }
    });
}

export default combineMenu;
