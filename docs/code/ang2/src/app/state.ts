// Class to map to state objects in the workflow JSON object

export class State {
  id: any;
  rev: any;
  name: string;
  desc: string;
  start: string;
  end: string;
  lastupdate: any;
  iteration: any;
  status: string;
  state: object;
  visibility: string;
  type: string;
  participants: {
    id: number
    name: string
    email: string
    permission: string
    currentuser: string
  };
  percentcomplete: number;
  cost: string;
  quality: string;
  schedule: string;
  actualhours: number;
  plannedhours: number;
  required: string;
  entrycondition: Array<object>;
  exitcondition: Array<object>;
  actions: Array<object>;
  form: object;
}
