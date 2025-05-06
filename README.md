# Pull Request Info GitHub Action

[![GitHub Super-Linter](https://github.com/actions/javascript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/javascript-action/actions/workflows/ci.yml/badge.svg)

A GitHub Action that retrieves pull request information associated with a
specific commit. This action makes it easy to find all pull requests related to
a commit in your workflows.

## Features

- Finds all pull requests that include a specific commit
- Returns detailed pull request information in a structured JSON format
- Gracefully handles errors without failing the workflow

## Inputs

| Input          | Description                                            | Required |
| -------------- | ------------------------------------------------------ | -------- |
| `commit_sha`   | The SHA of the commit to find associated pull requests | Yes      |
| `github_token` | GitHub token for API authentication                    | Yes      |
| `owner`        | The owner of the repository                            | Yes      |
| `repo`         | The name of the repository                             | Yes      |

## Outputs

| Output          | Description                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------- |
| `pull_requests` | JSON array containing information about all pull requests associated with the specified commit |

## Usage

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v4

  - name: Get Pull Request Info
    id: pr-info
    uses: denniscual/pull-request-info@v1
    with:
      commit_sha: ${{ github.sha }}
      github_token: ${{ secrets.GITHUB_TOKEN }}
      owner: ${{ github.repository_owner }}
      repo: ${{ github.event.repository.name }}

  - name: Use Pull Request Info
    run: |
      echo "Pull Requests: ${{ steps.pr-info.outputs.pull_requests }}"
```

## Example Output

The `pull_requests` output contains a JSON array with details about each related
pull request:

```json
[
  {
    "url": "https://api.github.com/repos/octocat/Hello-World/pulls/1347",
    "id": 1347,
    "number": 1347,
    "state": "open",
    "title": "Feature: Add new functionality",
    "user": {
      "login": "octocat",
      "id": 1
    },
    "created_at": "2011-01-26T19:01:12Z",
    "updated_at": "2011-01-26T19:01:12Z"
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
