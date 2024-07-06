import { Button, Modal, Space, Upload, message } from "antd";
import { get } from "lodash";
import { useState } from "react";
import { BASE_URL } from "~/constants/defaultValue";
import importExcel from "./importExcel";
import useNotificationStore from "~/store/NotificationContext";
import axios from "axios";
import { UploadFile, UploadProps } from "antd/lib";

type propsType = {
  isModalOpen?: any;
  onClose?: any;
  onModule?: any;
  query?: any;
};

const propsFile: UploadProps = {
  name: "file",
  multiple: true,
  action: `${BASE_URL}/api/v1/import-pharma`,
};
interface Errors {
  message?: string;
}
export function FormImportFile({
  isModalOpen,
  onClose,
  onModule,
  query,
}: propsType) {
  const [fileList, setFileList] = useState<any[]>([]);
  const [errors, setErrors] = useState<Errors | null>(null);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [complete, setComplete] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const { onNotify } = useNotificationStore();

  const handleUpload = async () => {
    if (!fileList[0]) {
      message.destroy();
      message.error("Chưa có file để thực hiện thao tác");
      return;
    }
    setUploading(true);

    const response = await importExcel.postFile(fileList[0]?.originFileObj);
    switch (response?.status) {
      case true:
        message.success("Thực hiện thành công");
        break;
      default:
        setErrors({ message: response.message });
        message.warning("File nhập tồn tại dữ liệu trùng hoặc trống");
        break;
    }
    setTimeout(() => {
      setUploading(false);
      setComplete(true);
    }, 2000);
  };
  //
  const onFileChange: UploadProps["onChange"] = async ({ file, fileList }) => {
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

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file as UploadFile);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      if (!newFileList.length) {
        setDisabled(true);
      }
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file as UploadFile]);
      setDisabled(false);
      return false;
    },
    fileList,
  };

  // Export file mẫu
  const handleOnClick = async () => {
    try {
      if (query) {
        const keyExportUrl = "/api/v1/export-pharma";
        try {
          axios
            .get(keyExportUrl, {
              method: "GET",
              responseType: "blob",
            })
            .then((response) => {
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("target", "_blank");
              link.setAttribute("download", `FileMauNhaThuoc.xlsx`);
              document.body.appendChild(link);
              link.click();
            });
        } catch (error: any) {
          onNotify?.error(error || "Có lỗi xảy ra!");
        }
      }
    } catch (error: any) {
      onNotify?.error(error || "Có lỗi xảy ra!");
    }
  };

  const handleOnClickError = async () => {
    try {
      if (query) {
        const keyExportUrl = "/api/v1/export-pharma-error";
        try {
          axios
            .get(keyExportUrl, {
              method: "GET",
              responseType: "blob",
            })
            .then((response) => {
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("target", "_blank");
              link.setAttribute("download", `ErrorNhaThuoc.xlsx`);
              document.body.appendChild(link);
              link.click();
            });
        } catch (error: any) {
          onNotify?.error(error || "Có lỗi xảy ra!");
        }
      }
    } catch (error: any) {
      onNotify?.error(error || "Có lỗi xảy ra!");
    }
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
          key="import"
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
          key="done"
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
            Nhập thông tin khách hàng B2B từ file dữ liệu
          </p>
          <p>
            &nbsp; (Tải về file mẫu:
            <a
              target="_blank"
              style={{ color: "#1990ff" }}
              onClick={handleOnClick}
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
          // listType="text"
          style={{ width: "60%", color: "#1990ff" }}
          onChange={onFileChange}
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          maxCount={1}
        >
          <Button key={"select"} type="primary" htmlType="submit">
            Chọn file dữ liệu
          </Button>
          <div style={{ marginTop: "5px", marginBottom: "1rem" }}>
            <i>
              *Hệ thống cho phép nhập tối đa <b>2000 khách hàng B2B</b> mỗi lần từ
              file
            </i>
          </div>
        </Upload>
        <div style={{ marginTop: "10px", display: "block" }}>
          {errors?.message && (
            <>
              <Space style={{ color: "red" }}>{errors?.message} </Space>
              {/* <Link to={PATH_CLINIC.processImport.root} /> */}
              <a
                target="_blank"
                style={{ color: "#1990ff" }}
                onClick={handleOnClickError}
              >
                Tải về file
              </a>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
