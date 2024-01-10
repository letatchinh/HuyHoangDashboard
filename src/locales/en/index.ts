import dashboard from '../en/dashboard.json';
import productGroup from '../en/productGroup.json';
import manufacturer from '../en/manufacturer.json';
import supplier from '../en/supplier.json';
import statusConfig from '../en/starusConfig.json';
import rankingManufacturer from '../en/rankingManufacturer.json';
import unit from '../en/unit.json';
import medicine from '../en/medicine.json';
const en = {
    ...dashboard,
    ...supplier,
    ...statusConfig,
    ...dashboard,
    ...supplier,
    ...productGroup,
    ...manufacturer,
    ...rankingManufacturer,
    ...unit,
    ...medicine,
}
export default en;
