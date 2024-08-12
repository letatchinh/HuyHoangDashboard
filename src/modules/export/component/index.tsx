import { Button, Dropdown, Menu, Modal, Radio, Space } from "antd";
import { BASE_URL } from "~/constants/defaultValue";
import moment from "moment";
import axios from "axios";
import { omit } from "lodash";
import { SizeType } from "antd/es/config-provider/SizeContext";
import useNotificationStore from "~/store/NotificationContext";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import "./index.scss";
import { useState } from "react";
interface Props {
  size?: SizeType;
  stylesButton?: any;
  query?: any;
  fileName: string;
  api: string;
  exportOption: string;
  ids?: string[];
  useLayout?: "v1" | "v2";
}

const defaultStyles = {
  position: "absolute",
  top: "200px",
  right: "100px",
  width: "150px",
};
export default function ExportExcelButton({
  size,
  stylesButton,
  query,
  fileName,
  api,
  exportOption,
  ids,
  useLayout = "v1",
}: Props) {
  const { onNotify } = useNotificationStore();
  const handleOnClick = async (obj: any) => {
    try {
      if (query || api) {
        const concatExportOption = {
          ...query,
          exportOption,
        };
        const newQuery: any = Object.fromEntries(
          Object.entries(concatExportOption)?.filter(
            ([_, v]) => v !== null && v !== undefined
          )
        );
        let a = `?`;
        const dateNow = moment(Date.now()).format("DD-MM-YYYY HH:mm");
        const keyExportUrl = "/api/v1/export";
        const linkUrl = keyExportUrl.concat(`/${api}`);
        switch (obj) {
          case "1":
            const newObj_1: any = {
              ...omit(newQuery, ["page", "limit"]),
              exportOptionV2: "ALL",
            };
            let queryString_1 = Object.keys(newObj_1)
              .map(
                (key) =>
                  `${encodeURIComponent(key)}=${encodeURIComponent(
                    newObj_1[key]
                  )}`
              )
              .join("&");
            a = a.concat(queryString_1);
            break;
          case "2":
            if (!ids?.length) {
              onNotify?.error("Không tồn tại lựa chọn nào!");
              a = "";
            } else {
              const newObj_2: any = {
                ...omit(newQuery, ["page", "limit"]),
                ids,
                exportOptionV2: "OPTION",
              };
              let queryString_2 = Object.keys(newObj_2)
                .map(
                  (key) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(
                      newObj_2[key]
                    )}`
                )
                ?.join("&");
              a = a.concat(queryString_2);
            }
            break;
          case "3":
            const newExportOption = exportOption.concat("Page");
            const newObj_3 = {
              ...newQuery,
              exportOption: newExportOption,
              exportOptionV2: "PAGING",
            };
            let queryString_3 = Object.keys(newObj_3)
              .map(
                (key) =>
                  `${encodeURIComponent(key)}=${encodeURIComponent(
                    newObj_3[key]
                  )}`
              )
              .join("&");
            a = a.concat(queryString_3);
            break;
          default:
            break;
        }
        const temp = BASE_URL.concat(linkUrl, a);
        try {
          if (a !== "") {
            axios
              .get(temp, {
                method: "GET",
                responseType: "blob",
              })
              .then((response) => {
                const url = window.URL.createObjectURL(
                  new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("target", "_blank");
                link.setAttribute("download", `${fileName}_${dateNow}.xlsx`);
                document.body.appendChild(link);
                link.click();
              });
          }
        } catch (error: any) {
          onNotify?.error(error || "Có lỗi xảy ra!");
        }
      }
    } catch (error: any) {
      onNotify?.error(error || "Có lỗi xảy ra!");
    }
  };
  if (useLayout === "v1") {
    return (
      <Dropdown.Button
        dropdownRender={() => <MenuButton handle={handleOnClick} ids={ids} />}
        onClick={() => handleOnClick("1")}
        trigger={["hover"]}
        style={
          {
            // margin: '0px 10px ' Make Scroll
          }
        }
        type="primary"
        size={size ? size : "middle"}
      >
        Tải về
      </Dropdown.Button>
    );
  }
  if (useLayout === "v2") {
    const onDownLoad = () => {
      Modal.confirm({
        title: "Lựa chọn",
        content: <OptionsDownLoad onChange={(value) => handleOnClick(value)} />,
        footer: null,
        icon : null,
        width : 450,
        closable : true
      });
    };
    return (
      <div onClick={onDownLoad} className="DropdownAction--item">
        <i className="fa-solid fa-download"></i>
        <span>Tải xuống danh sách</span>
      </div>
    );
  }
  return <></>;
}
// export default ExportExcelButton;

function MenuButton({ handle, ids }: any) {
  return (
    <Menu>
      {ids && (
        <Menu.Item>
          <Button
            className="button-export__children"
            type="primary"
            size="small"
            onClick={() => handle("2")}
          >
            Theo lựa chọn
          </Button>
        </Menu.Item>
      )}
      <Menu.Item>
        <Button
          className="button-export__children"
          type="primary"
          size="small"
          onClick={() => handle("3")}
        >
          Theo trang hiện tại
        </Button>
      </Menu.Item>
    </Menu>
  );
}

const OptionsDownLoad = ({ onChange }: { onChange: (value: any) => void }) => {
  const [value, setValue] = useState("1");

  return (
    <div>
      <Radio.Group value={value} onChange={(e) => setValue(e.target.value)}>
        <Radio value="1">Tất cả</Radio>
        <Radio value="2">Theo lựa chọn</Radio>
        <Radio value="3">Theo trang hiện tại</Radio>
      </Radio.Group>
      <br />
      <Button className="mt-2" type="primary" onClick={() => onChange(value)}>Xác nhận</Button>
    </div>
  );
};
