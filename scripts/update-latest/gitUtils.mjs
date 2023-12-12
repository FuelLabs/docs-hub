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

export const checkoutBranch = async (branch, dir) => {
  await exec('git', ['checkout', branch], {
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
  const body = 'This is an automated PR to update the nightly docs.';

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

export const getVersionCommit = async (version, dir) => {
  let releaseCommit = '';
  await exec(`git rev-list -n 1 tags/${version}`, [], {
    cwd: dir,
    listeners: {
      stdout: (data) => {
        releaseCommit = data.toString().trim();
      },
    },
  });
  return releaseCommit;
};

export const gitResetCommit = async (releaseCommit, dir) => {
  await exec('git', ['reset', '--hard', releaseCommit], {
    cwd: dir,
  });
};

export const getReleaseTimestamp = async (version, dir) => {
  try {
    let releaseTimestamp = null;
    await exec('git', ['log', '--format="%ct"', '-n', '1', `tags/${version}`], {
      cwd: dir,
      listeners: {
        stdout: (data) => {
          console.log('data.toString()', data.toString());
          releaseTimestamp = parseInt(data.toString().trim().slice(1, -1), 10);
        },
      },
    });
    return releaseTimestamp;
  } catch (error) {
    console.error(
      `Error getting commit timestamp for version ${version}: ${error.message}`
    );
    return null;
  }
};

export const getCommitByTimestamp = async (timestamp, branch, dir) => {
  try {
    let closestCommitHash = '';
    let commits = [];

    // Fetch all commits in branch
    await exec('git', ['log', '--format="%H %ct"', '--max-count=300', branch], {
      cwd: dir,
      listeners: {
        stdout: (data) => {
          const commitLines = data.toString().trim().split('\n');
          commits = commits.concat(commitLines);
        },
      },
    });

    // Find a commit with a timestamp after the timestamp
    for (let i = 0; i < commits.length; i++) {
      const commit = commits[i];
      const [commitHash, commitTimestamp] = commit.split(' ');
      const cleanTS = parseInt(commitTimestamp.slice(0, -1));
      if (cleanTS < timestamp) {
        break;
      }
      closestCommitHash = commitHash.substr(1);
    }

    return closestCommitHash;
  } catch (error) {
    console.error(`Error finding commit by timestamp: ${error.message}`);
  }
};
