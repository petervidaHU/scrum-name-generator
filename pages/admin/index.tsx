// import '@/styles/globals.css'
import { iResult, iResultWithTags } from "@/app/types/nameTypes";
import { FormEventHandler, useState, useCallback, MouseEventHandler } from "react";
import Loader from "@/app/components/Loader";
import { Button } from "flowbite-react";
import RootLayout from '@/app/components/layout';
import { GeneratorForm } from '@/app/components/GeneratorForm';
import { PageTitle } from '@/app/components/PageTitle';
import { NameTables } from '@/app/components/NameTables';
import { createRequestForNames } from './createRequestForNames';
import { saveNameList } from './saveNameList';
import { getDescription } from './getDescription';
import { extendList } from './extendList';

export default function Admin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorResponse, setErrorResponse] = useState<string>('');
  const [proposedList, setProposedList] = useState<(iResult | iResultWithTags)[]>([]);
  const [rejectedList, setRejectedList] = useState<(iResult | iResultWithTags)[]>([]);
  const [tagList, setTagList] = useState<string[]>([]);

  // TODO: create a centralized loading/spinner handler
  // TODO: clear the errorResponse

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { result, error } = await createRequestForNames(event);
    if (result) {
      setProposedList(result);
    } else {
      setErrorResponse(error);
    }
    setLoading(false);
  }

  const handleDeleteTag = useCallback<MouseEventHandler<HTMLSpanElement>>(
    (event) => {
      let temp = [...proposedList];
      const tag = event.currentTarget.id;
      const parent = event.currentTarget.dataset.parent;
      if (!parent || !tag) throw new Error(`error in deleting tag: ${event.currentTarget}`);
      const index = +parent;
      temp[index].tags = temp[index].tags?.filter(thisTag => thisTag !== tag);
      setProposedList([...temp]);
    }, [proposedList]
  );

  const handleProposal: MouseEventHandler<HTMLSpanElement> = (event) => {
    const name = event.currentTarget.dataset.name;

    const newProposedList = [...proposedList];
    const newRejectedList = [...rejectedList];

    const proposedNameIndex = proposedList.findIndex((n) => n.name === name);
    if (proposedNameIndex !== -1) {
      const [movedItem] = newProposedList.splice(proposedNameIndex, 1);
      newRejectedList.push(movedItem);
    } else {
      const rejectedNameIndex = rejectedList.findIndex((n) => n.name === name);
      if (rejectedNameIndex !== -1) {
        const [movedItem] = newRejectedList.splice(rejectedNameIndex, 1);
        newProposedList.push(movedItem);
      }
    }
    setProposedList(newProposedList);
    setRejectedList(newRejectedList);
  };

  const extendListHandler = async () => {
    setLoading(true);
    const { result, error } = await extendList(proposedList);
    if (result) {
      setProposedList(result);
    } else {
      setErrorResponse(error);
    }
    setLoading(false);
  }

  const createFurtherDescriptionHandler = async (name: string) => {
    const newDesc = await getDescription(name);
    const tempResult = proposedList.map(n => {
      if (n.name === name) {
        n.description = newDesc;
      };
      return n;
    })
    setProposedList(tempResult);
  }

  const getTags = () => {
    const tagList = new Set(proposedList.map(object => {
      return object.tags ? object.tags : [];
    }).flat());
    setTagList([...tagList]);
  }

  const saveList = async () => {
    setLoading(true);
    const savedList = saveNameList(proposedList)
    console.log('saved list: ', savedList)
    setLoading(false);
  }

  return (
    <RootLayout>
      <div className="px-20 py-10">
        <Loader loading={loading} />
        <PageTitle title="Name Generator" />
        <GeneratorForm s={handleSubmit} />
        <div>
          {errorResponse ? `we got an error, but we have a notification bar, so this line seems redundant: ${errorResponse}` : null}
        </div>
        <div>
          {proposedList.length > 0 && (
            <NameTables
              title='proposed names'
              list={proposedList}
              descriptionWizard={createFurtherDescriptionHandler}
              proposalHandler={handleProposal}
              tagDeleteHandler={handleDeleteTag}
            />)}
          <Button className="my-6" onClick={extendListHandler} disabled={loading}>
            {!proposedList[0]?.description ? 'Create Description' : 'Create tags'}
          </Button>

          <Button className="my-6" onClick={getTags}>Get Tags</Button>
          {tagList.map(listItem => (<li key={listItem}>{listItem}</li>))}
          <div className="my-6">
            <Button onClick={saveList}>save list</Button>
          </div>
        </div>
        {rejectedList.length > 0 && (
          <NameTables
            title='rejected names'
            list={rejectedList}
            descriptionWizard={createFurtherDescriptionHandler}
            proposalHandler={handleProposal}
            proposalLabel='accept'
          />)}
      </div>
    </RootLayout >
  );
}