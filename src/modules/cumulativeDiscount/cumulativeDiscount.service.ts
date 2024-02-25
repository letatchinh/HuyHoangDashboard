import dayjs from "dayjs";
import { forIn, get, min, omit, pick } from "lodash";
import { TYPE_DISCOUNT, TYPE_REPEAT, TYPE_REWARD } from "./constants";
import {
  applyTimeSheetType,
  conditionType,
  cumulativeDiscountType,
  cumulativeTimeSheet,
  TypeRepeatType,
} from "./cumulativeDiscount.modal";
import ProductModule from "~/modules/product";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { variantType } from "../product/product.modal";
import { v4 } from "uuid";
dayjs.extend(quarterOfYear);

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
  generatorSession() {
    return "$" + v4().slice(0, 5);
  }
  generatorSessionIdNonRepeat(session: any, id: any) {
    return `ANY_${session ? session : this.generatorSession()}_${
      id ? id : this.prefix
    }`;
  }
  getSession(session_id: string) {
    const session = session_id?.indexOf("$");
    if (session === -1) return null;
    return session_id.slice(session, session + 6);
  }
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
  #quarterOfMonth(m: number) {
    return dayjs()
      .month(m - 1)
      .quarter();
  }
  #quarterOfMonths(repeatCumulative: any) {
    let repeatQuarter: any[] = [];
    forIn(repeatCumulative, (value, key) => {
      const quarter = this.#quarterOfMonth(+key);
      if (!repeatQuarter?.includes(quarter)) {
        repeatQuarter.push(quarter);
      }
    });
    return repeatQuarter;
  }
  handleConvertOutputTimeSheetNonRepeat(timeSheet: any, session_id: any) {
    return {
      nonRepeat: {
        gte: dayjs(get(timeSheet, "nonRepeat.gte"))
          .startOf("d")
          .format("YYYY-MM-DD HH:mm:ss"),
        lte: dayjs(get(timeSheet, "nonRepeat.lte"))
          .endOf("d")
          .format("YYYY-MM-DD HH:mm:ss"),
        session_id,
      },
    };
  }
  handleConvertOutputCumulativeTimeSheetNonRepeatYear(timeSheet: any, session_id: any) {
    return {
      nonRepeat: {
        gte: dayjs().set('year',get(timeSheet, "nonRepeat"))
          .startOf('y')
          .format("YYYY-MM-DD HH:mm:ss"),
        lte: dayjs().set('year',get(timeSheet, "nonRepeat"))
          .endOf('y')
          .format("YYYY-MM-DD HH:mm:ss"),
        session_id,
      },
    };
  }
  handleConvertOutputApplyTimeSheetNonRepeatYear(timeSheet: any, session_id: any) {
    return {
      nonRepeat: {
        gte: dayjs(get(timeSheet, "nonRepeat.gte"))
          .startOf('d')
          .format("YYYY-MM-DD HH:mm:ss"),
          lte: dayjs(get(timeSheet, "nonRepeat.lte"))
          .endOf('d')
          .format("YYYY-MM-DD HH:mm:ss"),
        session_id,
      },
    };
  }
  handleConvertOutputTimeSheetStart(
    timeSheetItem: cumulativeTimeSheet | null,
    idDiscount: any,
    typeRepeatSheet : TypeRepeatType
  ) {
    const gteRanger: any = get(timeSheetItem, "repeat.gteRanger");
    const lteRanger: any = get(timeSheetItem, "repeat.lteRanger");
    const valueRepeat: any = get(timeSheetItem, "repeat");
    const id: any = idDiscount;
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
        valueRepeat?.forEach((q: any) => {
          const monthsOfQuarter = this.#monthsOfQuarter(q);
          monthsOfQuarter?.forEach((item: any) => {
            const quarterOfMonth = this.#quarterOfMonth(+item);
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
    const typeRepeat = get(item, "typeRepeat");
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
          if ([1, 4, 7, 10].includes(session)) {
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
        case "year":
          console.log('year');
          break;
      default:
        break;
    }
    return repeat;
  }
  handleConvertInputCumulative(
    cumulativeDiscount: cumulativeDiscountType[],
    variants?: variantType[]
  ) {
    const newCumulativeDiscount = cumulativeDiscount?.map(
      (value: cumulativeDiscountType) => {
        let newValue = { ...value };
        const applyVariantId = get(newValue, "applyVariantId");
        const exchangeValue = ProductModule.service.getExchangeValue(
          applyVariantId,
          variants
        );
        const typeDiscount = get(value, "typeDiscount");
        const cumulativeTimeSheetItem = get(value, "cumulativeTimeSheet");
        const applyTimeSheetItem = get(value, "applyTimeSheet");
        const repeatCumulative = get(cumulativeTimeSheetItem, "repeat", {});
        const repeatApply = get(applyTimeSheetItem, "repeat", {});
        const typeRepeat = get(value, "typeRepeat");
        const firstKeyCumulative = Object.keys(repeatCumulative || {})?.[0];
        const firstKeyApply = Object.keys(repeatApply || {})?.[0];
        const firstRepeatCumulative = repeatCumulative?.[firstKeyCumulative];
        const firstRepeatApply = repeatApply?.[firstKeyApply];
        switch (typeRepeat) {
          case "nope":
            Object.assign(newValue, {
              applyTimeSheet: {
                ...applyTimeSheetItem,
                nonRepeat: {
                  gte: dayjs(get(applyTimeSheetItem, "nonRepeat.gte")),
                  lte: dayjs(get(applyTimeSheetItem, "nonRepeat.lte")),
                  session: this.getSession(
                    get(applyTimeSheetItem, "nonRepeat.session_id", "")
                  ),
                },
              },
            });
            if (cumulativeTimeSheetItem) {
              Object.assign(newValue, {
                cumulativeTimeSheet: {
                  ...cumulativeTimeSheetItem,
                  nonRepeat: {
                    gte: dayjs(get(cumulativeTimeSheetItem, "nonRepeat.gte")),
                    lte: dayjs(get(cumulativeTimeSheetItem, "nonRepeat.lte")),
                    session: this.getSession(
                      get(applyTimeSheetItem, "nonRepeat.session_id", "")
                    ),
                  },
                },
              });
            }

            break;
          case "year":
            Object.assign(newValue, {
              applyTimeSheet: {
                ...applyTimeSheetItem,
                nonRepeat: {
                  gte: dayjs(get(applyTimeSheetItem, "nonRepeat.gte")),
                  lte: dayjs(get(applyTimeSheetItem, "nonRepeat.lte")),
                  session: this.getSession(
                    get(applyTimeSheetItem, "nonRepeat.session_id", "")
                  ),
                },
              },
            });
            
            if (cumulativeTimeSheetItem) {
              Object.assign(newValue, {
                cumulativeTimeSheet: {
                  ...applyTimeSheetItem,
                  nonRepeat: +dayjs(get(applyTimeSheetItem, "nonRepeat.gte")).format("YYYY"),
                },
              });
            }

            break;
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
            }
            Object.assign(newValue, {
              applyTimeSheet: {
                ...applyTimeSheetItem,
                repeat: {
                  gteRanger: gteRangerApply,
                  lteRanger: lteRangerApply,
                },
              },
            });
            if (cumulativeTimeSheetItem) {
              Object.assign(newValue, {
                cumulativeTimeSheet: {
                  ...cumulativeTimeSheetItem,
                  repeat: {
                    gteRanger: gteRangerCumulative,
                    lteRanger: lteRangerCumulative,
                  },
                },
              });
            }
            break;
          case "month":
            let repeat: any = [];
            forIn(repeatCumulative, (value, key) => {
              repeat.push(+key);
            });

            if (cumulativeTimeSheetItem) {
              Object.assign(newValue, {
                cumulativeTimeSheet: {
                  ...cumulativeTimeSheetItem,
                  repeat,
                },
              });
            }
            switch (typeDiscount) {
              case TYPE_DISCOUNT.LK:
                Object.assign(newValue, {
                  applyTimeSheet: {
                    ...applyTimeSheetItem,
                    repeat: {
                      gteRanger: get(firstRepeatApply, "[0].d_start"),
                      lteRanger: get(firstRepeatApply, "[0].d_end"),
                    },
                  },
                });
                break;
              case TYPE_DISCOUNT["DISCOUNT.SOFT.CONDITION"]:
                let repeatApplyMonth: any = [];
                forIn(repeatApply, (value, key) => {
                  repeatApplyMonth.push(+key);
                });
                Object.assign(newValue, {
                  applyTimeSheet: {
                    ...applyTimeSheetItem,
                    repeat: repeatApplyMonth,
                  },
                });
                break;

              default:
                break;
            }

            break;
          case "quarter":
            let repeatQuarter: any[] = this.#quarterOfMonths(repeatCumulative);
            if (cumulativeTimeSheetItem) {
              Object.assign(newValue, {
                cumulativeTimeSheet: {
                  ...cumulativeTimeSheetItem,
                  repeat: repeatQuarter,
                },
              });
            }
            switch (typeDiscount) {
              case TYPE_DISCOUNT.LK:
                Object.assign(newValue, {
                  applyTimeSheet: {
                    ...applyTimeSheetItem,
                    repeat: {
                      gteRanger: get(firstRepeatApply, "[0].d_start"),
                      lteRanger: get(firstRepeatApply, "[0].d_end"),
                    },
                  },
                });
                break;
              case TYPE_DISCOUNT["DISCOUNT.SOFT.CONDITION"]:
                let repeatApplyQuarter: any[] = this.#quarterOfMonths(repeatApply);
                Object.assign(newValue, {
                  applyTimeSheet: {
                    ...applyTimeSheetItem,
                    repeat: repeatApplyQuarter,
                  },
                });
                break;

              default:
                break;
            }
            break;
          default:
            break;
        }
        return {
          ...newValue,
          condition: applyVariantId
            ? this.handleConvertConditionInput(
                get(newValue, "condition"),
                exchangeValue
              )
            : get(newValue, "condition"),
        };
      }
    );
    return newCumulativeDiscount;
  }
  zeroToEndMonth(m: number) {
    return m === 0 ? "Cuối tháng" : m;
  }
  handleConvertTextViewCumulativeTimeSheet(cumulativeTimeSheetItem: any,typeRepeat: TypeRepeatType) {

    const repeatCumulative = get(cumulativeTimeSheetItem, "repeat");
    const gteRanger = get(repeatCumulative, "gteRanger");
    const lteRanger = get(repeatCumulative, "lteRanger");
    let text = "";
    switch (typeRepeat) {
      case "nope":
        text = `Từ ${dayjs(
          get(cumulativeTimeSheetItem, "nonRepeat.gte")
        ).format("DD-MM-YYYY")} đến ${dayjs(
          get(cumulativeTimeSheetItem, "nonRepeat.lte")
        ).format("DD-MM-YYYY")}`;
        break;

      case "year":
        text = `Năm ${get(cumulativeTimeSheetItem,'nonRepeat')}`;
        break;

      case "ranger":
        if (gteRanger <= lteRanger) {
          // In Month
          text = `Từ ngày ${gteRanger} đến ngày ${this.zeroToEndMonth(
            lteRanger
          )} mỗi tháng`;
        } else {
          text = `Từ ngày ${gteRanger} đến ngày ${this.zeroToEndMonth(
            lteRanger
          )} tháng sau`;
        }
        break;

      case "month":
        text = `Diễn ra vào các tháng ${repeatCumulative?.join(
          ", "
        )} và nhận thưởng vào tháng sau`;
        break;
      case "quarter":
        const quarter = this.#quarterOfMonths(repeatCumulative);
        text = `Diễn ra vào các quý ${quarter?.join(
          " , "
        )} và nhận thưởng vào quý sau`;
        break;

      default:
        break;
    }
    return text;
  }
  handleConvertTextViewApplyTimeSheet(applyTimeSheetItem: any,typeDiscount : string,typeRepeat : TypeRepeatType) {
    let text = "";

    const repeatCumulative = get(applyTimeSheetItem, "repeat");
    const gteRanger = get(repeatCumulative, "gteRanger");
    const lteRanger = get(repeatCumulative, "lteRanger");
    switch (typeRepeat) {
      case "nope":
      case "year":
        text = `Từ ngày ${dayjs(
          get(applyTimeSheetItem, "nonRepeat.gte")
        ).format("DD-MM-YYYY")} đến ${dayjs(
          get(applyTimeSheetItem, "nonRepeat.lte")
        ).format("DD-MM-YYYY")}`;
        break;

      case "ranger":
        if (gteRanger <= lteRanger) {
          // In Month
          text = `Từ ngày ${gteRanger} đến ngày ${this.zeroToEndMonth(
            lteRanger
          )} mỗi tháng`;
        } else {
          text = `Từ ngày ${gteRanger} đến ngày ${this.zeroToEndMonth(
            lteRanger
          )} tháng sau`;
        }
        break;

      case "month":
        switch (typeDiscount) {
          case TYPE_DISCOUNT["DISCOUNT.SOFT.CONDITION"]:
            text = `Diễn ra vào các tháng ${repeatCumulative?.join(
              ", "
            )}`;
            break;
          case TYPE_DISCOUNT.LK:
            text = `Diễn ra vào ngày ${gteRanger} đến ngày ${this.zeroToEndMonth(
              lteRanger
            )} sau khi kết thúc chu kỳ tích luỹ của mỗi tháng`;
            break;
        
          default:
            break;
        }
      
        break;
      case "quarter":
        switch (typeDiscount) {
          case TYPE_DISCOUNT["DISCOUNT.SOFT.CONDITION"]:
            text = `Diễn ra vào các quý ${repeatCumulative?.join(
              ", "
            )}`;
            break;
          case TYPE_DISCOUNT.LK:
            text = `Diễn ra vào ngày ${gteRanger} đến ngày ${this.zeroToEndMonth(
              lteRanger
            )} sau khi kết thúc chu kỳ tích luỹ của mỗi quý`;
            break;
        
          default:
            break;
        }
      
        break;

      default:
        break;
    }

    return text;
  }
  handleConvertConditionOutput(
    condition: conditionType | null,
    exChangeValue: number
  ) {
    if (condition) {
      const newCondition = {
        ...condition,
        gte: exChangeValue * get(condition, "gte", 1),
        ...(get(condition, "lte") && {
          lte: exChangeValue * get(condition, "lte", 1),
        }),
      };
      return newCondition;
    } else {
      return null;
    }
  }
  handleConvertConditionInput(
    condition: conditionType | null,
    exChangeValue: number
  ) {
    if (condition) {
      const newCondition = {
        ...condition,
        gte: get(condition, "gte", 1) / exChangeValue,
        ...(get(condition, "lte") && {
          lte: get(condition, "lte", 1) / exChangeValue,
        }),
      };
      return newCondition;
    } else {
      return null;
    }
  }
  handleCopyDiscountList({discountList,targetTypeCopy,targetTypePaste } : {discountList : cumulativeDiscountType[],targetTypeCopy : 'pharmacy' | 'supplier',targetTypePaste : 'pharmacy' | 'supplier'}) : cumulativeDiscountType[]{
    const resultCopy : any[] = discountList?.filter((discount : cumulativeDiscountType) => get(discount,'targetType') === targetTypeCopy)?.map((discount:cumulativeDiscountType) => {
      const discountRemoveField = omit(discount,[
        '_id',
        'code',
        'updatedAt',
        'createdAt',
      ])
      return ({
        ...discountRemoveField,
        targetType  : targetTypePaste 
    })
    });
    return resultCopy
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
  "targetType",
  "status",
  "_id",
  "timesReward",
  "typeRepeat",
  "itemReward",
];
export const pickCore = (submitData: any) => pick(submitData, rootField);

export const pickSoft = (submitData: any) => pick(submitData, rootField);
export const pickLK = (submitData: any) =>
  pick(submitData, [
    ...rootField,
    "condition",
    "applyTimeSheet",
    "cumulativeTimeSheet",
    "applyVariantId",
    "itemReward",
  ]);
export const pickSoftCondition = (submitData: any) =>
  pick(submitData, [
    ...rootField,
    "condition",
    "applyTimeSheet",
    "itemReward",
    "applyVariantId",
  ]);

export const onDiscountChange = (
  newCumulativeDiscount: cumulativeDiscountType[]
) => {
  const cumulativeDiscount = newCumulativeDiscount?.map(
    (item: cumulativeDiscountType) => {
      const typeDiscount = get(item, "typeDiscount");
      const condition = get(item, "condition");
      const typeReward = get(item, "typeReward");
      const value = get(item, "value");
      if (
        [TYPE_DISCOUNT.LK, TYPE_DISCOUNT["DISCOUNT.SOFT.CONDITION"]].includes(
          typeDiscount
        )
      ) {
        return {
          ...item,
          condition: { ...condition, isRanger: !!get(condition, "lte") },
          value: typeReward === TYPE_REWARD.VALUE ? value : 0,
        };
      } else {
        return {
          ...item,
          // typeReward: TYPE_REWARD.VALUE,
          value: typeReward === TYPE_REWARD.VALUE ? value : 0,
        };
      }
    }
  );
  return cumulativeDiscount;
};

export const convertInitDiscount = (
  cumulativeDiscount: cumulativeDiscountType[],
  variants?: variantType[]
) => {
  const DiscountMethod = new DiscountFactory();
  const newCumulativeDiscount = DiscountMethod.handleConvertInputCumulative(
    cumulativeDiscount,
    variants
  );
  return newCumulativeDiscount;
};

export const convertSubmitDiscount = (
  cumulativeDiscount: cumulativeDiscountType[],
  variants?: variantType[]
) => {
  const newCumulativeDiscount = cumulativeDiscount?.map(
    (item: cumulativeDiscountType) => {
      const applyVariantId = get(item, "applyVariantId");
      const exChangeValue = ProductModule.service.getExchangeValue(
        applyVariantId,
        variants
      );
      const DiscountMethod = new DiscountFactory();
      const { typeDiscount, _id } = item;
      switch (typeDiscount) {
        case TYPE_DISCOUNT.LK:
          let cumulativeTimeSheet: any = {};
          let applyTimeSheet: any = {};

          const applyTimeSheetItem = get(item, "applyTimeSheet");
          const cumulativeTimeSheetItem: any = get(item, "cumulativeTimeSheet");
          const typeRepeat : any = get(item, "typeRepeat", TYPE_REPEAT.noTime);
          const session_id = DiscountMethod.generatorSessionIdNonRepeat(
            get(applyTimeSheetItem, "nonRepeat.session"),
            _id
          ); // Same ID with cumulativeTimeSheet
          if ([TYPE_REPEAT.nope].includes(typeRepeat)) {
            Object.assign(
              cumulativeTimeSheet,
              DiscountMethod.handleConvertOutputTimeSheetNonRepeat(
                cumulativeTimeSheetItem,
                session_id
              )
            );
            Object.assign(
              applyTimeSheet,
              DiscountMethod.handleConvertOutputTimeSheetNonRepeat(
                applyTimeSheetItem,
                session_id
              )
            );
          }else if([TYPE_REPEAT.year].includes(typeRepeat)){
            Object.assign(
              cumulativeTimeSheet,
              DiscountMethod.handleConvertOutputCumulativeTimeSheetNonRepeatYear(
                cumulativeTimeSheetItem,
                session_id
              )
            );
            Object.assign(
              applyTimeSheet,
              DiscountMethod.handleConvertOutputApplyTimeSheetNonRepeatYear(
                applyTimeSheetItem,
                session_id,
              )
            );
          } else{
            const repeatCumulative =
              DiscountMethod.handleConvertOutputTimeSheetStart(
                get(item, "cumulativeTimeSheet"),
                get(item, "_id", ""),
                typeRepeat
              );
            const repeatApply =
              DiscountMethod.handleConvertOutputApplyTimeSheet(
                item,
                repeatCumulative
              );
            Object.assign(cumulativeTimeSheet, {
              repeat: repeatCumulative,
            });
            Object.assign(applyTimeSheet, { repeat: repeatApply });
          }
          const newItem = {
            ...item,
            applyTimeSheet,
            cumulativeTimeSheet,
            condition: applyVariantId
              ? DiscountMethod.handleConvertConditionOutput(
                  get(item, "condition"),
                  exChangeValue
                )
              : get(item, "condition"),
          };
          return pickLK(newItem);
        case TYPE_DISCOUNT["DISCOUNT.CORE"]:
          console.log(item,'item');
          return pickCore(item);
        case TYPE_DISCOUNT["DISCOUNT.SOFT"]:
          return pickSoft(item);
        case TYPE_DISCOUNT["DISCOUNT.SOFT.CONDITION"]:
          let applyTimeSheet_4: any = {};
          const typeRepeat4 : any = get(item, "typeRepeat", TYPE_REPEAT.noTime);

          const applyTimeSheetItem_4 = get(item, "applyTimeSheet");
          const session_id_4 = DiscountMethod.generatorSessionIdNonRepeat(
            get(applyTimeSheetItem_4, "nonRepeat.session"),
            _id
          ); // Same ID with cumulativeTimeSheet
          if (typeRepeat4 === "nope") {
            Object.assign(
              applyTimeSheet_4,
              DiscountMethod.handleConvertOutputTimeSheetNonRepeat(
                applyTimeSheetItem_4,
                session_id_4
              )
            );
          } else {
            const repeatApply =
              DiscountMethod.handleConvertOutputTimeSheetStart(
                applyTimeSheetItem_4,
                _id,
                typeRepeat4
              );
            Object.assign(applyTimeSheet_4, {
              repeat: repeatApply,
            });
          }
          const newItem_4 = {
            ...item,
            applyTimeSheet: applyTimeSheet_4,
            condition: applyVariantId
              ? DiscountMethod.handleConvertConditionOutput(
                  get(item, "condition"),
                  exChangeValue
                )
              : get(item, "condition"),
          };
          return pickSoftCondition(newItem_4);
        default:
          return item;
      }
    }
  );
  return newCumulativeDiscount;
};
type ParamsValidateDiscount = {
  form : any,
  onFailed:() => void,
  onSuccess:() => void,
}
export const validateDiscount = async({form,onFailed,onSuccess} : ParamsValidateDiscount) => {
  try {
    await form.validateFields();
    form.setFieldsValue({
      cumulativeDiscount : form.getFieldValue('cumulativeDiscount')?.map((discount:any) => ({
        ...discount,
        editing : false
      }))
    })
    onSuccess();
  } catch (error : any) {
    const {errorFields} = error;
    const isCumulativeError = errorFields?.some(((e:any) => get(e,'name.[0]') === "cumulativeDiscount"));
    if(isCumulativeError){
      onFailed()
    }
  }
}