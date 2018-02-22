// model for workflow metadata
import { State } from './state';
export class WorkflowMeta {
  id: any;
  rev: any;
  name: string;
  desc: string;
  start: string;
  end: string;
  lastupdate: any;
  iteration: any;
  status: string;
  state: {
    id: number
    name: string
};
  visibility: string;
  type: string;
  owner: {
    id: number
    name: string
    email: string
  };
  states: Array<State>;
}

