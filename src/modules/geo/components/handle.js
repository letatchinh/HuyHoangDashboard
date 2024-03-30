import { uniq, xor, get, some } from 'lodash';
import subVn from 'sub-vn';
export const onRegexMap =
  (path, valid = true, exact = false) =>
  (e) =>
    new RegExp('^' + path + (exact ? '$' : ''), 'ig').test(e) === valid;
export const onRegexDiffMap = (path) => (e) =>
  new RegExp('^' + e, 'ig').test(path);
export const checkSome = (arr, path) => some(arr, onRegexMap(path));

let getPath =
  (...codes) =>
  (item) => {
    return codes.map((field) => '/' + get(item, field)).join('');
  };

export const getProvindByAreaCode = (value) => {
  return subVn.getProvindByAreaCode(value).map(getPath('area_code', 'code'));
};

export const getDistrictsByProvinceCode = (value) => {
  return subVn
    .getDistrictsByProvinceCode(value)
    .map(getPath('area_code', 'province_code', 'code'));
};
export const _regex = (pattern) => new RegExp('^' + pattern, 'ig');
