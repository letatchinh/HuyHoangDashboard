import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { useEffect, useMemo, useState } from 'react';
import { get, truncate } from 'lodash';
import { BASE_URL } from '~/constants/defaultValue';

const listKey = {
  groupProduct: 'groupProduct',
  groupSupplier: 'groupSupplier',
  groupByRangerDateWithProduct: 'groupByRangerDateWithProduct',
  groupByRangerDateWithSupplier: 'groupByRangerDateWithSupplier',
} as const;
type propsType = {

}
const PRODUCT = 'groupProduct';
const SUPPLIER = 'groupSupplier';
const DATE_WITH_PRODUCT = 'groupByRangerDateWithProduct';
const DATE_WITH_SUPPLIER = 'groupByRangerDateWithSupplier';

export default function ReportProductSupplier(props:propsType) : React.JSX.Element {
  const [viewMode, setViewMode] = useState(PRODUCT)
  const [data, setData] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);

  const [keySelect, setKeySelect] = useState<string>(
    listKey.groupProduct
  );

  useEffect(() => {
    (async () => {
      const responsive = await fetch(
        `${BASE_URL}/api/v1/report-product`,
        {
          method: 'POST',
        }
      );
      const json = await responsive.json();
      setData(json.data);
      setDetail(json.info);
    })();
    return () => {};
  }, [setData]);

  const keyInData = useMemo(() => {
    if (data) {
      return data[keySelect].reduce(
        (result: string[], current: { [key: string]: unknown }) => {
          const listKey: string[] = Object.keys(current).filter(
            (el) => el !== '_id'
          );
          listKey.map((key: string) => {
            if (!result.includes(key)) {
              result.push(key);
            }
          });
          return result;
        },
        [] as Array<string>
      );
    }
    return [];
  }, [data, keySelect]);
  console.log(keySelect, "keyInData");
  
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div style={{ width: '90%', height: '80%' }}>
        <ResponsiveBar
          data={data?.[keySelect] ?? []}
          keys={keyInData}
          indexBy="_id"
          margin={{ top: 50, right: 200, bottom: 100, left: 100 }}
          padding={0.5}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={{ scheme: 'nivo' }}
          defs={[
            {
              id: 'dots',
              type: 'patternDots',
              background: 'inherit',
              color: '#38bcb2',
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: 'lines',
              type: 'patternLines',
              background: 'inherit',
              color: '#eed312',
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          fill={[
            {
              match: {
                id: 'fries',
              },
              id: 'dots',
            },
            {
              match: {
                id: 'sandwich',
              },
              id: 'lines',
            },
          ]}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 1.6]],
          }}
          onClick={(e) => {
            console.log('e :>> ', e);
          }}
          label={(key) => {
            return Number(key.value).toLocaleString('vi');
          }}
          tooltip={(e) => {
          return  <span>{get(detail, [keySelect, e.id], e.id) + ': ' + Number(e.value).toLocaleString('vi')}</span>
         
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -30,
            legend: '_id',
            legendPosition: 'middle',
            legendOffset: 32,
            // truncateTickAt: 10,
            format: (value) =>
              truncate(get(detail, [keySelect, value], value), { length: 10 }),
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: 'middle',
            legendOffset: -40,
            truncateTickAt: 0,
            format: (v) => Number(v).toLocaleString('vi'),
          }}
          enableLabel={true}
          // layers={['grid', 'axes', 'bars', 'markers', 'legends', 'annotations', 'totals']}
          // totalsOffset={6}
          // enableTotals={true}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 1.6]],
          }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,

              itemDirection: 'left-to-right',
              itemOpacity: 0.5,
              symbolSize: 24,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          role="application"
          barAriaLabel={(e) =>
            e.id + ': ' + e.formattedValue + ' in country: ' + e.indexValue
          }
        />
      </div>
    </div>
  );
};