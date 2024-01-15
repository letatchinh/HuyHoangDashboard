import Bill from "~/modules/bill";
import { CreateBillProvider } from "~/store/createBillContext";

const CreateBillPage = () => {
  return (
    <CreateBillProvider>
      <Bill.page.create />
    </CreateBillProvider>
  );
};

export default CreateBillPage;
