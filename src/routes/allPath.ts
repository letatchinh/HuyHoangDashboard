
function path(root:any, sublink:any) {
    return `${root}${sublink}`;
  }
  
  const ROOTS = {
    auth: '/',
    app: ''
  };
export const PATH_APP = {
    root: ROOTS.app,
  
    main: {
      root: path(ROOTS.app, '/dashboard'),
    },
    auth : {
      login: path(ROOTS.app, '/login'),
    },

    worldPharma : {
      productConfig: path(ROOTS.app, '/productConfig'),
    },

    supplier : {
      root: path(ROOTS.app, '/supplier'),
    },

    branch : {
      root: path(ROOTS.app, '/branch'),
    },
    todoList: {
      statusConfig: path(ROOTS.app, '/statusConfig'),
      workBoard: path(ROOTS.app, '/workBoard'),
    },
    employee: {
        root: path(ROOTS.app, '/employee'),
    },
    user: {
      root: path(ROOTS.app, '/user'),
      // detail: path(ROOTS.app, '/user/:groupId'),  
    },
    userGroup: {
      root: path(ROOTS.app, '/user/group'),
      detail: path(ROOTS.app, '/user/group/:groupId'),
    },
  };