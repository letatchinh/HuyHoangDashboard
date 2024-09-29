
function path(root: any, sublink: any) {
  return `${root}${sublink}`;
}

const ROOTS = {
  auth: "/",
  app: "",
};
export const AUTH = {
  login: path(ROOTS.app, "/login"),
};
export const PATH_APP = {
  root: ROOTS.app,

  main: {
    root: path(ROOTS.app, "/"),
  },
  course: {
    root: path(ROOTS.app, "/course"),
    create: path(ROOTS.app, "/course-create"),
    update: path(ROOTS.app, "/course-update/:id"),
  },
  user: {
    root: path(ROOTS.app, "/user"),
  },

  staff: {
    root: path(ROOTS.app, "/staff"),
    staffGroup: path(ROOTS.app, "/staff-group"),
  },
  
};
