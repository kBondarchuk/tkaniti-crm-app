import Views from "@/router/views";

const routeObject = {
  path: "login",
  name: "login",
  component: () => import("@/views/LoginView.vue"),
};

const routeParentObject = {
  path: "/",
  name: "login",
  component: () => import("../layouts/LayoutView.vue"),
  children: [],
};

// const genRoute = (name, path, parentName = null) => {
//   return {
//     path: path,
//     name: name,
//     component: genComponent(name),
//   };
// };

// const genTabRoute = (name, path, parentName = null) => {
//   const _name = parentName + "Tab" + "_" + name;
//   return {
//     path: path,
//     name: _name,
//     component: genTabComponent(_name),
//   };
// };

const genParentRoute = (name, object, parentName = null) => {
  if (object.children) {
    console.log(name + ":{");
    emunerateRoutes(object.children, name);
    console.log("},");
  } else {
    let props = null;
    if (object.props) {
      // let dumb = { query: "1", params: "2" };
      // console.log(object.props);
      props = emunerateProps(object.props);
    }
    console.log(genItem(name, parentName, props));
  }
  // return result;
};

const genItem = (name, parentName, props) => {
  let args = "";
  let parameters = [];
  let paramsString = "";
  // Props
  if (props && props.params.length > 0) {
    const params = props.params.join(",");
    args = `params: { ${params} },`;
    parameters.push(params);

    // console.log("!!!", args);
  }
  // Query
  if (props && props.query.length > 0) {
    const query = props.query.join(",");
    args = args + `query: { ${query} },`;
    parameters.push(query);

    // console.log("!!!", args);
  }

  if (parameters.length > 0) {
    paramsString = `{${parameters.reverse().join(",")}}={},`;
  }

  return `
  ${name}: (${paramsString} replace = false) => {
    router.push({ name: "${parentName}${name}", ${args} replace: replace });
  },
  `;
};

const genNavigation = () => {
  const routes = emunerateRoutes(Views);
  return routes;
};

function emunerateProps(props) {
  let result = {
    query: [],
    params: [],
  };

  for (const [key, value] of Object.entries(props)) {
    // console.debug(value["from"], key);
    result[value["from"]].push(key);
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
console.log("export const navigation = (router) => { return {");
genNavigation();
console.log("}};");
// console.log(Bun.inspect(genRoutes()));
// await Bun.write(Bun.stdout, JSON.stringify(genRoutes()));
