export type Action =
  | RunCommand
  | WriteToFile
  | ModifyFile
  | CompareToFile
  | CompareFiles
  | GoToUrl
  | Wait
  | Reload
  | GetByLocatorAndSave
  | ClickByRole
  | WalletApprove
  | WalletApproveConnect
  | CheckIfIsIncremented;

export type RunCommand = {
  name: 'runCommand';
  // the folder where the command should be run (relative to the root dir)
  commandFolder?: string;
  // append to the beginning of the command
  // or can use <COMMAND> var to run the command inside the preCommand
  // ex: pnpm pm2 start 'PORT=4000 BROWSER=none <COMMAND>'
  preCommand?: string;
};

export type WriteToFile = {
  name: 'writeToFile';
  filepath: string;
};

export type ModifyFile = {
  name: 'modifyFile';
  filepath: string;
  atLine?: number;
  removeLines?: number[];
  addSpacesBefore?: number;
  addSpacesAfter?: number;
};

export type CompareToFile = {
  name: 'compareToFile';
  filepath: string;
};

export type CompareFiles = {
  name: 'compareFiles';
  testPathName: string;
  refPathName: string;
};

export type GoToUrl = {
  name: 'goToUrl';
  url: string;
};

export type Wait = {
  name: 'wait';
  timeout: number;
};

export type Reload = { name: 'reload' };

export type GetByLocatorAndSave = {
  name: 'getByLocator-save';
  locator: string;
};

export type ClickByRole = {
  name: 'clickByRole';
  role: string;
  elementName: string;
};

export type WalletApprove = { name: 'walletApprove' };

export type WalletApproveConnect = { name: 'walletApproveConnect' };

// checks if the number in the finalIndex is
// equal to the initialIndex + 1
// the index is based on the order the values were saved by getByLocator-save
export type CheckIfIsIncremented = {
  name: 'checkIfIsIncremented';
  initialIndex: number;
  finalIndex: number;
};
