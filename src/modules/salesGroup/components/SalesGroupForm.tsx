import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  TreeSelect,
} from "antd";
import { get, uniq, xor } from "lodash";
import React, { useCallback, useEffect, useId, useMemo } from "react";
import RenderLoading from "~/components/common/RenderLoading";
import WithPermission from "~/components/common/WithPermission";
import GeoSelectTreeStatic from "~/modules/geo/components/GeoSelectTreeStatic";
import GeoTreeSelect from "~/modules/geo/components/GeoTreeSelect";
import { RELATIVE_POSITION } from "~/modules/geo/constants";
import POLICIES from "~/modules/policy/policy.auth";
import { useFetchState } from "~/utils/hook";
import { OPTIONS_SALES_GROUP_GEOGRAPHY } from "../constants";
import apis from "../salesGroup.api";
import {
  useCreateSalesGroup,
  useGetSalesGroup,
  useResetAction,
} from "../salesGroup.hook";
import { FieldTypeForm, propsTypeSalesGroupForm } from "../salesGroup.modal";
import { convertInitData, convertSubmitData } from "../salesGroup.service";
const getPath = (managementArea : any[]) => managementArea?.map((area: any) =>get(area, "path"))
const SalesGroupForm = ({
  id,
  onCancel,
  onUpdate,
  parentNear: parentNearFromList,
  parentNearName: parentNearNameFromList,
  parentNearPath: parentNearPathFromList,
}: propsTypeSalesGroupForm): React.JSX.Element => {
  const keyTree = useId();
  const [blackList,isLoadingBlackList] = useFetchState({api : apis.getBlackList,useDocs : false});

  const [salesGroup, isLoading]: any = useGetSalesGroup(id);
  const parentExist = useMemo(() => getPath(get(salesGroup, "managementArea", [])),[salesGroup])
  const blackList_ : any[] = useMemo(() => xor(blackList,parentExist),[blackList,parentExist]);

  const parentNear = useMemo(
    () => (id ? get(salesGroup, "parent._id", "") : parentNearFromList),
    [salesGroup, id, parentNearFromList]
  );
  const parentNearName = useMemo(
    () => (id ? get(salesGroup, "parent.name", "") : parentNearNameFromList),
    [salesGroup, id, parentNearNameFromList]
  );
  const parentNearPath = useMemo(
    () =>
      id
        ? getPath(get(salesGroup, "parent.managementArea", []))
        : parentNearPathFromList,
    [salesGroup, id, parentNearPathFromList]
  );

  const rootParent = useMemo(() => xor(parentNearPath,parentExist),[parentExist,parentNearPath])
  const parentList = useMemo(() => {
    if(!rootParent) return [];
    return rootParent.filter(
      (path:any) => blackList.filter((blPath:any) => blPath === path).length === 1
    );
  }, [blackList,rootParent]);
  const parentListDiff = useMemo(() => {
    if(!rootParent) return [];
    return rootParent.filter(
      (path:any) => blackList.filter((blPath:any) => blPath === path).length !== 1
    );
  }, [blackList,rootParent]);

  const [form] = Form.useForm();
  const [isSubmitLoading, onCreate] = useCreateSalesGroup(onCancel);

  useResetAction();

  const onFinish = useCallback(
    (values: FieldTypeForm) => {
      const submitData = convertSubmitData(values);

      if (!id) {
        onCreate(submitData);
      } else {
        onUpdate({ ...submitData, _id: id });
      }
    },
    [id, onCreate, onUpdate]
  );

  useEffect(() => {
    if (id && salesGroup) {
      const initSalesGroup = convertInitData(salesGroup);
      form.setFieldsValue(initSalesGroup);
    } else {
      form.setFieldsValue({ parentNear });
    }
  }, [form, id, salesGroup]);

  const onValuesChange = (value: any, values: any) => {};
  return (
    <div className="flex-column-center">
      {parentNear ? <i>*Nhóm cha: {parentNearName}</i> : ""}
      <Divider>
        <h5 className="text-center">
          {id ? "Cập nhật" : "Tạo mới"} nhóm bán hàng
        </h5>
      </Divider>
      <Form
        form={form}
        labelCol={{ sm: 24, md: 24, lg: 8, xl: 8 }}
        wrapperCol={{ sm: 24, md: 24, lg: 16, xl: 16 }}
        labelAlign="left"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
        <Form.Item<FieldTypeForm> hidden name={"parentNear"} />
        <Row justify={"space-between"} align="middle" gutter={48}>
          <Col span={24}>
            <Form.Item<FieldTypeForm>
              label="Tên nhóm bán hàng"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên nhóm bán hàng" },
              ]}
            >
              {RenderLoading(isLoading, <Input />)}
            </Form.Item>
          </Col>
        </Row>

        <Row justify={"space-between"} align="middle" gutter={48}>
          <Col span={24}>
            <Form.Item<FieldTypeForm> label="Tên mô tả" name="alias">
              {RenderLoading(isLoading, <Input />)}
            </Form.Item>
          </Col>
        </Row>

        <Row justify={"space-between"} align="middle" gutter={48}>
          <Col span={24}>
            <Form.Item shouldUpdate noStyle>
              {({ setFieldsValue, getFieldValue }) => (
                <Form.Item
                  label="Khu vực"
                  name={["managementArea"]}
                  // rules={[{ required: true, message: "Vui lòng chọn" }]}
                >
                  <GeoSelectTreeStatic
                    key={keyTree}
                    onChange={(value) => {
                      setFieldsValue({ managementArea: value });
                    }}
                    initValue={getFieldValue("managementArea")}
                    blackList={xor(blackList_, parentListDiff)}
                    parentList={parentList}
                  />
                </Form.Item>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row justify={"space-between"} align="middle" gutter={48}>
          <Col span={24}>
            <Form.Item<FieldTypeForm>
              label="Loại nhóm"
              name="typeArea"
              rules={[{ required: true, message: "Vui lòng nhập!" }]}
            >
              {RenderLoading(
                isLoading,
                <Select options={OPTIONS_SALES_GROUP_GEOGRAPHY} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <div className="btn-footer">
          <WithPermission
            permission={
              id
                ? POLICIES.UPDATE_AREACONFIGURATION
                : POLICIES.UPDATE_AREACONFIGURATION
            }
          >
            <Button
              loading={isSubmitLoading}
              block
              type="primary"
              htmlType="submit"
            >
              {id ? "Cập nhật" : "Tạo mới"}
            </Button>
          </WithPermission>
          <Button onClick={onCancel} block danger>
            Huỷ
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SalesGroupForm;
