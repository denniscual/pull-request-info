import * as core from '@actions/core'
import { Octokit } from '@octokit/core'

/**
 * The main function for the action.
 *
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run() {
  try {
    const commitSha = core.getInput('commit_sha')
    const githubToken = core.getInput('github_token')
    const owner = core.getInput('owner')
    const repo = core.getInput('repo')

    core.debug(`Commit SHA: ${commitSha}`)
    core.debug(`Owner: ${owner}`)
    core.debug(`Repo: ${repo}`)

    // Initialize Octokit client with the provided token
    const octokit = new Octokit({
      auth: githubToken
    })

    // Make request to get pull requests associated with the commit
    core.debug(`Fetching pull requests for commit ${commitSha}...`)
    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls',
      {
        owner,
        repo,
        commit_sha: commitSha,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    )

    core.debug(
      `Found ${response.data.length} pull requests associated with the commit`
    )

    // Set the output as specified in action.yml
    core.setOutput('pull_requests', JSON.stringify(response.data))
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) {
      core.error(error)
    }

    // Avoid failing the workflow run if there is an error occurring in the action. Instead, set output to empty array
    core.setOutput('pull_requests', JSON.stringify([]))
  }
}
