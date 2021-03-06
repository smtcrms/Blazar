![Blazar](BlazarUI/app/images/blazar-logo.png)

## Overview ##

Blazar is a continuous integration tool designed to integrate with GitHub (and/or GitHub Enterprise) 
and [Singularity](https://github.com/HubSpot/Singularity). It uses GitHub organization webhooks
so that new repositories are automatically discovered, and the builds happen as one-off tasks in
Singularity so you can reuse your existing cluster rather than running dedicated build servers. 

## Concepts ##

The unit of build in Blazar is a module, which is an arbitrary subset of a repository. This allows 
Blazar to only build the parts of a repository that have changed when a commit is pushed, rather 
than building the entire repository every time. It uses a pattern similar to Heroku's buildpacks 
to discover the buildable units within a repository and to define how to do the build.

## Getting Started ##

To run Blazar locally, run 
`mvn clean pre-integration-test -DskipTests -Dblazar.port=7199` to launch Blazar and its dependencies (Singularity, Mesos, and MySQL) in Docker containers. Then go to `http://DOCKER_IP:7199/blazar/` in your browser. When you're done, run `mvn docker:stop` to shut down the containers.
