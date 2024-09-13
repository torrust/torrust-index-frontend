# Torrust Index GUI

[![Container](https://github.com/torrust/torrust-index-gui/actions/workflows/container.yaml/badge.svg)](https://github.com/torrust/torrust-index-gui/actions/workflows/container.yaml) [![Labels](https://github.com/torrust/torrust-index-gui/actions/workflows/labels.yaml/badge.svg)](https://github.com/torrust/torrust-index-gui/actions/workflows/labels.yaml) [![Test](https://github.com/torrust/torrust-index-gui/actions/workflows/testing.yaml/badge.svg)](https://github.com/torrust/torrust-index-gui/actions/workflows/testing.yaml)

This repository serves as the web GUI for the [Torrust Index](https://github.com/torrust/torrust-index) project.

It contains the [vue-3](https://vuejs.org/) frontend web application for the [Torrust Index](https://github.com/torrust/torrust-index).

This web GUI connects using the [Torrust Index Application Interface](https://github.com/torrust/torrust-index-api-lib) to our reference [Torrust Index](https://github.com/torrust/torrust-index).

![Torrust Architecture](https://raw.githubusercontent.com/torrust/.github/main/img/torrust-architecture.webp)

## Key Features

* [X] Built with [Nuxt](https://nuxt.com/) and [Vue 3](https://vuejs.org/).
* [X] Modern design.
* [X] Categories and tags.
* [X] Search.
* [X] Sorting.
* [X] Filtering.
* [X] Pagination.
* [X] Admin settings: tracker, categories, tags, etc.
* [X] Support for BitTorrent v1.

> NOTE: It does not support the [BitTorrent Protocol Specification v2][BEP_52].

You can see some [screenshots](./docs/screenshots.md) of the application.

## Getting Started

### Container Version

The Torrust Index GUI is [deployed to DockerHub][dockerhub], you can run a demo immediately with the following commands:

#### Docker

```sh
docker run -it --publish="3000:3000/tcp" torrust/index-gui:develop
```

> Please read our [container guide][containers] for more information.

#### Podman

```sh
podman run -it --publish="3000:3000/tcp" docker.io/torrust/index-gui:develop
```

> Please read our [container guide][containers] for more information.

### Development Version

#### Requirements

* Node >= `20.10.0`

You can follow the [documentation](./docs/index.md) to install and use Torrust Index GUI for development.

There are some missing sections in the documentation like an installation guide for production. Contributions to the documentation are welcome.

#### Checkout and Run

```sh
# Checkout repository into a new folder:
git clone https://github.com/torrust/torrust-index-gui.git && cd torrust-index-gui

# Install dependencies
npm install

# Set up the .env file (if it doesn't exist, this is the normal behaviour with a newly cloned repo)
if ! [ -f "./.env" ]; then
    cp .env.local .env
fi

# Run development server
npm run dev
```

#### Customization

You can use environment variables to customize the application infrastructure settings.

```s
NUXT_PUBLIC_API_BASE="http://localhost:3001/v1" \
    NITRO_HOST="0.0.0.0" \
    NITRO_PORT="3000" \
    npm run dev
```

> Please read our [container guide][containers] for more information.

### Production Version

You can run the production build in preview mode with the following:

```s
npm install && npm run build && npm run preview
```

### Services

The default configuration serves the web app on http://[::]:3000.

## Documentation

You can read the documentation [here](./docs/index.md).

## Contributing

We are happy to support and welcome new people to our project. Please consider our [contributor guide][contribution_guide].</br>
This is an open-source community-supported project. We welcome contributions from the community!

__How can you contribute?__

* Bug reports and feature requests.
* Code contributions. You can start by looking at the issues labeled "[good first issues]".
* Documentation improvements. Check the [documentation][docs] for typos, errors, or missing information.
* Participation in the community. You can help by answering questions in the [discussions].

## License

**Copyright (c) 2023 The Torrust Developers.**

This program is free software: you can redistribute it and/or modify it under the terms of the [GNU Affero General Public License][AGPL_3_0] as published by the [Free Software Foundation][FSF], version 3.

This program is distributed in the hope that it will be useful, but __WITHOUT ANY WARRANTY__; without even the implied warranty of __MERCHANTABILITY__ or __FITNESS FOR A PARTICULAR PURPOSE__. See the [GNU Affero General Public License][AGPL_3_0] for more details.

You should have received a copy of the *GNU Affero General Public License* along with this program. If not, see <https://www.gnu.org/licenses/>.

Some files include explicit copyright notices and/or license notices.

### Legacy Exception

For prosperity, versions of Torrust Tracker that are older than five years are automatically granted the [MIT-0][MIT_0] license in addition to the existing [AGPL-3.0-only][AGPL_3_0] license.

### Contributor Agreement

The copyright of the Torrust Tracker is retained by the respective authors.

__Contributors agree:__

* That all their contributions be granted a license(s) __compatible__ with the [Torrust Trackers License](#license).
* *That all contributors signal __clearly__ and __explicitly__ any other compilable licenses if they are not: *[AGPL-3.0-only with the legacy MIT-0 exception](#license)*.

**The Torrust-Tracker project has no copyright assignment agreement.**

*We kindly ask you to take time and consider The Torrust Project [Contributor Agreement][agreement] in full.*

## Disclaimer

This software is provided solely for lawful purposes. Users must ensure compliance with all applicable laws and regulations regarding copyright and intellectual property. The developers of this software do not condone or support the use of this software for any illegal activities, including but not limited to the distribution of copyrighted, protected, or otherwise illegal content. By using this software, you agree to use it responsibly and in compliance with all legal requirements. Misuse of this software for illegal purposes may lead to legal consequences, for which the developers are not liable.

## Acknowledgments

This project was a joint effort by [Nautilus Cyberneering GmbH][nautilus], [Dutch Bits][Dutch Bits] and collaborators. Thank you to you all!

[AGPL_3_0]: ./LICENSE-AGPL_3_0
[agreement]: https://github.com/torrust/.github/blob/main/info/licensing/contributor_agreement_v01.md
[BEP_52]: https://www.bittorrent.org/beps/bep_0052.html
[containers]: ./docs/index.md
[contribution_guide]: https://github.com/torrust/.github/blob/main/info/contributing.md
[discussions]: https://github.com/torrust/torrust-index-gui/discussions
[dockerhub]: https://hub.docker.com/r/torrust/index-gui/tags
[docs]: ./docs/index.md
[Dutch Bits]: https://dutchbits.nl
[FSF]: https://www.fsf.org/
[MIT_0]: ./LICENSE-MIT_0
[nautilus]: https://github.com/orgs/Nautilus-Cyberneering/
