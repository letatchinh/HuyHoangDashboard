import { Tabs } from "antd";
import React from "react";
import { useParams } from "react-router-dom";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchOrPolicy } from "~/modules/policy/policy.hook";
import RequestGroup from "~/modules/requestGroup/components";
import apis from "../collaborator.api";
import { useGetCollaborator } from "../collaborator.hook";
import CollaboratorAddress from "./CollaboratorAddress";
import CollaboratorForm from "./CollaboratorForm";
import CollaboratorProduct from "./CollaboratorProduct";

export default function MainContentTab() {
  const { id }: any = useParams();
  const canReadRequest = useMatchOrPolicy([
    POLICIES.READ_REQUESTCHANGEGROUP,
    POLICIES.READ_REQUESTCHANGEGROUPCTV,
  ]);

  return (
    <Tabs
      className={"layoutDetail--right__mainContent__tab"}
      destroyInactiveTabPane
      items={[
        {
          key: "1",
          label: "Hồ sơ",
          children: <CollaboratorForm id={id} readOnly />,
        },
        {
          key: "2",
          label: "Sản phẩm đảm nhiệm",
          children: (
            <CollaboratorProduct
              id={id}
              useGetUser={useGetCollaborator}
              apiSearchProduct={apis.searchProduct}
              target="partner"
            />
          ),
          disabled: !id,
        },
        {
          key: "3",
          label: "Sổ địa chỉ",
          children: <CollaboratorAddress id={id} />,
          disabled: !id,
        },
        {
          key: "4",
          label: "Yêu cầu",
          children: <RequestGroup.CreateAndView id={id} mode="one" />,
          disabled: !id || !canReadRequest,
        },
      ]}
    ></Tabs>
  );
}
