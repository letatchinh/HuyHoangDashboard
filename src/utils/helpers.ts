import { TablePaginationConfig } from "antd";
import dayjs from "dayjs";
import { forIn, get, groupBy, keys,flattenDeep,compact,uniq } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { REF_COLLECTION, STATUS } from "~/constants/defaultValue";

import subvn from "~/core/subvn";
import POLICIES, { CORE_ACTION } from "~/modules/policy/policy.auth";
import { PoliciesType, policyType } from "~/modules/policy/policy.modal";
import { useAdapter } from "~/modules/auth/auth.hook";
import { ADAPTER_KEY } from "~/modules/auth/constants";
import { PATH_APP } from "~/routes/allPath";
import relativeTime from "dayjs/plugin/relativeTime";
import localeEn from "dayjs/locale/vi"; // With a custom alias for the locale object

export const getPaging = (response: any) => ({
  current: response.page,
  pageSize: response.limit,
  total: response.totalDocs,
});

export const pagingTable = (paging : any,onParamChange : any) :TablePaginationConfig => ({
  ...paging,
  onChange(page : any, pageSize : any) {
    onParamChange({ page, limit: pageSize });
  },
  showSizeChanger : true,
  showTotal: (total) => `Tổng cộng: ${total} `,
  size:"small"
})

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
export const getAreaByCode = (areaCode? : string) => {
  if(!areaCode) {return null};
  const areas = subvn.getAreas();
  return areas?.find((area) => areaCode === area?.code);
}
export const concatAddress = (address: any): string => {
  if (!address) return "";
  const { street, ward, district, districtId, city, cityId, wardId,area, areaId} = address;
  let ward_ = ward ?? get(subvn.getWardsByCode(wardId), "name");
  let district_ = district ?? get(subvn.getDistrictByCode(districtId), "name");
  let city_ = city ?? get(subvn.getCityByCode(cityId), "name");
  let area_ = area ?? get(getAreaByCode(areaId), "name");
  return [street, ward_, district_, city_,area_].filter(Boolean).join(", ");
};

export function removeAccents(str: any) {
  return str
    .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
    .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
    .replace(/ì|í|ị|ỉ|ĩ/g, "i")
    .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
    .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
    .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
    .replace(/đ/g, "d");
}

export const filterAcrossAccents = (input: any, option: any) => {
  return (
    removeAccents(option.children.toLowerCase()).indexOf(
      removeAccents(input.toLowerCase())
    ) >= 0
  );
};
export const StringToSlug = (str: string) => {
  const result = removeAccents(str)
  return result.replaceAll(/\s+/g, '-')
};

export const filterSelectWithLabel = (input: any, option: any) => {
  return (
    removeAccents(option?.label?.toLowerCase()).indexOf(
      removeAccents(input?.toLowerCase())
    ) >= 0
  );
};

