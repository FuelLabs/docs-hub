import { exec } from '@actions/exec';

export const setupUser = async () => {
  await exec('git', ['config', 'user.name', `"github-actions[bot]"`]);
  await exec('git', [
    'config',
    'user.email',
    `"github-actions[bot]@users.noreply.github.com"`,
  ]);
};

export const push = async (branch, { force } = {}) => {
  await exec(
    'git',
    ['push', 'origin', `HEAD:${branch}`, force && '--force'].filter(Boolean)
  );
};

export const switchToExistingBranch = async (branch, dir) => {
  await exec('git', ['switch', branch], {
    cwd: dir,
  });
};

export const switchToNewBranch = async (branch, dir) => {
  await exec('git', ['branch', branch], {
    cwd: dir,
  });
  await exec('git', ['switch', branch], {
    cwd: dir,
  });
};

export const checkoutVersion = async (version, dir) => {
  await exec('git', ['checkout', version], {
    cwd: dir,
  });
};

export const commitAll = async (message) => {
  await exec('git', ['add', '.']);
  await exec('git', ['commit', '-m', message]);
};

export const updateSubmodule = async (submdoule) => {
  await exec('git', ['submodule', 'update', '--remote', submdoule]);
};

export async function checkDiff() {
  let output = '';
  await exec('git diff', [], {
    listeners: {
      stdout: (data) => {
        output += data.toString();
      },
    },
  });

  // returns true if there are changes
  // returns false if there are no changes
  return output.length > 0;
}
