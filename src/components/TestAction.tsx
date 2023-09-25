import type { Action } from '~/tests/utils/types';

export type TestActionProps = {
  id: string;
  action: Action;
};

export default function TestAction({ id, action }: TestActionProps) {
  if (action.name === 'modifyFile') {
    console.log('ACTION:', action);
  }
  return (
    <span
      id={id}
      data-name={action.name}
      data-command-folder={
        action.name === 'runCommand' ? action.commandFolder : null
      }
      data-pre-command={action.name === 'runCommand' ? action.preCommand : null}
      data-filepath={
        action.name === 'writeToFile' ||
        action.name === 'compareToFile' ||
        action.name === 'modifyFile'
          ? action.filepath
          : null
      }
      data-add-spaces-before={
        action.name === 'modifyFile' ? action.addSpacesBefore : null
      }
      data-add-spaces-after={
        action.name === 'modifyFile' ? action.addSpacesAfter : null
      }
      data-at-line={action.name === 'modifyFile' ? action.atLine : null}
      data-remove-lines={
        action.name === 'modifyFile' ? action.removeLines : null
      }
      data-test-path-name={
        action.name === 'compareFiles' ? action.testPathName : null
      }
      data-ref-path-name={
        action.name === 'compareFiles' ? action.refPathName : null
      }
      data-url={action.name === 'goToUrl' ? action.url : null}
      data-timeout={action.name === 'wait' ? action.timeout : null}
      data-locator={action.name === 'getByLocator-save' ? action.locator : null}
      data-role={action.name === 'clickByRole' ? action.role : null}
      data-element-name={
        action.name === 'clickByRole' ? action.elementName : null
      }
      data-initial-index={
        action.name === 'checkIfIsIncremented' ? action.initialIndex : null
      }
      data-final-index={
        action.name === 'checkIfIsIncremented' ? action.finalIndex : null
      }
    />
  );
}