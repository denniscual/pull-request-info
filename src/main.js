import * as core from '@actions/core'
import { Octokit } from '@octokit/core'

export async function run() {
  try {
    const commitSha = core.getInput('commit_sha')
    const githubToken = core.getInput('github_token')
    const owner = core.getInput('owner')
    const repo = core.getInput('repo')
    const label = core.getInput('label')

    core.debug(`Commit SHA: ${commitSha}`)
    core.debug(`Owner: ${owner}`)
    core.debug(`Repo: ${repo}`)
    core.debug(`Label: ${label}`)

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

    let pullRequests = response.data

    if (label) {
      pullRequests = pullRequests.filter((pr) => {
        if (pr.labels.length === 0) {
          return false
        }
        return Boolean(pr.labels.find((prLabel) => prLabel.name === label))
      })
    }

    core.debug(
      `Found ${pullRequests.length} pull requests associated with the commit`
    )

    const transformedPullRequests = pullRequests.map((pr) => ({
      number: pr.number,
      title: pr.title,
      url: pr.html_url,
      created_at: pr.created_at,
      updated_at: pr.updated_at,
      merged_at: pr.merged_at,
      user: {
        login: pr.user.login,
        url: pr.user.html_url
      },
      labels: pr.labels.map((label) => ({
        id: label.id,
        name: label.name,
        description: label.description
      }))
    }))

    core.setOutput('pull_requests', JSON.stringify(transformedPullRequests))
  } catch (error) {
    if (error instanceof Error) {
      core.error(error)
    }

    // Avoid failing the workflow run if there is an error occurring in the action. Instead, set output to empty array
    core.setOutput('pull_requests', JSON.stringify([]))
  }
}
