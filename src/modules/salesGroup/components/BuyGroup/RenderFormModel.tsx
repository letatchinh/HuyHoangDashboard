import React from "react";
import { useCreateCollaborator, useUpdateCollaborator } from "~/modules/collaborator/collaborator.hook";
import CollaboratorForm from "~/modules/collaborator/components/CollaboratorForm";
import EmployeeForm from "~/modules/employee/components/EmployeeForm";
import { useCreateEmployee, useUpdateEmployee } from "~/modules/employee/employee.hook";
import { BuyGroupType } from "../../salesGroup.modal";
type propsType = {
  typeUser: BuyGroupType['type'];
  id?: string,
  onClose:()=>void,
};

const hook = {
    partner:{
        create: useCreateCollaborator,
        update:useUpdateCollaborator
    },
    employee:{
        create: useCreateEmployee,
        update: useUpdateEmployee
    }
}

export default function RenderFormModel(props: propsType): React.JSX.Element {
    const {id,onClose,typeUser} = props;

    const [isSubmitLoading, handleCreate] = hook[typeUser].create(onClose);
    const [, handleUpdate] =  hook[typeUser].update(onClose);

  if (typeUser === "partner")
    return (
      <CollaboratorForm
        id={id}
        handleCloseModal={onClose}
        handleCreate={handleCreate}
        handleUpdate={handleUpdate}
        isSubmitLoading={isSubmitLoading}
      />
    );
  else
    return (
      <EmployeeForm
        id={id}
        handleCloseModal={onClose}
        handleCreate={handleCreate}
        handleUpdate={handleUpdate}
        isSubmitLoading={isSubmitLoading}
      />
    );
}
