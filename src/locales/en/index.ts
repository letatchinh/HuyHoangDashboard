import dashboard from '../en/dashboard.json';
import productConfig from '../en/productConfig.json';
import manufacturer from '../en/manufacturer.json';
import supplier from '../en/supplier.json';
import rankingManufacturer from '../en/rankingManufacturer.json';
import unit from '../en/unit.json';
import medicine from '../en/medicine.json';
const en = {
    ...dashboard,
    ...supplier,
    ...productConfig,
    ...manufacturer,
    ...rankingManufacturer,
    ...unit,
    ...medicine,
}
export default en;
