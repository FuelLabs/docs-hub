import { exec } from '@actions/exec';
import { getOctokit } from '@actions/github';

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

export const fetchTag = async (tag, dir) => {
  await exec('git', ['fetch', 'origin', 'tag', tag], {
    cwd: dir,
  });
};

export const fetchBranch = async (branch, dir) => {
  await exec('git', ['fetch', 'origin', `${branch}:${branch}`], {
    cwd: dir,
  });
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
  await exec('git', ['commit', '-m', `'${message}'`]);
};

export const updateSubmodule = async (submdoule) => {
  await exec('git', ['submodule', 'update', '--remote', submdoule]);
};

export async function checkDiff() {
  let output = '';
  await exec('git diff -- docs', [], {
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

export async function createPR(title, branchName) {
  const githubToken = process.env.GITHUB_TOKEN;
  const octokit = getOctokit(githubToken);
  const body = 'This is an automated PR to udpate the latest docs.';

  await octokit.pulls.create({
    owner: 'FuelLabs',
    repo: 'docs-hub',
    title,
    head: branchName,
    base: 'master',
    body,
    maintainer_can_modify: true,
  });
}
