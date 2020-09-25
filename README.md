# ATS

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.7.

## Introduction

this app is to connect our college alumnus and students built with angular 9 and firestore.

## Key Features

There are 2 types of users for this app 1

1) Student ( currently pursuing degree in L D College Of Engineering )
2) Alumni of L D College Of Engineering

/* pay attention that seperate admin panel is also there for user/event/job/other-activity verification handled by Our LDCE Professors */ 

Features :-

- user can check for daily updates of college with latest #News.
- user can participate in #Events.
- Alumnus/students also can request for events.
- Alumnus can request for posting #Job to the student on this platform.
- student can directly apply to the job through this.
- Students/Alumns can post their Activities/Achievements and like and comment on other's posts.
- Users can maintain their profile like LinkedIn to get Attention from Alumnus.

## Edit Environment

To start with this app make sure you add your firebase's credentials like this...

  export const environment = {
  production: false,
  firebase: {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  }
};

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
