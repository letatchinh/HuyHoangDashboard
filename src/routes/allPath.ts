
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
      productGroup: path(ROOTS.app, '/productGroup'),
      manufacturer: path(ROOTS.app, '/manufacturer'),
      ranking: path(ROOTS.app, '/ranking'),
      unit: path(ROOTS.app, '/unit'),
      medicine: path(ROOTS.app, '/medicine'),
    },

    supplier : {
      root: path(ROOTS.app, '/supplier'),
    },

    branch : {
      root: path(ROOTS.app, '/branch'),
    },

    product : {
      root: path(ROOTS.app, '/product'),
      edit: path(ROOTS.app, '/product/:supplierId'),
    },
    todoList: {
      statusConfig: path(ROOTS.app, '/statusConfig'),
      workBoard: path(ROOTS.app, '/workBoard'),
    },
    employee: {
        root: path(ROOTS.app, '/employee'),
    },

  configDiscount: {
    root: path(ROOTS.app, '/config-discount'),
  },
    pharmacy : {
      root:  path(ROOTS.app, '/pharmacy'),
      detail: path(ROOTS.app, '/pharmacy/:id'),
    },

    bill : {
      root:  path(ROOTS.app, '/bill'),
      update: path(ROOTS.app, '/bill/:id'),
      create: path(ROOTS.app, '/bill/create'),
      quotation:  path(ROOTS.app, '/quotation'),
      lk: path(ROOTS.app, '/lk'),
    },

    quotation : {
      root:  path(ROOTS.app, '/quotation'),
      update: path(ROOTS.app, '/quotation/:id'),
      create: path(ROOTS.app, '/quotation/create'),
    },
     user: {
      root: path(ROOTS.app, '/user/*'),
   
    },

    vouchers: {
      root: path(ROOTS.app, '/vouchers'),
    },
  
  };