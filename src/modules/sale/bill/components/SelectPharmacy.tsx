import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, Row, Space, Tabs } from "antd";
import { SelectProps } from "antd/lib/index";
import { get } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import DebounceSelect from "~/components/common/DebounceSelect";
import PharmacyModule from "~/modules/pharmacy";
import useNotificationStore from "~/store/NotificationContext";
import { FormFieldCreateBill } from "../bill.modal";
import { useLocation } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";
import {
  useCreatePharmacy,
  usePharmacyQueryParams,
} from "~/modules/pharmacy/pharmacy.hook";
import ModalAnt from "~/components/Antd/ModalAnt";
import PharmacyForm from "~/modules/pharmacy/screens/PharmacyForm";
import CollaboratorForm from "~/modules/collaborator/components/CollaboratorForm";
import { useCreateCollaborator } from "~/modules/collaborator/collaborator.hook";
interface propsType extends SelectProps {
  form?: any;
  allowClear?: boolean;
  showIcon?: boolean;
  validateFirst?: boolean;
  required?: boolean;
  label?: string;
  id?: string;
  showButtonAdd?: boolean;
}
type ItemSearch = {
  name: string;
  value: string;
};
export default function SelectPharmacy({
  form,
  allowClear = true,
  showIcon = true,
  validateFirst = true,
  required = true,
  label = "",
  id,
  showButtonAdd = true,
  ...props
}: propsType): React.JSX.Element {
  const { onNotify } = useNotificationStore();
  const [loading, setLoading] = useState(false);
  const [initOption, setInitOption] = useState([]);
  const { pathname } = useLocation();
  const [isPharmacyFormOpen, setPharmacyFormOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [destroy, setDestroy] = useState(false);
  const [query] = usePharmacyQueryParams(true);
  const [isSubmitLoading, handleCreateB2C] = useCreateCollaborator(() => {
    setIsOpenModal(false);
    setDestroy(true);
  });

  const [, handleCreateB2B] = useCreatePharmacy(() => {
    setPharmacyFormOpen(false);
    setDestroy && setDestroy(true);
  });
  const filterOption: any = (data: any[]) => {
    if (pathname === PATH_APP.bill.createCollaborator) {
      return data?.filter((item) => item?.type === "ctv");
    }
    if (
      pathname === PATH_APP.bill.createEmployee ||
      pathname === PATH_APP.bill.createPharmacy
    ) {
      return data?.filter((item) => item?.type === "pharmacy");
    }
    return data;
  };

  const typeData = useMemo(() => {
    if (pathname === PATH_APP.bill.createCollaborator) {
      return "ctv";
    }
    if (
      pathname === PATH_APP.bill.createEmployee ||
      pathname === PATH_APP.bill.createPharmacy
    ) {
      return "pharmacy";
    }
    return null;
  }, [id, pathname]);

  const isSentOptionWith: boolean = useMemo(() => {
    if (
      (pathname === PATH_APP.bill.createCollaborator ||
        pathname === PATH_APP.bill.createEmployee ||
        pathname === PATH_APP.bill.createPharmacy ||
        pathname === PATH_APP.bill.create) &&
      !id
    ) {
      return false;
    }
    return true;
  }, [id, pathname]);

  const fetchOptions: any = async (keyword: string) => {
    try {
      const pharmacies = await PharmacyModule.api.search({
        ...(id && !keyword && { id }),
        ...(isSentOptionWith && { optionWith: { id: [id] } }),
        keyword: keyword || "",
        type: typeData,
      });
      const newOptions = filterOption(get(pharmacies, "docs", []))?.map(
        (item: ItemSearch) => ({
          label: get(item, "name"),
          value: get(item, "_id"),
          data: item,
        })
      );

      return newOptions;
    } catch (error: any) {
      onNotify?.error(error?.response?.data?.message || "Có lỗi gì đó xảy ra");
    }
  };

  useEffect(() => {
    const fetchInit = async () => {
      try {
        setLoading(true);
        const pharmacies = await PharmacyModule.api.search({
          // ...id && {id},
          ...(isSentOptionWith && { optionWith: { id: [id] } }),
          type: typeData,
        });

        const newOptions = filterOption(get(pharmacies, "docs", []))?.map(
          (item: ItemSearch) => ({
            label: get(item, "name"),
            value: get(item, "_id"),
            data: item,
          })
        );

        setInitOption(newOptions);
        setLoading(false);
        if (validateFirst) {
          await form.validateFields(["pharmacyId"]);
        }
      } catch (error) {
        setLoading(false);
      }
    };
    fetchInit();
  }, [pathname]);

  return (
    <>
      <Row gutter={8} justify="space-between" align="middle">
        <Col flex={1}>
          <Form.Item  shouldUpdate noStyle>
            <Space.Compact style={{ width: "100%" }}>
            {showIcon &&<Form.Item style={{ marginRight: "5px" }}> <UserOutlined /></Form.Item>}
              <Form.Item<FormFieldCreateBill>
                name={"pharmacyId"}
                label={label}
                rules={[
                  {
                    required: required,
                    message:
                      typeData === "ctv"
                        ? "Vui lòng chọn khách hàng B2C"
                        : "Vui lòng chọn khách hàng B2B",
                  },
                ]}
                colon={false}
                style={{ width: "100%",marginBottom : 'unset' }}
                wrapperCol={{ sm: 24 }}
              >
                <DebounceSelect
                  size="middle"
                  loading={loading}
                  placeholder={
                    typeData === "ctv"
                      ? "Chọn khách hàng B2C"
                      : "Chọn khách hàng B2B"
                  }
                  fetchOptions={fetchOptions}
                  style={{ width: "100%" }}
                  initOptions={initOption}
                  allowClear={allowClear}
                  {...props}
                />
              </Form.Item>
              {showButtonAdd && (
                <Form.Item noStyle>
                  <Button
                    onClick={() =>
                      typeData === "ctv"
                        ? setIsOpenModal(true)
                        : setPharmacyFormOpen(true)
                    }
                  >
                    <PlusOutlined />
                  </Button>
                </Form.Item>
              )}
            </Space.Compact>
          </Form.Item>
        </Col>
      </Row>
      <ModalAnt
        width={1200}
        open={isPharmacyFormOpen}
        onCancel={() => setPharmacyFormOpen(false)}
        footer={[]}
        destroyOnClose={destroy}
        afterClose={() => setDestroy(false)}
      >
        <PharmacyForm
          setDestroy={setDestroy}
          onClose={() => setPharmacyFormOpen(false)}
          handleCreate={handleCreateB2B}
          isSubmitLoading={isSubmitLoading}
          query={query}
        />
      </ModalAnt>
      <Modal
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() => setIsOpenModal(false)}
        className="form-modal modalScroll"
        footer={null}
        width={1020}
        centered
        // style={{ top: 50 }}
        afterClose={() => {
          setDestroy(false);
        }}
        destroyOnClose={destroy}
      >
        <h4>Tạo mới khách hàng B2C</h4>
        <Tabs
          destroyInactiveTabPane
          items={[
            {
              key: "1",
              label: "Hồ sơ",
              children: (
                <CollaboratorForm
                  id={id}
                  handleCloseModal={() => setIsOpenModal(false)}
                  handleCreate={handleCreateB2C}
                  isSubmitLoading={isSubmitLoading}
                  query={query}
                />
              ),
            },
            {
              key: "2",
              label: "Sản phẩm đảm nhiệm",
              disabled: !id,
            },
            {
              key: "3",
              label: "Sổ địa chỉ",
              disabled: !id,
            },
            {
              key: "4",
              label: "Yêu cầu",
              disabled: !id,
            },
          ]}
        ></Tabs>
      </Modal>
    </>
  );
}
