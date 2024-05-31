import { Badge, Flex, Input, Typography } from "antd";
import Search from "antd/lib/input/Search";
import { get } from "lodash";
import React, { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import ModalAnt from "~/components/Antd/ModalAnt";
import Header from "~/components/common/Layout/List/Detail/Header";
import Layout from "~/components/common/Layout/List/Detail/Layout";
import { STATUS_COLOR, STATUS_NAMES } from "~/constants/defaultValue";
import { PATH_APP } from "~/routes/allPath";
import ListInDetail from "../component/ListInDetail";
import MainContentTab from "../component/MainContentTab";
import {
  useDeletePharmacy,
  useGetPharmacyId_onyGet,
  usePharmacyQueryParams,
  useUpdatePharmacy,
  useUpdatePharmacyParams,
} from "../pharmacy.hook";
import PharmacyForm from "./PharmacyForm";
const CLONE_STATUS_NAMES: any = STATUS_NAMES;
const CLONE_STATUS_COLOR: any = STATUS_COLOR;
export default function PharmacyDetail_v2(): React.JSX.Element {
  const { id: pharmacyId }: any = useParams();
  const [id, setId] = useState<any>();
  const [query] = usePharmacyQueryParams(true);
  const [keyword, { setKeyword, onParamChange }] =
    useUpdatePharmacyParams(query);
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
      setOpen(true);
    };
    const onClose = () => {
      setOpen(false);
    };
    const onSearch = () => {
        onParamChange({keyword});
        onClose();
    }
  const [pharmacy]: any = useGetPharmacyId_onyGet();
  const [isOpenForm, setIsOpenForm] = useState(false);
  const onCloseForm = useCallback(() => {
    setIsOpenForm(false);
    setId(null);
  }, []);
  const onOpenForm = useCallback((idd?: any) => {
    setIsOpenForm(true);
    idd && setId(idd);
  }, []);
  const [, updatePharmacy] = useUpdatePharmacy(onCloseForm);
  const [, deletePharmacy] = useDeletePharmacy();

  return (
    <>
      <Layout
        HeaderLeft={
          <Header.HeaderLeft
            onChangeStatus={(status) => onParamChange({ status })}
            onAdd={() => onOpenForm()}
            SearchProp={{
                openSearch : showDrawer,
                open,
                onClose,
                onSearch,
                SearchComponent : <Input
                placeholder="Nhập để tìm kiếm"
                allowClear
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
              />
            }}
          />
        }
        HeaderRight={
          <Header.HeaderRight
            path={PATH_APP.pharmacy.root}
            onDeleteClick={() => deletePharmacy(pharmacyId)}
            onEditClick={() => onOpenForm(pharmacyId)}
            name={
              <Flex gap={10} align="center">
                <h4>
                  {get(pharmacy, "name", "") +
                    " - " +
                    get(pharmacy, "code", "")}
                </h4>
                <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                  <Badge
                    style={{ marginRight: 2 }}
                    status={CLONE_STATUS_COLOR[get(pharmacy, "status", "")]}
                  />
                  {CLONE_STATUS_NAMES[get(pharmacy, "status", "")]}
                </Typography.Text>
              </Flex>
            }
          />
        }
        MainContent={<MainContentTab />}
        List={<ListInDetail />}
      />
      <ModalAnt
        width={1100}
        open={isOpenForm}
        onCancel={onCloseForm}
        footer={[]}
        destroyOnClose
      >
        <PharmacyForm
          onClose={onCloseForm}
          id={id}
          handleUpdate={updatePharmacy}
        />
      </ModalAnt>
    </>
  );
}
