import NameList from "@/app/components/nameList";
import { iResult, iResultComplete, iResultWithTags } from "@/app/types/nameTypes";
import { FormEventHandler, useState, useCallback } from "react";
import { post } from '../../app/helpers/fetchOptions';
import Loader from "@/app/components/Loader";


export default function Admin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<(iResult | iResultWithTags)[] | string>('');

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
      if (typeof result === 'string') return;
      let temp = [...result];
      temp.splice(index, 1);
      setResult([...temp]);
    }, [result]
  );

  const createTagsHandler = async () => {
    setLoading(true);
    const endpoint = '/api/createTags';
    let tempResult;
    const data = {
      names: result,
    }
    try {
      const response = await fetch(endpoint, post(data));
      tempResult = await response.json();
    } catch (e) {
      console.log('error:', e);
    }
    console.log('tags:', tempResult);
    setResult(tempResult);
    setLoading(false);
  }

  return (
    <>
      <Loader loading={loading} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="topic">planned topic</label>
        <input type="text" id="topic" name="topic" required />

        <label htmlFor="desc">description</label>
        <input type="textarea" id="desc" name="desc" />

        <button type="submit">Submit</button>
      </form>

      <div>{typeof result !== 'string' && (
        <>
          <NameList list={result} deleteHandler={handleDelete} />
          <button onClick={createTagsHandler} disabled={loading}>
            create tags
          </button>
        </>
      )}
      </div>
    </>
  );
}