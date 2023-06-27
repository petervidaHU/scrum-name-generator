import '@/styles/globals.css'
import { iResult, iResultWithTags } from "@/app/types/nameTypes";
import { FormEventHandler, useState, useCallback } from "react";
import { post } from '../../app/helpers/fetchOptions';
import Loader from "@/app/components/Loader";
import { Button } from "flowbite-react";
import RootLayout from '@/app/components/layout';
import { GeneratorForm } from '@/app/components/GeneratorForm';
import { PageTitle } from '@/app/components/PageTitle';
import { NameTables } from '@/app/components/NameTables';
import { createRequestForNames } from './createRequestForNames';
import { saveNameList } from './saveNameList';
import { getDescription } from './getDescription';
import { extendResultListDatabase } from './extendResultListDatabase';


export default function Admin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorResponse, setErrorResponse] = useState<string>('');
  const [result, setResult] = useState<(iResult | iResultWithTags)[]>([]);
  const [tagList, setTagList] = useState<string[]>([]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { tempResult, tempError } = await createRequestForNames(event);
    if (!tempError) {
      setResult(tempResult);
    } else {
      setErrorResponse(tempError);
    }
    setLoading(false);
  }

  const handleDelete = useCallback(
    (index: number) => {
      if (typeof result === 'string') return;
      let temp = [...result];
      temp.splice(index, 1);
      setResult([...temp]);
    }, [result]
  );

  const handleDeleteTag = useCallback(
    (tag: string, index: number) => {
      if (typeof result === 'string') return;
      let temp = [...result];
      temp[index].tags = temp[index].tags?.filter(thisTag => thisTag !== tag);
      setResult([...temp]);
    }, [result]
  );



  const createTagsHandler = async () => {
    setLoading(true);
    const endpoint = '/api/createTags';
    let tempResult: iResultWithTags[] = [];
    const data = {
      names: result,
      property: extendResultListDatabase.tags
    }
    try {
      const response = await fetch(endpoint, post(data));
      tempResult = await response.json();
    } catch (e) {
      console.log('error:', e);
    }
    setResult(tempResult);
    setLoading(false);
  }

  const createDescriptionHandler = async (name: string) => {
    const newDesc = await getDescription(name);
    const tempResult = result.map(n => {
      if (n.name === name) {
        n.description = newDesc;
      };
      return n;
    })
    setResult(tempResult);
  }

  const getTags = () => {
    if (typeof result === 'string') return;
    const tagList = new Set(result.map(object => {
      return object.tags ? object.tags : [];
    }).flat());
    setTagList([...tagList]);
  }

  const saveList = async () => {
    setLoading(true);
    const savedList = saveNameList(result)
    console.log('saved list: ', savedList)
    setLoading(false);
  }

  return (
    <RootLayout>
      <div className="px-20 py-10">
        <Loader loading={loading} />
        <PageTitle title="Name Generator" />
        <GeneratorForm s={handleSubmit} />
        <div >
          {result.length > 0 && <NameTables list={result} descriptionWizard={createDescriptionHandler} />}

          <Button onClick={createTagsHandler} disabled={loading}>
            create tags
          </Button>

          <Button onClick={getTags}>Get tags</Button>
          {tagList.map(listItem => (<li key={listItem}>{listItem}</li>))}
          <div>
            <Button onClick={saveList}>save list</Button>
            {tagList.map(listItem => (<li key={listItem}>{listItem}</li>))}
          </div>
        </div>
      </div>
    </RootLayout >
  );
}