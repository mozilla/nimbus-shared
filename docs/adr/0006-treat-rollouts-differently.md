# Opting out of studies should not affect rollouts

> Status: Decided

> Author: Travis Long

> Deciders:
>
> - Nimbus Team
> - Trust & Legal
> - Desktop Firefox Product Team
> - Mobile Firefox Product Team
> - Data Science

> Date: H1 2022

## Context and Problem Statement

Rollouts are a feature of Nimbus and are distinct from experiments in that they are not measurement
instruments but instead represent off-train configuration updates.

Rollouts can serve many purposes:

- Launching a winning branch of an experiment faster than the trains.
- Launching a configuration to non-experiment users during an experiment after a short period of
  verification
- Configuring different settings for a feature for different audiences remotely
- A "kill switch" if you want to launch a feature but then turn it off if something goes wrong.

Currently, rollouts are ignored if the users has opted out of studies because Nimbus treats rollouts
the same as studies, obeying the user preference settings for experiments.

One of the requirements of the messaging system work is that messages set up as rollouts will be
shown to users regardless of their experiments settings.

Product management for mobile teams would like to be able to rollout features using this capability
to all users, regardless of the preference for experiments, when the audience is set to 100%.

## Decision Outcome

Because of the differences between rollouts and experiments, the Nimbus team would like to treat
them independently from each other.

This would involve disconnecting rollouts from the "studies" application preference so that rollouts
could still be delivered to users who have otherwise opted out of participating in experiments.

A rollout is an intentional, internal configuration change or update that is initiated by Mozilla,
and thus may be important to the release of new features to the users. If users are allowed to opt
out of these rollouts, it could degrade the user experience due to the effects of not applying these
changes.

- Treating rollouts as automatic configuration updates means they will be subject to:

  1. Go through the
     ["release an update"](https://firefox-source-docs.mozilla.org/contributing/pocket-guide-shipping-firefox.html)
     approval process
  2. Respect the _updates_ opt out.

- Experiments will then be subject to:
  1. Go through the
     ["launching an experiment"](https://docs.google.com/document/d/1eFGL9FATIuZudjSItpIT2Ct1C5qb5E3Qk7hJuJQT67s/edit#heading=h.kdvlxlgor0w6)
     approval process
  2. Respect the _studies_ opt out.
