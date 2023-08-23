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
import { PromptVersionType } from "@/pVersioning/versionTypes";
import axios from "axios";
import { ResultEvaulator_True_Or_False } from "@/pVersioning/resultEvaulator";

let trueOrFalse: ResultEvaulator_True_Or_False | undefined;

const getPromptAPI = '/api/getPrompt';
const saveResultAPI = '/api/versionapi/saveResult';

export default function Admin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorResponse, setErrorResponse] = useState<string>('');
  const [proposedList, setProposedList] = useState<(iNameItem | iNameItemWithTags)[]>([]);
  const [rejectedList, setRejectedList] = useState<(iNameItem | iNameItemWithTags)[]>([]);
  const [tagList, setTagList] = useState<string[]>([]);
  const [paramId, setParamId] = useState<string>('');
  const [promptVersions, setPromptVersions] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<PromptVersionType | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);


  useEffect(() => {
    if (resultId) {
      trueOrFalse = new ResultEvaulator_True_Or_False(resultId)
    }
  }, [resultId])


  // TODO: create a centralized loading/spinner handler
  // TODO: clear the errorResponse

  const prompt = 'cf7dcaa0-a3a7-4fdb-be18-da2beb41d3ac'

  useEffect(() => {
    const getOnePrompt = async () => {
      const { data } = await axios(getPromptAPI, {
        method: 'GET',
        params: { prompt }
      });
      setPromptVersions(data.versions);
      setParamId(data.defaultParametersId);
    }
    getOnePrompt();
  }, [prompt])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!selectedVersion) return;

    setLoading(true);
    const { result, error } = await createRequestForNames(event, selectedVersion, paramId);
    if (result) {
      console.log('result: ', result);
      setProposedList(result.resultText);
      setResultId(result.resultId);
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
      if (trueOrFalse) {
        trueOrFalse.setFalse(true)
      }
    } else {
      const rejectedNameIndex = rejectedList.findIndex((n) => n.name === name);
      if (rejectedNameIndex !== -1) {
        const [movedItem] = newRejectedList.splice(rejectedNameIndex, 1);
        newProposedList.push(movedItem);
        if (trueOrFalse) {
          trueOrFalse.setFalse(false)
        }
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

  const handleAccept = (n: number) => {
    if (trueOrFalse) {
      trueOrFalse.setTrue(true, n)
      const versionResult = trueOrFalse.getResult();

      axios(saveResultAPI, {
        method: 'Post',
        data: {
          versionResult,
        }
      });
    }
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
            sx={{ margin: '10px' }}
            onClick={() => handleAccept(proposedList.length)}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            Accept
          </Button>

          <Button
            sx={{ margin: '10px' }}
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
            sx={{ margin: '10px' }}
            onClick={getTags}
            variant="contained"
            color="primary"
            disabled={loading}
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
              sx={{ margin: '10px' }}
              onClick={saveList}
              variant="contained"
              color="primary"
              disabled={loading}
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
