import { FormEventHandler, useState, useCallback, MouseEventHandler, useEffect } from "react";
import { PageTitle } from '@/app/components/PageTitle'
import AdminLayout from '@/app/components/layouts/adminLayout'
import { ListTable } from "@/app/components/ListTable";
import { getList } from "./getList";

export default function Names() {
const [list, setList] = useState<any[]>([])
const [errorResponse, setErrorResponse] = useState('')

useEffect(() => {
 (async () => {
    const { result, error } = await getList();
    if (result) {
      setList(result);
    } else {
      setErrorResponse(error);
    }
  })();

  return () => { }
}, [])


  return (
    <AdminLayout>
      <PageTitle title="List of names" />
      <ListTable list={list} />
    </AdminLayout>
  )
}
