import { EvaluatorResults, ResultObject, TrueAndFalseEvaluatorType } from "./versionTypes";

// const db: DBInterface = new DBfilesystem();

class ResultManager {
  private resultId: string;
  protected result: EvaluatorResults | null = null;
  protected evaluatorName: string | null;

  constructor(id: string) {
    this.resultId = id;
    this.evaluatorName = null;
  }

  collectResult(newResult: EvaluatorResults, evaluator: string): void {
    this.result = newResult;
    this.evaluatorName = evaluator;

    return;
  }

  getResult(): ResultObject | null {
    if (this.result && this.resultId && this.evaluatorName) {
      return {
        resultId: this.resultId,
        resultObject: this.result,
        evaluatorName: this.evaluatorName,
      }
    }
    return null;
  }
 }

export class ResultEvaluator_True_Or_False extends ResultManager {
  private trueAndFalse: TrueAndFalseEvaluatorType;
  private myNameIs: string;

  constructor(id: string) {
    super(id);
    this.trueAndFalse = {
      true: 0,
      false: 0,
    };
    this.myNameIs = 'trueOrFalse';
  }

  setFalse(add = true) {
    this.trueAndFalse = {
      true: this.trueAndFalse.true,
      false: add ? this.trueAndFalse.false + 1 : this.trueAndFalse.false - 1,
    };
    this.collectResult(this.trueAndFalse, this.myNameIs);
  }

  setTrue(add = true, num: number = 1) {
    this.trueAndFalse = {
      true: add ? this.trueAndFalse.true + num : this.trueAndFalse.true - num,
      false: this.trueAndFalse.false,
    };
    this.collectResult(this.trueAndFalse, this.myNameIs);
  }
}