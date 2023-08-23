import { EvaluatorResults, ResultObject, TrueAndFalseEvaluatorType } from "./versionTypes";


class ResultManager {
  private resultId: string;
  protected result: EvaluatorResults | null = null;

  constructor(id: string) {
    this.resultId = id;
  }

  saveResult(newResult: EvaluatorResults): void {
    this.result = newResult;
    return;
  }

  getResult(): ResultObject | null {
    if (this.result && this.resultId) {
      return {
        resultId: this.resultId,
        resultObject: this.result,
      }
    }
    return null;
  }
}

export class ResultEvaulator_True_Or_False extends ResultManager {
  private trueAndFalse: TrueAndFalseEvaluatorType;

  constructor(id: string) {
    super(id);
    this.trueAndFalse = {
      true: 0,
      false: 0,
    };
  }

  setFalse(add = true) {
    this.trueAndFalse = {
      true: this.trueAndFalse.true,
      false: add ? this.trueAndFalse.false + 1 : this.trueAndFalse.false - 1,
    };
    this.saveResult(this.trueAndFalse);
    console.log('this.trueandfalse FALSE: ', this.trueAndFalse);
  }

  setTrue(add = true, num: number = 1) {
    this.trueAndFalse = {
      true: add ? this.trueAndFalse.true + num : this.trueAndFalse.true - num,
      false: this.trueAndFalse.false,
    };
    this.saveResult(this.trueAndFalse);
    console.log('this.trueandfalse TRUE: ', this.trueAndFalse);
  }
}