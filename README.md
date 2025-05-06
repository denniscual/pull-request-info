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

  - name: Use Pull Request Info
    run: |
      echo "Pull Requests: ${{ steps.pr-info.outputs.pull_requests }}"
```

### Inputs

| Input          | Description                                            | Required |
| -------------- | ------------------------------------------------------ | -------- |
| `commit_sha`   | The SHA of the commit to find associated pull requests | Yes      |
| `github_token` | GitHub token for API authentication                    | Yes      |
| `owner`        | The owner of the repository                            | Yes      |
| `repo`         | The name of the repository                             | Yes      |

### Outputs

| Output          | Description                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------- |
| `pull_requests` | JSON array containing information about all pull requests associated with the specified commit |

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

## Development

If you are new, there's also a simpler introduction in the
[Hello world JavaScript action repository](https://github.com/actions/hello-world-javascript-action).

### Initial Setup

After you've cloned the repository to your local machine or codespace, you'll
need to perform some initial setup steps before you can develop your action.

> [!NOTE]
>
> You'll need to have a reasonably modern version of
> [Node.js](https://nodejs.org) handy. If you are using a version manager like
> [`nodenv`](https://github.com/nodenv/nodenv) or
> [`nvm`](https://github.com/nvm-sh/nvm), you can run `nodenv install` in the
> root of your repository to install the version specified in
> [`package.json`](./package.json). Otherwise, 20.x or later should work!

1. :hammer_and_wrench: Install the dependencies

   ```bash
   npm install
   ```

2. :building_construction: Package the JavaScript for distribution

   ```bash
   npm run bundle
   ```

3. :white_check_mark: Run the tests

   ```bash
   $ npm test
   ```
