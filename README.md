<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

In this project I tried to use a tsv/csv file with almost 200k rows and more than 100 columns, the purpose of this project is test the limits of NestJs (Typescript), reading and transforming Big Data. At the same time I was learning how to manipulate data in lowest way NodeJs allows us to do.

## Setup
You need to have a file in the route *"public/data/**[.tsv, .csv]"*, because thats the file we are going to use. Obviously you can always change this path.

You can see the number of columns I was in *input folder*, because I was using production you are not going to find the public folder, however you can find [datasets](https://www.kaggle.com/datasets) in this link, so try it out. Likewise you must change some lines of code in *app.service.ts*.

Firstable you have to change the lines  `12, 13` with the names of your datasets.

```bash
private readonly getCsvPathOriginal = './path/to/your/<dataset>.tsv';
private readonly getCsvPath = './public/data/retiross1.csv';
```

## Installation

```bash
$ pnpm install
```

I tried the fastest configuration I could make, take a look on that! If it's not a problem I would like to recive your pull request with a better Nestjs framework setup.

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev
```

## Stay in touch

- Author - [Daniel Román](https://www.linkedin.com/in/danielroman-)
- Website - [danielroman.pages.dev](https://danielroman.pages.dev/)
