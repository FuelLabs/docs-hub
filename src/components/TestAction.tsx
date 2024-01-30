import type { Action } from '~/tests/utils/types';

export type TestActionProps = {
  id: string;
  action: Action;
};

export default function TestAction({ id, action }: TestActionProps) {
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
        action.name === 'modifyFile' ? JSON.stringify(action.removeLines) : null
      }
      data-use-set-data={
        action.name === 'modifyFile' ? action.useSetData : null
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
      data-remove-from-value={
        action.name === 'getByLocator-save' ? action.removeFromValue : null
      }
      data-role={action.name === 'clickByRole' ? action.role : null}
      data-element-name={
        action.name === 'clickByRole' ? action.elementName : null
      }
      data-testid={action.name === 'clickByTestId' ? action.testId : null}
      data-click-by-locator={
        action.name === 'clickByLocator' ? action.locator : null
      }
      data-selector={action.name === 'writeBySelector' ? action.selector : null}
      data-value={action.name === 'writeBySelector' ? action.value : null}
      data-initial-index={
        action.name === 'checkIfIsIncremented' ? action.initialIndex : null
      }
      data-final-index={
        action.name === 'checkIfIsIncremented' ? action.finalIndex : null
      }
    />
  );
}
