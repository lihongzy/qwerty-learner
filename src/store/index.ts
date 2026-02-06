import { atomWithStorage } from "jotai/utils";

export const isOpenDarkModeAtom = atomWithStorage("isOpenDarkMode", window.matchMedia("(prefers-color-scheme: dark)").matches);