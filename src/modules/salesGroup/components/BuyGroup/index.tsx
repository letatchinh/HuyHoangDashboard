/* eslint-disable react-hooks/exhaustive-deps */
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Flex, Form, Pagination, Tabs, Tree } from "antd";
import React, {
  useCallback,
  useMemo,
  useState,
} from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import apis from "~/modules/collaborator/collaborator.api";
import {
  useGetCollaborator,
} from "~/modules/collaborator/collaborator.hook";
import CollaboratorAddress from "~/modules/collaborator/components/CollaboratorAddress";
import CollaboratorProduct from "~/modules/collaborator/components/CollaboratorProduct";
import {
  useGetEmployee,
} from "~/modules/employee/employee.hook";
import apisEmployee from "~/modules/employee/employee.api";
import {
  useBuyGroupPaging,
  useBuyGroupQueryParams,
  useGetBuyGroups,
  useGetChildrenBuyGroups,
  useUpdateSalesGroupParams,
} from "../../salesGroup.hook";
import { LoadTree } from "./LoadTree";
import { RenderItemTree } from "./RenderItemTree";
import SearchAnt from "~/components/Antd/SearchAnt";
import Context from "./Context";
import DrawerBuyGroup from "./DrawerBuyGroup";
import RenderFormModel from "./RenderFormModel";
import { BuyGroupType } from "../../salesGroup.modal";
import SelectSaleChannel from "~/modules/saleChannel/components/SelectSaleChannel";
import { getExistProp } from "~/utils/helpers";
type propsType = {
  activeKey: "B2B" | "B2C";
};
type FuncType = (T?:any)=>void

export default function BuyGroup(props: propsType): React.JSX.Element {

  const [id, setId] = useState<any>();
  const [typeUser, setTypeUser] = useState<BuyGroupType['type']>('partner');
  const [query] = useBuyGroupQueryParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [keyword, { onParamChange }] = useUpdateSalesGroupParams(query);
  const [data, isLoading] = useGetBuyGroups(query);
  const paging = useBuyGroupPaging();
  const { action } = useGetChildrenBuyGroups();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const initValue = useMemo(() => {
    const root = {
      ...query,
      salesChannelIds: query?.salesChannelIds,
    };
    return getExistProp(root);
  }, [query]);

  const onOpen = useCallback((id?: any, type: BuyGroupType['type'] ='partner') => {
      setId(id??null);
      setTypeUser(type);
      setOpen(true);
  }, []);
  const onClose = useCallback(() => {
    setOpen(false);
    setId(null);
    setTypeUser('partner');
  }, []);

  const returnFunc = useCallback(
    (funcP: FuncType, funE: FuncType) =>
      typeUser === "partner" ? funcP : funE,
    [typeUser]
  );
  let items = useMemo(() => {
    let result = [
      {
        key: "1",
        label: "Hồ sơ",
        children: <RenderFormModel typeUser={typeUser} id={id} onClose={onClose} />
         
      },
      {
        key: "2",
        label: "Sản phẩm đảm nhiệm",
        children: (
          <CollaboratorProduct
            target={typeUser}
            config={{
              discount: {
                discountType: "PERCENT",
                value: typeUser === "partner" ? 10 : 45,
              },
            }}
            id={id}
            useGetUser={returnFunc(useGetCollaborator, useGetEmployee)}
            apiSearchProduct={
              typeUser === "partner"
                ? apis.searchProduct
                : apisEmployee.searchProduct
            }
          />
        ),
        disabled: !id,
      },
    ];
    if (typeUser === "partner") {
      result.push({
        key: "3",
        label: "Sổ địa chỉ",
        children: <CollaboratorAddress id={id} />,
        disabled: !id,
      });
    }
    return result;
  }, [id, typeUser, returnFunc]);
  return (
    <Context.Provider activeKey={props.activeKey}>
      <div className="buy_group">
        <Flex vertical style={{ position: "relative", height: "inherit" }}>
          <div className="header-buy-group">
            <Button
              icon={<PlusOutlined />}
              onClick={() => onOpen(null,'partner')}
              className="mb-2"
              type="primary"
            >
              Thêm mới khách hàng B2C
            </Button>{" "}
            &nbsp;&nbsp;&nbsp;
            <SearchAnt onParamChange={onParamChange} />
            <Form
              form={form}
              initialValues={initValue}
            >
              <SelectSaleChannel
                validateFirst={false}
                form={form}
                style={{ minWidth: 200, marginLeft: 10, marginBottom: 10 }}
                showIcon={false}
                size={"middle"}
                defaultValue={query?.salesChannelIds || null}
                divisionText="B2C"
                onChange={(value) => onParamChange({ salesChannelIds: value })}
                mode="multiple"
              />
            </Form>
          </div>
          <LoadTree
            loading={isLoading}
            current={paging.current}
            pageSize={paging.pageSize}
          >
            <Tree
              showLine
              loadData={({ key, children }) =>
                new Promise<void>((resolve) => {
                  if (children) {
                    return resolve();
                  }
                  setTimeout(() => {
                    action(key);
                    return resolve();
                  }, 300);
                })
              }
              className="tree-custom"
              switcherIcon={<DownOutlined />}
              treeData={data}
              blockNode
              style={{ flexGrow: 1 }}
              selectable={false}
              titleRender={(node: any) => (
                <RenderItemTree node={node} onOpen={onOpen} />
              )}
            />
          </LoadTree>

          <div className="pagination-buy-group">
            <Pagination
              style={{ textAlign: "right" }}
              showSizeChanger
              pageSizeOptions={[10, 20, 50, 100, 150]}
              {...paging}
              showTotal={(total) => `Tổng cộng ${total}`}
              onChange={(current, pageSize) => {
                let page = pageSize !== paging.pageSize ? 1 : current;
                onParamChange({ limit: pageSize, page });
              }}
            />
          </div>
          <Context.Consumer>
            {({ drawerOpen, setDrawerOpen, clearContextDrawer }) => {
              return (
                <Drawer
                  title="Thông tin chiết khấu"
                  placement="right"
                  width={"40vw"}
                  onClose={(e) => {
                    setDrawerOpen(false);
                    clearContextDrawer();
                  }}
                  mask={false}
                  maskClosable={false}
                  open={drawerOpen}
                >
                  <DrawerBuyGroup />
                </Drawer>
              );
            }}
          </Context.Consumer>
        </Flex>

        <ModalAnt
          destroyOnClose
          width={1050}
          open={open}
          onCancel={onClose}
          footer={null}
          className="modalScroll"
          centered
        >
          <Tabs destroyInactiveTabPane items={items}></Tabs>
        </ModalAnt>
      </div>
    </Context.Provider>
  );
}
