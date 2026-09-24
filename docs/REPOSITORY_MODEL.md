# Nebulah repository model

## Private development repository

`Nebulah360/Nebulah-Discord-Handler`

Purpose:
- active development
- experimental features
- testing
- integration work
- CI validation
- backup of work in progress

## Public stable repository

`Nebulah360/Nebulah-Discord-Handler-Public`

Purpose:
- stable source snapshots
- public releases
- public documentation
- reproducible release history

## Promotion policy

Development happens in the private repository. A stable version is promoted to the public repository only when a GitHub Release is published or the stable-publish workflow is manually triggered.

The public repository should not be used as the development remote.
