export const setPendingStatus = (state: any) => {
    state.loading = true;
    state.error = null;
}

export const setRejectStatus = (state: any, action: any) => {
    state.loading = false;
    state.error = action.payload as string;
}