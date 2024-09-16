
function path(root: any, sublink: any) {
  return `${root}${sublink}`;
}

const ROOTS = {
  auth: "/",
  app: "",
};
export const PATH_APP = {
  root: ROOTS.app,

  main: {
    root: path(ROOTS.app, "/dashboard"),
  },
  course: {
    root: path(ROOTS.app, "/course"),
  },
  user: {
    root: path(ROOTS.app, "/user"),
  },
  
};
