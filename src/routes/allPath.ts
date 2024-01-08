
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
      list: path(ROOTS.app, '/todoList'),
    }
  };