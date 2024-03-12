import SalesGroup from "~/modules/salesGroup";
import { SalesGroupProvider } from "~/modules/salesGroup/salesGroupContext";

const SalesGroupPage = () => {
  return (
    <SalesGroupProvider>
      <SalesGroup.page.index />
    </SalesGroupProvider>
  );
};

export default SalesGroupPage;
