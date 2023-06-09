import NameList from "@/app/components/nameList";
import { iResult } from "@/app/types/nameTypes";
import { FormEventHandler, useState, useCallback } from "react";
import { post } from '../../app/helpers/fetchOptions';


export default function Admin() {
  const [loading, setLoading] = useState<Boolean>(false);
  const [result, setResult] = useState<iResult>({ message: null, data: [] });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const endpoint = '/api/form';
    setLoading(true);

    const target = event.target as HTMLFormElement;
    const data = {
      topic: target.topic.value,
      desc: target.desc.value,
    };
    
    let tempResult;
    try {
      const response = await fetch(endpoint, post(data));
      tempResult = await response.json();
    } catch (e) {
      console.log('error:', e);
    }
    
    setResult(tempResult);
    setLoading(false);
  };

  const handleDelete = useCallback(
    (index: number) => {
      let temp = [...result.data];
      temp.splice(index, 1);
      setResult({
        ...result,
        data: temp
      });
    }, [result]
  );

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="topic">planned topic</label>
        <input type="text" id="topic" name="topic" required />

        <label htmlFor="desc">description</label>
        <input type="textarea" id="desc" name="desc" />

        <button type="submit">Submit</button>
      </form>

      <div>{loading
        ? 'loading...'
        : <NameList message={result.message} list={result.data} deleteHandler={handleDelete} />}
      </div>
    </>
  );
}