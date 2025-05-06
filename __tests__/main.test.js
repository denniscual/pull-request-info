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
      data: [
        { id: 1, title: 'Test PR 1' },
        { id: 2, title: 'Test PR 2' }
      ]
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
    const mockPRs = [
      { id: 1, title: 'Test PR 1' },
      { id: 2, title: 'Test PR 2' }
    ]
    mockRequest.mockResolvedValue({ data: mockPRs })

    await run()

    expect(core.setOutput).toHaveBeenCalledWith(
      'pull_requests',
      JSON.stringify(mockPRs)
    )
  })

  it('handles API errors correctly', async () => {
    const errorMessage = 'API request failed'
    mockRequest.mockRejectedValue(new Error(errorMessage))

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(errorMessage)
  })

  it('handles empty pull request list', async () => {
    mockRequest.mockResolvedValue({ data: [] })

    await run()

    expect(core.debug).toHaveBeenCalledWith(
      'Found 0 pull requests associated with the commit'
    )
    expect(core.setOutput).toHaveBeenCalledWith('pull_requests', '[]')
  })
})
