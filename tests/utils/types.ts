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
  | ClickByTestId
  | ClickByLocator
  | WriteBySelector
  | WalletApprove
  | WalletApproveConnect
  | CheckIfIsIncremented;

// runs a command
export type RunCommand = {
  name: 'runCommand';
  // the folder where the command should be run (relative to the root dir)
  commandFolder?: string;
  // append to the beginning of the command
  // or can use <COMMAND> var to run the command inside the preCommand
  // ex: pnpm pm2 start 'PORT=4000 BROWSER=none <COMMAND>'
  preCommand?: string;
};

// creates a new file from the copied code
export type WriteToFile = {
  name: 'writeToFile';
  filepath: string;
};

// modifies an existing file
// atLine: insert the copied code at this line (index is from before lines are removed)
// removeLines: lines to remove (indexes are from before code in inserted)
// addSpacesBefore: add blank lines before
// addSpacesAfter: add blank lines after
// useSetData: instead of modifying the file with the copied code, use this code instead
export type ModifyFile = {
  name: 'modifyFile';
  filepath: string;
  atLine?: number;
  removeLines?: number[];
  addSpacesBefore?: number;
  addSpacesAfter?: number;
  useSetData?: string;
};

// compares the code copied from the id to the file at th efilepath
export type CompareToFile = {
  name: 'compareToFile';
  filepath: string;
};

// compares two files from their filepaths
export type CompareFiles = {
  name: 'compareFiles';
  testPathName: string;
  refPathName: string;
};

// goes to the url
export type GoToUrl = {
  name: 'goToUrl';
  url: string;
};

// waits for the timeout amount of milliseconds
export type Wait = {
  name: 'wait';
  timeout: number;
};

// reloads the page
export type Reload = { name: 'reload' };

// click an element by the locator
// refer to https://playwright.dev/
// you can remove text from the element's inner text before saving
export type GetByLocatorAndSave = {
  name: 'getByLocator-save';
  locator: string;
  removeFromValue: string;
};

// click an element by the role/name
// refer to https://playwright.dev/docs/locators#locate-by-role
export type ClickByRole = {
  name: 'clickByRole';
  role: string;
  elementName: string;
};

export type ClickByTestId = {
  name: 'clickByTestId';
  testId: string;
};

export type ClickByLocator = {
  name: 'clickByLocator';
  locator: string;
};

export type WriteBySelector = {
  name: 'writeBySelector';
  selector: string;
  value: string;
};

// approves a pending transaction
export type WalletApprove = { name: 'walletApprove' };

// approves a pending connection
export type WalletApproveConnect = { name: 'walletApproveConnect' };

// checks if the number in the finalIndex is
// equal to the initialIndex + 1
// the index is based on the order the values were saved by getByLocator-save
export type CheckIfIsIncremented = {
  name: 'checkIfIsIncremented';
  initialIndex: number;
  finalIndex: number;
};
