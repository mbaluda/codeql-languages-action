# codeql-languages-action
Gets the list of CodeQL supported languages in a repo using the [trees API](https://docs.github.com/en/rest/git/trees)
Use the `exclude_codeql_languages` parameter to avoid checking for a given language

## Usage:
```
jobs:
  detect-lang:
    runs-on: ubuntu-latest
    outputs:
      codeql_languages: ${{ steps.codeql_languages.outputs.languages }}
    steps:
    - id: codeql_languages
      uses: mbaluda/codeql-languages-action@main
      with:
        exclude_codeql_languages: ["javascript"]
```
