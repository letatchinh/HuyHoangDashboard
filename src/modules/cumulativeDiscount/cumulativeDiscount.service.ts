import dayjs from "dayjs";
import { forIn, get, min, pick } from "lodash";
import { TYPE_DISCOUNT, TYPE_REWARD } from "./constants";
import {
  applyTimeSheetType,
  cumulativeDiscountType,
  cumulativeTimeSheet,
} from "./cumulativeDiscount.modal";
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
dayjs.extend(quarterOfYear)

interface TempObject {
  session?: number | string;
  d_start: number;
  d_end: number;
  typeTemp?: string;
  id?: any;
  session_id?: any;
}
export class DiscountFactory {
  prefix: string = "@id@";
  #generatorRepeatItem({
    session,
    d_start,
    d_end,
    typeTemp,
    id,
    session_id,
  }: TempObject) {
    return {
      d_start,
      d_end,
      session_id:
        session_id ?? typeTemp + "_" + session + "_" + (id ? id : this.prefix),
    };
  }
  #isInMonth(d: number, m: number): any {
    return min([
      d,
      dayjs()
        .month(m - 1)
        .endOf("month")
        .date(),
    ]);
  }
  #monthsOfQuarter(q: number) {
    // Calculate the starting month of the quarter
    const startMonth = (q - 1) * 3 + 1;

    // Create an array to store the months
    const monthsInQuarter = [];

    // Loop through the months in the quarter
    for (let i = 0; i < 3; i++) {
      const monthStartDate = dayjs()
        .month(startMonth + i - 1)
        .date(1)
        .startOf("month")
        .format("M");
      monthsInQuarter.push(monthStartDate);
    }
    return monthsInQuarter;
  }
  #quarterOfMonth(m:number){
    return dayjs().month(m-1).quarter();
  }
  #quarterOfMonths(repeatCumulative:any){
    let repeatQuarter: any[] = [];
    forIn(repeatCumulative, (value, key) => {
      const quarter = this.#quarterOfMonth(+key)
      if (!repeatQuarter?.includes(quarter)) {
        repeatQuarter.push(quarter);
      }
    });
    return repeatQuarter;
  }
  handleConvertOutputCumulative(item: cumulativeDiscountType) {
    const cumulativeTimeSheetItem = get(item, "cumulativeTimeSheet");
    const gteRanger: any = get(cumulativeTimeSheetItem, "repeat.gteRanger");
    const lteRanger: any = get(cumulativeTimeSheetItem, "repeat.lteRanger");
    const typeRepeatSheet = get(cumulativeTimeSheetItem, "typeRepeat");
    const valueRepeat: any = get(cumulativeTimeSheetItem, "repeat");
    const id: any = get(item, "_id");
    let repeat: any = {};
    switch (typeRepeatSheet) {
      case "ranger":
        const isOutMonth = gteRanger > lteRanger;
        if (isOutMonth) {
          for (let session = 1; session <= 12; session++) {
            repeat[session] = [
              this.#generatorRepeatItem({
                session: session === 1 ? 12 : session - 1,
                d_start: 1,
                d_end: lteRanger,
                typeTemp: "T",
                id,
              }),
              this.#generatorRepeatItem({
                session,
                d_start: gteRanger,
                d_end: 0,
                typeTemp: "T",
                id,
              }),
            ];
          }
        } else {
          for (let session = 1; session <= 12; session++) {
            repeat[session] = [
              this.#generatorRepeatItem({
                session,
                d_start: gteRanger,
                d_end: this.#isInMonth(lteRanger, session),
                typeTemp: "T",
                id,
              }),
            ];
          }
        }
        break;

      case "month":
        valueRepeat?.forEach((item: any) => {
          repeat[item] = [
            this.#generatorRepeatItem({
              session: item,
              d_start: 1,
              d_end: 0,
              typeTemp: "T",
              id,
            }),
          ];
        });
        break;

      case "quarter":
        console.log(valueRepeat,'valueRepeat');
        valueRepeat?.forEach((q: any) => {
          const monthsOfQuarter = this.#monthsOfQuarter(q);
          monthsOfQuarter?.forEach((item: any) => {
            const quarterOfMonth = this.#quarterOfMonth(+item)
            repeat[item] = [
              this.#generatorRepeatItem({
                session: quarterOfMonth,
                d_start: 1,
                d_end: 0,
                typeTemp: "Q",
                id,
              }),
            ];
          });
        });
        break;
      default:
        break;
    }
    return repeat;
  }
  handleConvertOutputApplyTimeSheet(
    item: cumulativeDiscountType,
    repeatCumulative: any
  ) {
    const applyTimeSheetItem = get(item, "applyTimeSheet");
    const gteRanger: any = get(applyTimeSheetItem, "repeat.gteRanger");
    const lteRanger: any = get(applyTimeSheetItem, "repeat.lteRanger");
    const typeRepeat = get(applyTimeSheetItem, "typeRepeat");
    const id: any = get(item, "_id");
    let repeat: any = {};
    switch (typeRepeat) {
      case "ranger":
        const isOutMonth = gteRanger > lteRanger;

        if (isOutMonth) {
          for (let session = 1; session <= 12; session++) {
            const isCumulativeInMonth = repeatCumulative[session]?.length === 1;
            repeat[session] = [
              this.#generatorRepeatItem({
                session:
                  session === 1
                    ? isCumulativeInMonth
                      ? 12
                      : 11
                    : session - (isCumulativeInMonth ? 1 : 2),
                d_start: 1,
                d_end: lteRanger,
                typeTemp: "T",
                id,
              }),
              this.#generatorRepeatItem({
                session:
                  session === 1
                    ? isCumulativeInMonth
                      ? 1
                      : 12
                    : session - (isCumulativeInMonth ? 0 : 1),
                d_start: gteRanger,
                d_end: 0,
                typeTemp: "T",
                id,
              }),
            ];
          }
        } else {
          for (let session = 1; session <= 12; session++) {
            const isCumulativeInMonth = repeatCumulative[session]?.length === 1;
            repeat[session] = [
              this.#generatorRepeatItem({
                session:
                  session === 1
                    ? isCumulativeInMonth
                      ? 1
                      : 12
                    : session - (isCumulativeInMonth ? 0 : 1),
                d_start: gteRanger,
                d_end: this.#isInMonth(
                  lteRanger,
                  session - (isCumulativeInMonth ? 0 : 1)
                ),
                typeTemp: "T",
                id,
              }),
            ];
          }
        }
        break;

      case "month":
        for (const [key, value] of Object.entries(repeatCumulative)) {
          const session = +key;
          repeat[session === 12 ? 1 : session + 1] =
            [
              {
                d_start: gteRanger,
                d_end: lteRanger,
                session_id: get(value, "[0].session_id"),
              },
            ] ?? [];
        }
        break;
        case "quarter":
          for (const [key, value] of Object.entries(repeatCumulative)) {
            const session = +key === 12 ? 1 : +key + 1;
            if([1,4,7,10].includes(session)){
              repeat[session] =
              [
                {
                  d_start: gteRanger,
                  d_end: lteRanger,
                  session_id: get(value, "[0].session_id"),
                },
              ] ?? [];
            }
      
          }
          break;
      default:
        break;
    }
    return repeat;
  }
  handleConvertInputCumulative(cumulativeDiscount: cumulativeDiscountType[]) {
    const newCumulativeDiscount = cumulativeDiscount?.map(
      (value: cumulativeDiscountType) => {
        const cumulativeTimeSheetItem = get(value, "cumulativeTimeSheet");
        const applyTimeSheetItem = get(value, "applyTimeSheet");
        const repeatCumulative = get(cumulativeTimeSheetItem, "repeat",{});
        const repeatApply = get(applyTimeSheetItem, "repeat",{});
        const typeRepeat = get(cumulativeTimeSheetItem, "typeRepeat");
        const firstKeyCumulative = Object.keys(repeatCumulative)?.[0];
        const firstKeyApply = Object.keys(repeatApply)?.[0];
        const firstRepeatCumulative = repeatCumulative?.[firstKeyCumulative];
        const firstRepeatApply = repeatApply?.[firstKeyApply];
        switch (typeRepeat) {
          case "nope":
            return {
              ...value,
              applyTimeSheet: {
                ...applyTimeSheetItem,
                nonRepeat: {
                  gte: dayjs(get(applyTimeSheetItem, "nonRepeat.gte")),
                  lte: dayjs(get(applyTimeSheetItem, "nonRepeat.lte")),
                },
              },
              cumulativeTimeSheet: {
                ...cumulativeTimeSheetItem,
                nonRepeat: {
                  gte: dayjs(get(cumulativeTimeSheetItem, "nonRepeat.gte")),
                  lte: dayjs(get(cumulativeTimeSheetItem, "nonRepeat.lte")),
                },
              },
            };

          case "ranger":

            let gteRangerCumulative;
            let lteRangerCumulative;
            let gteRangerApply;
            let lteRangerApply;
            
            if (firstRepeatCumulative?.length === 1) {
              // Only In Month
              gteRangerCumulative = get(firstRepeatCumulative, "[0].d_start");
              lteRangerCumulative = get(firstRepeatCumulative, "[0].d_end");
            } else {
                // Out month
              gteRangerCumulative = get(firstRepeatCumulative, "[1].d_start");
              lteRangerCumulative = get(firstRepeatCumulative, "[0].d_end");
            }
            if (firstRepeatApply?.length === 1) {
              // Only In Month
              gteRangerApply = get(firstRepeatApply, "[0].d_start");
              lteRangerApply = get(firstRepeatApply, "[0].d_end");
            } else {
                // Out month
              gteRangerApply = get(firstRepeatApply, "[1].d_start");
              lteRangerApply = get(firstRepeatApply, "[0].d_end");
            };
            return {
              ...value,
              applyTimeSheet: {
                ...applyTimeSheetItem,
                repeat: {
                    gteRanger : gteRangerApply,
                    lteRanger : lteRangerApply
                },
              },
              cumulativeTimeSheet: {
                ...cumulativeTimeSheetItem,
                repeat: {
                    gteRanger : gteRangerCumulative,
                    lteRanger : lteRangerCumulative
                },
              },
            };

            case "month":
              let repeat : any = [];
              forIn(repeatCumulative,(value,key) => {
                repeat.push(+key);
              });
              return {
                ...value,
                applyTimeSheet: {
                  ...applyTimeSheetItem,
                  repeat: {
                      gteRanger : get(firstRepeatApply, "[0].d_start"),
                      lteRanger : get(firstRepeatApply, "[0].d_end")
                  },
                },
                cumulativeTimeSheet: {
                  ...cumulativeTimeSheetItem,
                  repeat,
                },
              };
              case "quarter":
                let repeatQuarter : any[] = this.#quarterOfMonths(repeatCumulative);
                console.log(repeatQuarter,'repeatQuarter');
                return {
                  ...value,
                  applyTimeSheet: {
                    ...applyTimeSheetItem,
                    repeat: {
                        gteRanger : get(firstRepeatApply, "[0].d_start"),
                        lteRanger : get(firstRepeatApply, "[0].d_end")
                    },
                  },
                  cumulativeTimeSheet: {
                    ...cumulativeTimeSheetItem,
                    repeat : repeatQuarter,
                  },
                };
          default:
            break;
        }

        return value;
      }
    );
    console.log(newCumulativeDiscount,'newCumulativeDiscount');
    return newCumulativeDiscount;
  }
  handleConvertTextViewCumulativeTimeSheet(cumulativeTimeSheetItem:any){
    const typeRepeat = get(cumulativeTimeSheetItem, "typeRepeat");

    const repeatCumulative = get(cumulativeTimeSheetItem, "repeat");
    const gteRanger = get(repeatCumulative,'gteRanger');
    const lteRanger = get(repeatCumulative,'lteRanger');
    let text = "";
    switch (typeRepeat) {
      case "nope":
        text = `Từ ${dayjs(
          get(cumulativeTimeSheetItem, "nonRepeat.gte")
          ).format("DD-MM-YYYY")} đến ${dayjs(
            get(cumulativeTimeSheetItem, "nonRepeat.lte")
            ).format("DD-MM-YYYY")}`;
            break;

        case "ranger":
      
        if(gteRanger <= lteRanger){ // In Month
          text = `Từ ngày ${gteRanger} đến ngày ${lteRanger} mỗi tháng`
        }else{
          text = `Từ ngày ${gteRanger} đến ngày ${lteRanger} tháng sau`
        }
        break;

        case "month":
          text = `Diễn ra vào các tháng ${repeatCumulative?.join(', ')} và nhận thưởng vào tháng sau`;
          break
        case "quarter":
          const quarter = this.#quarterOfMonths(repeatCumulative);
          text = `Diễn ra vào các quý ${quarter?.join(' , ')} và nhận thưởng vào quý sau`
          break

      default:
        break;
    }
    return text;
  }
  handleConvertTextViewApplyTimeSheet(applyTimeSheetItem:any){
    let text = "";
    const typeRepeat = get(applyTimeSheetItem, "typeRepeat");

    const repeatCumulative = get(applyTimeSheetItem, "repeat");
    const gteRanger = get(repeatCumulative,'gteRanger');
    const lteRanger = get(repeatCumulative,'lteRanger');
    switch (typeRepeat) {
      case "nope":
        text = `Từ ngày ${dayjs(
          get(applyTimeSheetItem, "nonRepeat.gte")
          ).format("DD-MM-YYYY")} đến ${dayjs(
            get(applyTimeSheetItem, "nonRepeat.lte")
            ).format("DD-MM-YYYY")}`;
            break;

        case "ranger":
      
        if(gteRanger <= lteRanger){ // In Month
          text = `Từ ngày ${gteRanger} đến ngày ${lteRanger} mỗi tháng`
        }else{
          text = `Từ ngày ${gteRanger} đến ngày ${lteRanger} tháng sau`
        }
        break;

        case "month":
          text = `Diễn ra vào ngày ${gteRanger} đến ngày ${lteRanger} sau khi kết thúc chu kỳ tích luỹ của mỗi tháng`;
          break
        case "quarter":
          text = `Diễn ra vào ngày ${gteRanger} đến ngày ${lteRanger} sau khi kết thúc chu kỳ tích luỹ của mỗi quý`;
          break

      default:
        break;
    }

    return text;
  }
}

