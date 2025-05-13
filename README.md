# Pull Request Info GitHub Action

A GitHub Action that retrieves pull request information associated with a
specific commit. This action makes it easy to find all pull requests related to
a commit in your workflows.

## Usage

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v4

  - name: Get Pull Request Info
    id: pr-info
    uses: denniscual/pull-request-info@v1.0.0
    with:
      commit_sha: ${{ github.sha }}
      github_token: ${{ secrets.GITHUB_TOKEN }}
      owner: ${{ github.repository_owner }}
      repo: ${{ github.event.repository.name }}
      # Optional: Filter PRs by label
      # label: 'bug'

  - name: Use Pull Request Info
    run: |
      echo "Pull Requests: ${{ steps.pr-info.outputs.pull_requests }}"
      echo "Number of PRs: ${{ steps.pr-info.outputs.size }}"
```

### Inputs

| Input          | Description                                            | Required | Default |
| -------------- | ------------------------------------------------------ | -------- | ------- |
| `commit_sha`   | The SHA of the commit to find associated pull requests | Yes      | N/A     |
| `github_token` | GitHub token for API authentication                    | Yes      | N/A     |
| `owner`        | The owner of the repository                            | Yes      | N/A     |
| `repo`         | The name of the repository                             | Yes      | N/A     |
| `label`        | Filter pull requests by label name                     | No       | `''`    |

### Outputs

| Output          | Description                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------- |
| `pull_requests` | JSON array containing information about all pull requests associated with the specified commit |
| `size`          | The number of pull requests associated with the specified commit                               |

### Example Output

The `pull_requests` output contains a JSON array with details about each related
pull request:

```json
[
  {
    "number": 1,
    "title": "Test PR 1",
    "url": "https://github.com/testOwner/testRepo/pull/1",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-02T00:00:00Z",
    "merged_at": "2023-01-03T00:00:00Z",
    "user": {
      "login": "testUser1",
      "url": "https://github.com/testUser1"
    },
    "labels": [
      {
        "id": 101,
        "name": "bug",
        "description": "Bug fix"
      }
    ]
  },
  {
    "number": 2,
    "title": "Test PR 2",
    "url": "https://github.com/testOwner/testRepo/pull/2",
    "created_at": "2023-01-04T00:00:00Z",
    "updated_at": "2023-01-05T00:00:00Z",
    "merged_at": null,
    "user": {
      "login": "testUser2",
      "url": "https://github.com/testUser2"
    },
    "labels": [
      {
        "id": 102,
        "name": "enhancement",
        "description": "New feature"
      }
    ]
  }
]
```
