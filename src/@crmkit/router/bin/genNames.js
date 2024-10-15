import Views from "@/router/views";

const genParentRoute = (name, object, parentName = null) => {
  if (object.children) {
    console.log(name + ":{");
    emunerateRoutes(object.children, name);
    console.log("},");
  } else {
    console.log(genItem(name, parentName));
  }

  /// Tabs
  if (object.tabs) {
    console.log(name + "Tabs :{");
    console.log(enumerateTabs(object.tabs, parentName + name));
    console.log("},");
  }
  // return result;
};

const genItem = (name, parentName) => {
  return `${name}: "${parentName}${name}",`;
};

const genTabItem = (name, parentName, path) => {
  return `${name}: "${parentName}Tab_${name}",
  ${name}Path: "${path}",`;
};

const genNames = () => {
  const routes = emunerateRoutes(Views);
  return routes;
};

function enumerateTabs(tabs, parentName = null) {
  let result = "";
  for (const [key, path] of Object.entries(tabs)) {
    if (typeof path === "string") {
      // result.push(genTabRoute(key, value, parentName));
      result = result + genTabItem(key, parentName, path);
    }
  }
  return result;
}

function emunerateRoutes(routes, parentName = "") {
  let result = [];
  for (const [key, value] of Object.entries(routes)) {
    if (typeof value === "object") {
      // console.debug(key);
      result.push(genParentRoute(key, value, parentName));
    }
  }

  return result;
}

// export default genRoutes();
console.log("export default {");
genNames();
console.log(`};`);

// console.log(Bun.inspect(genRoutes()));
// await Bun.write(Bun.stdout, JSON.stringify(genRoutes()));
