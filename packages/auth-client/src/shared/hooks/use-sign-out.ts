import { useReducer } from "react";
import { type WebAndMobileAuthClient } from "../../types/auth-client.types";
import { type InferData, type InferError, type MutationStatus, type RetryAfter } from "../../types/hook.type";

type SignOutFn = WebAndMobileAuthClient["signOut"];
type SignOutData = InferData<SignOutFn>;
type SignOutError = (NonNullable<InferError<SignOutFn>> & RetryAfter) | null;
type SignOutResult = Promise<{ data: SignOutData, error: SignOutError }>;

type SignOutMutationState = {
    status: MutationStatus,
    data: SignOutData,
    error: SignOutError
};

type SignOutAction =
    { type: "START" } |
    { type: "SUCCESS", payload: SignOutData } |
    { type: "ERROR", payload: SignOutError }

type HookReturnType = {
    signOut: () => SignOutResult,
    data: SignOutData,
    error: SignOutError,
    status: {
        isIdle: boolean,
        isPending: boolean,
        isSuccess: boolean,
        isError: boolean
    }
}

function reducer(state: SignOutMutationState, action: SignOutAction): SignOutMutationState {
    switch (action.type) {
        case "START":
            return {
                status: "pending",
                data: null,
                error: null
            }
        case "SUCCESS":
            return {
                status: "success",
                data: action.payload,
                error: null
            }
        case "ERROR":
            return {
                status: "error",
                data: null,
                error: action.payload
            }
        default:
            return state
    }
}
const initialState: SignOutMutationState = {
    status: "idle",
    data: null,
    error: null
}

export function useSignOut<T extends WebAndMobileAuthClient>(client: T) {
    const [state, dispatch] = useReducer(reducer, initialState);

    async function signOut() {

        dispatch({ type: "START" });
        const result = await client.signOut();

        if (result.error) {
            dispatch({ type: "ERROR", payload: { ...result.error, retryAfter: 0 } });
            return result
        }

        dispatch({ type: "SUCCESS", payload: result.data });
        return result;
    }

    const result: HookReturnType = {
        signOut,
        data: state.data,
        error: state.error,
        status: {
            isIdle: state.status === 'idle',
            isPending: state.status === 'pending',
            isSuccess: state.status === 'success',
            isError: state.status === 'error'
        }
    }

    return result;
}