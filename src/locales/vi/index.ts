import dashboard from '../vi/dashboard.json';
import productConfig from '../vi/productConfig.json';
import manufacturer from '../vi/manufacturer.json';
import supplier from '../vi/supplier.json';
import rankingManufacturer from '../vi/rankingManufacturer.json';
const vi = {
    ...dashboard,
    ...supplier,
    ...productConfig,
    ...manufacturer,
    ...rankingManufacturer,
}
export default vi;
