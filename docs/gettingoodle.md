---
sidebar_position: 2
---
# Getting Oodle

## Using the built-in downloader
You don't need to do anything to use this. It automatically downloads the necessary library for your platform.
Current supported platforms:
- Windows
- Unix

### Clearing cache
You can try clearing the download cache by passing `true` to the `Oodle` constructor if you're facing issues.
### MacOS
Currently, MacOS is treated as Unix however this might not work and is untested.

If you know of a way to get an `Oodle dylib`, please open a [pull request](https://github.com/Backiscute/oodle.js/pulls) with the feature implemented.

If you desperately need to use the wrapper on MacOS, you can always provide your own `dylib` and passing the path to it as the first argument to the `Oodle` constructor.

## Unreal Engine
Alternatively, You can get the `Oodle` library from your local Unreal Engine install.

You can then use it by passing the path to it as the first argument to the `Oodle` constructor.

## OodleUE
You can get also get the `Oodle` library from [WorkingRobot/OodleUE](https://github.com/WorkingRobot/OodleUE) which is a collection of `Oodle` builds for different versions and for different platforms.

You can download the one you need and use it by passing the path to it as the first argument to the `Oodle` constructor.

:::important
This is subject to IP laws. `Oodle` is property of RAD Games and Unreal Engine is property of Epic Games.
:::

### Warframe
The videogame `Warframe` has an open cdn where you can download `Oodle` for windows from using the following steps:
- Download `https://origin.warframe.com/origin/50F7040A/index.txt.lzma` and `LZMA` decompress it.
- Look in the file for the path that includes `oo2core_9_win64.dll`
- Copy the path without the comma and what comes after it
  - *Example:*
    ```diff
    /oo2core_9_win64.dll.lzma,1
    + /oo2core_9_win64.dll.lzma
    - ,1
    ```
- Download the library from `https://content.warframe.com` + the previous path.
  - *Example:* `https://content.warframe.com/oo2core_9_win64.dll.lzma`
- `LZMA` decompress the library.

You can then use it by passing the path to it as the first argument to the `Oodle` constructor.

:::important
I am not sure about the legality of this. Please use at your own risk.

This is subject to IP laws. `Oodle` is property of RAD Games and Unreal Engine is property of Epic Games.
:::