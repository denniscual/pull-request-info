/**
 * Unit tests for the action's main functionality, src/main.js
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'

// Create mock for Octokit
const mockRequest = jest.fn()
const Octokit = jest.fn().mockImplementation(() => ({
  request: mockRequest
}))

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('@octokit/core', () => ({ Octokit }))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

const mockPrs = [
  {
    number: 1,
    title: 'Test PR 1',
    url: 'https://github.com/testOwner/testRepo/pull/1',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z',
    merged_at: '2023-01-03T00:00:00Z',
    user: {
      login: 'testUser1',
      url: 'https://github.com/testUser1'
    },
    labels: [
      {
        id: 101,
        name: 'bug',
        description: 'Bug fix'
      }
    ],
    comments_url:
      'https://api.github.com/repos/testOwner/testRepo/issues/1/comments',
    state: 'open'
  },
  {
    number: 2,
    title: 'Test PR 2',
    url: 'https://github.com/testOwner/testRepo/pull/2',
    created_at: '2023-01-04T00:00:00Z',
    updated_at: '2023-01-05T00:00:00Z',
    merged_at: null,
    user: {
      login: 'testUser2',
      url: 'https://github.com/testUser2'
    },
    labels: [
      {
        id: 102,
        name: 'enhancement',
        description: 'New feature'
      }
    ],
    comments_url:
      'https://api.github.com/repos/testOwner/testRepo/issues/1/comments',
    state: 'open'
  }
]

describe('main.js', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()

    // Set up default mock inputs
    core.getInput.mockImplementation((name) => {
      if (name === 'commit_sha') return 'test-commit-sha'
      if (name === 'github_token') return 'test-token'
      if (name === 'owner') return 'testOwner'
      if (name === 'repo') return 'testRepo'
      return ''
    })

    // Set up default mock response
    mockRequest.mockResolvedValue({
      data: mockPrs
    })
  })

  it('makes the correct API request', async () => {
    await run()

    expect(mockRequest).toHaveBeenCalledWith(
      'GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls',
      {
        owner: 'testOwner',
        repo: 'testRepo',
        commit_sha: 'test-commit-sha',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    )
  })

  it('sets the output with the pull request data', async () => {
    await run()

    expect(core.setOutput).toHaveBeenCalledWith(
      'pull_requests',
      JSON.stringify(
        mockPrs.map((pr) => ({
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
      )
    )
  })

  it('handles API errors correctly', async () => {
    const errorMessage = 'API request failed'
    mockRequest.mockRejectedValue(new Error(errorMessage))

    await run()

    // If there is an error occurring in the action, we inspect the action to set output to empty array instead of failing the workflow run.
    expect(core.setOutput).toHaveBeenCalledWith(
      'pull_requests',
      JSON.stringify([])
    )
  })

  it('filters pull requests by label when label input is provided', async () => {
    // Override the getInput mock to return a label
    core.getInput.mockImplementation((name) => {
      if (name === 'commit_sha') return 'test-commit-sha'
      if (name === 'github_token') return 'test-token'
      if (name === 'owner') return 'testOwner'
      if (name === 'repo') return 'testRepo'
      if (name === 'label') return 'bug'
      return ''
    })

    await run()

    // Only PR with 'bug' label should be included in the output
    const expectedOutput = mockPrs
      .filter((pr) => pr.labels.some((label) => label.name === 'bug'))
      .map((pr) => ({
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

    expect(core.setOutput).toHaveBeenCalledWith(
      'pull_requests',
      JSON.stringify(expectedOutput)
    )

    // Verify we're only getting PRs with the bug label
    expect(JSON.parse(core.setOutput.mock.calls[0][1]).length).toBe(1)
    expect(JSON.parse(core.setOutput.mock.calls[0][1])[0].number).toBe(1)
  })
})
