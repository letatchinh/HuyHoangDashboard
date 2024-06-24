import { Button, Col, DatePicker, Form, Input, Row, Skeleton } from "antd";
import {
  useCreateFreelanceContractPharmacy,
  useGetFreelanceContractPharmacy,
  useInitFreelanceContractPharmacy,
  useResetFreelanceContractPharmacyAction,
} from "../freelanceContractPharmacy.hook";
import { useCallback, useEffect, useState } from "react";
import {
  convertInitContract,
  convertSubmitData,
} from "../freelanceContractPharmacy.service";
import { PATH_APP } from "~/routes/allPath";
import { Link } from "react-router-dom";
import SelectPharmacy from "~/modules/sale/bill/components/SelectPharmacy";
import dayjs from "dayjs";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import moment from "moment";
import { get } from "lodash";
import UploadListFile from "../component/UploadListFile";
import UploadFileProgress from "~/modules/workTask/components/Task/UploadFileProgress";

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

interface Props {
  onClose: (p?: any) => void;
  id?: any;
  handleUpdate?: any;
}

const FreelanceContractPharmacyForm = ({
  onClose,
  id,
  handleUpdate,
}: Props) => {
  const [form] = Form.useForm();
  const [isSubmitLoading, handleCreate] =
    useCreateFreelanceContractPharmacy(onClose);
  const [contract, isLoading] = useGetFreelanceContractPharmacy(id);
  const initFreelanceContractPharmacy = useInitFreelanceContractPharmacy(
    contract,
    id
  );
  useResetFreelanceContractPharmacyAction();

  useEffect(() => {
    if (!id) {
      form.resetFields();
    } else {
      const initContract = convertInitContract(initFreelanceContractPharmacy);
      form.setFieldsValue(initContract);
      form.setFieldsValue({
        pharmacyId: get(contract, "pharmacyId._id", contract?.pharmacyId),
        date: moment(form.getFieldValue(["date"])),
        startDate: moment(form.getFieldValue(["startDate"])),
        endDate: moment(form.getFieldValue(["endDate"])),
      });
    }
  }, [initFreelanceContractPharmacy, id, form]);

  const onFinish = useCallback(
    (values: any) => {
      const submitData = convertSubmitData(values);
      if (id) {
        handleUpdate({ ...submitData, _id: id });
      } else {
        handleCreate({ ...submitData });
      };
      onClose();
    },
    [handleCreate, handleUpdate, id, onClose]
  );
  return (
    <div className="freelance-contract page-wraper form-page-content">
      <h4 style={{ margin: "20px 0 40px 20px" }}>
        {id ? " Cập nhật" : "Thêm mới"} hợp đồng khoán khách hàng B2B
      </h4>
      <div className="container-fluid">
        <Form
          form={form}
          autoComplete="off"
          onFinish={onFinish}
          scrollToFirstError
          requiredMark={false}
          labelCol={{ sm: 24, md: 24, lg: 4 }}
          wrapperCol={{ sm: 24, md: 24, lg: 18 }}
          labelAlign="left"
        >
          <SelectPharmacy
            form={form}
            allowClear={false}
            showIcon={false}
            validateFirst={false}
            required={false}
            label="Khách hàng B2B:"
            showButtonAdd={true}
          />
          <FormItem
            label="Mã hợp đồng"
            name="contractCode"
            // labelCol={{ sm: 24, md: 24, lg: 3 }}
            wrapperCol={{ sm: 24, md: 24, lg: 21 }}
            rules={[
              { required: true, message: "Xin vui lòng nhập mã hợp dồng" },
            ]}
            style={{ marginTop: "25px" }}
          >
            <Input />
          </FormItem>
          <FormItem
            label="Ngày tạo"
            name="date"
            // labelCol={{ sm: 24, md: 24, lg: 3 }}
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ngày tạo hợp đồng!",
              },
            ]}
          >
            {isLoading ? (
              <Skeleton.Input active />
            ) : (
              <DatePicker
                format={"DD/MM/YYYY"}
                placeholder="Ngày tạo"
                disabledDate={(current) => {
                  return current > dayjs().endOf("day");
                }}
              />
            )}
          </FormItem>

          <FormItem
            label="Số tiền khoán"
            name={"amount"}
            // labelCol={{ sm: 24, md: 24, lg: 3 }}
            wrapperCol={{ sm: 24, md: 24, lg: 21 }}
          >
            <InputNumberAnt min={0} style={{ width: "100%" }} />
          </FormItem>

          <FormItem
            label="Ngày bắt đầu"
            name="startDate"
            wrapperCol={{ sm: 24, md: 24, lg: 21 }}
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ngày bắt đầu hợp đồng!",
              },
            ]}
          >
            {isLoading ? (
              <Skeleton.Input active />
            ) : (
              <DatePicker format={"DD/MM/YYYY"} placeholder="Ngày bắt đầu" />
            )}
          </FormItem>

          <FormItem
            label="Ngày kết thúc"
            name="endDate"
            wrapperCol={{ sm: 24, md: 24, lg: 21 }}
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ngày kết thúc hợp đồng!",
              },
            ]}
          >
            {isLoading ? (
              <Skeleton.Input active />
            ) : (
              <DatePicker format={"DD/MM/YYYY"} placeholder="Ngày kết thúc" />
            )}
          </FormItem>

          {/* <FormItem
            label="File đính kèm"
            name="files"
            wrapperCol={{ sm: 24, md: 24, lg: 21 }}
          > */}
          <UploadListFile
            contract={contract}
          />
          {/* </FormItem> */}

          <Row className="form__submit-box" justify={"center"} gutter={16}>
            <Col>
              {isSubmitLoading ? (
                <Button disabled>Huỷ</Button>
              ) : (
                <Link to={PATH_APP.freelanceContractPharmacy.root}>
                  <Button onClick={onClose}>Huỷ</Button>
                </Link>
              )}
            </Col>
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitLoading}
              >
                {id ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default FreelanceContractPharmacyForm;
