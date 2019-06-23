# Reactive Dialogs (RDX) for digital conversations

Reactive Dialogs (RDX) implementation for digital conversations using Remark and JSX. Forked from @tinialabs/tdx and @mdx-js/mdx with updated transpiler for whendo runtime, and with react-like JSX syntax for both cards and dialogs.

While the `rdx` specification is very similar to markdown and similar formats such as `mdx`, a different extension is used as the code in any code blocks may be executed. In addition the execution order of formats such as `mdx` are linear (a single document) where as a `rdx` module may be executed as an adaptive dialog over the series of many days. The specification also includes yaml front matter by default.

https://github.com/synchealth/rdx

## Installation

```sh
npm i -S @rdx-js/rdx
```