const rootField = [
  "name",
  "target",
  "targetId",
  "typeDiscount",
  "typeReward",
  "value",
  "valueType",
  "status",
  "_id",
];
export const pickCore = (submitData: any) => pick(submitData, rootField);

export const pickSoft = (submitData: any) => pick(submitData, rootField);
export const pickLK = (submitData: any) =>
  pick(submitData, [
    ...rootField,
    "condition",
    "applyTimeSheet",
    "cumulativeTimeSheet",
  ]);

export const convertInitDiscount = (
  cumulativeDiscount: cumulativeDiscountType[]
) => {
  const DiscountMethod = new DiscountFactory();
  const newCumulativeDiscount = DiscountMethod.handleConvertInputCumulative(cumulativeDiscount);
  return newCumulativeDiscount;
};

export const onDiscountChange = (
  newCumulativeDiscount: cumulativeDiscountType[]
) => {
  const cumulativeDiscount = newCumulativeDiscount?.map(
    (item: cumulativeDiscountType) => {
      const typeDiscount = get(item, "typeDiscount");
      const condition = get(item, "condition");
      const typeReward = get(item, "typeReward");
      const value = get(item, "value");
      if (typeDiscount === TYPE_DISCOUNT.LK) {
        return {
          ...item,
          condition: { ...condition, isRanger: !!get(condition, "lte") },
          value: typeReward === TYPE_REWARD.VALUE ? value : 0,
        };
      } else {
        return {
          ...item,
          // typeReward: TYPE_REWARD.VALUE,
        };
      }
    }
  );

  return cumulativeDiscount;
};

