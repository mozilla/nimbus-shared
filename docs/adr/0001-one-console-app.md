# One application for experiment intake, publishing, and visualizations

- Status: Accepted
- Author: Kate Hudson
- Deciders: Nimbus team, Product Delivery team, Cirrus team
- Date: ~H1 2020

### TLDR;

**Problem**: Should we change course towards consolidating the web console functions of
experimentation (intake, publishing, visualizations) into one tool, and if so, how?

**Decision**: Yes, by consolidatating these functions into Experimenter.

## Context and Problem Statement

The experiment platform as described in Project Nimbus[1] has three parts:

1. A _web console_, for intake, publishing, lifecycle management, real-time monitoring, and
   visualizing of results;
2. A _client SDK_, for interpreting experiment configuration and activiating experiments
3. A _data pipeline / ETL_, for processing, cleaning, and applying automated statistical
   calculations to experiment data and generating alerts.

If we we were building everything from scratch, there would be no reason not to build a single
website for #1, the web console, given that we want it to reflect a single user experience and be
built by a highly coordinated team. However, our existing infrastructure that satisfies the
functions of #1 is not a single website, but rather several tools/projects owned by several teams:

- Experimenter, for intake and some reporting functions;
- Normandy, Normandy Devtools, Leanplum, and others for publishing and lifecycle management;
- Graphana for real-time monitoring;
- Redash, Amplitude, and the Cirrus project for visualizing experiments (planned, but not yet built)

There are significant costs to maintaining separate tools, but also to changing the direction of
existing improvement efforts.

## Considered Options

- Option A - Status quo (maintain separate tools)
- Option B - Build a seperate visualization tool, but consolidate intake, publishing, and lifecycle
  management
- Option C - One tool - Consolidate intake, visualizations into Normandy + Normandy devtools
- Option D - One tool - Consolidate publishing, lifecycle management, visualizations into
  Experimenter
- Option E - One tool - Build from scratch

## Decision Outcome

We decided to adopt option D, to build one tool by consolidate publishing, lifecycle management, and
visualizations into Experimenter.

While there was an immediate impact to the roadmaps of several existing projects, including Normandy
Devtools and Cirrus, we felt that the long-term cost of maintaining separate applications
significantly outweighs any short-term impact. This includes:

- The overhead of deployment, security review, build-system, and repo maintainance
- Maintaining a cohesive UX across app boundaries
- The overhead of authentication / API endpoints for communicating across apps
- The impact to the development workflow of having to run and make changes to multiple applications

Furthermore, despite the need for increased coordination between the teams building different parts,
we felt that this architecture better reflects the user experience and cohesive team structure we
really want.

### Why Experimenter?

We choose to consolidate into Experimenter because its existing architecture and functionality was
the closest to what we needed for all functions of a cross-platform web console (web application
with a front end, integration with other server-side tools, public API) v.s. other options.

## Links

- [1][architectural overview of project nimbus](https://mana.mozilla.org/wiki/pages/viewpage.action?spaceKey=FJT&title=Nimbus+Engineering#NimbusEngineering-Architecturaloverview)
- [Technical Overview of Experiments in Firefox Desktop](https://docs.google.com/document/d/1ypWh-aug9NFdArQfYCuLYpUpK_IKdgELVmx21CaWI6w/edit#)
