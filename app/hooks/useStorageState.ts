import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import { useCallback, useEffect, useReducer } from 'react';
import {jwtDecode} from "jwt-decode";

type UserJwt = {
    exp: bigint,
    person_id: string,
};


type UseStateHook<T> = [
    [boolean, T | null],
    (value: T | null) => void
];

function useAsyncState<T>(initialValue: [boolean, T | null] = [true, null]): UseStateHook<T> {

    return useReducer(( state: [boolean, T | null], action: T | null = null ): [boolean, T | null] => [false, action], initialValue) as UseStateHook<T>

}

export async function setStorageItemAsync(key: string, value: string | null) {

    value == null ? await deleteItemAsync(key) : await setItemAsync(key, value)

}

export function useStorageState(key: string): UseStateHook<string> {
    // Public
    const [state, setState] = useAsyncState<string>();

    // Get
    useEffect(() => {

        getItemAsync(key).then(value => {
            if (value) {
                let payload = jwtDecode<UserJwt>(value, {})
                setState(payload.person_id)
            } else {
                setState(value)
            }
        }).catch((error: any) => {
            console.log("Error: ", error);
        })

    }, [key])

    // Set
    const setValue = useCallback(
        (value: string | null) => {
            if (value) {
                let payload = jwtDecode<UserJwt>(value, {})
                setState(payload.person_id)
                setStorageItemAsync(key, value);
            } else {
                setState(value)
                setStorageItemAsync(key, value);
            }
        },
        [key]
    );

    return [state, setValue];
}