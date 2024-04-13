import { Button, Modal, Space, Upload, message } from "antd";
import { get, has } from "lodash";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import ModalAnt from "~/components/Antd/ModalAnt";
import { BASE_URL } from "~/constants/defaultValue";
import importExcel from "./importExcel";

type propsType = {
  isModalOpen?: any;
  onClose?: any;
  onModule?: any;
  query?: any;
};
export function FormImportFile({
  isModalOpen,
  onClose,
  onModule,
  query,
}: propsType) {
  const [fileList, setFileList] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>('');
  const [disabled, setDisabled] = useState(true);
  const [complete, setComplete] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", fileList[0]?.originFileObj);

    if (!fileList[0]) {
      message.destroy();
      message.error("Chưa có file để thực hiện thao tác");
      return;
    }
    setUploading(true);
    const response = await importExcel.postFile(formData)
    switch (response?.status) {
      case true:
        message.success("Thực hiện thành công")
        break;
      default:
        setErrors({message:response.message})
        message.warning("File nhập tồn tại dữ liệu trùng hoặc trống")
        break;
    }
    setTimeout(() => {
      setUploading(false);
      setComplete(true);
    }, 2000);
  };
  const onFileChange = async ({ file, fileList }: any) => {
    setUploading(true);
    if (file.status === "removed") {
      setErrors(null);
      setDisabled(true);
      setFileList([]);
      setUploading(false);
      return;
    }
    if (file.status !== "uploading") {
      if (Array.isArray(fileList)) {
        const newFileList = fileList.map((item) => {
          if (!get(item, "response")) return item;
          return {
            ...item,
            url: get(item, "response.url"),
          };
        });
        setFileList([...newFileList]);
      }
    } else {
      setFileList([...fileList]);
      setDisabled(false);
    }
    setUploading(false);
  };
  const props = {
    onRemove: (file: any) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      if (!newFileList.length) {
        setDisabled(true);
      }
    },
    beforeUpload: (file: any) => {
      setFileList([...fileList, file]);
      setDisabled(false);
      return false;
    },
    fileList,
  };

  return (
    <Modal
      width={700}
    //   height={600}
      open={isModalOpen}
      onCancel={onClose}
      onOk={() => onModule((value: any) => !value)}
      footer={[
        <Button
          key={"import"}
          type="primary"
          disabled={disabled}
          loading={uploading}
          onClick={handleUpload}
          htmlType="button"
          style={{ marginLeft: "1rem" }}
        >
          Import
        </Button>,
        <Button
          key={"done"}
          hidden={!complete}
          type="primary"
          onClick={() => {
            setErrors(null);
            setDisabled(true);
            setFileList([]);
            onModule((value: any) => !value);
          }}
          htmlType="button"
        >
          Huỷ
        </Button>,
      ]}
    >
      <div className="container-fluid">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <p style={{ fontSize: "22px", fontWeight: "500" }}>
            Nhập thông tin nhà thuốc từ file dữ liệu
          </p>
          <p>
            &nbsp; (Tải về file mẫu:
            <a
              target="_blank"
              style={{ color: "#1990ff" }}
              href={`${BASE_URL}/api/v1/export-pharma`}
              download
            >
              {" "}
              Excel file
            </a>
            )
          </p>
        </div>

        <Upload
          {...props}
          fileList={fileList}
          style={{ width: "60%", color: "#1990ff" }}
          onChange={onFileChange}
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          maxCount={1}
        >
          <Button
            key={"select"}
            type="primary"
            htmlType="submit"
            // style={{ marginRight: '5px' }}
          >
            Chọn file dữ liệu
          </Button>
          <div style={{ marginTop: "5px", marginBottom: "1rem" }}>
            <i>
              *Hệ thống cho phép nhập tối đa <b>2000 nhà thuốc</b>{" "}
              mỗi lần từ file
            </i>
          </div>
        </Upload>
        <div style={{ marginTop: "10px", display: "block" }}>
          {errors?.key && (
            <>
              <Space style={{ color: "red" }}>{errors?.message} </Space>
              {/* <Link to={PATH_CLINIC.processImport.root} /> */}
              <a href={`${BASE_URL}/api/v1/export-pharma`} download>
              Tải về file
            </a>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
