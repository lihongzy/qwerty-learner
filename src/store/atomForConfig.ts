import { atom, WritableAtom } from "jotai";
import { atomWithStorage, RESET } from "jotai/utils"

type SetStateActionWithReset<Value> = Value | typeof RESET | ((prev: Value) => Value | typeof RESET);

export function atomForConfig<T extends Record<string, unknown>>(
    key: string,
    defaultValue: T): WritableAtom<T, [SetStateActionWithReset<T>], void> {
    const storageAtom = atomWithStorage(key, defaultValue)
    return atom((get) => {

        //Get the underlying object
        const config = get(storageAtom)

        let newConfig: T

        //check if the types are different
        const isTypingMismatch = typeof config !== typeof defaultValue

        if (isTypingMismatch) {
            newConfig = defaultValue
        } else {
            // check if there are missing properties
            let hasMissingProperty = false
            for (const key in defaultValue) {
                if (!(key in config)) {
                    hasMissingProperty = true
                    break
                }
            }
            newConfig = hasMissingProperty ? { ...defaultValue, ...config } : config
        }

        if (newConfig !== config) {
            const jsonString = JSON.stringify(newConfig)
            localStorage.setItem(key, jsonString)
        }
        return newConfig
    }, storageAtom.write)
}