import { atom } from 'recoil';


export const booleanState = atom({
    key: 'booleanState',
    default: false,
});

export const isLoaderState = atom({
    key: 'isLoaderState',
    default: false
});

export const burgerShowState = atom({
    key: 'burgerShowState',
    default: true
});

export const snakeBarState = atom({
    key: 'snakeBarState',
    default: {
        snackStatus: false,
        snackColor: "bg-primary",
        snackMsg: ""
    },
});

