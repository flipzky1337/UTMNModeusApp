import {jwtDecode} from "jwt-decode";

type UserDecoded = {
  person_id: string
};

export function getUserID(token: string) {
  return jwtDecode<UserDecoded>(token).person_id;
}

export function checkTokenExpiration(token: string) {
  if (jwtDecode(token).exp) {
    // @ts-ignore stoopid error "exp is undefined hurr bur" shut up
    return Date.now() - jwtDecode(token).exp < 300000
  } else {
    console.log('possible error in token');
  }
}