import { iNameItem, iNameItemWithTags } from "@/app/types/nameTypes";
import { FormEventHandler, useState, useCallback, MouseEventHandler, useEffect } from "react";
import Loader from "@/app/components/Loader";
import { Button } from "@mui/material";
import AdminLayout from '@/app/components/layouts/adminLayout';
import { GeneratorForm } from '@/app/components/GeneratorForm';
import { PageTitle } from '@/app/components/PageTitle';
import { NameTables } from '@/app/components/NameTables';
import { createRequestForNames } from './createRequestForNames';
import { saveNameList } from './saveNameList';
import { getDescription } from './getDescription';
import { extendList } from './extendList';
import { promptVersionType } from "@/pVersioning/versionTypes";
import axios from "axios";

const getPromptAPI = '/api/getPrompt'

export default function Admin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorResponse, setErrorResponse] = useState<string>('');
  const [proposedList, setProposedList] = useState<(iNameItem | iNameItemWithTags)[]>([]);
  const [rejectedList, setRejectedList] = useState<(iNameItem | iNameItemWithTags)[]>([]);
  const [tagList, setTagList] = useState<string[]>([]);
  const [promptVersions, setPromptVersions] = useState<promptVersionType[] | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<promptVersionType | null>(null);

  // TODO: create a centralized loading/spinner handler
  // TODO: clear the errorResponse

  const prompt = '17ca47a8-345b-49d5-bb88-4136db02a6d7'

  useEffect(() => {
    const getOnePrompt = async () => {
      const { data } = await axios(getPromptAPI, {
        method: 'GET',
        params: { prompt }
      });
      setPromptVersions(data.versions);
    }
    getOnePrompt();
  }, [prompt])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!selectedVersion) return;

    setLoading(true);
    const { result, error } = await createRequestForNames(event, selectedVersion);
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
    <AdminLayout>
      <div>
        <Loader loading={loading} />
        <PageTitle title="Name Generator" />
        <GeneratorForm
          submitHandler={handleSubmit}
          promptVersions={promptVersions || []}
          versionSelector={setSelectedVersion}
          version={selectedVersion}
        />
        <div>
          {
            errorResponse
              ? `we got an error, but we have a notification bar, so this line seems redundant: ${errorResponse}`
              : null
          }
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

          <Button
            onClick={extendListHandler}
            disabled={loading}
            variant="contained"
            color="primary"
          >
            {!proposedList[0]?.description
              ? 'Create Description'
              : 'Create tags'}
          </Button>

          <Button
            onClick={getTags}
            variant="contained"
            color="primary"
          >
            Get Tags
          </Button>

          {
            tagList.map(listItem => (
              <li key={listItem}>
                {listItem}
              </li>
            ))
          }
          <div className="my-6">
            <Button
              onClick={saveList}
              variant="contained"
              color="primary"
            >
              save list
            </Button>
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
    </AdminLayout >
  );
}