export const formatter = (value:any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const floorFormatter = (value:number) => `${Math.floor(value)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const ceilFormatter = (value:number) => `${Math.ceil(value)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const getActive = (list : []) => list?.filter((item:any) => get(item,'status') === STATUS.ACTIVE);
interface UseExpandrowTableClick {
  select: string[];
  setSelect: React.Dispatch<React.SetStateAction<string[]>>;
  onClick: (item: any) => (param?:any) => void;
}

export const useExpandrowTableClick: () => UseExpandrowTableClick = () => {
  const [select, setSelect] = useState<string[]>([]);

  const onClick = (item: any) => (evt?:any) => {
    if(evt.target?.cellIndex ===0){
      const parentId = item.parentId;
      let children = item?.children ?? [];
      const id = item._id;
  
      if (children.length && id) {
        function repeat(value: any): string[] {
          let res = [value._id];
          if (value?.children) {
            let child = value?.children.map(repeat);
            res = flattenDeep([...res, ...child]);
          }
          return res;
        }
  
        children = children.map(repeat);
  
        if (select.includes(id)) {
          let filter = select.filter((_id) => _id !== id);
          filter = filter.filter(
            (_id) => !flattenDeep(children).includes(_id),
          );
          setSelect(filter);
        } else {
          setSelect(uniq(compact([...select, id, parentId])));
        }
      }
    }
  };

  return { select, setSelect, onClick };
};


interface FetchStateParams {
  api: (query: any) => Promise<any>;
  query?: any;
  useDocs?: boolean;
  init?: any[];
  fieldGet?: string;
  reFetch?: any; // Adjust the type based on your specific requirements
  nullNotFetch?: boolean;
  conditionRun?: boolean;
  shouldRun?: boolean;
}

export const useFetchState = ({ api, query, useDocs = true, init = [], fieldGet,reFetch,nullNotFetch = false ,conditionRun = false,shouldRun=true} : FetchStateParams) : any => {
  const [data, setData] = useState(init);
  const [loading, setLoading] = useState(false);
  const [totalDocs, setTotalDocs] = useState(0);
  const req = useCallback(api, [api]);
  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const response = await req(query);
      setTotalDocs(get(response,'totalDocs',0));
      if (fieldGet) {
        setData(get(response, fieldGet))
      } else {
        if (useDocs) {
          setData(get(response, 'docs', []));
        } else {
          setData(response);
        }
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [query,reFetch])
  useEffect(() => {
    if(shouldRun){
      if(conditionRun){
        fetch()
      }else{
        if(nullNotFetch){
          !!query && fetch();
        }else{
          fetch()
        }
      }
    }

  }, [fetch,nullNotFetch,query]);
  const dataReturn = useMemo(() => data, [data])
  return [dataReturn, loading,totalDocs]
};


export const getShortName = (name: string): string => {
  if (!!!name) return "";
  const arrName = (name).trim()?.split(' ');
  if (!arrName.length) return "";
  return (arrName[arrName.length - 2]?.charAt(0) || "") + (arrName[arrName.length - 1]?.charAt(0) || "");
};
export function convertQueryToObject(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const paramsObject: any = {};
  urlParams.forEach((value, key) => {
    paramsObject[key] = value;
  });
  return paramsObject
}
export const formatNumberThreeComma = (num: any) => num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const formatNumberIsPercent = (value: any) => {
  if (!value) return '';
  const floatValue = parseFloat(value);
  if (floatValue <= 100) {
      return floatValue.toString();
  } else {
      return (floatValue / 10).toString();
  }
};
export const compactAddress = (address: any) => compact([address?.street, address?.ward, address?.district, address?.city]).join(", ") 

export const convertQueryString = (queryString: any) => {
  const queryJson = Object.entries(getExistProp(queryString));
  const stringQuery = queryJson.reduce((total, cur: any, i) => (
    total.concat((i === 0 ? cur[0] ? '?' : '' : '&'), cur[0], '=', encodeURIComponent(cur[1]))
  ), '');
  return stringQuery;
};

export function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const getValueQuery = (key : string) : any => {
  let search = window.location.search;
  let params = new URLSearchParams(search);
  let foo = params.get(key);
  return foo;
};

export const getOptions = (constantVi : any) => {
  let options : any[] = [];
  forIn(constantVi,(value,key) => {
    options.push({
      label : value,
      value : key
    })
  });
  return options;
}

export const filterOptionSlug = (input:any,option:any) => StringToSlug(get(option,'label','')?.toLowerCase())?.includes(StringToSlug(input?.trim()?.toLowerCase()));
export const filterSlug = (input:any,target:any) => StringToSlug(target?.toLowerCase())?.includes(StringToSlug(input?.trim()?.toLowerCase()));

export const filterAcrossAccentsByLabel = (input: any, option: any) => {
  return (
    removeAccents(option?.label?.toLowerCase()).indexOf(removeAccents(input.toLowerCase())) >= 0
  );
};

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

export const DeviceDetector = () => {
  const getDeviceInfo = (): DeviceInfo => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /mobile/.test(userAgent);
    const isTablet = /tablet/.test(userAgent);
    const isDesktop = !isMobile && !isTablet;

    return {
      isMobile: isMobile && !isTablet,
      isTablet,
      isDesktop,
    };
  };
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => getDeviceInfo());
  // useEffect(() => { // Close Code Because Make Re-Render Each Resize And Your Variable Not use
  //   const handleResize = () => {
  //     setDeviceInfo(getDeviceInfo());
  //   };

  //   window.addEventListener('resize', handleResize);

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  return getDeviceInfo();
};

