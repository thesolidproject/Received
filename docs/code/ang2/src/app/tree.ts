// class to model tree object for rendering by d3
export class Tree {
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
  participants: object;
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
  children: Array<Tree>;
}
