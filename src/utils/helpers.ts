import { forIn, get, groupBy, keys } from "lodash";
import subvn from "~/core/subvn";

export const getPaging = (response: any) => ({
  current: response.page,
  pageSize: response.limit,
  total: response.totalDocs,
});

/**
 *
 * @param {Array} listOptionSearch expects an array {label, value}
 * @param {Object} query query search parameters
 * @param {Object} param param Searching
 * To clear the query search except param
 * Example: after search want to remove all query in listOptionSearch
 */
export const clearQuerySearch = (
  listOptionSearch?: any[],
  query?: any,
  param?: any
) => {
  // group listOptionSearch by value
  const groupByKey = groupBy(listOptionSearch, (e: any) => get(e, "value"));
  // loop query to remove all query in listOptionSearch  except param
  forIn(query, (values, key, obj) => {
    if (groupByKey[key] && keys(param)?.some((e) => groupByKey[e])) {
      obj[key] = null;
    }
  });
};

export const getExistProp = (data: any) => {
  const result = Object.keys(data).reduce((nextData, key) => {
    if (data[key]) {
      return {
        ...nextData,
        [key]: data[key],
      };
    }

    return nextData;
  }, {});

  return result;
};

export const concatAddress = (address: any): string => {
  if (!address) return "";
  const { street, ward, district, districtId, city, cityId, wardId } = address;
  let ward_ = ward ?? get(subvn.getWardsByCode(wardId), "name");
  let district_ = district ?? get(subvn.getDistrictByCode(districtId), "name");
  let city_ = city ?? get(subvn.getCityByCode(cityId), "name");
  return [street, ward_, district_, city_].filter(Boolean).join(",");
};

export function removeAccents(str : any) {
  return str
    .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
    .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
    .replace(/ì|í|ị|ỉ|ĩ/g, "i")
    .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
    .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
    .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
    .replace(/đ/g, "d")
}

export const filterAcrossAccents = (input:any, option:any) => {
  return (
    removeAccents(option.children.toLowerCase()).indexOf(removeAccents(input.toLowerCase())) >= 0
  );
};
export const StringToSlug = (str: string) => {
  const result = removeAccents(str)
  return result.replaceAll(/\s+/g, '-')
};

export const formatter = (value:number) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const floorFormatter = (value:number) => `${Math.floor(value)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const ceilFormatter = (value:number) => `${Math.ceil(value)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