//
var utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

export const vietnamMoment = (v: any, formatTime?: any) => {
  if (v) {
    // const utcMoment = dayjs.utc(v);
    const utcMoment = dayjs(v);
    if (formatTime) {
      return utcMoment.format(formatTime);
    }
    else {
      return utcMoment
    }
  }
  return null
 
};
//
export const getValueOfMath = (valueTarget:number,valueDiscount : number,typeValue : 'PERCENT' | 'VALUE') =>  typeValue === 'PERCENT' ?  valueDiscount * valueTarget / 100 : valueDiscount;
export const getValueOfPercent = (value: number, percent: number) => value * percent / 100;
export const getTextOfDiscount = (value: number, typeValue: "PERCENT" | "VALUE") => typeValue === 'PERCENT' ? `${value}%` : formatter(value);

type typePoly= keyof PoliciesType;
type ActionPolicy = keyof typeof CORE_ACTION
type KeyPolicy = 'QUOTATION' | 'BILL';

export const permissionConvert = (query:any)=>(action: ActionPolicy, key: KeyPolicy)  => {
  const per =  (k:KeyPolicy)=>(pr:any)=> action.concat('_').concat(k) .concat(pr) as typePoly ;
  const _ = ['PARTNER', 'EMPLOYEE', 'PHARMACY']
  if (!get(query, 'refCollection')) {
    return POLICIES[ per(key)('')] as [string,policyType] 
  };
  const objEntry = _.map((e) => [REF_COLLECTION[e], per(key)(e)])
  let objj = Object.fromEntries(objEntry) as {
    [key in keyof typeof query ]: typePoly
  } 
  return POLICIES[ objj[ get(query,'refCollection') as any ] ]as [string,policyType] 
};

export const convertFiles = (files: any[]) => {
  return files?.map((item: any) => ({
    fileName: item?.name,
    url: item?.response?.url
  }));
};
export const useIsAdapterSystem = () => {
  const adapter = useAdapter();
  const isAdapterSystem = useMemo(() => adapter === ADAPTER_KEY.STAFF, [adapter]);
  return !!isAdapterSystem; // return true if adapter is system
};

type keyRefCollection = 'quotation' | 'bill';
export const checkRefCollection = (key: keyRefCollection,pathname: string) => {
  let refCollection = '';
  if (pathname === PATH_APP[key].root) {
    return 
  };
  if (pathname === PATH_APP[key].employee) {
    return refCollection = REF_COLLECTION.EMPLOYEE
  };
  if (pathname === PATH_APP[key].collaborator) {
    return refCollection = REF_COLLECTION.PARTNER
  };
  if (pathname === PATH_APP[key].pharmacy) {
    return refCollection = REF_COLLECTION.PHARMACY
  };
};
export const CheckPermission: any = (pathname: string) => {
   const newPathname = pathname.replace(/\/[0-9a-fA-F]+$/, '');
  if (newPathname === PATH_APP.bill.root) {
    return 'bill'
  };
  if (newPathname === PATH_APP.bill.employee) {
    return 'billEmployee'
  };
  if (newPathname === PATH_APP.bill.collaborator) {
    return 'billPartner'
  };
  if (newPathname === PATH_APP.bill.pharmacy) {
    return 'billPharmacy'
  };
};

export const daysAgo = (postDate: any) => { 
  dayjs.extend(relativeTime).locale(localeEn) 
  var fromNowOn = dayjs(postDate).fromNow(); 
  return(fromNowOn)
};