export const convertSubmitDiscount = (
  cumulativeDiscount: cumulativeDiscountType[]
) => {
  const newCumulativeDiscount = cumulativeDiscount?.map(
    (item: cumulativeDiscountType) => {
      const DiscountMethod = new DiscountFactory();
      const { typeDiscount, _id } = item;
      switch (typeDiscount) {
        case TYPE_DISCOUNT.LK:
          let cumulativeTimeSheet: any = {};
          let applyTimeSheet: any = {};

          const applyTimeSheetItem = get(item, "applyTimeSheet");
          const cumulativeTimeSheetItem: any = get(item, "cumulativeTimeSheet");
          const typeRepeat = get(cumulativeTimeSheetItem, "typeRepeat", "nope");
          if (typeRepeat === "nope") {
            Object.assign(cumulativeTimeSheet, {
              nonRepeat: {
                gte: dayjs(
                  get(cumulativeTimeSheetItem, "nonRepeat.gte")
                ).startOf('d').format("YYYY-MM-DD HH:mm:ss"),
                lte: dayjs(
                  get(cumulativeTimeSheetItem, "nonRepeat.lte")
                ).endOf('d').format("YYYY-MM-DD HH:mm:ss"),
                session_id: "ANY_" + (_id ? _id : DiscountMethod.prefix),
              },
              typeRepeat,
            });
            Object.assign(applyTimeSheet, {
              nonRepeat: {
                gte: dayjs(get(applyTimeSheetItem, "nonRepeat.gte")).startOf('d').format(
                  "YYYY-MM-DD HH:mm:ss"
                ),
                lte: dayjs(get(applyTimeSheetItem, "nonRepeat.lte")).endOf('d').format(
                  "YYYY-MM-DD HH:mm:ss"
                ),
                session_id: "ANY_" + (_id ? _id : DiscountMethod.prefix),
              },
              typeRepeat,
            });
          } else {
            const repeatCumulative = DiscountMethod.handleConvertOutputCumulative(item);
            const repeatApply =  DiscountMethod.handleConvertOutputApplyTimeSheet(item,repeatCumulative);
            Object.assign(cumulativeTimeSheet, { repeat: repeatCumulative,typeRepeat  });
            Object.assign(applyTimeSheet, { repeat: repeatApply,typeRepeat });
          }
          const newItem = {
            ...item,
            applyTimeSheet,
            cumulativeTimeSheet,
          };
          return pickLK(newItem);
        case TYPE_DISCOUNT["DISCOUNT.CORE"]:
          return pickCore(item);
        case TYPE_DISCOUNT["DISCOUNT.SOFT"]:
          return pickSoft(item);
        default:
          return item;
      }
    }
  );
  return newCumulativeDiscount;
};
