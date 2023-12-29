import { useMemo } from "react"
import { useGetSuppliers } from "../supplier.hook";

export default function Supplier() {
  const query = useMemo(() => ({page : 1,limit : 10}),[]);

  const [data] = useGetSuppliers(query);
  console.log(data,'data');
  
  return (
    <div>supplier.screen</div>
  )
}
