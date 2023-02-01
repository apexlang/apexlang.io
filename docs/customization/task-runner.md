---
sidebar_position: 2
---

# Task Definitions

The `apex run` command runs tasks defined in the `tasks` block of an `apex.yaml` configuration file.

The following `apex.yaml` gives us a `greeter` task.

```yaml
tasks:
  greeter:
    - echo Hello World
    - echo Have a great day!
```

Running `apex run greeter` will execute each command in sequence.

```sh
$ apex run greeter
echo Hello World
Hello World
echo Have a great day!
Have a great day!
```

## Environment variables

You can access environment variables from tasks with the familiar `$NAME` syntax, e.g.

```yaml
tasks:
  greeter:
    - echo $GREETING World
```

Output when run with `GREETING` set:

```
$ GREETING="Bonjour" apex run greeter
echo $GREETING World
Bonjour World
```

## Local configuration

Sometimes environment variables aren't a good fit or you want to reuse apex configuration. In that case, `apex` exposes all of its configuration in variables that follow an `$apex_config_[key]` pattern. This example shows how to use the `greetingPrefix` configuration variable in a task.

```yaml
config:
  greetingPrefix: 'Howdy'
tasks:
  greeter:
    - echo $apex_config_greetingPrefix World
```

Output:

```sh
$ apex run greeter
echo $apex_config_greetingPrefix World
Howdy World
```
