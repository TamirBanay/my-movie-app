import { atom } from "recoil";

export const _moviesList = atom({
  key: "_moviesList",
  default: [],
});
export const _currentPage = atom({
  key: "_currentPage",
  default: 1,
});
export const _movieIsOpen = atom({
  key: "_movieIsOpen",
  default: false,
});
export const _movieId = atom({
  key: "_movieId",
  default: null,
});
export const _userIsLoggedIn = atom({
  key: "_userIsLoggedIn",
  default: null,
});