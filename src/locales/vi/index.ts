import dashboard from '../vi/dashboard.json';
import productConfig from '../vi/productConfig.json';
import manufacturer from '../vi/manufacturer.json';
import supplier from '../vi/supplier.json';
const vi = {
    ...dashboard,
    ...supplier,
    ...productConfig,
    ...manufacturer,
}
export default vi;
