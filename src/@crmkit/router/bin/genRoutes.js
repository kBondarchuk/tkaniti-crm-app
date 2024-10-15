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

const genRoute = (name, path, parentName = null) => {
  const component = genComponent(name);
  return `{
    path: "${path}",
    name: "${name}",
    component: ${component},
  },`;
};

const genTabRoute = (name, path, parentName = null) => {
  const _name = parentName + "Tab" + "_" + name;
  const component = genTabComponent(_name);
  return `{
    path: "${path}",
    name: "${_name}",
    component: ${component},
  },`;
};

const genParentRoute = (name, object, parentName = null) => {
  const _name = (parentName ? parentName + "" : "") + name;
  const result = {
    name: object.layout ? null : _name,
    path: object.path,
    props: object.props ? enumerateProps(object.props) : null,
    component: object.layout ? genLayout(object.layout) : genComponent(object.component ?? _name),
    children: object.children
      ? enumerateRoutes(object.children, name)
      : object.layout
        ? "[" + genRoute(name, object.path, "") + "]"
        : object.tabs
          ? enumerateTabs(object.tabs, object.component ?? _name)
          : null,
  };

  // Add redirect if tabs
  if (object.tabs) {
    const _tabName = parentName + name + "Tab" + "_" + Object.keys(object.tabs)[0];
    result.redirect = _tabName;
    // console.log("!!!", result.redirect);
  }

  if (result.name === null) {
    delete result.name;
  }
  if (result.children == null) {
    delete result.children;
  }
  if (result.props == null) {
    delete result.props;
  }
  if (result.path == null) {
    delete result.path;
  }

  // props: ${result.props},
  return (
    `
  {
    ` +
    (result.name ? `name: "${result.name}",` : "") +
    `
    path: "${result.path}",` +
    (result.props ? `props: ${genProps(result.props)},` : "") +
    `
    component: ${result.component},` +
    (result.redirect ? `redirect: {name: "${result.redirect}"},` : "") +
    (result.children ? `children: ${result.children}` : "") +
    `
  },
  `
  );
};

const genProps = (props) => {
  // console.log(props);

  // props: (route) => ({ contractId: Number(route.params.contractId) }),
  // const fileName = "../views/" + name + "View.vue";
  // let args = props.params.join(",");
  let args = [...props.params, ...props.query].join(",");
  return `(route) => ({ ${args} })`;
};

const genTabComponent = (name) => {
  const fileName = "../views/" + name + ".vue";
  return `() => import('${fileName}')`;
};

const genComponent = (name) => {
  const fileName = "../views/" + name + "View.vue";
  return `() => import('${fileName}')`;
};

const genLayout = (name) => {
  const fileName = "../layouts/" + name + ".vue";
  return `() => import('${fileName}')`;
};

const genRoutes = () => {
  var _func = `
  function ParsedNumber(value) {
    return Number.isNaN(parseInt(value)) ? null : Number(value);
  }


`;

  console.log(_func);
  console.log("export const routes = ");

  const routes = enumerateRoutes(Views);
  return routes;
};

function enumerateRoutes(routes, parentName = null) {
  let result = "[";
  for (const [key, value] of Object.entries(routes)) {
    // console.debug(`${key}:`, value);
    if (typeof value === "object") {
      // console.debug("Object");
      // result.push(genParentRoute(key, value, parentName));
      result = result + genParentRoute(key, value, parentName);
    }
  }

  return result + "]";
}

function enumerateTabs(routes, parentName = null) {
  let result = "[";
  // console.warn(routes);
  for (const [key, value] of Object.entries(routes)) {
    if (typeof value === "string") {
      // result.push(genTabRoute(key, value, parentName));
      result = result + genTabRoute(key, value, parentName);
    }
  }
  return result + "]";
}

function enumerateProps(props) {
  let result = {
    query: [],
    params: [],
  };

  for (const [key, value] of Object.entries(props)) {
    // console.debug("!!!", value["from"], value["type"].name, key);
    const func =
      key +
      ": " +
      (typeof value["type"] === "string" ? value["type"] : value["type"].name) +
      "(route." +
      value["from"] +
      "." +
      key +
      ")";
    result[value["from"]].push(func);
  }

  return result;
}

// export default genRoutes();
console.log(genRoutes());
// await Bun.write(Bun.stdout, JSON.stringify(genRoutes()));
